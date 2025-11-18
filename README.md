# Todo Application - Fullstack Monorepo (Vercel)

Fullstack Todo application dengan authentication, deployed menggunakan Vercel (Backend + Frontend) dengan CI/CD via GitHub Actions.

## Features

- User Authentication (Register/Login dengan JWT)
- Todo CRUD Operations (Create, Read, Update, Delete)
- JWT-based Authentication
- RESTful API
- React Frontend dengan modern UI
- MongoDB Atlas integration
- CI/CD dengan GitHub Actions
- Backend deployed ke Vercel (Serverless Functions)
- Frontend deployed ke Vercel (Static Site)
- 100% Free Tier (No Credit Card Required)

## Tech Stack

### Backend
- Node.js 22 LTS
- Express 5 - Web framework
- MongoDB dengan Mongoose - Database
- JWT - Authentication
- Vercel Serverless Functions

### Frontend
- React 19 - UI library
- Vite - Build tool
- React Router - Routing
- Axios - HTTP client

### Infrastructure
- Vercel - Backend (Serverless) + Frontend (Static Site)
- MongoDB Atlas - Database (Free Tier)
- GitHub Actions - CI/CD Pipeline
- Turbo - Monorepo build system

## Project Structure

```
monorepo-todo-auth-vercel-finished/
├── apps/
│   ├── backend/              # Express API server (Vercel Serverless)
│   │   ├── api/              # Vercel serverless function wrapper
│   │   ├── src/              # Source code
│   │   │   ├── routes/       # API routes
│   │   │   ├── models/       # MongoDB models
│   │   │   └── middleware/   # Auth middleware
│   │   ├── vercel.json       # Vercel configuration
│   │   └── .env.example      # Environment variables template
│   └── frontend/             # React application
│       ├── src/              # Source code
│       │   ├── pages/        # React pages
│       │   └── utils/        # Utilities
│       ├── vercel.json       # Vercel configuration
│       └── .env.example      # Environment variables template
├── .github/
│   └── workflows/            # CI/CD pipelines
└── turbo.json               # Turbo configuration
```

## Prerequisites

Sebelum memulai, pastikan Anda sudah memiliki:

- Node.js 22 LTS atau lebih baru
- pnpm 9 (atau npm 10)
- MongoDB Atlas account (Free Tier) - https://cloud.mongodb.com
- Vercel account (Free Tier) - https://vercel.com
- GitHub account (untuk CI/CD)

**PENTING: Install pnpm terlebih dahulu**
```bash
npm install -g pnpm
```

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd monorepo-todo-auth-vercel-finished
```

### 2. Install Dependencies

```bash
# Install dependencies untuk semua apps (backend + frontend)
pnpm install
```

### 3. Setup Environment Variables

**Backend** (apps/backend/.env):
```bash
cd apps/backend
cp .env.example .env
```

Edit file `.env` dan isi dengan:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo?retryWrites=true&w=majority
JWT_SECRET=buatlah-secret-key-yang-panjang-minimal-32-karakter-atau-lebih
JWT_EXPIRES_IN=7d
```

**Frontend** (apps/frontend/.env):
```bash
cd ../frontend
cp .env.example .env
```

Edit file `.env` dan isi dengan:
```env
VITE_API_URL=http://localhost:3001
```

### 4. Setup MongoDB Atlas

1. Buat account di https://cloud.mongodb.com (gratis)
2. Create cluster baru (pilih Free Tier M0)
3. Create database user dengan username dan password
4. PENTING: Di Network Access, tambahkan IP `0.0.0.0/0` (allow from anywhere) untuk free tier
5. Get connection string dari cluster (klik Connect > Connect your application)
6. Copy connection string ke `MONGODB_URI` di file `.env` backend
7. Ganti `<username>`, `<password>`, dan nama database sesuai kebutuhan

### 5. Jalankan Development Server

**Terminal 1 - Backend:**
```bash
cd apps/backend
pnpm dev
```

Server backend akan berjalan di: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm dev
```

Server frontend akan berjalan di: http://localhost:5173

### 6. Testing API

**Menggunakan Browser:**

Buka browser dan akses:
- Frontend: http://localhost:5173
- Backend Health: http://localhost:3001/health
- Backend API Info: http://localhost:3001

**Menggunakan Postman:**

1. Download dan install Postman dari https://www.postman.com/downloads/
2. Buka Postman
3. Klik "Import" di pojok kiri atas
4. Pilih tab "File"
5. Klik "Choose Files" atau drag & drop file `todo-api.postman_collection.json` dari root project
6. Klik "Import"
7. Collection "Todo API - Vercel" akan muncul di sidebar kiri
8. Expand collection untuk melihat semua endpoints

**Cara Test dengan Postman:**

Step 1: Test Health Check
- Klik "Health Check" > "Root - API Info"
- Klik tombol "Send"
- Verifikasi response berisi informasi API

Step 2: Register User Baru
- Klik "Auth" > "Register"
- Di tab "Body", edit email dan password sesuai kebutuhan
- Klik "Send"
- Verifikasi response status 201 dan dapat token

Step 3: Login
- Klik "Auth" > "Login"
- Edit email dan password (sama dengan yang digunakan saat register)
- Klik "Send"
- Token akan otomatis disimpan ke variable `auth_token`
- Verifikasi response status 200

Step 4: Test Todos Endpoints (Butuh Token)
- Klik "Todos" > "Get All Todos"
- Token sudah otomatis ditambahkan di Authorization header
- Klik "Send"
- Verifikasi response berisi array todos (kosong jika belum ada)

Step 5: Create Todo
- Klik "Todos" > "Create Todo"
- Edit title di body request
- Klik "Send"
- Copy `_id` dari response untuk testing update/delete

Step 6: Update Todo
- Klik "Todos" > "Update Todo"
- Klik tab "Params"
- Ganti `:id` dengan todo ID yang di-copy tadi
- Edit title atau completed di body request
- Klik "Send"

Step 7: Delete Todo
- Klik "Todos" > "Delete Todo"
- Ganti `:id` dengan todo ID
- Klik "Send"

**Ganti Base URL untuk Production:**

Setelah deploy ke Vercel, update base URL:
1. Klik collection "Todo API - Vercel"
2. Klik tab "Variables"
3. Ganti value `base_url` dari `http://localhost:3001` ke URL Vercel (contoh: `https://your-backend.vercel.app`)
4. Klik "Save"

## Deployment ke Vercel

### Step 1: Setup MongoDB Atlas untuk Production

1. Login ke MongoDB Atlas
2. Pastikan IP whitelist sudah diset `0.0.0.0/0`
3. Copy connection string untuk production

### Step 2: Deploy Backend ke Vercel

1. Login ke Vercel Dashboard: https://vercel.com
2. Klik "Add New Project"
3. Import repository dari GitHub
4. Configure project:
   - Project Name: `nama-project-backend`
   - Root Directory: KOSONGKAN (biarkan kosong)
   - Framework Preset: Other
   - Build Command: (kosongkan)
   - Output Directory: (kosongkan)
5. Add Environment Variables:
   - `MONGODB_URI` = connection string dari MongoDB Atlas
   - `JWT_SECRET` = secret key yang sama dengan development (minimal 32 karakter)
   - `JWT_EXPIRES_IN` = `7d`
   - `NODE_ENV` = `production`
6. Deploy
7. Copy deployment URL (contoh: `https://your-backend.vercel.app`)
8. Di Settings > General, copy Project ID
9. Matikan "Auto Deploy" di Settings > Git

### Step 3: Deploy Frontend ke Vercel

1. Di Vercel Dashboard, klik "Add New Project" lagi
2. Import repository yang sama dari GitHub
3. Configure project:
   - Project Name: `nama-project-frontend`
   - Root Directory: KOSONGKAN (biarkan kosong)
   - Framework Preset: Vite (auto-detect)
   - Build Command: `pnpm build`
   - Output Directory: `dist`
4. Add Environment Variables:
   - `VITE_API_URL` = Backend URL dari step sebelumnya
5. Deploy
6. Di Settings > General, copy Project ID
7. Matikan "Auto Deploy" di Settings > Git

### Step 4: Setup GitHub Secrets untuk CI/CD

Go to: GitHub Repository > Settings > Secrets and variables > Actions

Tambahkan secrets berikut:

**Required:**
- `VERCEL_TOKEN` - Generate di https://vercel.com/account/tokens
- `VERCEL_USER_ID` - Copy dari Vercel Settings > General (User ID)
- `VERCEL_BACKEND_PROJECT_ID` - Project ID backend dari Vercel
- `VERCEL_FRONTEND_PROJECT_ID` - Project ID frontend dari Vercel

**Optional (jika ingin override):**
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `VITE_API_URL`

### Step 5: CI/CD Otomatis

Setelah setup secrets, setiap push ke branch `main` akan otomatis:
1. Run tests
2. Build frontend
3. Deploy frontend ke Vercel
4. Deploy backend ke Vercel

## Logging Configuration

Aplikasi ini menggunakan **Winston** untuk detailed logging yang dapat dilihat di Vercel atau console development.

### Log Levels
- `error` - Error dan exceptions (status code >= 500)
- `warn` - Warning (status code >= 400)
- `http` - HTTP requests (status code 2xx-3xx)
- `info` - Informasi umum
- `debug` - Debug information

### Environment Variable
```env
LOG_LEVEL=info  # Optional, default: info
                # Options: error, warn, info, http, debug
```

### Format Log
Setiap log memiliki format:
```
2024-01-15 10:30:45 [INFO]: Message
{
  "metadata": "additional context"
}
```

### Log Types

**HTTP Request Logs:**
```json
{
  "method": "POST",
  "url": "/api/todos",
  "status": 201,
  "duration": "45ms",
  "ip": "127.0.0.1",
  "userAgent": "PostmanRuntime/7.28.4"
}
```

**Database Operation Logs:**
```json
{
  "operation": "create",
  "collection": "todos",
  "userId": "65a1b2c3d4e5f6789012345",
  "details": {...}
}
```

**Authentication Logs:**
```json
{
  "action": "login_success",
  "userId": "65a1b2c3d4e5f6789012345",
  "email": "user@example.com"
}
```

**Error Logs (dengan stack trace):**
```json
{
  "message": "Error message",
  "stack": "Error: ...\n    at ...",
  "context": "additional_context"
}
```

### Melihat Logs di Vercel
1. Go to Vercel Dashboard
2. Pilih project backend
3. Klik tab "Logs"
4. Logs akan muncul real-time dengan warna dan format yang rapi

## 404 Error Handling

Semua endpoint yang tidak ditemukan akan mengembalikan response JSON yang jelas:

### Response Format
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Endpoint GET /api/invalid tidak ditemukan",
  "path": "/api/invalid",
  "method": "GET",
  "availableEndpoints": {
    "root": {
      "method": "GET",
      "path": "/",
      "description": "API information"
    },
    "health": {
      "method": "GET",
      "path": "/health",
      "description": "Simple health check"
    },
    "auth": {
      "register": {
        "method": "POST",
        "path": "/api/auth/register",
        "description": "Register new user"
      },
      "login": {
        "method": "POST",
        "path": "/api/auth/login",
        "description": "Login user"
      }
    },
    "todos": {
      "list": {
        "method": "GET",
        "path": "/api/todos",
        "description": "Get all todos (requires auth)"
      }
    }
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Testing 404 Response
Gunakan Postman collection yang sudah disediakan di folder "Error Handling" untuk test 404 response.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Todos (Protected - Butuh JWT Token)
- `GET /api/todos` - Get semua todos
- `POST /api/todos` - Create todo baru
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Health Check
- `GET /` - API information
- `GET /health` - Simple health check
- `GET /health-checks` - Detailed health check

## Build Commands

```bash
# Build semua apps
pnpm build

# Build backend saja
pnpm --filter backend build

# Build frontend saja
pnpm --filter frontend build
```

## Testing

Project ini dilengkapi dengan comprehensive testing setup:

- **Backend**: 104 unit tests (Jest + Supertest)
- **Frontend**: E2E tests (Playwright)

### Quick Start

```bash
# Backend unit tests
cd apps/backend
pnpm test

# Frontend E2E tests (pastikan backend running)
cd apps/frontend
pnpm test:e2e
```

### Detailed Documentation

Untuk setup lengkap, troubleshooting, dan advanced testing:

📖 **[TESTING-GUIDE.md](./TESTING-GUIDE.md)** - Comprehensive testing documentation

#### Backend Tests
- **Location**: [`apps/backend/tests/`](./apps/backend/tests/)
- **Documentation**: [`apps/backend/TESTING.md`](./apps/backend/TESTING.md)
- **Coverage**: Models, Routes, Middleware

#### Frontend E2E Tests
- **Location**: [`apps/frontend/e2e/`](./apps/frontend/e2e/)
- **Documentation**: [`apps/frontend/E2E-TESTING.md`](./apps/frontend/E2E-TESTING.md)
- **Flow**: Register → CRUD → Logout → Login

**Note**: Known issues dengan Jest + ESM di Windows. Test files sudah lengkap dan valid, hanya ada compatibility issues. Lihat TESTING.md untuk details.

## Troubleshooting

### Issue: pnpm command not found

**Solusi:**
```bash
npm install -g pnpm
```

### Issue: MongoDB connection error - authentication failed

**Kemungkinan Penyebab:**
- Username atau password salah di connection string
- User belum dibuat di MongoDB Atlas

**Solusi:**
1. Cek username dan password di MongoDB Atlas
2. Pastikan connection string benar:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE_NAME
   ```
3. Pastikan tidak ada karakter special di password yang perlu di-encode

### Issue: MongoDB connection error - ENOTFOUND atau getaddrinfo

**Kemungkinan Penyebab:**
- Connection string salah
- Cluster belum selesai dibuat
- Network issue

**Solusi:**
1. Cek format connection string sudah benar
2. Tunggu cluster selesai dibuat (3-5 menit)
3. Test koneksi internet

### Issue: MongoDB connection error - timeout

**Kemungkinan Penyebab:**
- IP tidak ada di whitelist
- Network firewall blocking

**Solusi:**
1. Di MongoDB Atlas > Network Access, tambahkan IP `0.0.0.0/0`
2. Cek firewall atau antivirus tidak blocking port 27017

### Issue: JWT Authentication error - Invalid token

**Kemungkinan Penyebab:**
- JWT_SECRET berbeda antara backend yang generate token dan yang verify
- Token sudah expired

**Solusi:**
1. Pastikan JWT_SECRET sama di semua environment
2. Logout dan login ulang untuk dapat token baru

### Issue: Frontend tidak bisa connect ke Backend

**Kemungkinan Penyebab:**
- VITE_API_URL salah atau tidak diset
- Backend tidak berjalan
- CORS issue

**Solusi:**
1. Cek VITE_API_URL di `.env` frontend sudah benar
2. Pastikan backend sudah berjalan
3. Test backend di browser: `http://localhost:3001/health`
4. Clear browser cache dan restart dev server

### Issue: Vercel Deployment Failed - Project Not Found

**Kemungkinan Penyebab:**
- Project ID salah
- Token tidak punya akses ke project

**Solusi:**
1. Cek Project ID di Vercel Settings > General
2. Pastikan VERCEL_TOKEN punya akses ke project
3. Regenerate token jika perlu

### Issue: Vercel Build Failed - pnpm not found

**Solusi:**
Di `vercel.json`, pastikan ada:
```json
{
  "installCommand": "npm install -g pnpm && pnpm install"
}
```

### Issue: Frontend build error - env variables undefined

**Kemungkinan Penyebab:**
- Environment variables di Vercel belum diset
- Prefix `VITE_` tidak digunakan

**Solusi:**
1. Di Vercel Project Settings > Environment Variables, set `VITE_API_URL`
2. Pastikan semua env variables di frontend pakai prefix `VITE_`
3. Redeploy setelah set env variables

### Issue: Backend API error 500 saat production

**Kemungkinan Penyebab:**
- Environment variables tidak diset di Vercel
- MongoDB connection string salah

**Solusi:**
1. Cek Vercel Functions logs untuk error detail
2. Pastikan MONGODB_URI dan JWT_SECRET sudah diset di Vercel
3. Test MongoDB connection string di local dulu

### Issue: CORS error saat frontend hit backend

**Kemungkinan Penyebab:**
- Backend tidak mengizinkan origin dari frontend

**Solusi:**
Backend sudah include middleware `cors()` tanpa restriction, seharusnya tidak ada CORS error. Jika masih ada:
1. Cek browser console untuk error detail
2. Pastikan frontend pakai HTTPS jika backend pakai HTTPS

### Issue: Todo tidak muncul setelah create

**Kemungkinan Penyebab:**
- Error saat save ke database tapi tidak keliatan di UI
- Frontend tidak refresh data setelah create

**Solusi:**
1. Cek browser console untuk error
2. Cek Network tab untuk response dari API
3. Cek MongoDB Atlas untuk verify data tersimpan
4. Refresh halaman manual

## Free Tier Limits

### Vercel

**Backend (Serverless Functions):**
- 100GB bandwidth per bulan
- 100GB-hours function execution per bulan
- Unlimited deployments
- Auto-scaling
- No credit card required

**Frontend (Static Site):**
- Unlimited deployments
- Unlimited bandwidth (personal projects)
- Global CDN
- No credit card required

### MongoDB Atlas

- 512MB storage (Free Tier M0)
- Shared cluster
- No credit card required
- Perfect untuk development dan small production apps

## Additional Documentation

- Backend README: [apps/backend/README.md](apps/backend/README.md)
- Frontend README: [apps/frontend/README.md](apps/frontend/README.md)

## Contributing

1. Create feature branch
2. Make changes
3. Run tests: `pnpm test`
4. Submit pull request

## License

ISC

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Express Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
