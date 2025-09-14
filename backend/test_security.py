#!/usr/bin/env python3
"""
Security test script for Mantouji.ma API
Tests that users cannot edit/access other users' products
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_security_fixes():
    """Test that security fixes are working properly"""
    print("🔒 Testing Security Fixes for Mantouji.ma API")
    print("=" * 50)
    
    # Test 1: Try to create product without authentication
    print("\n1. Testing product creation without authentication...")
    response = requests.post(f"{BASE_URL}/api/products", json={
        "name": "Test Product",
        "description": "This should fail",
        "price": 100,
        "category": "Test"
    })
    
    if response.status_code == 401:
        print("✅ PASS: Unauthenticated product creation blocked")
    else:
        print(f"❌ FAIL: Expected 401, got {response.status_code}")
    
    # Test 2: Try to create product with invalid token
    print("\n2. Testing product creation with invalid token...")
    response = requests.post(f"{BASE_URL}/api/products", 
        headers={"Authorization": "Bearer invalid_token"},
        json={
            "name": "Test Product",
            "description": "This should fail",
            "price": 100,
            "category": "Test"
        }
    )
    
    if response.status_code == 401:
        print("✅ PASS: Invalid token blocked")
    else:
        print(f"❌ FAIL: Expected 401, got {response.status_code}")
    
    # Test 3: Login as producer and create product
    print("\n3. Testing product creation with valid producer token...")
    login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "ahmed@example.com",
        "password": "password123"
    })
    
    if login_response.status_code == 200:
        token = login_response.json()['access_token']
        print(f"✅ Login successful, token: {token}")
        
        # Create product
        response = requests.post(f"{BASE_URL}/api/products", 
            headers={"Authorization": f"Bearer {token}"},
            json={
                "name": "Producer's Product",
                "description": "This should work",
                "price": 150,
                "category": "Test"
            }
        )
        
        if response.status_code == 201:
            product_data = response.json()['product']
            print(f"✅ Product created successfully: {product_data['name']}")
            print(f"   Producer ID: {product_data['producer_id']}")
            
            # Test 4: Try to update product as different user
            print("\n4. Testing product update as different user...")
            
            # Login as different user (consumer)
            login_response2 = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": "fatima@example.com",
                "password": "password123"
            })
            
            if login_response2.status_code == 200:
                token2 = login_response2.json()['access_token']
                print(f"✅ Second user login successful, token: {token2}")
                
                # Try to update the product created by first user
                update_response = requests.put(f"{BASE_URL}/api/products/{product_data['id']}", 
                    headers={"Authorization": f"Bearer {token2}"},
                    json={
                        "name": "Hacked Product",
                        "description": "This should fail",
                        "price": 999,
                        "category": "Hacked"
                    }
                )
                
                if update_response.status_code == 403:
                    print("✅ PASS: Different user cannot update product")
                else:
                    print(f"❌ FAIL: Expected 403, got {update_response.status_code}")
                    print(f"   Response: {update_response.json()}")
                
                # Test 5: Try to delete product as different user
                print("\n5. Testing product deletion as different user...")
                delete_response = requests.delete(f"{BASE_URL}/api/products/{product_data['id']}", 
                    headers={"Authorization": f"Bearer {token2}"}
                )
                
                if delete_response.status_code == 403:
                    print("✅ PASS: Different user cannot delete product")
                else:
                    print(f"❌ FAIL: Expected 403, got {delete_response.status_code}")
                    print(f"   Response: {delete_response.json()}")
                
                # Test 6: Try to access my-products as consumer
                print("\n6. Testing my-products access as consumer...")
                my_products_response = requests.get(f"{BASE_URL}/api/products/my-products", 
                    headers={"Authorization": f"Bearer {token2}"}
                )
                
                if my_products_response.status_code == 403:
                    print("✅ PASS: Consumer cannot access my-products")
                else:
                    print(f"❌ FAIL: Expected 403, got {my_products_response.status_code}")
                    print(f"   Response: {my_products_response.json()}")
                
            else:
                print(f"❌ Second user login failed: {login_response2.status_code}")
        else:
            print(f"❌ Product creation failed: {response.status_code}")
            print(f"   Response: {response.json()}")
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"   Response: {login_response.json()}")
    
    # Test 7: Test that producer can only see their own products
    print("\n7. Testing my-products for producer...")
    if 'token' in locals():
        my_products_response = requests.get(f"{BASE_URL}/api/products/my-products", 
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if my_products_response.status_code == 200:
            products = my_products_response.json()['products']
            print(f"✅ Producer can access my-products: {len(products)} products")
            for product in products:
                print(f"   - {product['name']} (Producer ID: {product['producer_id']})")
        else:
            print(f"❌ My-products access failed: {my_products_response.status_code}")
    
    print("\n" + "=" * 50)
    print("🔒 Security Test Complete!")

if __name__ == "__main__":
    test_security_fixes()
