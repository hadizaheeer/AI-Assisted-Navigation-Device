"""
Main entry point for the AI-Assisted Navigation Device backend API.

This is a clean, stateless FastAPI service that provides:
- /v1/vision/detect - Object detection
- /v1/ocr/read - Text recognition
- /v1/health - Health check

Run with: uvicorn main:app --host 0.0.0.0 --port 8000
"""

from api import app
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Set to False in production
    )
