# SmartBuy

**SmartBuy** is a production-ready, full-stack store catalog platform built for retail environments. It combines a high-performance customer-facing storefront with a secure, feature-complete admin management portal.

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Security Architecture](#security-architecture)
- [Environment Configuration](#environment-configuration)
- [Local Development Setup](#local-development-setup)
- [Deployment](#deployment)

---

## System Overview

**Problem Solved**: Store owners managing inventory through spreadsheets or disconnected tools lack a unified platform to display a live product catalog to customers while retaining full control over inventory, categories, and media assets.

**Core Mission**: Provide a clean, fast, bilingual storefront for customers and a secure, mobile-responsive management portal for administrators — without subscriptions, third-party commerce platforms, or per-transaction fees.

**Target Users**: Independent retailers, boutique stores, and small businesses that require a self-hosted catalog with Cloudinary-managed product imagery.

**Portal Architecture**:
- `client/` — React SPA (Vite) serving two distinct experiences under one codebase
- `server/` — Express REST API (Node.js + Prisma ORM + PostgreSQL)

---

## Architecture

```
+--------------------------------------------------------------------+
|  CLIENT LAYER                                                      |
|                                                                    |
|  +----------------------------+  +-----------------------------+   |
|  |  Customer Catalog (/)      |  |  Admin Portal (/admin/*)   |   |
|  |  React 18 + Vite           |  |  React 18 + Vite           |   |
|  |  Public — No Auth          |  |  Protected — JWT Cookie    |   |
|  |  Bilingual (EN / PT)       |  |  Full CRUD + Cloudinary    |   |
|  +----------------------------+  +-----------------------------+   |
+----------------------------------+---------------------------------+
                                   |
                       HTTPS REST (Cookie / Bearer JWT)
                                   |
+----------------------------------v---------------------------------+
|  API LAYER  (Express 4, Node.js ES Modules)                       |
|                                                                    |
|  +----------+  +----------+  +----------+                         |
|  | /api/auth|  |/api/prod.|  |/api/cat. |                         |
|  +----------+  +----------+  +----------+                         |
|                                                                    |
|  Middleware Chain:                                                 |
|  [helmet] -> [cors] -> [cookieParser] -> [generalApiLimiter]      |
|  -> [authLimiter (auth routes)] -> [protectAdmin (admin routes)]  |
+----------------------------------+---------------------------------+
                                   |
+----------------------------------v---------------------------------+
|  INTEGRATION LAYER                                                 |
|                                                                    |
|  +------------------+  +------------------+                       |
|  | Cloudinary SDK   |  | Multer Upload    |                       |
|  | Image upload,    |  | Middleware       |                       |
|  | optimization,    |  | (in-memory buf) |                       |
|  | deletion         |  +------------------+                       |
|  +------------------+                                             |
+----------------------------------+---------------------------------+
                                   |
+----------------------------------v---------------------------------+
|  DATABASE LAYER                                                    |
|  PostgreSQL + Prisma ORM (hosted on Neon / Supabase / Railway)   |
|                                                                    |
|  [admins] -> [categories] -> [products]                           |
+--------------------------------------------------------------------+
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^18.3.1 | Core UI framework |
| Vite | ^5.4.11 | Build tool and dev server |
| React Router DOM | ^6.28.0 | Client-side routing |
| Tailwind CSS | ^3.4.15 | Utility-first styling |
| Axios | ^1.7.7 | HTTP client for API requests |
| Lucide React | ^0.460.0 | Icon library |
| Sonner | ^1.7.0 | Toast notification system |
| tailwind-merge | ^2.5.4 | Conditional class merging |
| clsx | ^2.1.1 | Conditional className utility |
| Google Fonts | — | Outfit, Urbanist, Inter typography |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18.x+ | Runtime (ES Modules) |
| Express | ^4.21.1 | HTTP framework |
| Prisma ORM | ^5.22.0 | Type-safe ORM and migrations |
| @prisma/client | ^5.22.0 | Generated Prisma query client |
| Cloudinary SDK | ^2.5.1 | Image upload, transformation, deletion |
| Multer | ^1.4.5-lts.1 | Multipart form-data / image upload middleware |
| jsonwebtoken | ^9.0.2 | JWT issuance and verification |
| bcryptjs | ^2.4.3 | Password hashing (bcrypt, 10 rounds) |
| cookie-parser | ^1.4.7 | HTTP-only cookie parsing |
| helmet | ^8.0.0 | Security HTTP headers |
| cors | ^2.8.5 | Cross-Origin Resource Sharing |
| express-rate-limit | ^7.4.1 | IP-based rate limiting |
| zod | ^3.23.8 | Input validation schemas |
| dotenv | ^16.4.5 | Environment variable loading |
| nodemon | ^3.1.7 | Dev server hot-reload |

---

## Project Structure

```
SmartBuy/
├── client/
│   ├── public/
│   │   └── logo.png                  # SmartBuy brand logo (also used as favicon)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx            # Sticky navbar, category ribbon, search, language toggle
│   │   │   ├── ProductCard.jsx       # Product image card with skeleton and error fallback
│   │   │   ├── Pagination.jsx        # Server-side pagination controls
│   │   │   ├── LoadingScreen.jsx     # Full-page loading state on initial catalog fetch
│   │   │   ├── Footer.jsx            # Store footer with NIPC and branding
│   │   │   ├── CustomSelect.jsx      # Accessible dropdown component
│   │   │   └── LanguageSelector.jsx  # EN / PT language toggle button
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Admin authentication state and persistence
│   │   │   └── LanguageContext.jsx   # Global language state (en / pt)
│   │   ├── hooks/
│   │   │   └── useDebounce.js        # Generic debounce hook for search input
│   │   ├── layouts/
│   │   │   └── AdminLayout.jsx       # Admin shell: sticky sidebar, mobile drawer, sign-out modal
│   │   ├── pages/
│   │   │   ├── CustomerCatalog.jsx   # Public storefront with search, filter, sort, pagination
│   │   │   ├── AdminLogin.jsx        # Admin login page with brute-force protected form
│   │   │   ├── AdminDashboard.jsx    # Inventory overview and quick-stats panel
│   │   │   ├── AdminProducts.jsx     # Full product CRUD table with mobile layout
│   │   │   └── AdminCategories.jsx   # Category management with sequence reordering
│   │   ├── services/
│   │   │   ├── authService.js        # Admin login, logout, and session check API calls
│   │   │   ├── catalogService.js     # Public products and categories API calls
│   │   │   └── adminService.js       # Admin product and category CRUD API calls
│   │   ├── utils/
│   │   │   └── translations.js       # Bilingual string dictionaries (en / pt)
│   │   ├── App.jsx                   # Router configuration and route guards
│   │   ├── main.jsx                  # React DOM root and provider tree
│   │   └── index.css                 # Tailwind directives and glassmorphic CSS utilities
│   ├── index.html                    # HTML entry point with Google Fonts preload
│   ├── tailwind.config.js            # Custom color palette, font families, animations
│   ├── vite.config.js                # Vite build and dev server configuration
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma             # Database models: Admin, Category, Product
│   │   ├── seed.js                   # Seeds admin account, categories, and sample products
│   │   └── seed_bulk.js              # Bulk product seeder for large dataset testing
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # Singleton Prisma client instance
│   │   │   └── cloudinary.js         # Cloudinary SDK initialization
│   │   ├── controllers/
│   │   │   ├── authController.js     # Admin login and logout handlers
│   │   │   ├── productController.js  # Product CRUD, stats, Cloudinary integration
│   │   │   └── categoryController.js # Category CRUD with safe deletion logic
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT protectAdmin middleware (cookie + Bearer)
│   │   │   ├── uploadMiddleware.js   # Multer memory-storage configuration
│   │   │   ├── rateLimiter.js        # generalApiLimiter and authLimiter definitions
│   │   │   └── errorHandler.js       # Centralized error response handler
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # POST /login, POST /logout, GET /me
│   │   │   ├── productRoutes.js      # Public GET, admin POST/PUT/DELETE + /stats
│   │   │   └── categoryRoutes.js     # Public GET, admin POST/PUT/DELETE
│   │   ├── services/
│   │   │   └── cloudinaryService.js  # uploadToCloudinary and deleteFromCloudinary helpers
│   │   ├── utils/
│   │   │   └── validators.js         # Zod schemas for product and category inputs
│   │   ├── app.js                    # Express app: middleware chain, route mounting, error handling
│   │   └── server.js                 # HTTP server bootstrap and port binding
│   ├── .env.example                  # Environment variable template
│   └── package.json
│
└── README.md
```

---

## Database Schema

The database is PostgreSQL managed via Prisma ORM. There are 3 models and no enums.

### Admin

Stores administrator credentials. Only one admin account is expected per deployment; additional admins can be created via the seed script.

| Field | Type | Notes |
|---|---|---|
| id | String UUID | Primary key, auto-generated |
| email | String unique | Login identifier |
| passwordHash | String | bcrypt hash (10 salt rounds) |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Category

Organizes products into named groups. Categories can be reordered by admins. Safe deletion prevents loss of product data.

| Field | Type | Notes |
|---|---|---|
| id | String UUID | Primary key, auto-generated |
| name | String unique | Display name; indexed for uniqueness |
| order | Int | Display sequence, default 0; indexed |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| products | Product[] | Relation — one category to many products |

### Product

Core inventory entity. Each product belongs to exactly one category. Cloudinary public ID is stored for asset cleanup on deletion.

| Field | Type | Notes |
|---|---|---|
| id | String UUID | Primary key, auto-generated |
| name | String | Product display name; indexed |
| imageUrl | String | Cloudinary delivery URL |
| imagePublicId | String? | Cloudinary public ID for deletion; nullable for seeded items |
| categoryId | String | Foreign key to Category; indexed |
| createdAt | DateTime | Record creation timestamp; indexed (used for sort) |
| updatedAt | DateTime | Last update timestamp |

### Entity Relationships

```
Admin (independent — no relations to other models)

Category 1 ----< Product (one-to-many, onDelete: Restrict)
```

The `Restrict` delete rule on `Product.categoryId` means a category cannot be deleted while it still has products assigned. The admin portal enforces this with a reassignment dialog before any category deletion.

---

## API Reference

All routes are served from the backend base URL (default: `http://localhost:5000`).

Authenticated routes require a valid HTTP-only `admin_token` cookie **or** an `Authorization: Bearer <token>` header.

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | No | API status, version, and available endpoint paths |
| GET | `/health` | No | Health check with status, timestamp, and process uptime |

### Authentication — `/api/auth`

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` | No | Validate credentials, issue HTTP-only JWT cookie (7d expiry) |
| POST | `/api/auth/logout` | — | No | Clear the `admin_token` cookie |
| GET | `/api/auth/me` | — | Yes | Verify the active admin session and return admin profile |

### Products — `/api/products`

| Method | Endpoint | Query / Body | Auth | Description |
|---|---|---|---|---|
| GET | `/api/products` | `?page`, `?limit`, `?search`, `?categoryId`, `?sort` | No | Paginated product catalog with server-side filtering and sorting |
| GET | `/api/products/:id` | — | No | Single product detail by UUID |
| GET | `/api/products/stats` | — | Yes | Dashboard metrics: total products, total categories, recent additions |
| POST | `/api/products` | `multipart/form-data: name, categoryId, image` | Yes | Create product with Cloudinary image upload |
| PUT | `/api/products/:id` | `multipart/form-data: name?, categoryId?, image?` | Yes | Update product fields; replace image and clean up old Cloudinary asset |
| DELETE | `/api/products/:id` | — | Yes | Delete product and remove image from Cloudinary |

#### Supported Query Parameters for `GET /api/products`

| Parameter | Type | Default | Description |
|---|---|---|---|
| page | Integer | 1 | Page number (1-indexed) |
| limit | Integer | 25 | Items per page |
| search | String | — | Case-insensitive name search |
| categoryId | UUID or `all` | `all` | Filter by category UUID; omit or pass `all` for no filter |
| sort | Enum | `newest` | `newest`, `oldest`, `name_asc`, `name_desc` |

### Categories — `/api/categories`

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| GET | `/api/categories` | — | No | All categories with live product counts, ordered by `order` field |
| POST | `/api/categories` | `{ name }` | Yes | Create a new category |
| PUT | `/api/categories/:id` | `{ name?, order? }` | Yes | Rename category or update display sequence |
| DELETE | `/api/categories/:id` | `?reassignToCategoryId=<uuid>` | Yes | Delete category; requires reassignment if products exist |

---

## Authentication Flow

SmartBuy uses a simple, single-admin session model secured with HTTP-only JWT cookies.

```
POST /api/auth/login
  -> Zod validate { email, password }
  -> prisma.admin.findUnique({ where: { email } })
  -> bcrypt.compare(password, admin.passwordHash)
  -> jwt.sign({ id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  -> res.cookie('admin_token', token, {
       httpOnly: true,
       secure: NODE_ENV === 'production',
       sameSite: 'strict',
       maxAge: 7 days
     })
  -> Return: { success, admin: { id, email, createdAt } }

protectAdmin middleware (all admin routes)
  -> Check req.cookies.admin_token
  -> Fallback: Authorization: Bearer <token> header
  -> jwt.verify(token, JWT_SECRET)
  -> prisma.admin.findUnique({ where: { id: decoded.id } })
  -> Attach req.admin -> next()
  -> On failure: 401 Unauthorized

POST /api/auth/logout
  -> res.clearCookie('admin_token')
  -> Return: { success: true, message: 'Logged out' }
```

---

## Security Architecture

| Layer | Mechanism | Configuration |
|---|---|---|
| General Rate Limit | express-rate-limit | 200 requests / 1 min per IP on all `/api/*` routes |
| Auth Rate Limit | express-rate-limit | 10 attempts / 15 min per IP on `/api/auth/*` routes |
| Security Headers | Helmet | Sets CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and more |
| CORS | Strict origin allowlist | `CLIENT_URL` env var + `localhost:5173` allowed; all other origins blocked in production |
| JWT Authentication | jsonwebtoken | 7-day signed tokens; `{ id, email }` payload |
| Cookie Security | HTTP-only, Secure, SameSite=Strict | Prevents XSS token theft; CSRF-resistant |
| Password Hashing | bcryptjs | bcrypt with 10 salt rounds |
| Input Validation | Zod schemas | All admin request bodies validated before reaching controllers |
| Image Upload Guard | Multer + Cloudinary | Files processed in memory buffer; only images accepted |
| Proxy Trust | `app.set('trust proxy', 1)` | Correct `req.ip` resolution behind Render / Cloudflare reverse proxies |
| Soft Deletes | None — Restrict constraint | Prisma `onDelete: Restrict` prevents orphaned products on category deletion |

---

## Environment Configuration

### Backend — `server/.env`

| Variable | Required | Description | Example |
|---|---|---|---|
| PORT | Optional | HTTP server port (default: 5000) | `5000` |
| NODE_ENV | Optional | Runtime environment | `production` |
| DATABASE_URL | Required | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=verify-full` |
| JWT_SECRET | Required | Secret for JWT signing (32+ chars recommended) | any long random string |
| JWT_EXPIRES_IN | Optional | JWT token lifetime (default: 7d) | `7d` |
| ADMIN_EMAIL | Required | Email for initial admin account created by seed script | `admin@smartbuy.com` |
| ADMIN_PASSWORD | Required | Password for initial admin account | `AdminSecurePassword123!` |
| CLOUDINARY_CLOUD_NAME | Required | Cloudinary cloud name | `your_cloud_name` |
| CLOUDINARY_API_KEY | Required | Cloudinary API key | `123456789` |
| CLOUDINARY_API_SECRET | Required | Cloudinary API secret | `abc123xyz` |
| CLIENT_URL | Required | Frontend origin for CORS allowlist | `https://your-frontend.vercel.app` |

### Frontend — `client/.env` (if applicable)

| Variable | Required | Description | Example |
|---|---|---|---|
| VITE_API_URL | Required (prod) | Backend base URL — no trailing slash | `https://your-backend.onrender.com` |

---

## Local Development Setup

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A PostgreSQL database (local install or a free [Neon](https://neon.tech) serverless instance)
- A [Cloudinary](https://cloudinary.com) account (free tier is sufficient)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/TanishMehta23/SmartBuy.git
cd SmartBuy
```

---

### Step 2 — Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your database connection string, JWT secret, admin credentials, and Cloudinary keys.

Run database migrations to create all tables:

```bash
npx prisma migrate dev --name init
```

Seed the database with the initial admin account, categories, and sample products:

```bash
npm run seed
```

Optionally inspect the database with Prisma Studio:

```bash
npx prisma studio
```

Start the backend development server with hot-reload:

```bash
npm run dev
# Server starts at http://localhost:5000
```

Verify the backend is running:

```bash
curl http://localhost:5000/health
# -> { "status": "ok", "timestamp": "...", "uptime": ... }
```

---

### Step 3 — Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
# Client starts at http://localhost:5173
```

The Vite dev server proxies API calls to `http://localhost:5000` automatically. No additional `.env` configuration is required for local development.

---

### Step 4 — Admin Access

Navigate to `http://localhost:5173/admin/login` and sign in with the credentials set in `server/.env` (or the defaults from the seed script):

| Field | Default Value |
|---|---|
| Email | `admin@storecatalog.com` |
| Password | `AdminSecurePassword123!` |

---

## Deployment

### Database

Provision a free PostgreSQL instance on [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app). Copy the connection string into `DATABASE_URL`.

---

### Backend (Render / Railway / Fly.io)

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install && npx prisma generate && npx prisma migrate deploy` |
| Start Command | `npm start` |
| Required Environment Variables | `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLIENT_URL`, `NODE_ENV=production` |

After first deploy, run the seed script once via the platform shell or a one-off job:

```bash
node prisma/seed.js
```

---

### Frontend (Vercel / Netlify)

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_URL=https://your-backend.onrender.com` |

For Vercel, add a `vercel.json` at `client/vercel.json` to enable SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## License

This project is released under the MIT License.

**Disclaimer**: SmartBuy is a catalog display platform. It does not process payments, manage orders, or store customer data. Product inventory and imagery are managed solely by the store administrator through the protected admin portal.
