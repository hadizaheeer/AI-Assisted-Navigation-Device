"""
FastAPI backend service for AI-Assisted Navigation Device.

This module provides stateless API endpoints for vision detection and OCR.
All endpoints follow the contracts defined in CONTRACTS.md.

Currently returns mocked responses until ML adapters are integrated.
"""

from datetime import datetime, timezone
import uuid
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image

app = FastAPI(
    title="AI-Assisted Navigation Device API",
    description="Backend API for vision detection and OCR services",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Request/Response Models (Pydantic)
# ============================================================================

class BBoxNorm(BaseModel):
    """Normalized bounding box coordinates (0.0-1.0)"""
    cx: float
    cy: float
    w: float
    h: float


class VisionDetection(BaseModel):
    """Single object detection result"""
    id: int
    label: str
    confidence: float
    bbox_norm: BBoxNorm
    severity: str  # "near" | "mid" | "far" | "none"
    side: str  # "left" | "center" | "right"
    distance_m: Optional[float] = None


class VisionResponse(BaseModel):
    """Response for /v1/vision/detect"""
    timestamp: str
    frame_id: str
    source: str
    detections: List[VisionDetection]


class OCRDetection(BaseModel):
    """Single text detection result"""
    id: int
    text: str
    confidence: float
    bbox_norm: BBoxNorm


class OCRResponse(BaseModel):
    """Response for /v1/ocr/read"""
    timestamp: str
    frame_id: str
    source: str
    text_detections: List[OCRDetection]


class ServiceStatus(BaseModel):
    """Service status for health check"""
    vision: str
    ocr: str


class HealthResponse(BaseModel):
    """Response for /v1/health"""
    status: str
    timestamp: str
    version: str
    services: ServiceStatus


# ============================================================================
# Utility Functions
# ============================================================================

def _iso_timestamp() -> str:
    """Generate ISO-8601 timestamp in UTC"""
    now = datetime.now(timezone.utc)
    return now.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def _generate_frame_id() -> str:
    """Generate unique frame ID"""
    return str(uuid.uuid4())


def _validate_image(image_data: bytes) -> bool:
    """Validate that bytes represent a valid image"""
    try:
        Image.open(BytesIO(image_data))
        return True
    except Exception:
        return False


def _parse_image_input(file: Optional[UploadFile] = None, image_base64: Optional[str] = None) -> bytes:
    """
    Parse image from either multipart file upload or base64 string.
    Returns image bytes.
    """
    if file:
        image_bytes = file.file.read()
        if not _validate_image(image_bytes):
            raise HTTPException(status_code=400, detail="Invalid image format")
        return image_bytes
    
    if image_base64:
        try:
            # Handle data URL format: "data:image/jpeg;base64,..."
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            image_bytes = base64.b64decode(image_base64)
            if not _validate_image(image_bytes):
                raise HTTPException(status_code=400, detail="Invalid base64 image format")
            return image_bytes
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 encoding: {str(e)}")
    
    raise HTTPException(status_code=400, detail="No image provided. Use 'image' file or 'image' base64 string")


# ============================================================================
# Mock Data Generators (Replace with real ML adapters later)
# ============================================================================

def _generate_mock_vision_detections() -> List[VisionDetection]:
    """Generate mock vision detections for testing"""
    return [
        VisionDetection(
            id=0,
            label="office-chair",
            confidence=0.82,
            bbox_norm=BBoxNorm(cx=0.53, cy=0.61, w=0.24, h=0.35),
            severity="near",
            side="left",
            distance_m=None
        ),
        VisionDetection(
            id=1,
            label="monitor",
            confidence=0.75,
            bbox_norm=BBoxNorm(cx=0.72, cy=0.45, w=0.18, h=0.22),
            severity="mid",
            side="right",
            distance_m=None
        ),
        VisionDetection(
            id=2,
            label="books",
            confidence=0.68,
            bbox_norm=BBoxNorm(cx=0.35, cy=0.55, w=0.15, h=0.28),
            severity="far",
            side="left",
            distance_m=None
        )
    ]


def _generate_mock_ocr_detections() -> List[OCRDetection]:
    """Generate mock OCR detections for testing"""
    return [
        OCRDetection(
            id=0,
            text="Room 2.12",
            confidence=0.88,
            bbox_norm=BBoxNorm(cx=0.45, cy=0.30, w=0.15, h=0.08)
        ),
        OCRDetection(
            id=1,
            text="Library",
            confidence=0.92,
            bbox_norm=BBoxNorm(cx=0.50, cy=0.15, w=0.12, h=0.06)
        )
    ]


# ============================================================================
# API Endpoints
# ============================================================================

@app.post("/v1/vision/detect", response_model=VisionResponse)
async def vision_detect(
    image: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None)
):
    """
    Object detection endpoint.
    
    Accepts image via multipart form-data (file) or JSON form (base64).
    Returns detected objects with bounding boxes, confidence, severity, and side.
    
    **Note:** Currently returns mocked data. Replace with ML adapter integration.
    """
    # Parse image input (validates format)
    image_bytes = _parse_image_input(file=image, image_base64=image_base64)
    
    # TODO: Replace with real ML adapter call
    # detections = ml_adapter.detect_objects(image_bytes)
    detections = _generate_mock_vision_detections()
    
    return VisionResponse(
        timestamp=_iso_timestamp(),
        frame_id=_generate_frame_id(),
        source="yolov8s_indoor_v1_trained",
        detections=detections
    )


@app.post("/v1/ocr/read", response_model=OCRResponse)
async def ocr_read(
    image: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None)
):
    """
    OCR text detection endpoint.
    
    Accepts image via multipart form-data (file) or JSON form (base64).
    Returns detected text with bounding boxes and confidence.
    
    **Note:** Currently returns mocked data. Replace with ML adapter integration.
    """
    # Parse image input (validates format)
    image_bytes = _parse_image_input(file=image, image_base64=image_base64)
    
    # TODO: Replace with real ML adapter call
    # text_detections = ml_adapter.read_text(image_bytes)
    text_detections = _generate_mock_ocr_detections()
    
    return OCRResponse(
        timestamp=_iso_timestamp(),
        frame_id=_generate_frame_id(),
        source="easyocr_v1",
        text_detections=text_detections
    )


@app.get("/v1/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.
    
    Returns service status and availability of vision/OCR services.
    """
    # TODO: Add real health checks (e.g., ML model loaded, GPU available)
    return HealthResponse(
        status="healthy",
        timestamp=_iso_timestamp(),
        version="1.0.0",
        services=ServiceStatus(
            vision="available",
            ocr="available"
        )
    )


# ============================================================================
# Root endpoint (optional, for quick testing)
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "AI-Assisted Navigation Device API",
        "version": "1.0.0",
        "endpoints": {
            "vision": "/v1/vision/detect",
            "ocr": "/v1/ocr/read",
            "health": "/v1/health"
        },
        "docs": "/docs"
    }

