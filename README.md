# Store Product Catalog

A complete, production-ready **Store Product Catalog Website** built with Node.js, Express, PostgreSQL, Prisma, Cloudinary, React, Vite, and Tailwind CSS.

The application features two completely distinct portals:
1. **Customer Portal (`/`)**: Public showcase for customers to browse products with debounced search, category filtering, sorting, and server-side pagination. (Strictly non-clickable cards, no cart/checkout/orders).
2. **Admin Portal (`/admin/*`)**: Protected by secure admin authentication with HTTP-only cookies and JWT, offering full inventory management, category organization (with safe deletion/reassignment), and Cloudinary image upload/cleanup.

---

## Features

### 🛍️ Customer Portal (`/`)
- **Instant Access**: Zero login or registration required.
- **Strict Catalog Display**: Products display strictly the image and name on non-clickable cards. No product detail pages, no cart/checkout/payment buttons.
- **Instant Search**: Debounced search across both product names and categories without unnecessary API thrashing.
- **Category Navigation**: Dynamic categories fetched directly from the database with product counters.
- **Sorting**: Newest first, Oldest first, Name A → Z, Name Z → A.
- **Server-Side Pagination**: Efficient indexed database queries designed for scaling to thousands of products.
- **Responsive & Modern Design**: Polished layout supporting mobile (2 columns), tablet (2–3 columns), and desktop (3–5 columns) views.

### 🛡️ Admin Portal (`/admin`)
- **Admin Authentication (`/admin/login`)**: Secure login with bcrypt password hashing, HTTP-only session cookies, and brute-force rate limiting.
- **Dashboard (`/admin/dashboard`)**: Instant inventory overview with total products, categories, and recently added items.
- **Product Management (`/admin/products`)**:
  - Add product with name, category selection, and Cloudinary image upload.
  - Edit product information and replace images.
  - Delete product with automatic Cloudinary storage cleanup.
- **Category Management (`/admin/categories`)**:
  - Create and rename categories.
  - **Safe Deletion Protection**: Prevents accidental deletion of categories that have products; offers an intuitive reassignment dialog to move products to a target category before deletion.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React, Sonner.
- **Backend**: Node.js, Express.js (ES Modules), Prisma ORM, PostgreSQL.
- **Image Storage**: Cloudinary (with web optimization transformations).
- **Security & Validation**: Zod, Helmet, CORS, Express-Rate-Limit, bcryptjs, jsonwebtoken, cookie-parser.

---

## Project Structure

```
store-catalog/
├── client/
│   ├── src/
│   │   ├── components/       # ProductCard, Header, Pagination, ProtectedRoute
│   │   ├── pages/            # CustomerCatalog, AdminLogin, AdminDashboard, AdminProducts, AdminCategories
│   │   ├── layouts/          # AdminLayout
│   │   ├── context/          # AuthContext
│   │   ├── hooks/            # useDebounce
│   │   ├── services/         # Axios instance and API service calls
│   │   ├── App.jsx           # Routing configuration
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Tailwind & custom CSS
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma database schema with indexes
│   │   └── seed.js           # Database seed script for initial Admin & items
│   ├── src/
│   │   ├── config/           # Database (Prisma) and Cloudinary configuration
│   │   ├── controllers/      # authController, productController, categoryController
│   │   ├── middleware/       # authMiddleware, uploadMiddleware, rateLimiter, errorHandler
│   │   ├── routes/           # authRoutes, productRoutes, categoryRoutes
│   │   ├── services/         # cloudinaryService
│   │   ├── utils/            # Zod validation schemas
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # HTTP server entry point
│   ├── .env.example          # Environment variable template
│   └── package.json
│
└── README.md
```

---

## Getting Started (Local Development)

### 1. Prerequisites
- **Node.js**: v18+ installed
- **PostgreSQL**: Local PostgreSQL instance or cloud PostgreSQL URI (e.g., Supabase, Neon, Railway)
- **Cloudinary Account**: Free tier cloud name, API key, and API secret

---

### 2. Backend Setup (`/server`)

1. Open terminal and navigate to `server`:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your PostgreSQL `DATABASE_URL` and Cloudinary credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:password@localhost:5432/store_catalog?schema=public"
   JWT_SECRET="your_long_random_jwt_secret_key"
   JWT_EXPIRES_IN=7d
   ADMIN_EMAIL="admin@storecatalog.com"
   ADMIN_PASSWORD="AdminSecurePassword123!"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   CLIENT_URL="http://localhost:5173"
   ```

3. Initialize Prisma & Run Migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed the Database (Creates initial Admin account, categories, and sample products):
   ```bash
   npm run seed
   ```

5. Start the Server in development mode:
   ```bash
   npm run dev
   ```
   Server will start on `http://localhost:5000`.

---

### 3. Frontend Setup (`/client`)

1. Open a new terminal and navigate to `client`:
   ```bash
   cd client
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The client will be running at `http://localhost:5173`.

---

## Creating the First Admin Account Securely

There are two secure ways to create admin accounts:

### Method 1: Using the Automated Seed Script (Recommended)
Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env` and execute:
```bash
cd server
npm run seed
```
This securely hashes the password with **bcrypt (salt rounds = 12)** and stores the admin record in PostgreSQL.

### Method 2: Default Credentials
The initial seed creates:
- **Email**: `admin@storecatalog.com`
- **Password**: `AdminSecurePassword123!`

---

## API Endpoints Reference

### Public Customer Endpoints
- `GET /api/products` — Paginated product catalog (`?page=1&limit=24&search=apple&categoryId=xyz&sort=newest`)
- `GET /api/products/:id` — Single product details
- `GET /api/categories` — List all categories with product counts

### Admin Authentication Endpoints
- `POST /api/auth/login` — Authenticate admin & receive HTTP-only cookie and JWT
- `POST /api/auth/logout` — Clear session
- `GET /api/auth/me` — Verify authenticated admin session

### Admin Management Endpoints (Protected)
- `GET /api/products/stats` — Dashboard overview metrics
- `POST /api/products` — Create product with multipart image upload
- `PUT /api/products/:id` — Update product details and replace image
- `DELETE /api/products/:id` — Delete product and clean up Cloudinary image
- `POST /api/categories` — Create category
- `PUT /api/categories/:id` — Rename category
- `DELETE /api/categories/:id?reassignToCategoryId=xyz` — Safe delete category with product reassignment

---

## Production Deployment Guide

### 1. Database (PostgreSQL)
- Create a free PostgreSQL instance on [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app).
- Copy the connection URI into `DATABASE_URL`.

### 2. Backend Deployment (Render / Railway / Fly.io)
- Connect your GitHub repository.
- Root directory: `server`.
- Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
- Start command: `npm start`
- Add Environment variables (`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`, `CLIENT_URL`, `NODE_ENV=production`).

### 3. Frontend Deployment (Vercel / Netlify)
- Root directory: `client`.
- Framework preset: `Vite`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Set Environment Variable: `VITE_API_URL=https://your-backend-service.onrender.com`.
