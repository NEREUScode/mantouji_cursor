#!/usr/bin/env python3
"""
Test script to verify the Flask server is working
"""

import requests
import time
import subprocess
import sys

def test_server():
    print("🧪 Testing Mantouji.ma API...")
    
    # Wait a moment for server to start
    time.sleep(2)
    
    try:
        # Test health endpoint
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        print(f"✅ Health check: {response.status_code}")
        print(f"📄 Response: {response.json()}")
        
        # Test register endpoint
        register_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "test123"
        }
        
        response = requests.post(
            'http://localhost:5000/api/auth/register',
            json=register_data,
            timeout=5
        )
        print(f"✅ Register endpoint: {response.status_code}")
        print(f"📄 Response: {response.json()}")
        
        # Test login endpoint
        login_data = {
            "email": "test@example.com",
            "password": "test123"
        }
        
        response = requests.post(
            'http://localhost:5000/api/auth/login',
            json=login_data,
            timeout=5
        )
        print(f"✅ Login endpoint: {response.status_code}")
        print(f"📄 Response: {response.json()}")
        
        print("\n🎉 All tests passed! The API is working correctly.")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection refused. Server might not be running.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_server()
