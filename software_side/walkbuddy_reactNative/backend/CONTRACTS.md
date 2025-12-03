# API Contracts

This document defines the request/response shapes for all backend API endpoints.

## Base URL
All endpoints are prefixed with `/v1`

---

## `/v1/vision/detect`

**Purpose:** Object detection from camera/image input

### Request

**Method:** `POST`

**Content-Type:** `multipart/form-data` or `application/json` (base64 image)

**Body (multipart/form-data):**
```
image: <binary file>
```

**Body (JSON with base64):**
```json
{
  "image": "base64_encoded_image_string"
}
```

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Body:**
```json
{
  "timestamp": "2025-11-29T14:30:00.123456789Z",
  "frame_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "source": "yolov8s_indoor_v1_trained",
  "detections": [
    {
      "id": 0,
      "label": "office-chair",
      "confidence": 0.82,
      "bbox_norm": {
        "cx": 0.53,
        "cy": 0.61,
        "w": 0.24,
        "h": 0.35
      },
      "severity": "near",
      "side": "left",
      "distance_m": null
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid image format",
  "detail": "Image must be a valid JPEG, PNG, or base64 string"
}
```

---

## `/v1/ocr/read`

**Purpose:** Optical Character Recognition (OCR) from camera/image input

### Request

**Method:** `POST`

**Content-Type:** `multipart/form-data` or `application/json` (base64 image)

**Body (multipart/form-data):**
```
image: <binary file>
```

**Body (JSON with base64):**
```json
{
  "image": "base64_encoded_image_string"
}
```

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Body:**
```json
{
  "timestamp": "2025-11-29T14:30:00.123456789Z",
  "frame_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "source": "easyocr_v1",
  "text_detections": [
    {
      "id": 0,
      "text": "Room 2.12",
      "confidence": 0.88,
      "bbox_norm": {
        "cx": 0.45,
        "cy": 0.30,
        "w": 0.15,
        "h": 0.08
      }
    },
    {
      "id": 1,
      "text": "Library",
      "confidence": 0.92,
      "bbox_norm": {
        "cx": 0.50,
        "cy": 0.15,
        "w": 0.12,
        "h": 0.06
      }
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid image format",
  "detail": "Image must be a valid JPEG, PNG, or base64 string"
}
```

---

## `/v1/health`

**Purpose:** Health check endpoint for monitoring and load balancers

### Request

**Method:** `GET`

**No body required**

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Body:**
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

**Error Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-11-29T14:30:00.123456789Z",
  "version": "1.0.0",
  "services": {
    "vision": "unavailable",
    "ocr": "unavailable"
  }
}
```

---

## Common Response Fields

### Detection Object (Vision)
- `id`: Sequential ID within frame (integer)
- `label`: Class name (string, one of: book, books, monitor, office-chair, whiteboard, table, tv)
- `confidence`: Detection confidence 0.0-1.0 (float)
- `bbox_norm`: Normalized bounding box coordinates 0.0-1.0
  - `cx`: Center X (float)
  - `cy`: Center Y (float)
  - `w`: Width (float)
  - `h`: Height (float)
- `severity`: Distance estimate - "near" | "mid" | "far" | "none" (string)
- `side`: Horizontal position - "left" | "center" | "right" (string)
- `distance_m`: Distance in meters (float | null, reserved for future)

### Text Detection Object (OCR)
- `id`: Sequential ID within frame (integer)
- `text`: Detected text string (string)
- `confidence`: OCR confidence 0.0-1.0 (float)
- `bbox_norm`: Normalized bounding box coordinates 0.0-1.0
  - `cx`: Center X (float)
  - `cy`: Center Y (float)
  - `w`: Width (float)
  - `h`: Height (float)

### Common Metadata
- `timestamp`: ISO-8601 UTC timestamp (string)
- `frame_id`: Unique UUID per frame (string)
- `source`: Model/pipeline identifier (string)

