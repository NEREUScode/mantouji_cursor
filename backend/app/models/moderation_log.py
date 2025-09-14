from app import db
from datetime import datetime
import uuid

class ModerationLog(db.Model):
    """Moderation log model for admin actions"""
    __tablename__ = 'moderation_logs'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    moderator_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    target_type = db.Column(db.String(20), nullable=False)  # user, product, review
    target_id = db.Column(db.String(36), nullable=False)  # ID of the moderated item
    action = db.Column(db.String(50), nullable=False)  # approve, reject, flag, suspend
    reason = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert moderation log to dictionary"""
        return {
            'id': self.id,
            'moderator_id': self.moderator_id,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'action': self.action,
            'reason': self.reason,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<ModerationLog {self.id} - {self.action} {self.target_type} {self.target_id}>'
