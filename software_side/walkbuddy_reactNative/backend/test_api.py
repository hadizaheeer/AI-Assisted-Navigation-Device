"""
Simple test script for the backend API endpoints.

Run this after starting the server to verify all endpoints work correctly.
"""

import requests
import base64
from pathlib import Path

BASE_URL = "http://localhost:8000"


def test_health():
    """Test the health check endpoint"""
    print("Testing /v1/health...")
    response = requests.get(f"{BASE_URL}/v1/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()


def test_vision_detect_mock():
    """Test vision detection with a mock image (base64)"""
    print("Testing /v1/vision/detect (base64)...")
    
    # Create a simple 1x1 pixel image as base64 (minimal test)
    # In real usage, you'd use an actual image
    test_image_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    response = requests.post(
        f"{BASE_URL}/v1/vision/detect",
        data={"image_base64": test_image_base64}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()


def test_ocr_read_mock():
    """Test OCR with a mock image (base64)"""
    print("Testing /v1/ocr/read (base64)...")
    
    # Create a simple 1x1 pixel image as base64 (minimal test)
    test_image_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    response = requests.post(
        f"{BASE_URL}/v1/ocr/read",
        data={"image_base64": test_image_base64}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()


def test_vision_detect_file(image_path: str):
    """Test vision detection with an actual image file"""
    print(f"Testing /v1/vision/detect (file: {image_path})...")
    
    if not Path(image_path).exists():
        print(f"Image not found: {image_path}")
        return
    
    with open(image_path, "rb") as f:
        response = requests.post(
            f"{BASE_URL}/v1/vision/detect",
            files={"image": f}
        )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()


if __name__ == "__main__":
    print("=" * 50)
    print("Backend API Test Suite")
    print("=" * 50)
    print()
    
    try:
        # Test health endpoint
        test_health()
        
        # Test vision detection (base64)
        test_vision_detect_mock()
        
        # Test OCR (base64)
        test_ocr_read_mock()
        
        # Test with actual image file (if provided)
        # Uncomment and provide path:
        # test_vision_detect_file("path/to/your/image.jpg")
        
        print("=" * 50)
        print("All tests completed!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server.")
        print("   Make sure the server is running:")
        print("   python main.py")
    except Exception as e:
        print(f"❌ Error: {e}")

