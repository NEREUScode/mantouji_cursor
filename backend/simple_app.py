#!/usr/bin/env python3
"""
Simple working Flask app for Mantouji.ma
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# In-memory storage for testing
users = [
    {
        'id': 1,
        'username': 'ahmed_producer',
        'email': 'ahmed@example.com',
        'role': 'producer',
        'created_at': '2024-01-01T00:00:00Z'
    },
    {
        'id': 2,
        'username': 'fatima_consumer',
        'email': 'fatima@example.com',
        'role': 'consumer',
        'created_at': '2024-01-02T00:00:00Z'
    },
    {
        'id': 3,
        'username': 'admin_user',
        'email': 'admin@mantouji.ma',
        'role': 'admin',
        'created_at': '2024-01-01T00:00:00Z'
    }
]

products = [
    {
        'id': 1,
        'name': 'Organic Argan Oil',
        'description': 'Pure, cold-pressed argan oil from the Atlas Mountains. Rich in vitamin E and essential fatty acids.',
        'price': 150,
        'category': 'Beauty & Health',
        'producer_id': 1,
        'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        'stock_quantity': 50,
        'is_active': True,
        'tags': ['organic', 'argan', 'beauty', 'natural'],
        'views': 125,
        'created_at': '2024-01-15T00:00:00Z',
        'updated_at': '2024-01-15T00:00:00Z'
    },
    {
        'id': 2,
        'name': 'Handwoven Berber Carpet',
        'description': 'Traditional Berber carpet handwoven by local artisans. Unique patterns and vibrant colors.',
        'price': 800,
        'category': 'Home & Decor',
        'producer_id': 1,
        'image_url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'stock_quantity': 12,
        'is_active': True,
        'tags': ['handwoven', 'berber', 'carpet', 'traditional'],
        'views': 89,
        'created_at': '2024-01-20T00:00:00Z',
        'updated_at': '2024-01-20T00:00:00Z'
    },
    {
        'id': 3,
        'name': 'Fresh Mint Tea',
        'description': 'Premium Moroccan mint tea leaves, perfect for traditional tea ceremonies.',
        'price': 45,
        'category': 'Food & Beverages',
        'producer_id': 1,
        'image_url': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        'stock_quantity': 200,
        'is_active': True,
        'tags': ['tea', 'mint', 'moroccan', 'traditional'],
        'views': 156,
        'created_at': '2024-01-25T00:00:00Z',
        'updated_at': '2024-01-25T00:00:00Z'
    },
    {
        'id': 4,
        'name': 'Ceramic Tagine Pot',
        'description': 'Traditional clay tagine pot for authentic Moroccan cooking. Handcrafted by local potters.',
        'price': 120,
        'category': 'Kitchen & Dining',
        'producer_id': 1,
        'image_url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'stock_quantity': 30,
        'is_active': True,
        'tags': ['ceramic', 'tagine', 'cooking', 'traditional'],
        'views': 78,
        'created_at': '2024-02-01T00:00:00Z',
        'updated_at': '2024-02-01T00:00:00Z'
    },
    {
        'id': 5,
        'name': 'Saffron Spice',
        'description': 'Premium Moroccan saffron, one of the most expensive spices in the world.',
        'price': 300,
        'category': 'Food & Beverages',
        'producer_id': 1,
        'image_url': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
        'stock_quantity': 25,
        'is_active': True,
        'tags': ['saffron', 'spice', 'premium', 'cooking'],
        'views': 67,
        'created_at': '2024-02-05T00:00:00Z',
        'updated_at': '2024-02-05T00:00:00Z'
    }
]

reviews = [
    {
        'id': 1,
        'product_id': 1,
        'user_id': 2,
        'rating': 5,
        'comment': 'Amazing quality! My skin feels so soft and hydrated.',
        'created_at': '2024-02-10T00:00:00Z'
    },
    {
        'id': 2,
        'product_id': 1,
        'user_id': 2,
        'rating': 4,
        'comment': 'Great product, fast shipping. Will order again!',
        'created_at': '2024-02-12T00:00:00Z'
    },
    {
        'id': 3,
        'product_id': 2,
        'user_id': 2,
        'rating': 5,
        'comment': 'Beautiful carpet, exactly as described. Perfect for my living room.',
        'created_at': '2024-02-15T00:00:00Z'
    }
]

favorites = [
    {
        'id': 1,
        'user_id': 2,
        'product_id': 1,
        'created_at': '2024-02-08T00:00:00Z'
    },
    {
        'id': 2,
        'user_id': 2,
        'product_id': 2,
        'created_at': '2024-02-10T00:00:00Z'
    }
]

search_history = [
    {
        'id': 1,
        'user_id': 2,
        'query': 'argan oil',
        'filters': {'category': 'Beauty & Health'},
        'results_count': 1,
        'created_at': '2024-02-08T00:00:00Z'
    },
    {
        'id': 2,
        'user_id': 2,
        'query': 'carpet',
        'filters': {'category': 'Home & Decor'},
        'results_count': 1,
        'created_at': '2024-02-10T00:00:00Z'
    }
]

@app.route('/')
def home():
    return jsonify({
        'message': 'Mantouji.ma API is running!',
        'status': 'healthy',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'users': '/api/users',
            'products': '/api/products'
        }
    })

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'API is working correctly',
        'database': 'in-memory (testing)'
    })

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    user = {
        'id': len(users) + 1,
        'username': data.get('username'),
        'email': data.get('email'),
        'role': data.get('role', 'consumer'),
        'created_at': '2024-01-01T00:00:00Z'
    }
    users.append(user)
    
    # Generate a simple token (in real app, use JWT)
    access_token = f"token_{user['id']}_{user['username']}"
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': user
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Find user by email (simple check)
    user = next((u for u in users if u['email'] == email), None)
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Generate a simple token (in real app, use JWT)
    access_token = f"token_{user['id']}_{user['username']}"
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user
    })

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    # In a real app, you'd validate the JWT token here
    # For now, we'll return a mock user or the first user
    if users:
        return jsonify({'user': users[0]})
    return jsonify({'error': 'No user found'}), 404

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({'message': 'Test endpoint working', 'timestamp': '2024-01-01'})

# User endpoints
@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify({
        'users': users,
        'count': len(users)
    })

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user = {
        'id': len(users) + 1,
        'username': data.get('username'),
        'email': data.get('email'),
        'role': data.get('role', 'consumer'),
        'created_at': '2024-01-01T00:00:00Z'
    }
    users.append(user)
    return jsonify({
        'message': 'User created successfully',
        'user': user
    }), 201

# Product endpoints
@app.route('/api/products', methods=['GET'])
def get_products():
    # Get query parameters for filtering and search
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Filter products
    filtered_products = products.copy()
    
    if search:
        filtered_products = [p for p in filtered_products if 
                           search.lower() in p.get('name', '').lower() or 
                           search.lower() in p.get('description', '').lower()]
    
    if category:
        filtered_products = [p for p in filtered_products if p.get('category') == category]
    
    if min_price is not None:
        filtered_products = [p for p in filtered_products if p.get('price', 0) >= min_price]
    
    if max_price is not None:
        filtered_products = [p for p in filtered_products if p.get('price', 0) <= max_price]
    
    # Add producer information to each product
    for product in filtered_products:
        producer = next((u for u in users if u['id'] == product['producer_id']), None)
        if producer:
            product['producer'] = {
                'id': producer['id'],
                'username': producer['username'],
                'first_name': producer.get('first_name'),
                'last_name': producer.get('last_name'),
                'city': producer.get('city'),
                'region': producer.get('region')
            }
    
    # Pagination
    start = (page - 1) * per_page
    end = start + per_page
    paginated_products = filtered_products[start:end]
    
    return jsonify({
        'products': paginated_products,
        'total': len(filtered_products),
        'page': page,
        'per_page': per_page,
        'pages': (len(filtered_products) + per_page - 1) // per_page
    })

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json()
    product = {
        'id': len(products) + 1,
        'name': data.get('name'),
        'description': data.get('description'),
        'price': data.get('price'),
        'category': data.get('category'),
        'producer_id': data.get('producer_id'),
        'image_url': data.get('image_url', ''),
        'stock_quantity': data.get('stock_quantity', 0),
        'is_active': data.get('is_active', True),
        'tags': data.get('tags', []),
        'created_at': '2024-01-01T00:00:00Z',
        'updated_at': '2024-01-01T00:00:00Z'
    }
    products.append(product)
    return jsonify({
        'message': 'Product created successfully',
        'product': product
    }), 201

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Add producer information
    producer = next((u for u in users if u['id'] == product['producer_id']), None)
    if producer:
        product['producer'] = {
            'id': producer['id'],
            'username': producer['username'],
            'first_name': producer.get('first_name'),
            'last_name': producer.get('last_name'),
            'city': producer.get('city'),
            'region': producer.get('region')
        }
    
    return jsonify({'product': product})

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    product.update({
        'name': data.get('name', product['name']),
        'description': data.get('description', product['description']),
        'price': data.get('price', product['price']),
        'category': data.get('category', product['category']),
        'image_url': data.get('image_url', product['image_url']),
        'stock_quantity': data.get('stock_quantity', product['stock_quantity']),
        'is_active': data.get('is_active', product['is_active']),
        'tags': data.get('tags', product['tags']),
        'updated_at': '2024-01-01T00:00:00Z'
    })
    
    return jsonify({
        'message': 'Product updated successfully',
        'product': product
    })

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    global products
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    products = [p for p in products if p['id'] != product_id]
    return jsonify({'message': 'Product deleted successfully'})

@app.route('/api/products/categories', methods=['GET'])
def get_categories():
    categories = list(set(p.get('category', '') for p in products if p.get('category')))
    return jsonify({'categories': categories})

# Reviews and Ratings endpoints
@app.route('/api/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    product_reviews = [r for r in reviews if r.get('product_id') == product_id]
    return jsonify({
        'reviews': product_reviews,
        'count': len(product_reviews),
        'average_rating': sum(r.get('rating', 0) for r in product_reviews) / len(product_reviews) if product_reviews else 0
    })

@app.route('/api/products/<int:product_id>/reviews', methods=['POST'])
def create_review(product_id):
    data = request.get_json()
    review = {
        'id': len(reviews) + 1,
        'product_id': product_id,
        'user_id': data.get('user_id'),
        'rating': data.get('rating'),
        'comment': data.get('comment', ''),
        'created_at': '2024-01-01T00:00:00Z'
    }
    reviews.append(review)
    return jsonify({
        'message': 'Review created successfully',
        'review': review
    }), 201

@app.route('/api/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    review = next((r for r in reviews if r['id'] == review_id), None)
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    data = request.get_json()
    review.update({
        'rating': data.get('rating', review['rating']),
        'comment': data.get('comment', review['comment']),
        'updated_at': '2024-01-01T00:00:00Z'
    })
    
    return jsonify({
        'message': 'Review updated successfully',
        'review': review
    })

@app.route('/api/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    global reviews
    review = next((r for r in reviews if r['id'] == review_id), None)
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    reviews = [r for r in reviews if r['id'] != review_id]
    return jsonify({'message': 'Review deleted successfully'})

# Favorites endpoints
@app.route('/api/users/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites(user_id):
    user_favorites = [f for f in favorites if f.get('user_id') == user_id]
    favorite_products = []
    for fav in user_favorites:
        product = next((p for p in products if p['id'] == fav['product_id']), None)
        if product:
            favorite_products.append(product)
    
    return jsonify({
        'favorites': favorite_products,
        'count': len(favorite_products)
    })

@app.route('/api/users/<int:user_id>/favorites', methods=['POST'])
def add_favorite(user_id):
    data = request.get_json()
    product_id = data.get('product_id')
    
    # Check if already favorited
    existing = next((f for f in favorites if f['user_id'] == user_id and f['product_id'] == product_id), None)
    if existing:
        return jsonify({'error': 'Product already in favorites'}), 400
    
    favorite = {
        'id': len(favorites) + 1,
        'user_id': user_id,
        'product_id': product_id,
        'created_at': '2024-01-01T00:00:00Z'
    }
    favorites.append(favorite)
    return jsonify({
        'message': 'Product added to favorites',
        'favorite': favorite
    }), 201

@app.route('/api/users/<int:user_id>/favorites/<int:product_id>', methods=['DELETE'])
def remove_favorite(user_id, product_id):
    global favorites
    favorite = next((f for f in favorites if f['user_id'] == user_id and f['product_id'] == product_id), None)
    if not favorite:
        return jsonify({'error': 'Favorite not found'}), 404
    
    favorites = [f for f in favorites if not (f['user_id'] == user_id and f['product_id'] == product_id)]
    return jsonify({'message': 'Product removed from favorites'})

# Search tracking
@app.route('/api/search', methods=['POST'])
def track_search():
    data = request.get_json()
    search_entry = {
        'id': len(search_history) + 1,
        'user_id': data.get('user_id'),
        'query': data.get('query'),
        'filters': data.get('filters', {}),
        'results_count': data.get('results_count', 0),
        'created_at': '2024-01-01T00:00:00Z'
    }
    search_history.append(search_entry)
    return jsonify({'message': 'Search tracked successfully'})

@app.route('/api/search/history/<int:user_id>', methods=['GET'])
def get_search_history(user_id):
    user_searches = [s for s in search_history if s.get('user_id') == user_id]
    return jsonify({
        'searches': user_searches,
        'count': len(user_searches)
    })

# Analytics and Dashboard endpoints
@app.route('/api/analytics/producer/<int:producer_id>/stats', methods=['GET'])
def get_producer_stats(producer_id):
    # Get producer's products
    producer_products = [p for p in products if p.get('producer_id') == producer_id]
    product_ids = [p['id'] for p in producer_products]
    
    # Calculate stats
    total_products = len(producer_products)
    total_views = sum(p.get('views', 0) for p in producer_products)
    total_favorites = len([f for f in favorites if f.get('product_id') in product_ids])
    total_reviews = len([r for r in reviews if r.get('product_id') in product_ids])
    
    # Average rating
    product_reviews = [r for r in reviews if r.get('product_id') in product_ids]
    avg_rating = sum(r.get('rating', 0) for r in product_reviews) / len(product_reviews) if product_reviews else 0
    
    return jsonify({
        'producer_id': producer_id,
        'total_products': total_products,
        'total_views': total_views,
        'total_favorites': total_favorites,
        'total_reviews': total_reviews,
        'average_rating': round(avg_rating, 2),
        'products': producer_products
    })

@app.route('/api/analytics/admin/overview', methods=['GET'])
def get_admin_overview():
    # Calculate overall stats
    total_users = len(users)
    total_products = len(products)
    total_reviews = len(reviews)
    total_favorites = len(favorites)
    total_searches = len(search_history)
    
    # User role distribution
    role_distribution = {}
    for user in users:
        role = user.get('role', 'consumer')
        role_distribution[role] = role_distribution.get(role, 0) + 1
    
    # Category distribution
    category_distribution = {}
    for product in products:
        category = product.get('category', 'uncategorized')
        category_distribution[category] = category_distribution.get(category, 0) + 1
    
    return jsonify({
        'total_users': total_users,
        'total_products': total_products,
        'total_reviews': total_reviews,
        'total_favorites': total_favorites,
        'total_searches': total_searches,
        'role_distribution': role_distribution,
        'category_distribution': category_distribution
    })

@app.route('/api/analytics/products/trending', methods=['GET'])
def get_trending_products():
    # Simple trending calculation based on favorites and views
    trending_products = []
    for product in products:
        product_id = product['id']
        favorites_count = len([f for f in favorites if f.get('product_id') == product_id])
        reviews_count = len([r for r in reviews if r.get('product_id') == product_id])
        views = product.get('views', 0)
        
        # Simple trending score
        trending_score = favorites_count * 2 + reviews_count * 1.5 + views * 0.1
        
        trending_products.append({
            **product,
            'trending_score': trending_score,
            'favorites_count': favorites_count,
            'reviews_count': reviews_count
        })
    
    # Sort by trending score
    trending_products.sort(key=lambda x: x['trending_score'], reverse=True)
    
    return jsonify({
        'trending_products': trending_products[:10],  # Top 10
        'count': len(trending_products)
    })

if __name__ == '__main__':
    print("🚀 Starting Mantouji.ma API...")
    print("📍 API will be available at: http://localhost:5000")
    print("🔍 Health check: http://localhost:5000/api/health")
    print("👥 Users API: http://localhost:5000/api/users")
    print("📦 Products API: http://localhost:5000/api/products")
    print("Press CTRL+C to quit")
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
