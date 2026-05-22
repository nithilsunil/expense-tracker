# SpendWise Deployment & Architectural Guide

This guide details the end-to-end steps to launch your full-stack SpendWise Expense Tracker application in a production environment, followed by a breakdown of how the frontend, backend, database, and JWT authentication flows connect.

---

## 🛠️ Step 1: Database Setup (PostgreSQL on Neon)

We recommend using [Neon](https://neon.tech) for a free, serverless PostgreSQL instance.

1. **Create Neon Account**: Sign up at [Neon.tech](https://neon.tech).
2. **Create Project**: Click **Create a Project**, choose a project name (e.g. `spendwise-db`), select PostgreSQL version 16 (or latest), and pick the region closest to your users.
3. **Save Connection String**: Copy the generated database connection string (`postgres://...`).
4. **Prepare Prisma URL**: Append `?sslmode=require` to your URL string if it's not already present. For example:
   ```text
   DATABASE_URL="postgresql://neondb_owner:password@ep-cool-water-a5.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

---

## 🚀 Step 2: Backend Hosting (Node.js + Express on Render)

We recommend deploying the Node.js API server to [Render](https://render.com).

1. **Sign Up**: Sign up at [Render.com](https://render.com) and link your GitHub repository.
2. **Create Web Service**:
   - Select **New +** > **Web Service**.
   - Choose your repository.
3. **Configure Settings**:
   - **Name**: `spendwise-api`
   - **Root Directory**: `backend` (if in a subdirectory, otherwise leave blank or set accordingly depending on your repo structure).
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Instance Type**: Select **Free**.
4. **Configure Environment Variables**:
   Click the **Advanced** button and add these keys:
   - `DATABASE_URL`: Your full PostgreSQL Neon connection string.
   - `JWT_SECRET`: A long, randomly generated secret string (e.g., `5d8d8bf24c56fd62d...`).
   - `PORT`: `5000` (Render will override this dynamically, but it's good to specify a fallback).
   - `NODE_ENV`: `production`
5. **Deploy**: Click **Create Web Service**. Wait for the build logs to show successful startup, and copy the assigned web service URL (e.g., `https://spendwise-api.onrender.com`).

---

## 🌐 Step 3: Frontend Hosting (React + Vite on Vercel)

We recommend deploying the frontend to [Vercel](https://vercel.com).

1. **Sign Up**: Sign up at [Vercel.com](https://vercel.com) and link your GitHub repository.
2. **Import Project**:
   - Click **Add New** > **Project**.
   - Select your repository.
3. **Configure Settings**:
   - **Project Name**: `spendwise-tracker`
   - **Framework Preset**: `Vite` (Vercel auto-detects this).
   - **Root Directory**: Select `frontend` (crucial to point Vercel directly to the React source folder).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Configure Environment Variables**:
   Under the **Environment Variables** section, add:
   - Key: `VITE_API_URL`
   - Value: `https://spendwise-api.onrender.com/api` (ensure it points to your Render backend domain with the `/api` suffix).
5. **Deploy**: Click **Deploy**. Vercel will build and host your app on a free `.vercel.app` subdomain!

---

## 🔄 Architectural Data Flows

### 1. How Frontend connects to Backend
- **Axios Instance**: Located in [api.js](file:///C:/Users/nithi/.gemini/antigravity/scratch/expense-tracker/frontend/src/services/api.js), it sets `baseURL` to the production `VITE_API_URL`.
- **Request Interceptor**: The Axios client automatically searches `localStorage` for a string named `token`. If present, it injects it as an HTTP header:
  `Authorization: Bearer <JWT_TOKEN>`
- **Response Interceptor**: If the backend replies with a `401 Unauthorized` status (indicating token expiry or tampering), the client wipes the session details from local storage and routes the user back to the login page automatically.

### 2. How JWT Authentication works
```mermaid
sequenceDiagram
    participant User as Browser / React
    participant Server as Express Server
    participant DB as PostgreSQL DB

    User->>Server: POST /api/auth/signup (name, email, password)
    Note over Server: Validates & hashes password via bcrypt
    Server->>DB: INSERT INTO users ...
    DB-->>Server: User created with ID
    Note over Server: Signs JWT using JWT_SECRET
    Server-->>User: status 251 + Token + User Info

    Note over User: Saves Token & User to localStorage

    User->>Server: GET /api/expenses (with Bearer Token)
    Note over Server: Middleware verifies signature & fetches req.user
    Server->>DB: Query User's Expenses
    DB-->>Server: Array of items
    Server-->>User: status 200 + Expenses Array
```

### 3. How Database Integration works
- **Prisma Client**: Initialized in [prisma.js](file:///C:/Users/nithi/.gemini/antigravity/scratch/expense-tracker/backend/src/utils/prisma.js) as a singleton instance.
- **Relational Tables**:
  - `User` maps to a PostgreSQL table named `users`.
  - `Expense` maps to a table named `expenses`.
  - There is a `Cascade` rule: if a User account is deleted, all matching Expenses are automatically purged by the database.
- **Example Prisma Query**:
  ```javascript
  // Grouping spending by category for the authenticated user
  const categoryGroup = await prisma.expense.groupBy({
    by: ['category'],
    where: { userId: req.user.id },
    _sum: { amount: true }
  });
  ```
