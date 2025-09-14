from app import db
from datetime import datetime
import uuid

class SearchHistory(db.Model):
    """Search history model for tracking user searches"""
    __tablename__ = 'search_history'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)  # Nullable for anonymous searches
    search_query = db.Column(db.String(255), nullable=False)
    filters = db.Column(db.JSON, default=dict)  # Store search filters as JSON
    results_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert search history to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'search_query': self.search_query,
            'filters': self.filters or {},
            'results_count': self.results_count,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<SearchHistory {self.id} - Query: {self.search_query}>'
