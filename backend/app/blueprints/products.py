from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.product import Product
from app.models.user import User
from app.utils.decorators import validate_json, require_role
from app.utils.validators import validate_price, validate_stock_quantity
import uuid

products_bp = Blueprint('products', __name__)

@products_bp.route('', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    # Get query parameters for filtering and search
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    producer_id = request.args.get('producer_id')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Build query
    query = Product.query.filter_by(is_available=True)
    
    if search:
        query = query.filter(
            db.or_(
                Product.name.ilike(f'%{search}%'),
                Product.description.ilike(f'%{search}%')
            )
        )
    
    if category:
        query = query.filter(Product.category == category)
    
    if producer_id:
        query = query.filter(Product.producer_id == producer_id)
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Pagination
    pagination = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    products = []
    for product in pagination.items:
        product_dict = product.to_dict(include_producer=True)
        products.append(product_dict)
    
    return jsonify({
        'products': products,
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'pages': pagination.pages
    }), 200

@products_bp.route('', methods=['POST'])
@jwt_required()
@require_role(['producer', 'admin'])
@validate_json(['name', 'description', 'category', 'price'])
def create_product():
    """Create a new product (producers and admins only)"""
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Validate price
    if not validate_price(data['price']):
        return jsonify({'error': 'Invalid price format'}), 400
    
    # Validate stock quantity if provided
    stock_quantity = data.get('stock_quantity', 0)
    if not validate_stock_quantity(stock_quantity):
        return jsonify({'error': 'Invalid stock quantity'}), 400
    
    try:
        # Create new product
        product = Product(
            producer_id=current_user_id,  # Always use current user as producer
            name=data['name'],
            description=data['description'],
            category=data['category'],
            subcategory=data.get('subcategory'),
            price=data['price'],
            currency=data.get('currency', 'MAD'),
            unit=data.get('unit', 'piece'),
            stock_quantity=stock_quantity,
            min_order_quantity=data.get('min_order_quantity', 1),
            max_order_quantity=data.get('max_order_quantity'),
            images=data.get('images', []),
            tags=data.get('tags', []),
            is_organic=data.get('is_organic', False),
            is_available=data.get('is_available', True),
            harvest_date=data.get('harvest_date'),
            expiry_date=data.get('expiry_date')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict(include_producer=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create product'}), 500

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product by ID"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify({
        'product': product.to_dict(include_producer=True, include_reviews=True)
    }), 200

@products_bp.route('/<product_id>', methods=['PUT'])
@jwt_required()
@validate_json(['name', 'description', 'category', 'price'])
def update_product(product_id):
    """Update a product (only by owner or admin)"""
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Get product
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Check ownership or admin role
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    if product.producer_id != current_user_id and not current_user.is_admin():
        return jsonify({'error': 'You can only edit your own products'}), 403
    
    # Validate price
    if not validate_price(data['price']):
        return jsonify({'error': 'Invalid price format'}), 400
    
    # Validate stock quantity if provided
    stock_quantity = data.get('stock_quantity', product.stock_quantity)
    if not validate_stock_quantity(stock_quantity):
        return jsonify({'error': 'Invalid stock quantity'}), 400
    
    try:
        # Update product
        product.name = data['name']
        product.description = data['description']
        product.category = data['category']
        product.subcategory = data.get('subcategory', product.subcategory)
        product.price = data['price']
        product.currency = data.get('currency', product.currency)
        product.unit = data.get('unit', product.unit)
        product.stock_quantity = stock_quantity
        product.min_order_quantity = data.get('min_order_quantity', product.min_order_quantity)
        product.max_order_quantity = data.get('max_order_quantity', product.max_order_quantity)
        product.images = data.get('images', product.images)
        product.tags = data.get('tags', product.tags)
        product.is_organic = data.get('is_organic', product.is_organic)
        product.is_available = data.get('is_available', product.is_available)
        product.harvest_date = data.get('harvest_date', product.harvest_date)
        product.expiry_date = data.get('expiry_date', product.expiry_date)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict(include_producer=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update product'}), 500

@products_bp.route('/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product (only by owner or admin)"""
    current_user_id = get_jwt_identity()
    
    # Get product
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Check ownership or admin role
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    if product.producer_id != current_user_id and not current_user.is_admin():
        return jsonify({'error': 'You can only delete your own products'}), 403
    
    try:
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete product'}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    categories = db.session.query(Product.category).distinct().all()
    category_list = [cat[0] for cat in categories if cat[0]]
    
    return jsonify({'categories': category_list}), 200

@products_bp.route('/my-products', methods=['GET'])
@jwt_required()
@require_role(['producer', 'admin'])
def get_my_products():
    """Get current user's products"""
    current_user_id = get_jwt_identity()
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Query user's products
    query = Product.query.filter_by(producer_id=current_user_id)
    
    # Pagination
    pagination = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    products = []
    for product in pagination.items:
        product_dict = product.to_dict(include_producer=True, include_reviews=True)
        products.append(product_dict)
    
    return jsonify({
        'products': products,
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'pages': pagination.pages
    }), 200
