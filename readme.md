# Finance Tracker System

A full-stack finance tracking application with FastAPI backend and React frontend.

## 🚀 Live Demo

- **Frontend**: [https://finance-system-u9sp.onrender.com/](https://finance-system-u9sp.onrender.com/)
- **Backend API**: [https://finance-api-v3df.onrender.com/docs](https://finance-api-v3df.onrender.com/docs)


## Project Structure

```
Finance System/
├── Backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/          # Routes and dependencies
│   │   ├── core/         # Config and security
│   │   ├── db/           # Database setup
│   │   ├── models/       # SQLAlchemy models
│   │   ├── repositories/ # Data access layer
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   ├── tests/            # pytest test suite
│   └── requirements.txt
├── Frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   └── services/     # API configuration
│   └── package.json
├── Docs/                 # Documentation
└── readme.md            # This file
```

## Architecture

### Backend: Layered Architecture
```
Routes → Services → Repositories → Models/Schemas
```

- **Routes** (`api/routes/`): HTTP handling, thin layer
- **Services** (`services/`): Business logic and validation
- **Repositories** (`repositories/`): Data access abstraction
- **Models** (`models/`): Database schema definitions
- **Schemas** (`schemas/`): Pydantic validation models

### Frontend: Component-Based
- React 19 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations

## Role System

Uses header-based authentication via `X-Role` header:

| Role | Create | Read | Update | Delete | Filter |
|------|--------|------|--------|--------|--------|
| admin | Yes | Yes | Yes | Yes | Yes |
| analyst | No | Yes | No | No | Yes |
| viewer | No | Yes | No | No | No |

## Features

- **CRUD Operations**: Full transaction management
- **Pagination**: Configurable page sizes (1-100)
- **Filtering**: By type, category, date range, search
- **Analytics**: Monthly comparisons, category breakdowns
- **Role-Based Access**: Admin/Analyst/Viewer permissions
- **Responsive UI**: Mobile-friendly dashboard

## Quick Start

### Backend
> [!IMPORTANT]
> This project requires **Python 3.12**. Later versions (e.g., Python 3.14) break compatibility with core dependencies like SQLAlchemy and Pydantic-Core.

```bash
cd Backend
# Note: Ensure you are using Python 3.12 specifically
python3.12 -m venv venv  # Or point explicitly to your 3.12 executable
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# API at http://localhost:8000/docs
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
# App at http://localhost:5173
```

## Tech Stack

### Backend
- FastAPI 0.110.0
- SQLAlchemy 2.0.28
- SQLite
- Pydantic v2
- pytest

### Frontend
- React 19.2.4
- Vite 8.0.1
- TypeScript 5.9.3
- Tailwind CSS 4.2.2
- Framer Motion 12.38.0
- Axios

## API Endpoints

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/transactions` | Create transaction |
| GET | `/api/v1/transactions` | List (paginated, filterable) |
| GET | `/api/v1/transactions/{id}` | Get single transaction |
| PUT | `/api/v1/transactions/{id}` | Update transaction |
| DELETE | `/api/v1/transactions/{id}` | Delete transaction |

### Summary
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/summary` | Financial summary |

## Known Limitations

- Header-based auth (not production-ready)
- SQLite database (not scalable)
- Float for currency (use Decimal in production)
- No database migrations (Alembic)
- No caching

## 📄 Project Documentation

Comprehensive documentation is available in the `Docs/` directory:

- [**Technical Decisions & Trade-offs**](Docs/TECHNICAL_DECISIONS.md): Architectural choices, rationale, and backend-focused summary.
- [**Assignment Evaluation Report**](Docs/ASSIGNMENT_EVALUATION.md): Direct mapping of project requirements to the implemented codebase.
- [**Full Version 1.0 Report**](Docs/VERSION_1_REPORT.md): Detailed technical breakdown of both Backend and Frontend.
- [**Testing Guide**](Docs/TESTING_GUIDE.md): Step-by-step instructions for running the test suite and manual verification.
- [**Render Deployment Guide**](Docs/RENDER_DEPLOYMENT.md): Detailed workflow for deploying the system to the Render cloud platform.

## Deployment

See [RENDER_DEPLOYMENT.md](Docs/RENDER_DEPLOYMENT.md) for step-by-step instructions to deploy both backend and frontend to Render.

## Future Improvements

- JWT authentication
- PostgreSQL database
- Decimal for currency
- Alembic migrations
- Rate limiting
- Export to CSV
- Real-time updates
