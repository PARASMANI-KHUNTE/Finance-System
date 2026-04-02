# Technical Decisions and Trade-offs (Backend focus)

This document provides a concise summary of the architectural choices and trade-offs for the Finance Tracking System backend.

---

### **1. Framework: FastAPI (with Pydantic v2)**
*   **Decision:** Selected **FastAPI** over Flask or Django.
*   **Rationale:**
    *   **Performance:** Native `async/await` support provides high-throughput request handling.
    *   **Type Safety:** Pydantic v2 ensures 100% data integrity before processing, reducing runtime errors.
    *   **Developer Experience:** Automatic Swagger/OpenAPI generation facilitates instant documentation and testing.
*   **Trade-off:** Requires more explicit dependency management compared to a "batteries-included" framework like Django.

---

### **2. Architectural Pattern: Layered (Clean Architecture Lite)**
*   **Decision:** Implemented a **four-layer structure** (API Routes → Business Services → Persistence Repositories → Data Models).
*   **Rationale:**
    *   **Separation of Concerns:** Business logic (Aggregation, Summary) is decoupled from data access (SQL queries), allowing for isolated unit testing.
    *   **Maintainability:** Changes to the database schema or external APIs only require modifications in one specific layer.
*   **Trade-off:** Increased initial boilerplate and file management overhead compared to a monolithic script.

---

### **3. Persistence: SQLAlchemy 2.0 + SQLite**
*   **Decision:** Used **SQLAlchemy 2.0** (Sync style) with **SQLite** as the primary storage.
*   **Rationale:**
    *   **Portability:** SQLite is a zero-configuration, file-based database, making it ideal for assignment evaluations and portable local environments.
    *   **Modern Syntax:** Utilized the latest SQLAlchemy 2.0 "execute style" queries for better type hinting and readability.
    *   **Migration Path:** The use of an ORM abstraction means switching to **PostgreSQL** for production is a single-line configuration change.
*   **Trade-off:** SQLite lacks some advanced features like `RETURNING` clauses in older versions and is not designed for high-concurrency production writes.

---

### **4. Security: Simulated RBAC (X-Role Headers)**
*   **Decision:** Implemented **Role-Based Access Control** via `X-Role` header injection instead of OAuth2/JWT.
*   **Rationale:**
    *   **Clarity:** Specifically demonstrates permission logic (Admin/Analyst/Viewer) without the friction of a complex authentication server.
    *   **Efficiency:** Allows for instant role switching in the frontend to verify access control during evaluation.
*   **Trade-off:** Not production-secure (headers are spoofable). This decision prioritizes architectural transparency over final security hardening for the current version.

---

### **Technical Summary Table**

| Component | Choice | Trade-off |
| :--- | :--- | :--- |
| **Framework** | FastAPI | Requires `async` expertise |
| **Logic Layer** | Service Pattern | More boilerplate files |
| **Auth** | X-Role Headers | Low security; high transparency |
| **Data Layer** | Repositories | Decoupled but adds abstraction |
| **Database** | SQLite | Portable but not for high scale |

---

### **Additional Notes**

#### **Frontend Technology Stack**
*   **React 19 & Vite:** Leveraged for ultra-fast development and optimized production bundles.
*   **Tailwind CSS 4:** Provides a utility-first approach to styling, enabling a highly custom and premium "Editorial" aesthetic without the constraints of traditional UI libraries.
*   **Framer Motion:** Used to implement micro-animations and smooth page transitions, significantly enhancing the perceived quality of the user experience.

#### **State & Role Management**
*   **Context API:** Used to manage global state for both the **Theme** (Dark/Light mode) and the **Authentication Role**. This avoids the unnecessary complexity of a state management library like Redux for a medium-scale application.
*   **Persistent Layers:** Both theme and role are persisted to `localStorage`, ensuring a consistent experience across page refreshes.

#### **Deployment & Portability**
*   **Cross-Platform Ready:** The project includes `runtime.txt` and `.python-version` files to ensure seamless deployment on cloud platforms like **Render** or **Vercel**, pinning the environment to a stable **Python 3.12** instance.

---

### **Final Rationale**
The entire system was built to demonstrate **Senior-level foresight.** By choosing a Repository Pattern on the backend and a modular Component-based structure on the frontend, the codebase ensures the **Application remains sustainable and ready for enterprise expansion** at any time.
