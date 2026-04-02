from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import transactions, summary
from app.db.base import Base
from app.db.session import engine

# Create tables based on metadata (Normally handled by Alembic, but good for local dev)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend service for tracking financial transactions",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router, prefix=f"{settings.API_V1_STR}/transactions", tags=["transactions"])
app.include_router(summary.router, prefix=f"{settings.API_V1_STR}/summary", tags=["summary"])

@app.get("/")
def root():
    return {"message": "Welcome to the Finance Tracking API"}
