from app import db
from datetime import datetime
import uuid

class AIPrediction(db.Model):
    """AI prediction model for ML insights"""
    __tablename__ = 'ai_predictions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=True)  # Nullable for user-level predictions
    prediction_type = db.Column(db.String(50), nullable=False)  # client_potential, demand_trend, price_optimization
    prediction_data = db.Column(db.JSON, nullable=False)  # Store prediction results as JSON
    confidence_score = db.Column(db.Numeric(3, 2), nullable=False)  # 0.00 to 1.00
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert AI prediction to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'prediction_type': self.prediction_type,
            'prediction_data': self.prediction_data or {},
            'confidence_score': float(self.confidence_score) if self.confidence_score else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<AIPrediction {self.id} - Type: {self.prediction_type}>'
