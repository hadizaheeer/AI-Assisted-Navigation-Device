# Backend API Service

Clean, stateless FastAPI backend for AI-Assisted Navigation Device.

## Overview

This backend provides three main endpoints:
- `/v1/vision/detect` - Object detection from images
- `/v1/ocr/read` - Text recognition (OCR) from images
- `/v1/health` - Health check endpoint

All endpoints follow the contracts defined in `CONTRACTS.md`.

## Features

✅ **Stateless** - No global state, no shared mode  
✅ **Clean architecture** - Independent of frontend and ML team  
✅ **Mocked responses** - Ready for ML adapter integration  
✅ **Type-safe** - Pydantic models for request/response validation  
✅ **CORS enabled** - Ready for frontend integration  
✅ **Image validation** - Supports multipart file upload and base64  

## Quick Start

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Run the server

```bash
# Development mode (with auto-reload)
python main.py

# Or using uvicorn directly
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive docs**: http://localhost:8000/docs
- **Health check**: http://localhost:8000/v1/health

## API Endpoints

### POST `/v1/vision/detect`

Object detection endpoint. Accepts image and returns detected objects.

**Request:**
- Multipart form-data: `image` file
- OR JSON form: `image_base64` string

**Response:**
```json
{
  "timestamp": "2025-11-29T14:30:00.123456789Z",
  "frame_id": "uuid",
  "source": "yolov8s_indoor_v1_trained",
  "detections": [...]
}
```

### POST `/v1/ocr/read`

OCR text detection endpoint. Accepts image and returns detected text.

**Request:**
- Multipart form-data: `image` file
- OR JSON form: `image_base64` string

**Response:**
```json
{
  "timestamp": "2025-11-29T14:30:00.123456789Z",
  "frame_id": "uuid",
  "source": "easyocr_v1",
  "text_detections": [...]
}
```

### GET `/v1/health`

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-29T14:30:00.123456789Z",
  "version": "1.0.0",
  "services": {
    "vision": "available",
    "ocr": "available"
  }
}
```

## Testing

### Using curl

```bash
# Health check
curl http://localhost:8000/v1/health

# Vision detection (with image file)
curl -X POST http://localhost:8000/v1/vision/detect \
  -F "image=@path/to/image.jpg"

# OCR (with base64)
curl -X POST http://localhost:8000/v1/ocr/read \
  -F "image_base64=$(base64 -i path/to/image.jpg)"
```

### Using Python requests

```python
import requests

# Health check
response = requests.get("http://localhost:8000/v1/health")
print(response.json())

# Vision detection
with open("image.jpg", "rb") as f:
    response = requests.post(
        "http://localhost:8000/v1/vision/detect",
        files={"image": f}
    )
print(response.json())
```

### Using the interactive docs

Visit http://localhost:8000/docs for Swagger UI where you can test all endpoints interactively.

## Integration with ML Team

Currently, the endpoints return **mocked data**. To integrate with real ML models:

1. Create ML adapter modules (e.g., `ml_adapters/vision.py`, `ml_adapters/ocr.py`)
2. Replace the mock functions in `api.py`:
   - `_generate_mock_vision_detections()` → real ML adapter call
   - `_generate_mock_ocr_detections()` → real ML adapter call

Example integration point:
```python
# In api.py, replace:
detections = _generate_mock_vision_detections()

# With:
from ml_adapters.vision import detect_objects
detections = detect_objects(image_bytes)
```

## Architecture

```
backend/
├── api.py              # Main FastAPI app and endpoints
├── main.py             # Entry point
├── CONTRACTS.md        # API contract definitions
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Design Principles

- **Stateless**: No global variables, no shared state between requests
- **Independent**: Works without frontend or ML team dependencies
- **Type-safe**: Pydantic models ensure request/response validation
- **Clean**: Follows FastAPI best practices
- **Extensible**: Easy to add ML adapters later

## Future Work

- [ ] Integrate ML adapters for real object detection
- [ ] Integrate ML adapters for real OCR
- [ ] Add request rate limiting
- [ ] Add authentication/authorization
- [ ] Add request logging
- [ ] Add metrics/monitoring
- [ ] Add Docker containerization

