import re
from typing import Any, Dict, List

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password(password: str) -> bool:
    """Validate password strength"""
    return len(password) >= 8

def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    pattern = r'^\+?[1-9]\d{1,14}$'
    return bool(re.match(pattern, phone))

def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> tuple[bool, str]:
    """Validate that all required fields are present"""
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    return True, ""

def validate_positive_number(value: Any, field_name: str) -> tuple[bool, str]:
    """Validate that value is a positive number"""
    try:
        num = float(value)
        if num <= 0:
            return False, f"{field_name} must be a positive number"
        return True, ""
    except (ValueError, TypeError):
        return False, f"{field_name} must be a valid number"

def validate_rating(rating: Any) -> tuple[bool, str]:
    """Validate rating is between 1 and 5"""
    try:
        num = int(rating)
        if not 1 <= num <= 5:
            return False, "Rating must be between 1 and 5"
        return True, ""
    except (ValueError, TypeError):
        return False, "Rating must be a valid integer"

def validate_coordinates(latitude: Any, longitude: Any) -> tuple[bool, str]:
    """Validate latitude and longitude coordinates"""
    try:
        lat = float(latitude)
        lon = float(longitude)
        
        if not -90 <= lat <= 90:
            return False, "Latitude must be between -90 and 90"
        if not -180 <= lon <= 180:
            return False, "Longitude must be between -180 and 180"
        
        return True, ""
    except (ValueError, TypeError):
        return False, "Coordinates must be valid numbers"
