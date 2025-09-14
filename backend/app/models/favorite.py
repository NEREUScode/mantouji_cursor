from app import db
from datetime import datetime
import uuid

class Favorite(db.Model):
    """Favorite model for user's favorite products"""
    __tablename__ = 'favorites'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate favorites
    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='unique_user_product_favorite'),)
    
    def to_dict(self, include_product=False):
        """Convert favorite to dictionary"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_product and self.product:
            data['product'] = self.product.to_dict()
        
        return data
    
    def __repr__(self):
        return f'<Favorite {self.id} - User {self.user_id} -> Product {self.product_id}>'
