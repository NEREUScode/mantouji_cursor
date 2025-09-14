from app import db
from datetime import datetime
import uuid

class Review(db.Model):
    """Review model for product reviews and ratings"""
    __tablename__ = 'reviews'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    title = db.Column(db.String(100))
    comment = db.Column(db.Text)
    is_verified_purchase = db.Column(db.Boolean, default=False)
    is_flagged = db.Column(db.Boolean, default=False)
    flag_reason = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Unique constraint to prevent duplicate reviews
    __table_args__ = (db.UniqueConstraint('product_id', 'user_id', name='unique_product_user_review'),)
    
    def to_dict(self, include_user=False):
        """Convert review to dictionary"""
        data = {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'is_verified_purchase': self.is_verified_purchase,
            'is_flagged': self.is_flagged,
            'flag_reason': self.flag_reason,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_user and self.user:
            data['user'] = {
                'id': self.user.id,
                'username': self.user.username,
                'first_name': self.user.first_name,
                'last_name': self.user.last_name
            }
        
        return data
    
    def flag(self, reason):
        """Flag review for moderation"""
        self.is_flagged = True
        self.flag_reason = reason
        db.session.commit()
    
    def unflag(self):
        """Remove flag from review"""
        self.is_flagged = False
        self.flag_reason = None
        db.session.commit()
    
    def __repr__(self):
        return f'<Review {self.id} for Product {self.product_id}>'
