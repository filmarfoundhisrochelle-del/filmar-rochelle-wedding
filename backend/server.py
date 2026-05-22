from fastapi import FastAPI, APIRouter, HTTPException, Header, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional, List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

MAX_SEATS_PER_RSVP = 12

class RSVPCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: Optional[EmailStr] = None
    attending: bool
    seats: int = Field(ge=0, le=MAX_SEATS_PER_RSVP)
    message: Optional[str] = Field(default=None, max_length=600)

class RSVP(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: Optional[str] = None
    attending: bool
    seats: int
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RSVPStats(BaseModel):
    total_responses: int
    attending_responses: int
    declined_responses: int
    total_guests: int
    max_seats_per_rsvp: int

@api_router.get("/")
async def root():
    return {"message": "Filmar & Rochelle Wedding API"}

@api_router.post("/rsvp", response_model=RSVP)
async def submit_rsvp(payload: RSVPCreate, background_tasks: BackgroundTasks):
    if payload.attending and payload.seats < 1:
        raise HTTPException(status_code=400, detail="Please reserve at least 1 seat if you're attending.")
    seats = payload.seats if payload.attending else 0
    rsvp = RSVP(name=payload.name.strip(), email=payload.email, attending=payload.attending, seats=seats, message=(payload.message or "").strip() or None)
    doc = rsvp.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.rsvps.insert_one(doc)
    return rsvp

@api_router.get("/rsvp/stats", response_model=RSVPStats)
async def rsvp_stats():
    cursor = db.rsvps.find({}, {"_id": 0}).limit(5000)
    rsvps = await cursor.to_list(length=5000)
    attending = [r for r in rsvps if r.get("attending")]
    return RSVPStats(total_responses=len(rsvps), attending_responses=len(attending), declined_responses=len(rsvps)-len(attending), total_guests=sum(int(r.get("seats",0)) for r in attending), max_seats_per_rsvp=MAX_SEATS_PER_RSVP)

def _check_passcode(passcode: Optional[str]) -> None:
    expected = os.environ.get("HOST_PASSCODE", "")
    if not expected or passcode != expected:
        raise HTTPException(status_code=401, detail="Invalid host passcode")

@api_router.post("/host/verify")
async def host_verify(passcode: Optional[str] = Header(default=None, alias="X-Host-Passcode")):
    _check_passcode(passcode)
    return {"ok": True}

@api_router.get("/host/rsvps", response_model=List[RSVP])
async def host_list_rsvps(passcode: Optional[str] = Header(default=None, alias="X-Host-Passcode")):
    _check_passcode(passcode)
    cursor = db.rsvps.find({}, {"_id": 0}).sort("created_at", -1).limit(5000)
    rsvps = await cursor.to_list(length=5000)
    for r in rsvps:
        if isinstance(r.get("created_at"), str):
            try: r["created_at"] = datetime.fromisoformat(r["created_at"])
            except: pass
    return rsvps

@api_router.delete("/host/rsvps/{rsvp_id}")
async def host_delete_rsvp(rsvp_id: str, passcode: Optional[str] = Header(default=None, alias="X-Host-Passcode")):
    _check_passcode(passcode)
    result = await db.rsvps.delete_one({"id": rsvp_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="RSVP not found")
    return {"ok": True, "deleted": rsvp_id}

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=os.environ.get('CORS_ORIGINS','*').split(','), allow_methods=["*"], allow_headers=["*"])

logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
