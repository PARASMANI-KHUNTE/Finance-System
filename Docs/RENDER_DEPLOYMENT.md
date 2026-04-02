# Deploying to Render

This guide covers deploying the Finance Tracking System to [Render](https://render.com).

---

## Prerequisites

1. A [Render account](https://dashboard.render.com/register)
2. GitHub/GitLab repository with your code
3. Project pushed to remote repository

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Render                                             │
│                                                     │
│  ┌──────────────┐    ┌──────────────────────────┐ │
│  │  FastAPI     │───▶│  PostgreSQL               │ │
│  │  Web Service │    │  (Persistent, Managed)     │ │
│  └──────────────┘    └──────────────────────────┘ │
│         │                       │                  │
│  ┌──────────────┐              │                  │
│  │  React       │              │                  │
│  │  Static Site │              │                  │
│  └──────────────┘              │                  │
│         │                       │                  │
│         └───────────────────────┘                  │
│                     │                              │
│              pgAdmin / CLI                         │
│              (View & Manage DB)                    │
└─────────────────────────────────────────────────────┘
```

---

## Step 1: Create PostgreSQL Database

### 1.1 Create PostgreSQL Instance

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in details:

| Setting | Value |
|---------|-------|
| **Name** | `finance-db` |
| **Region** | Choose closest to you |
| **Database** | `finance_db` |
| **User** | `finance_user` |

4. Click **"Create Database"**

### 1.2 Copy Connection String

After creation, you'll see:
```
postgresql://finance_user:xxxxxxxxxxxx@dpg-xxxxxxxxxxxx:5432/finance_db
```

**Save this!** You'll need it for the web service.

### 1.3 View Database (pgAdmin)

To view your database data:

1. Download [pgAdmin](https://www.pgadmin.org/download/) or use the browser version
2. Click on your PostgreSQL instance in Render dashboard
3. Click **"Connect"** to open in browser pgAdmin
4. Or use the **"External Links"** section to connect with your preferred tool

---

## Step 2: Update Backend Code

### 2.1 Update Database Session

Replace `Backend/app/db/session.py`:

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./finance.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

### 2.2 Update requirements.txt

Add PostgreSQL driver:

```
fastapi==0.110.0
uvicorn==0.27.1
sqlalchemy==2.0.28
psycopg2-binary==2.9.9
pydantic==2.6.4
pydantic-settings==2.2.1
python-dotenv==1.0.1
pytest==8.1.1
httpx==0.27.0
```

---

## Step 3: Deploy Backend (Web Service)

### 3.1 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `finance-api` |
| **Region** | Same as PostgreSQL |
| **Branch** | `main` |
| **Root Directory** | `Backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

### 3.2 Add Environment Variables

| Key | Value |
|-----|-------|
| `PROJECT_NAME` | `Finance Tracking API` |
| `API_V1_STR` | `/api/v1` |
| `DATABASE_URL` | *(Paste your PostgreSQL connection string from Step 1.2)* |

**Important:** For `DATABASE_URL`, click the **"Secret"** toggle to hide it.

### 3.3 Connect to PostgreSQL

Scroll down to **"PostgreSQL"** section and connect to your database:

1. Click **"Connect a PostgreSQL database"**
2. Select your `finance-db` instance
3. Render will auto-populate `DATABASE_URL`

### 3.4 Deploy

Click **"Create Web Service"**.

Check logs for successful database connection:
```
INFO:     Connected to database
```

Your API will be live at: `https://finance-api.onrender.com`

---

## Step 4: Deploy Frontend (Static Site)

### 4.1 Update API Configuration

Update `Frontend/src/services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://finance-api.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const role = localStorage.getItem('user-role') || 'admin';
  config.headers['X-Role'] = role;
  return config;
});

export default api;
```

### 4.2 Create Environment File

Create `Frontend/.env.production`:
```
VITE_API_URL=https://finance-api.onrender.com/api/v1
```

### 4.3 Deploy to Render

1. Click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `finance-app` |
| **Branch** | `main` |
| **Root Directory** | `Frontend` |
| **Build Command** | `npm run build` |
| **Publish Directory** | `dist` |

4. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://finance-api.onrender.com/api/v1`

5. Click **"Create Static Site"**

Your app will be live at: `https://finance-app.onrender.com`

---

## Step 5: Update CORS

Update `Backend/app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import transactions, summary
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend service for tracking financial transactions",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://finance-app.onrender.com",  # Your deployed frontend
        "http://localhost:5173",              # Local development
        "http://localhost:3000",              # Alternative local port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router, prefix=f"{settings.API_V1_STR}/transactions", tags=["transactions"])
app.include_router(summary.router, prefix=f"{settings.API_V1_STR}/summary", tags=["summary"])

@app.get("/")
def root():
    return {"message": "Welcome to the Finance Tracking API"}
```

---

## Viewing Your Database

### Method 1: Render Dashboard (Easiest)

1. Go to your PostgreSQL instance in Render
2. Click **"Connect"** button
3. Opens browser-based pgAdmin interface
4. Navigate: `Servers` → `PostgreSQL` → `Databases` → `finance_db` → `Schemas` → `Tables`

### Method 2: Query Data via API

Your deployed API endpoints allow you to view data:

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/transactions` | List all transactions |
| `GET /api/v1/summary` | View totals and analytics |
| `GET /api/v1/transactions/{id}` | Get single transaction |

Visit `https://finance-api.onrender.com/docs` to use the interactive Swagger UI.

### Method 3: pgAdmin Desktop App

1. Download [pgAdmin](https://www.pgadmin.org/download/)
2. Add new server:
   - Host: From Render's "External Database URL"
   - Port: `5432`
   - Database: `finance_db`
   - Username: `finance_user`
   - Password: From Render dashboard

### Method 4: Connect with DBeaver (Recommended)

1. Download [DBeaver](https://dbeaver.io/download/)
2. Create new connection → PostgreSQL
3. Enter credentials from Render dashboard
4. Now you can:
   - Browse tables visually
   - Run SQL queries
   - Export data to CSV/Excel
   - View ER diagrams

---

## Migrating Existing Data (SQLite → PostgreSQL)

If you have data in local SQLite and want to move it:

### Option 1: Use Migrate Script

1. Create `Backend/migrations/migrate_sqlite_to_pg.py`:

```python
import os
import sqlite3
import psycopg2
from psycopg2.extras import execute_batch

def migrate():
    sqlite_db = "finance.db"
    pg_url = os.getenv("DATABASE_URL")
    
    if not pg_url:
        print("DATABASE_URL not set!")
        return
    
    # Connect to SQLite
    sqlite_conn = sqlite3.connect(sqlite_db)
    cursor = sqlite_conn.cursor()
    cursor.execute("SELECT id, user_id, amount, type, category, date, notes FROM transactions")
    rows = cursor.fetchall()
    
    print(f"Found {len(rows)} transactions to migrate")
    
    # Connect to PostgreSQL
    pg_conn = psycopg2.connect(pg_url)
    pg_cursor = pg_conn.cursor()
    
    # Insert data
    query = """
        INSERT INTO transactions (id, user_id, amount, type, category, date, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            amount = EXCLUDED.amount,
            type = EXCLUDED.type,
            category = EXCLUDED.category,
            date = EXCLUDED.date,
            notes = EXCLUDED.notes
    """
    
    execute_batch(pg_cursor, query, rows)
    pg_conn.commit()
    
    print(f"Successfully migrated {len(rows)} transactions!")
    
    sqlite_conn.close()
    pg_conn.close()

if __name__ == "__main__":
    migrate()
```

2. Run locally:
```bash
cd Backend
pip install psycopg2-binary
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
python migrations/migrate_sqlite_to_pg.py
```

### Option 2: Export/Import CSV

1. Export from SQLite:
```bash
sqlite3 finance.db
sqlite> .headers on
sqlite> .mode csv
sqlite> .output transactions.csv
sqlite> SELECT * FROM transactions;
sqlite> .exit
```

2. Import to PostgreSQL via pgAdmin:
   - Right-click table → Import/Export
   - Select your CSV file

---

## Free Tier Summary

| Resource | Free Tier | Notes |
|----------|------------|-------|
| Web Service | Sleeps after 15 min | ~30s wake up time |
| Static Site | Sleeps after 15 min | ~30s wake up time |
| PostgreSQL | Always on | 1GB storage, 250MB RAM |
| Data Retention | Indefinite | Persists on PostgreSQL |

---

## Troubleshooting

### Backend Not Starting
```
# Check logs for:
- Missing psycopg2-binary
- DATABASE_URL not set
- Connection refused to PostgreSQL
```

### Database Connection Errors
1. Verify PostgreSQL is in same region as web service
2. Check DATABASE_URL format (no quotes, no extra spaces)
3. Ensure PostgreSQL is not sleeping (it's always-on on free tier)

### CORS Errors
- Add exact frontend URL to `allow_origins` list
- No trailing slashes

### Empty Database After Deploy
- SQLite data doesn't automatically migrate
- Run the migration script
- Or add data via the deployed UI

---

## Cost Summary

| Service | Free Tier | Paid Options |
|---------|-----------|---------------|
| Web Service | 750 hours/month | $7/month starter |
| Static Site | Unlimited | $5/month |
| PostgreSQL | 1GB storage | $15/month for 100GB |

**For learning/personal use: All free tier is sufficient!**
