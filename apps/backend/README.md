# Backend - Todo API (Vercel Serverless)

Express.js REST API untuk Todo application dengan authentication, deployed sebagai Vercel Serverless Functions.

## Features

- RESTful API dengan Express 5
- JWT Authentication
- MongoDB dengan Mongoose
- Serverless Functions (Vercel)
- Health Check Endpoints
- Input Validation
- Error Handling

## Project Structure

```
backend/
├── api/
│   └── index.js              # Vercel serverless function handler
├── src/
│   ├── app.js                # Express app configuration
│   ├── index.js              # Server entry point (untuk local dev)
│   ├── routes/
│   │   ├── auth.js           # Authentication routes (register, login)
│   │   └── todos.js          # Todo CRUD routes
│   ├── models/
│   │   ├── User.js           # User model (email, password)
│   │   └── Todo.js           # Todo model (title, completed, user)
│   └── middleware/
│       └── auth.js           # JWT authentication middleware
├── vercel.json               # Vercel configuration
├── .env.example              # Environment variables template
└── package.json
```

## Tech Stack

- Node.js 22 - Runtime
- Express 5 - Web framework
- MongoDB + Mongoose - Database & ODM
- JWT (jsonwebtoken) - Authentication
- bcryptjs - Password hashing
- express-validator - Input validation

## Environment Variables

Copy `.env.example` ke `.env` dan isi dengan values yang sesuai:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
# Cara mendapatkan: 
# 1. Login ke https://cloud.mongodb.com
# 2. Buat cluster (Free Tier M0)
# 3. Klik Connect > Connect your application
# 4. Copy connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo?retryWrites=true&w=majority

# JWT Configuration
# Generate secret yang kuat: minimal 32 karakter
# Bisa pakai: openssl rand -base64 32
JWT_SECRET=buatlah-secret-key-yang-panjang-minimal-32-karakter-atau-lebih
JWT_EXPIRES_IN=7d
```

### Environment Variables untuk Vercel

Set di Vercel Project > Settings > Environment Variables untuk environment "Production":

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key (minimal 32 karakter)

**Optional:**
- `JWT_EXPIRES_IN` - JWT expiration (default: `7d`)
- `NODE_ENV` - Environment (default: `production`)

## Local Development

### Prerequisites

- Node.js 22 atau lebih baru
- MongoDB Atlas account (Free Tier)
- pnpm (atau npm)

**PENTING: Install pnpm dulu jika belum:**
```bash
npm install -g pnpm
```

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env dan isi dengan MongoDB URI dan JWT secret
```

### Mendapatkan MongoDB URI

1. Login ke https://cloud.mongodb.com
2. Buat cluster baru (pilih Free Tier M0)
3. Buat database user:
   - Klik "Database Access"
   - Add New Database User
   - Buat username dan password (simpan baik-baik)
4. Setup Network Access:
   - Klik "Network Access"
   - Add IP Address
   - Pilih "Allow Access from Anywhere" (`0.0.0.0/0`)
5. Get Connection String:
   - Klik "Database" > "Connect"
   - Pilih "Connect your application"
   - Copy connection string
   - Ganti `<username>`, `<password>`, dan database name

Contoh connection string:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/todo?retryWrites=true&w=majority
```

### Run Development Server

```bash
# Start server
pnpm dev

# Server akan berjalan di http://localhost:3001
```

### Testing API

Gunakan Postman atau browser:

**Health Check:**
```bash
GET http://localhost:3001/health
```

**Register:**
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login:**
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response akan berisi token JWT
```

**Get Todos (Butuh Token):**
```bash
GET http://localhost:3001/api/todos
Authorization: Bearer <your-jwt-token>
```

**Create Todo (Butuh Token):**
```bash
POST http://localhost:3001/api/todos
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Belajar Node.js"
}
```

## Build untuk Production

```bash
# Build
pnpm build

# Build akan create folder dist/ dengan compiled code
```

## Deployment ke Vercel

### Cara Deploy

1. Login ke Vercel Dashboard: https://vercel.com
2. Klik "Add New Project"
3. Import repository dari GitHub
4. Configure:
   - Root Directory: KOSONGKAN (biarkan kosong)
   - Framework Preset: Other
   - Build Command: (kosongkan)
   - Output Directory: (kosongkan)
5. Add Environment Variables (lihat section Environment Variables di atas)
6. Deploy

### Vercel Configuration

File `vercel.json` sudah dikonfigurasi untuk:
- Route semua request ke serverless function
- Install pnpm saat build
- Set Node.js version ke 22

```json
{
  "version": 2,
  "installCommand": "npm install -g pnpm && pnpm install",
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node",
      "config": {
        "maxDuration": 30
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

### Testing Production API

Setelah deploy, test dengan:

```bash
# Replace <your-deployment-url> dengan URL Vercel Anda
GET https://<your-deployment-url>.vercel.app/health
POST https://<your-deployment-url>.vercel.app/api/auth/register
```

## API Endpoints

### Authentication

**POST /api/auth/register**
- Deskripsi: Register user baru
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "email": "user@example.com"
    }
  }
  ```

**POST /api/auth/login**
- Deskripsi: Login user
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "message": "Login successful",
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "email": "user@example.com"
    }
  }
  ```

### Todos (Protected - Butuh JWT Token)

Semua endpoint todos butuh JWT token di Authorization header:
```
Authorization: Bearer <jwt-token>
```

**GET /api/todos**
- Deskripsi: Get semua todos milik user yang login
- Response:
  ```json
  [
    {
      "_id": "todo-id",
      "title": "Belajar Node.js",
      "completed": false,
      "user": "user-id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

**POST /api/todos**
- Deskripsi: Create todo baru
- Body:
  ```json
  {
    "title": "Belajar React"
  }
  ```
- Response: Object todo yang baru dibuat

**PUT /api/todos/:id**
- Deskripsi: Update todo
- Body:
  ```json
  {
    "title": "Belajar React Advanced",
    "completed": true
  }
  ```
- Response: Object todo yang sudah diupdate

**DELETE /api/todos/:id**
- Deskripsi: Hapus todo
- Response:
  ```json
  {
    "message": "Todo deleted successfully"
  }
  ```

### Health Check

**GET /health**
- Deskripsi: Simple health check
- Response:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456
  }
  ```

**GET /health-checks**
- Deskripsi: Detailed health check (cek database, memory, env variables)
- Response: Object dengan detail health status

## Troubleshooting

### Issue: MongoDB connection error

**Error:** `authentication failed`

**Penyebab:** Username atau password salah

**Solusi:**
1. Cek username dan password di MongoDB Atlas > Database Access
2. Pastikan connection string benar
3. Cek tidak ada special characters di password yang perlu di-encode

---

**Error:** `ENOTFOUND` atau `getaddrinfo`

**Penyebab:** Connection string salah atau cluster belum ready

**Solusi:**
1. Cek format connection string
2. Tunggu cluster selesai dibuat (3-5 menit)
3. Test koneksi internet

---

**Error:** `timeout` atau `MongoServerSelectionError`

**Penyebab:** IP tidak di-whitelist atau network blocking

**Solusi:**
1. Di MongoDB Atlas > Network Access, tambahkan IP `0.0.0.0/0`
2. Cek firewall tidak blocking port 27017
3. Cek antivirus tidak blocking koneksi

### Issue: JWT authentication error

**Error:** `Invalid token` atau `Authentication required`

**Penyebab:** 
- Token tidak ada atau salah
- JWT_SECRET berbeda
- Token expired

**Solusi:**
1. Pastikan JWT_SECRET sama di semua environment
2. Cek token dikirim di Authorization header dengan format: `Bearer <token>`
3. Login ulang untuk dapat token baru jika expired

### Issue: Vercel deployment failed

**Error:** `Project not found`

**Penyebab:** Project ID salah atau token tidak punya akses

**Solusi:**
1. Cek Project ID di Vercel Settings > General
2. Pastikan VERCEL_TOKEN valid dan punya akses ke project
3. Regenerate token jika perlu

---

**Error:** `pnpm not found`

**Solusi:**
Tambahkan di `vercel.json`:
```json
{
  "installCommand": "npm install -g pnpm && pnpm install"
}
```

---

**Error:** API error 500 di production

**Penyebab:** Environment variables tidak diset

**Solusi:**
1. Cek Vercel Functions logs
2. Pastikan MONGODB_URI dan JWT_SECRET diset di Vercel
3. Test connection string di local dulu

### Issue: CORS error

**Penyebab:** Backend tidak allow origin frontend

**Solusi:**
Backend sudah pakai middleware `cors()` tanpa restriction. Jika masih ada error:
1. Cek browser console untuk detail
2. Pastikan frontend dan backend sama-sama HTTPS atau HTTP

## Code Structure Explanation

### api/index.js
File ini adalah handler utama untuk Vercel Serverless Functions. Setiap request akan:
1. Connect ke MongoDB
2. Buat instance Express app baru
3. Handle request dengan Express

### src/app.js
File ini berisi konfigurasi Express app:
- Middleware (CORS, JSON parser)
- Routes
- Error handlers
- MongoDB connection helper

### src/models/
Berisi schema Mongoose untuk:
- **User.js**: Model untuk user dengan email dan password (password di-hash otomatis)
- **Todo.js**: Model untuk todo dengan title, completed status, dan relasi ke user

### src/routes/
Berisi route handlers:
- **auth.js**: Register dan login endpoints
- **todos.js**: CRUD endpoints untuk todos (protected dengan JWT)

### src/middleware/
Berisi middleware:
- **auth.js**: Middleware untuk verify JWT token dan protect routes

## Tips untuk Newbie

### Cara Kerja JWT Authentication

1. User register/login -> Server generate JWT token
2. Frontend simpan token (localStorage)
3. Setiap request ke protected endpoint, kirim token di Authorization header
4. Backend verify token -> jika valid, allow request
5. Token ada expiration (default 7 hari)

### Cara Kerja Mongoose Models

1. Define schema (struktur data)
2. Mongoose otomatis create collection di MongoDB
3. Pre-save hooks bisa jalankan function sebelum save (contoh: hash password)
4. Methods bisa ditambah untuk custom logic (contoh: comparePassword)

### Cara Kerja Vercel Serverless

1. Setiap request adalah function execution terpisah
2. Tidak ada state yang persistent antar request
3. Connection ke database harus dibuat per request (dengan caching)
4. Function ada timeout limit (30 detik untuk free tier)

## Resources

- [Express Documentation](https://expressjs.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT Documentation](https://jwt.io)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
