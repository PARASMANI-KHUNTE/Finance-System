# Deploying to Render (SQLite)

This guide covers deploying the Finance Tracking System to [Render](https://render.com) using SQLite.

---

## Important Note

On Render's **free tier**, SQLite has limitations:
- ⚠️ **Data is ephemeral** - resets when service sleeps
- ⚠️ **Not persistent** - suitable for demos only

For production with persistent data, use PostgreSQL instead.

---

## Prerequisites

1. A [Render account](https://dashboard.render.com/register)
2. GitHub/GitLab repository with your code
3. Project pushed to remote repository

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Render (Free Tier)                                  │
│                                                      │
│  ┌──────────────┐    ┌──────────────────────────┐  │
│  │  FastAPI     │───▶│  SQLite (Ephemeral)      │  │
│  │  Web Service │    │  (Resets on sleep)        │  │
│  └──────────────┘    └──────────────────────────┘  │
│         │                                             │
│  ┌──────────────┐                                    │
│  │  React       │                                    │
│  │  Static Site │                                    │
│  └──────────────┘                                    │
└─────────────────────────────────────────────────────┘
```

---

## Deploy Backend (FastAPI)

### Step 1: Create Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `finance-api` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `Backend` |
| **Runtime** | `Python 3.11` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

> ⚠️ **Important:** Use Python 3.11 or 3.12. Python 3.14 is too new and packages don't have pre-built wheels for it.

### Step 2: Environment Variables

Add these under **Environment**:

| Key | Value |
|-----|-------|
| `PROJECT_NAME` | `Finance Tracking API` |
| `API_V1_STR` | `/api/v1` |
| `DATABASE_URL` | `sqlite:///./finance.db` |
| `PYTHON_VERSION` | `3.11` |

### Step 3: Deploy

Click **"Create Web Service"**.

Your API will be live at: `https://finance-api.onrender.com`

---

## Deploy Frontend (Static Site)

### Step 1: Update API Configuration

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

### Step 2: Create Environment File

Create `Frontend/.env.production`:
```
VITE_API_URL=https://finance-api.onrender.com/api/v1
```

### Step 3: Deploy to Render

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

## Update CORS for Production

Update `Backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://finance-app.onrender.com",  # Your deployed frontend
        "http://localhost:5173",              # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Viewing Your Data

### Method 1: Swagger UI (Easiest)

Visit `https://finance-api.onrender.com/docs`

Use the interactive interface to:
- View transactions via `GET /api/v1/transactions`
- View summary via `GET /api/v1/summary`
- Create new transactions

### Method 2: Export Data

1. Call `GET /api/v1/transactions?limit=1000`
2. Copy the JSON response
3. Save locally

### Method 3: Browser Console

In your frontend:
1. Open DevTools → Console
2. Run:
```javascript
fetch('https://finance-api.onrender.com/api/v1/transactions?limit=100', {
  headers: { 'X-Role': 'admin' }
}).then(r => r.json()).then(console.log)
```

---

## Free Tier Summary

| Feature | Free Tier | Notes |
|---------|-----------|-------|
| Web Service | Sleeps after 15 min | ~30s wake up |
| Static Site | Sleeps after 15 min | ~30s wake up |
| SQLite | Ephemeral | Data resets on sleep |

---

## Troubleshooting

### Backend Not Starting
- Check logs in Render dashboard
- Ensure `$PORT` is used in start command
- Verify all env vars are set

### CORS Errors
- Add exact frontend URL to `allow_origins`
- No trailing slashes

### Data Not Persisting
- This is expected on free tier!
- Service sleeps after 15 min inactivity
- Data will reset

---

## For Persistent Data

If you need data to persist, upgrade to:

1. **Render Paid Plan** ($7/month for Web Service)
2. **Use PostgreSQL** instead of SQLite
   - Create PostgreSQL instance in Render
   - Update `DATABASE_URL` environment variable
   - Data will persist indefinitely

---

## Cost Summary (Free Tier)

| Resource | Cost |
|----------|------|
| Web Service | Free |
| Static Site | Free |
| SQLite | Free (ephemeral) |

**Total: $0/month** (suitable for demos/learning)
