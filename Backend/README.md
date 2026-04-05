# Finance Tracking Application Backend

A clean, scalable, and maintainable Python backend system for a Finance Tracking Application. This project is built as an engineering design exercise, focusing heavily on robust architecture, clear business logic separation, and real-world API design.

## Overview

This application acts as the backend service for a finance tracker. It provides functionalities to manage transactions (income and expenses), aggregate these transactions into actionable summaries and monthly total breakdowns, and allows for precise querying through pagination and filtering.

## Tech Stack

- **Framework:** FastAPI
- **ORM:** SQLAlchemy (2.0 style, synchronous)
- **Database:** SQLite
- **Validation:** Pydantic v2
- **Server:** Uvicorn
- **Testing:** pytest
- **Config:** pydantic-settings
- **CORS:** Enabled for frontend integration

## Database

Uses SQLite for simplicity. The database file (`finance.db`) is created automatically on first run.

For production deployment with persistent data, consider using PostgreSQL.

## Architecture

This project strictly follows a **Layered Architecture** pattern to ensure excellent separation of concerns, testability, and future-proofing:

- **Routes (`api/routes`):** Extremely thin. Responsibilities are limited to parsing requests, invoking services, and formatting HTTP responses.
- **Services (`services`):** The heart of the application. All business rules (e.g., ensuring `income` adds to a balance and `expense` subtracts, or calculating aggregations) live here. The services also run initial input checks before persistence to map invalid scenarios cleanly to 4xx HTTP responses.
- **Repositories (`repositories`):** A persistence layer that cleanly abstracts away the underlying SQLAlchemy queries. Services communicate with repositories, absolutely ignorant of database engine specifics.
- **Models (`models`):** SQLAlchemy classes defining the raw structure of `transactions` in the database.
- **Schemas (`schemas`):** Pydantic v2 models that guarantee strict type checking and validation of user input and outgoing API responses.

## Role System Explanation

To focus purely on backend design rather than implementing a complete auth state mechanism, this application uses a **Header-Based Lightweight Role System**.

Clients must send an `X-Role` request header.

* **Admin** (`X-Role: admin`): Full CRUD access to all endpoints.
* **Analyst** (`X-Role: analyst`): Read-only access to `/transactions` with the ability to apply filters, plus full access to `/summary`.
* **Viewer** (`X-Role: viewer`): Restricted read-only access. The Viewer can only use `GET /transactions` and `GET /summary` **without any filters applied whatsoever** (though standardized pagination is preserved). Using filters will yield a `403 Forbidden` response.

## Assumptions

Throughout the development cycle, the following architectural decisions and assumptions were made:
1. **Sync vs Async Database:** While FastAPI inherently shines in async execution, standard SQLite operations are synchronous and blazingly fast locally. A completely synchronous SQLAlchemy session was implemented to reduce architectural complexity around SQLite's driver constraints, while keeping the repository pattern clean enough to be swapped to `asyncpg` seamlessly later.
2. **Simplified Authentication:** An API Gateway or robust Auth Provider (like Auth0 or AWS Cognito) typically handles authentication. Assuming this system exists securely outside this boundary, relying on `X-Role` lets us deeply demonstrate role-checking patterns natively in FastAPI dependencies without bogging down the codebase with local JWT signing code.
3. **Multi-Tenancy Preparation:** The transaction records feature a simple integer `user_id`. While explicit multi-user user-management isn't the focal point of the CRUD APIs right now, retaining the `user_id` parameter ensures the API scales horizontally properly in a future iteration.

## API Endpoints

### Transactions
* `POST /transactions` — Create a new transaction.
* `GET /transactions` — Retrieve all transactions (supports pagination, filtering by type/category/date, and search keywords).
* `GET /transactions/{id}` — Retrieve a transaction by its ID.
* `PUT /transactions/{id}` — Update a transaction by ID.
* `DELETE /transactions/{id}` — Permanently delete a transaction by ID.

### Summary
* `GET /summary` — Retrieve overall account balance, total income/expense aggregates, categorized spending bounds, and **monthly totals**.

## How to Run

1. Clone the project and navigate into the `Backend` directory.
2. Ensure you have **Python 3.12** installed. *(Note: Python 3.14 breaks compatibility with core dependencies like SQLAlchemy and Pydantic-Core).*
3. Create a virtual environment and install requirements:
   ```shell
   # Point explicitly to your Python 3.12 executable if necessary
   python3.12 -m venv venv
   source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```
4. Start the Uvicorn server:
   ```shell
   uvicorn app.main:app --reload
   ```
5. Navigate to `http://127.0.0.1:8000/docs` to test out the Swagger endpoints interactively!

## How to Test

Extensive testing has been implemented using `pytest`. The testing suite checks validations, transaction aggregations, edge cases, and role restrictions heavily.

Run tests using:
```shell
pytest tests/ -v
```

## Future Improvements
* Database Migrations configuration using `Alembic`
* Hardened user management using JWT Authentication (`python-jose`)
* Export routes returning buffered `.csv` downloads utilizing Pandas.
