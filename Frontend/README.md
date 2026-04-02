# Finance Tracker Frontend

A React-based frontend for the Finance Tracking System, providing a premium dark-themed dashboard for managing personal finances.

## Features

- **Dashboard**: Overview with balance, income, expenses, recent transactions, and category breakdown
- **Transaction History**: Searchable, filterable, paginated list of all transactions
- **Analytics**: Monthly income vs expense bar charts with insights
- **Role-Based UI**: Dynamic interface based on user role (Admin/Analyst/Viewer)
- **Responsive Design**: Mobile-friendly with collapsible sidebar

## Tech Stack

- **Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.1
- **Language**: TypeScript 5.9.3
- **Routing**: React Router 7.13.2
- **Styling**: Tailwind CSS 4.2.2
- **Animations**: Framer Motion 12.38.0
- **HTTP Client**: Axios 1.14.0
- **Icons**: Lucide React 1.7.0

## Project Structure

```
src/
├── api/
│   └── api.ts              # Axios instance with interceptors
├── components/
│   ├── Layout.tsx          # Sidebar layout with navigation
│   └── TransactionModal.tsx # Create/edit transaction modal
├── context/
│   └── AuthContext.tsx     # Role state management
├── pages/
│   ├── Dashboard.tsx       # Overview dashboard
│   ├── TransactionHistory.tsx # Transaction list with filters
│   └── Analytics.tsx       # Charts and insights
├── App.tsx                 # Router configuration
└── main.tsx                # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running on `http://127.0.0.1:8000`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Role System

The frontend includes a role switcher for simulation:

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: create, edit, delete, filter |
| **Analyst** | Read access with filtering enabled |
| **Viewer** | Read-only access, no filters allowed |

## Environment Variables

Currently, the API base URL is hardcoded. For production, add:
```
VITE_API_URL=http://localhost:8000/api/v1
```

## Pages

### Dashboard (`/`)
- Total balance, income, and expense cards
- Recent transactions list
- Category breakdown with progress bars
- Add Transaction button (Admin only)

### Transaction History (`/history`)
- Searchable transaction table
- Filter by type and category
- Pagination controls
- Edit/Delete actions (Admin only)

### Analytics (`/analytics`)
- Monthly income vs expense bar chart
- Financial efficiency insights
- Spending patterns analysis

## Components

### Layout
- Fixed sidebar navigation
- Role switcher
- Mobile hamburger menu
- Active route highlighting

### TransactionModal
- Income/Expense toggle
- Amount, category, date inputs
- Notes textarea
- Client-side validation
- Create and edit modes

## API Integration

The `api.ts` service automatically:
- Adds `X-Role` header from localStorage
- Sets content type to JSON
- Handles request/response configuration

## Known Issues

1. Modal not connected to Dashboard button
2. No error toast notifications
3. All page buttons rendered in pagination (no ellipsis)
4. Hardcoded API URL

## Future Improvements

- [ ] Environment variable for API URL
- [ ] Error toast notification system
- [ ] Pagination optimization
- [ ] Integrate TransactionModal
- [ ] Skeleton loading states
- [ ] Form debouncing
- [ ] Optimistic UI updates
