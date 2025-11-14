# Todo Application - Monorepo (Railway + Vercel)

Fullstack Todo application dengan authentication, deployed menggunakan free tier cloud services.

## Features

- User Authentication (Register/Login)
- Todo CRUD Operations
- JWT-based Authentication
- RESTful API dengan Swagger documentation
- React Frontend dengan PWA support
- MongoDB Atlas integration
- Docker containerization
- CI/CD dengan GitHub Actions
- Backend deployed ke Railway atau Render (Free Tier)
- Frontend deployed ke Vercel (Free Tier)

## Tech Stack

### Backend

- Node.js 22 LTS
- Express 5
- MongoDB dengan Mongoose
- JWT untuk authentication
- Swagger/OpenAPI 3.1 untuk API documentation

### Frontend

- React 19
- Vite
- PWA-ready
- Modern UI

### Infrastructure

- Docker & Docker Compose (untuk local development)
- Railway atau Render untuk backend hosting (Free Tier)
- Vercel untuk frontend hosting (Free Tier)
- MongoDB Atlas (Free Tier)
- GitHub Actions untuk CI/CD

### Monorepo

- Turbo untuk build system
- Shared packages
- Unified dependency management

## Project Structure

```
monorepo-todo-auth-railway-vercel/
├── apps/
│   ├── backend/          # Express API server
│   └── frontend/         # React application
├── packages/
│   └── shared/           # Shared utilities
├── infra/                # Infrastructure configs
├── docs/                 # Documentation
├── tests/                # E2E tests
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docker-compose.yml    # Local development
└── turbo.json           # Turbo configuration
```

## Getting Started

### Prerequisites

- Node.js 22 LTS
- pnpm 9 (or npm 10)
- Docker & Docker Compose (untuk local development)
- MongoDB Atlas account (Free Tier)
- Backend hosting account (Free Tier):
  - **Back4app** (Docker support, CI/CD - no credit card) ⭐ Recommended - [docs/BACK4APP_SETUP.md](docs/BACK4APP_SETUP.md)
  - **Netlify** (Built-in CI/CD, Fullstack - no credit card) - [docs/NETLIFY_BACKEND_SETUP.md](docs/NETLIFY_BACKEND_SETUP.md)
  - **Replit** (Online IDE, Limited CI/CD - no credit card) - [docs/REPLIT_SETUP.md](docs/REPLIT_SETUP.md)
  - **Render** (Perlu credit card untuk verifikasi) - [docs/RENDER_SETUP.md](docs/RENDER_SETUP.md)
  - **Railway** (Perlu credit card, limited) - [docs/RAILWAY_SETUP.md](docs/RAILWAY_SETUP.md)
- Vercel account (Free Tier)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

### Environment Setup

**Backend (.env):**

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

**Frontend (.env):**

```env
VITE_API_URL=http://localhost:3001
```

### Development

```bash
# Start all services (requires Docker)
docker-compose up -d

# Or run individually
pnpm --filter backend dev
pnpm --filter frontend dev
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter backend build
pnpm --filter frontend build
```

### Testing

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e
```

## Docker (Local Development)

### Build Images

```bash
docker-compose build
```

### Run with Docker Compose

```bash
docker-compose up -d
```

Services akan berjalan di:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## Deployment

### Backend Options

#### Option 1: Netlify (Recommended - No Credit Card, Built-in CI/CD, Fullstack)

**Netlify** adalah platform free hosting dengan **built-in CI/CD** yang **tidak memerlukan credit card** dan perfect untuk fullstack apps.

**Keuntungan Netlify:**

- ✅ **100% Free** tanpa credit card
- ✅ **Built-in CI/CD** - Auto-deploy dari GitHub
- ✅ **Fullstack Support** - Frontend + Backend di satu platform
- ✅ **Serverless Functions** - Auto-scaling
- ✅ **Global CDN** - Fast global delivery

**Keterbatasan:**

- ⚠️ Perlu restructure Express ke serverless functions
- ⚠️ Function-based architecture
- ⚠️ No traditional Express server

**Setup:**

1. Sign up di netlify.com dengan GitHub
2. Connect repository
3. Restructure Express ke serverless functions
4. Add environment variables
5. Deploy

**Lihat dokumentasi lengkap:** [docs/NETLIFY_BACKEND_SETUP.md](docs/NETLIFY_BACKEND_SETUP.md)

#### Option 2: Genezio (Perlu Credit Card - 1GB RAM, No Sleep, CI/CD)

**Note:** Genezio sekarang memerlukan credit card untuk verifikasi.

**Genezio** adalah platform serverless dengan **1GB RAM** dan **tidak akan sleep**.

**Keuntungan Genezio:**

- ✅ **1GB RAM** (paling besar di free tier)
- ✅ **No sleep** - aplikasi selalu aktif
- ✅ **100% Free** tanpa credit card
- ✅ **Auto-deploy** dari GitHub

**Setup:**

1. Sign up di genezio.com dengan GitHub
2. Connect repository
3. Set root directory: `apps/backend`
4. Auto-deploy

**Lihat dokumentasi:** [docs/FREE_BACKEND_ALTERNATIVES.md](docs/FREE_BACKEND_ALTERNATIVES.md)

#### Option 3: Replit (No Credit Card, Online IDE, Limited CI/CD)

**Replit** adalah platform free hosting dengan **online IDE** yang **tidak memerlukan credit card**.

**Keuntungan Replit:**

- ✅ **100% Free** tanpa credit card (Starter plan)
- ✅ **Online IDE** - Develop langsung di browser
- ✅ **Auto-deploy** saat run
- ✅ **Public URL** langsung

**Keterbatasan:**

- ⚠️ **Limited CI/CD** - Tidak support CI/CD secara langsung
- ⚠️ 512MB RAM limit
- ⚠️ Auto-sleep setelah inactivity
- ⚠️ No Docker support

**Setup:**

1. Login ke Replit (replit.com) dengan GitHub atau email
2. Click "Create Repl" > Select "Node.js" template
3. Import dari GitHub atau create new
4. Add `.env` file dengan environment variables
5. Click "Run" untuk deploy

**Lihat dokumentasi lengkap:** [docs/REPLIT_SETUP.md](docs/REPLIT_SETUP.md)

#### Option 4: Back4app Containers (No Credit Card - Docker Support, CI/CD) ⭐ Recommended

**Back4app Containers** adalah platform container hosting dengan **Docker support** dan **CI/CD** yang **tidak memerlukan credit card**.

**Keuntungan Back4app:**

- ✅ **100% Free** tanpa credit card
- ✅ **Docker Support** - Full Docker support
- ✅ **CI/CD Support** - Auto-deploy dari GitHub
- ✅ **Container-based** - Perfect untuk containerized apps

**Keterbatasan:**

- ⚠️ 256MB RAM limit
- ⚠️ Auto-sleep setelah inactivity
- ⚠️ 1GB storage limit

**Setup:**

1. Sign up di back4app.com (no credit card)
2. Go to "Containers" > "New Container"
3. Connect GitHub repository
4. Set root directory: `apps/backend`
5. Configure build settings
6. **⚠️ CRITICAL: Add environment variables BEFORE deployment:**
   - `MONGODB_URI` - MongoDB Atlas connection string (REQUIRED)
   - `JWT_SECRET` - JWT secret key (REQUIRED)
   - `JWT_EXPIRES_IN=7d` (optional)
   - `NODE_ENV=production` (optional)
   - `PORT=3001` (optional)
7. Deploy

**⚠️ IMPORTANT:** Jika environment variables tidak di-set, aplikasi akan crash saat startup karena MongoDB connection gagal. Check logs di Back4app dashboard untuk error details.

**Lihat dokumentasi lengkap:** 
- [docs/BACK4APP_SETUP.md](docs/BACK4APP_SETUP.md) - Setup guide
- [docs/BACK4APP_TROUBLESHOOTING.md](docs/BACK4APP_TROUBLESHOOTING.md) - Troubleshooting guide

#### Option 5: Fly.io (Perlu Credit Card - Docker Support)

**Note:** Fly.io sekarang memerlukan credit card untuk verifikasi.

**Fly.io** adalah platform container hosting dengan free tier yang generous.

**Keuntungan Fly.io:**

- ✅ **3 VMs free** (no credit card)
- ✅ **Docker support** full
- ✅ **Global edge network**
- ✅ **Perfect untuk containerized apps**

**Setup:**

1. Install Fly CLI
2. Sign up di fly.io
3. Deploy dengan `fly launch`
4. Set secrets: `fly secrets set KEY=value`

**Lihat dokumentasi:** [docs/FREE_BACKEND_ALTERNATIVES.md](docs/FREE_BACKEND_ALTERNATIVES.md)

#### Option 5: Render (Perlu Credit Card)

**Render** adalah platform yang sangat cocok untuk backend Node.js/Express dengan free tier yang generous, tapi **perlu credit card** untuk verifikasi.

**Keuntungan Render:**

- **750 hours/month** free (cukup untuk 24/7)
- **Docker support** full
- **Auto-deploy** dari GitHub
- **Perfect untuk Express apps**

**Lihat dokumentasi lengkap:** [docs/RENDER_SETUP.md](docs/RENDER_SETUP.md)

#### Option 6: Railway (Limited Free Tier - Perlu Credit Card)

**Railway** mendukung deployment langsung dari GitHub dengan Docker support, tapi free tier terbatas untuk database saja dan **perlu credit card**.

**Lihat dokumentasi lengkap:** [docs/RAILWAY_SETUP.md](docs/RAILWAY_SETUP.md)

#### Option 7: Vercel (Serverless Functions)

**Vercel** bisa untuk backend tapi perlu restructure Express ke serverless functions pattern. Tidak recommended untuk full Express app.

**Lihat dokumentasi:** [docs/VERCEL_BACKEND_DEPLOYMENT.md](docs/VERCEL_BACKEND_DEPLOYMENT.md)

### Vercel (Frontend)

Vercel adalah platform optimal untuk frontend React applications.

**Setup:**

1. Login ke Vercel (vercel.com)
2. Import project dari GitHub
3. Set root directory ke `apps/frontend`
4. Set build command: `pnpm build` atau `npm run build`
5. Set output directory: `dist`
6. Add environment variables:
   - `VITE_API_URL` (Railway backend URL)

**Vercel akan:**

- Auto-detect framework (Vite)
- Build dan deploy otomatis
- Provide public URL dengan HTTPS
- Auto-redeploy pada push ke main branch
- Edge network untuk fast global delivery

## CI/CD Pipeline

GitHub Actions workflow akan:

1. Run tests
2. Build Docker image untuk backend
3. Deploy ke Railway (via Railway CLI atau API)
4. Build frontend
5. Deploy ke Vercel (via Vercel CLI)

## Free Tier Limits

### Netlify (Recommended - No Credit Card, Built-in CI/CD)

- **100GB bandwidth** per month
- **512MB RAM**
- **Built-in CI/CD** - Auto-deploy dari GitHub
- **No sleep** - Always on
- **Fullstack support** - Frontend + Backend
- **No credit card required**
- Perfect untuk production dengan CI/CD

### Replit (No Credit Card, Online IDE, Limited CI/CD)

- **Starter plan** (free tier)
- **512MB RAM**
- **Online IDE** - Develop langsung di browser
- Auto-sleep after inactivity (wake on request)
- **Limited CI/CD** - Tidak support CI/CD secara langsung
- **No credit card required**
- Perfect untuk learning dan development

### Genezio (Perlu Credit Card - Most RAM)

- **1GB RAM** (paling besar)
- **No sleep** - aplikasi selalu aktif
- **Unlimited** deployments
- **Credit card required** untuk verifikasi
- Perfect untuk apps yang butuh lebih banyak RAM

### Fly.io (Perlu Credit Card)

- **3 VMs** free
- **256MB RAM** per VM
- **160GB** outbound transfer
- **Docker support**
- **Credit card required** untuk verifikasi

### Render (Perlu Credit Card)

- **750 hours/month** compute time (free tier)
- Auto-sleep after 15 min inactivity
- 512MB RAM
- Credit card required untuk verifikasi
- Perfect untuk backend deployment

### Railway (Perlu Credit Card)

- $5 credit per month (Free Tier)
- 500 hours compute time
- Limited untuk database di free trial
- Credit card required

### Vercel

- Unlimited deployments
- 100GB bandwidth per month
- 100GB-hours function execution
- Perfect untuk frontend applications
- Backend via serverless functions (perlu restructure)

### MongoDB Atlas

- 512MB storage (Free Tier)
- Shared cluster
- Sufficient untuk development dan small production apps

## Recommended Setup untuk Free Tier (No Credit Card)

**Best Combination (No Credit Card):**

- **Backend:**
  - **Back4app** (Docker support, CI/CD) ⭐ Recommended untuk production
- **Frontend:**
  - **Vercel** (unlimited, perfect untuk React) ⭐ Recommended
- **Fullstack Alternative:**
  - **Netlify** (Frontend + Backend, built-in CI/CD, perlu restructure ke serverless)
- **Learning:**
  - **Replit** (online IDE, tapi limited CI/CD)
- **Database:** MongoDB Atlas (512MB free, no credit card)

**Alternatif dengan Credit Card:**

- **Backend:** Render (750 hours/month, perlu CC untuk verifikasi)
- **Frontend:** Vercel (unlimited, no credit card)
- **Database:** MongoDB Atlas (512MB free, no credit card)

**Lihat semua alternatif:** [docs/FREE_BACKEND_ALTERNATIVES.md](docs/FREE_BACKEND_ALTERNATIVES.md)

## Monorepo Benefits

- **Single Repository:** Semua code dalam satu repo
- **Multi-services:** Frontend, Backend, shared libs
- **Easy CI/CD:** Single pipeline untuk semua services
- **Dependency Sharing:** Shared packages untuk code reuse
- **Ideal for Multi-Platform Deploy:** Deploy ke different platforms dari satu repo

## API Documentation

Swagger documentation tersedia di `/api-docs` setelah backend running.

Import Postman collection dari `docs/todo-api.postman_collection.json`.

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request

## License

ISC
