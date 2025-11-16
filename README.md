# Todo Application - Fullstack Monorepo (Vercel)

Fullstack Todo application dengan authentication, deployed menggunakan Vercel (Backend + Frontend) dengan CI/CD via GitHub Actions.

## 🚀 Features

- ✅ User Authentication (Register/Login dengan JWT)
- ✅ Todo CRUD Operations (Create, Read, Update, Delete)
- ✅ JWT-based Authentication
- ✅ RESTful API dengan Swagger documentation
- ✅ React Frontend dengan modern UI
- ✅ MongoDB Atlas integration
- ✅ CI/CD dengan GitHub Actions
- ✅ Backend deployed ke Vercel (Serverless Functions)
- ✅ Frontend deployed ke Vercel (Static Site)
- ✅ 100% Free Tier (No Credit Card Required)

## 🛠 Tech Stack

### Backend
- **Node.js 22 LTS**
- **Express 5** - Web framework
- **MongoDB dengan Mongoose** - Database
- **JWT** - Authentication
- **Swagger/OpenAPI 3.1** - API documentation
- **Serverless Functions** - Vercel deployment

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Modern UI** - Clean and responsive design

### Infrastructure
- **Vercel** - Backend (Serverless) + Frontend (Static Site)
- **MongoDB Atlas** - Database (Free Tier)
- **GitHub Actions** - CI/CD Pipeline
- **Turbo** - Monorepo build system

## 📁 Project Structure

```
monorepo-todo-auth-railway-vercel/
├── apps/
│   ├── backend/          # Express API server (Vercel Serverless)
│   │   ├── api/          # Vercel serverless function wrapper
│   │   ├── src/          # Source code
│   │   │   ├── routes/   # API routes
│   │   │   ├── models/   # MongoDB models
│   │   │   └── middleware/ # Auth middleware
│   │   ├── vercel.json   # Vercel configuration
│   │   └── .env.example  # Environment variables template
│   └── frontend/         # React application
│       ├── src/          # Source code
│       │   ├── pages/    # React pages
│       │   └── utils/    # Utilities
│       ├── vercel.json   # Vercel configuration
│       └── .env.example  # Environment variables template
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docker-compose.yml    # Local development (optional)
└── turbo.json           # Turbo configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 22 LTS** atau lebih baru
- **pnpm 9** (atau npm 10)
- **MongoDB Atlas account** (Free Tier) - https://cloud.mongodb.com
- **Vercel account** (Free Tier) - https://vercel.com
- **GitHub account** (untuk CI/CD)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd monorepo-todo-auth-railway-vercel

# Install dependencies
pnpm install

# Setup environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Edit .env files dengan credentials Anda
# - apps/backend/.env: MongoDB URI dan JWT secret
# - apps/frontend/.env: Backend API URL
```

### Environment Variables

**Backend (`apps/backend/.env`):**
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
```

**Frontend (`apps/frontend/.env`):**
```env
VITE_API_URL=http://localhost:3001
```

### Development

```bash
# Run backend (port 3001)
pnpm --filter backend dev

# Run frontend (port 5173)
pnpm --filter frontend dev

# Or run both in separate terminals
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs
- Health Check: http://localhost:3001/health

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

# Run specific tests
pnpm --filter backend test
```

## 📦 Deployment ke Vercel

### Prerequisites

1. **Vercel Account** - Sign up di https://vercel.com (Free, no credit card)
2. **MongoDB Atlas** - Setup cluster di https://cloud.mongodb.com (Free Tier)
3. **GitHub Repository** - Push code ke GitHub

### Step 1: Setup MongoDB Atlas

1. Sign up di https://cloud.mongodb.com
2. Create free cluster (M0)
3. Create database user
4. Get connection string
5. **IMPORTANT:** Add IP whitelist `0.0.0.0/0` (allow from anywhere) untuk free tier

### Step 2: Manual Deploy Pertama Kali (Backend)

1. Login ke Vercel Dashboard: https://vercel.com
2. Click **"Add New Project"**
3. Import repository dari GitHub
4. Configure project:
   - **Project Name:** `your-repo-name-backend`
   - **Root Directory:** **KOSONGKAN** (biarkan kosong)
   - **Framework Preset:** Other
   - **Build Command:** (kosongkan)
   - **Output Directory:** (kosongkan)
5. **Environment Variables:**
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Random secret key (min 32 chars)
   - `JWT_EXPIRES_IN` - `7d` (optional)
   - `NODE_ENV` - `production`
6. **IMPORTANT:** Di Settings > General:
   - **Root Directory:** KOSONGKAN (biarkan kosong)
   - **Git > Production Branch:** `main`
   - **Git > Auto Deploy:** **DISABLE** (matikan auto deploy)
7. Deploy sekali secara manual
8. Copy **Project ID** dari Settings > General
9. Add ke GitHub Secrets: `VERCEL_PROJECT_ID`

### Step 3: Manual Deploy Pertama Kali (Frontend)

1. Di Vercel Dashboard, click **"Add New Project"** lagi
2. Import repository yang sama dari GitHub
3. Configure project:
   - **Project Name:** `your-repo-name-frontend`
   - **Root Directory:** **KOSONGKAN** (biarkan kosong)
   - **Framework Preset:** Vite (auto-detect)
   - **Build Command:** `pnpm build` (auto-detect)
   - **Output Directory:** `dist` (auto-detect)
4. **Environment Variables:**
   - `VITE_API_URL` - Backend Vercel URL (contoh: `https://your-backend.vercel.app`)
5. **IMPORTANT:** Di Settings > General:
   - **Root Directory:** KOSONGKAN (biarkan kosong)
   - **Git > Production Branch:** `main`
   - **Git > Auto Deploy:** **DISABLE** (matikan auto deploy)
6. Deploy sekali secara manual
7. Copy **Project ID** dari Settings > General
8. Add ke GitHub Secrets: `VERCEL_FRONTEND_PROJECT_ID`

### Step 4: Setup GitHub Secrets

Go to GitHub Repository > Settings > Secrets and variables > Actions:

**Required Secrets:**
- `VERCEL_TOKEN` - Get dari https://vercel.com/account/tokens
- `VERCEL_USER_ID` - Get dari Vercel Dashboard > Settings > General (User ID)
- `VERCEL_PROJECT_ID` - Backend Project ID dari Vercel
- `VERCEL_FRONTEND_PROJECT_ID` - Frontend Project ID dari Vercel

**Optional Secrets (untuk backend):**
- `MONGODB_URI` - MongoDB connection string (atau set di Vercel)
- `JWT_SECRET` - JWT secret (atau set di Vercel)
- `JWT_EXPIRES_IN` - JWT expiration (atau set di Vercel)

**Optional Secrets (untuk frontend):**
- `VITE_API_URL` - Backend URL (atau set di Vercel)

### Step 5: Setup Vercel Environment Variables

**Backend Project (Vercel):**
- Go to Backend Project > Settings > Environment Variables
- Add untuk **Production** environment:
  - `MONGODB_URI` - MongoDB connection string
  - `JWT_SECRET` - JWT secret key
  - `JWT_EXPIRES_IN` - `7d` (optional)

**Frontend Project (Vercel):**
- Go to Frontend Project > Settings > Environment Variables
- Add untuk **Production** environment:
  - `VITE_API_URL` - Backend Vercel URL

### Step 6: CI/CD Setup

Setelah semua secrets di-set, CI/CD akan otomatis:
1. Run tests pada setiap push
2. Deploy backend ke Vercel (main branch only)
3. Deploy frontend ke Vercel (main branch only)

**Workflow:**
```
Push to main → Test → Build Frontend → Deploy Frontend → Deploy Backend → Notify
```

## 🔧 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci-cd.yml`) akan:

1. **Test** - Run semua tests
2. **Build Frontend** - Build React app
3. **Deploy Frontend** - Deploy ke Vercel
4. **Deploy Backend** - Deploy ke Vercel
5. **Notify** - Show deployment status

**Trigger:**
- Push ke `main` branch → Full deployment
- Push ke `develop` branch → Test only
- Pull Request → Test only

## 📚 API Documentation

Swagger documentation tersedia di:
- **Local:** http://localhost:3001/api-docs
- **Production:** https://your-backend.vercel.app/api-docs

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**Todos (Protected):**
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `GET /api/todos/:id` - Get todo by ID
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

**Health:**
- `GET /health` - Simple health check
- `GET /health-checks` - Detailed health check

## 🆓 Free Tier Limits

### Vercel (Backend + Frontend)

**Backend (Serverless Functions):**
- ✅ **100GB bandwidth** per month
- ✅ **100GB-hours** function execution per month
- ✅ **Unlimited** deployments
- ✅ **Auto-scaling**
- ✅ **No credit card required**

**Frontend (Static Site):**
- ✅ **Unlimited** deployments
- ✅ **Unlimited** bandwidth (personal projects)
- ✅ **Global CDN**
- ✅ **No credit card required**

### MongoDB Atlas

- ✅ **512MB storage** (Free Tier)
- ✅ **Shared cluster**
- ✅ **No credit card required**
- ✅ Perfect untuk development dan small production apps

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify `MONGODB_URI` di Vercel environment variables
- Check MongoDB Atlas IP whitelist (set `0.0.0.0/0` untuk free tier)
- Verify database user credentials

**JWT Authentication Error:**
- Verify `JWT_SECRET` di Vercel environment variables
- Ensure JWT_SECRET is at least 32 characters

**Root Directory Error:**
- Clear Root Directory di Vercel Project Settings (biarkan kosong)
- Workflow menggunakan `working-directory` parameter

### Frontend Issues

**API Connection Error:**
- Verify `VITE_API_URL` di Vercel environment variables
- Check backend URL is correct
- Ensure backend is deployed and running

**Build Errors:**
- Check Node version (22+)
- Clear `node_modules` dan reinstall
- Check environment variables

### CI/CD Issues

**Deployment Failed:**
- Check GitHub Secrets are set correctly
- Verify Vercel Token is valid
- Check Vercel Project IDs are correct
- Review GitHub Actions logs

**Project Not Found:**
- Ensure project exists di Vercel
- Verify Project ID matches
- Check User ID / Org ID is correct

## 📖 Additional Documentation

- **Backend README:** [apps/backend/README.md](apps/backend/README.md)
- **Frontend README:** [apps/frontend/README.md](apps/frontend/README.md)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests: `pnpm test`
4. Submit pull request

## 📄 License

ISC

## 🔗 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Express Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
