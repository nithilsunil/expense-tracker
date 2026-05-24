# SpendWise - Modern Full-Stack Expense Tracker

SpendWise is a premium and beginner-friendly full-stack expense tracker web application. It features a responsive React dashboard, data visualizations, and robust account management.

## 🚀 Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS + Recharts + Lucide React + Axios
- **Backend**: Node.js + Express (ES Modules)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Token (JWT) & Bcrypt password hashing
- **Deployment**: Vercel (Frontend), Render (Backend), Neon (PostgreSQL Database)

---

## 📂 Project Structure

```text
expense-tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database relationships and tables setup
│   ├── src/
│   │   ├── controllers/         # Authentication and CRUD query business logic
│   │   │   ├── authController.js
│   │   │   └── expenseController.js
│   │   ├── middleware/          # JWT authorization middlewares
│   │   │   └── authMiddleware.js
│   │   ├── routes/              # Express API endpoints routing
│   │   │   ├── authRoutes.js
│   │   │   └── expenseRoutes.js
│   │   ├── utils/               # Custom error handlers and client initializers
│   │   │   ├── errorHandler.js
│   │   │   └── prisma.js
│   │   ├── app.js               # Core Express app configs and CORS
│   │   └── server.js            # Node listener port launcher
│   ├── .env.example             # Database & JWT key templates
│   ├── .env                     # Local environment settings
│   └── package.json             # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components (Sidebars, charts, list tables)
│   │   │   ├── ChartSection.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/             # Global states (Theme dark-mode, Auth API sessions)
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/               # Layout pages (Dashboard, login sheets)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/            # Axios interceptors configuration
│   │   │   └── api.js
│   │   ├── App.jsx              # Main routing wrapper
│   │   ├── index.css            # Base Tailwind settings
│   │   └── main.jsx             # React renderer entry
│   ├── .env.example
│   ├── .env
│   ├── tailwind.config.js       # Styling configuration
│   ├── package.json
│   └── index.html
│
├── README.md                    # Setup and structure guides
└── DEPLOYMENT.md                # Production hosting steps (Render/Vercel/Neon)
```
