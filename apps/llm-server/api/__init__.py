from fastapi import APIRouter
from .summarize import summarize_router

api_router = APIRouter()

api_router.include_router(
    summarize_router, prefix="/summarize", tags=["Summarize"]
)
api_router.include_router(summarize_router)
