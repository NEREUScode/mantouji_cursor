from app import db
from datetime import datetime
import uuid

class Product(db.Model):
    """Product model for regional products"""
    __tablename__ = 'products'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    producer_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    subcategory = db.Column(db.String(50))
    price = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='MAD')
    unit = db.Column(db.String(20), default='piece')
    stock_quantity = db.Column(db.Integer, default=0)
    min_order_quantity = db.Column(db.Integer, default=1)
    max_order_quantity = db.Column(db.Integer)
    images = db.Column(db.JSON, default=list)  # List of image URLs
    tags = db.Column(db.ARRAY(db.String), default=list)
    is_organic = db.Column(db.Boolean, default=False)
    is_available = db.Column(db.Boolean, default=True)
    harvest_date = db.Column(db.Date)
    expiry_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reviews = db.relationship('Review', backref='product', lazy='dynamic', cascade='all, delete-orphan')
    favorites = db.relationship('Favorite', backref='product', lazy='dynamic', cascade='all, delete-orphan')
    product_views = db.relationship('ProductView', backref='product', lazy='dynamic', cascade='all, delete-orphan')
    order_items = db.relationship('OrderItem', backref='product', lazy='dynamic', cascade='all, delete-orphan')
    ai_predictions = db.relationship('AIPrediction', backref='product', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self, include_reviews=False, include_producer=False):
        """Convert product to dictionary"""
        data = {
            'id': self.id,
            'producer_id': self.producer_id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'subcategory': self.subcategory,
            'price': float(self.price) if self.price else 0,
            'currency': self.currency,
            'unit': self.unit,
            'stock_quantity': self.stock_quantity,
            'min_order_quantity': self.min_order_quantity,
            'max_order_quantity': self.max_order_quantity,
            'images': self.images or [],
            'tags': self.tags or [],
            'is_organic': self.is_organic,
            'is_available': self.is_available,
            'harvest_date': self.harvest_date.isoformat() if self.harvest_date else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_producer and self.producer:
            data['producer'] = {
                'id': self.producer.id,
                'username': self.producer.username,
                'first_name': self.producer.first_name,
                'last_name': self.producer.last_name,
                'city': self.producer.city,
                'region': self.producer.region
            }
        
        if include_reviews:
            data['reviews'] = [review.to_dict() for review in self.reviews]
            data['average_rating'] = self.get_average_rating()
            data['review_count'] = self.reviews.count()
        
        return data
    
    def get_average_rating(self):
        """Calculate average rating from reviews"""
        reviews = self.reviews.filter_by(is_flagged=False).all()
        if not reviews:
            return 0
        return sum(review.rating for review in reviews) / len(reviews)
    
    def get_review_count(self):
        """Get total number of non-flagged reviews"""
        return self.reviews.filter_by(is_flagged=False).count()
    
    def is_in_stock(self):
        """Check if product is in stock"""
        return self.stock_quantity > 0 and self.is_available
    
    def can_order_quantity(self, quantity):
        """Check if requested quantity can be ordered"""
        if not self.is_in_stock():
            return False
        if quantity < self.min_order_quantity:
            return False
        if self.max_order_quantity and quantity > self.max_order_quantity:
            return False
        if quantity > self.stock_quantity:
            return False
        return True
    
    def __repr__(self):
        return f'<Product {self.name}>'
