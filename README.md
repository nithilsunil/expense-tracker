# SpendWise - Modern Full-Stack Expense Tracker

SpendWise is a premium, resume-worthy, and beginner-friendly full-stack expense tracker web application. It features a responsive React dashboard, data visualizations, and robust account management.

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

---

## 💻 Local Setup & Installation

### 1. Database Setup
Before starting the backend, you need a running PostgreSQL database. You can use a local PostgreSQL installation or register for a free database on [Neon.tech](https://neon.tech).

Once you have your connection string, create a `.env` file in the `backend/` folder and paste it under the `DATABASE_URL` variable:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/spendwise?schema=public"
JWT_SECRET="spendwise_super_secret_local_dev_token_key"
```

### 2. Run Backend Server
Open a terminal in the root folder, navigate to `backend`, install packages, sync database schemas, and boot development server:
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```
The server will start listening on `http://localhost:5000`.

### 3. Run Frontend Server
Open a separate terminal window, navigate to `frontend`, install packages, and boot development server:
```bash
cd frontend
npm install
npm run dev
```
Vite will host the frontend on `http://localhost:3000`. Open this page in your browser.

---

## 🌐 How the Full-Stack Flow Connects

1. **Authentication (JWT)**: When you register or log in, your password is encrypted on the backend using `bcrypt`. The backend generates a signed **JSON Web Token (JWT)**, which the frontend saves in `localStorage`.
2. **API Requests (Axios Interceptors)**: Every request sent to the backend includes this token inside the HTTP headers (`Authorization: Bearer <token>`). The backend router validates the token using the `authMiddleware.js` before returning user-specific expenses.
3. **Database Queries (Prisma + PostgreSQL)**: The backend API does not write to files. It issues queries directly through the Prisma ORM Client which converts JS code into SQL queries execution in your PostgreSQL database.
4. **Data Visualizations**: The dashboard communicates with the backend statistics aggregator endpoint (`/expenses/stats`) to automatically divide spending patterns by category and plot daily trend charts using Recharts.

For complete hosting instructions on Neon, Render, and Vercel, read the [DEPLOYMENT.md](file:///C:/Users/nithi/.gemini/antigravity/scratch/expense-tracker/DEPLOYMENT.md) guide.
