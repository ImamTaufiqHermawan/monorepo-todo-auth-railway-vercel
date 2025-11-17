# Backend - Todo API (Vercel Serverless)

Express.js REST API untuk Todo application dengan authentication, deployed sebagai Vercel Serverless Functions.

## 🚀 Features

- ✅ RESTful API dengan Express 5
- ✅ JWT Authentication
- ✅ MongoDB dengan Mongoose
- ✅ Swagger/OpenAPI Documentation
- ✅ Serverless Functions (Vercel)
- ✅ Health Check Endpoints
- ✅ Input Validation
- ✅ Error Handling

## 📁 Project Structure

```
backend/
├── api/
│   └── index.js              # Vercel serverless function wrapper
├── src/
│   ├── app.js                # Express app configuration
│   ├── index.js              # Server entry point (for local dev)
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── todos.js          # Todo CRUD routes
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── Todo.js           # Todo model
│   └── middleware/
│       └── auth.js           # JWT authentication middleware
├── vercel.json               # Vercel configuration
├── .env.example              # Environment variables template
└── package.json
```

## 🛠 Tech Stack

- **Node.js 22** - Runtime
- **Express 5** - Web framework
- **MongoDB + Mongoose** - Database & ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Swagger/OpenAPI** - API documentation
- **serverless-http** - Serverless adapter

## ⚙️ Environment Variables

Copy `.env.example` ke `.env` dan isi dengan values Anda:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
# Get from MongoDB Atlas: https://cloud.mongodb.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo?retryWrites=true&w=majority

# JWT Configuration
# Generate strong secret: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRES_IN=7d

# API URL (optional, for Swagger docs)
# API_URL=http://localhost:3001
```

### Environment Variables untuk Vercel

Set di Vercel Project > Settings > Environment Variables:

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key (min 32 characters)

**Optional:**
- `JWT_EXPIRES_IN` - JWT expiration (default: `7d`)
- `NODE_ENV` - Environment (default: `production`)
- `API_URL` - API URL untuk Swagger docs

## 🚀 Local Development

### Prerequisites

- Node.js 22+
- MongoDB Atlas account (Free Tier)
- pnpm (atau npm)

### Setup

```bash
# Install dependencies
pnpm install

# Kalau gak bisa run diatas, lakukan dulu 
npm install -g pnpm

# Copy environment file
cp .env.example .env

# Edit .env dengan MongoDB URI dan JWT secret
```

### Run Development Server

```bash
# Run dengan watch mode
pnpm dev

# Server akan berjalan di http://localhost:3001
```

### Access

- **API:** http://localhost:3001
- **API Docs:** http://localhost:3001/api-docs
- **Health Check:** http://localhost:3001/health

## 📚 API Endpoints

### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

### Todos (Protected - Requires JWT)

**Get All Todos**
```http
GET /api/todos
Authorization: Bearer <jwt-token>
```

**Create Todo**
```http
POST /api/todos
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "My Todo",
  "description": "Todo description",
  "completed": false
}
```

**Get Todo by ID**
```http
GET /api/todos/:id
Authorization: Bearer <jwt-token>
```

**Update Todo**
```http
PUT /api/todos/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Todo",
  "completed": true
}
```

**Delete Todo**
```http
DELETE /api/todos/:id
Authorization: Bearer <jwt-token>
```

### Health Checks

**Simple Health Check**
```http
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

**Detailed Health Check**
```http
GET /health-checks

Response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "checks": {
    "api": { "status": "ok" },
    "database": { "status": "ok" },
    "memory": { "status": "ok", "used": 45.2, "total": 128.0 }
  }
}
```

## 🚀 Deployment ke Vercel

### Manual Deploy Pertama Kali

1. **Login ke Vercel:** https://vercel.com
2. **Add New Project** > Import dari GitHub
3. **Configure:**
   - Project Name: `your-repo-name-backend`
   - **Root Directory:** KOSONGKAN (biarkan kosong)
   - Framework: Other
4. **Environment Variables:**
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - JWT secret key
   - `JWT_EXPIRES_IN` - `7d` (optional)
5. **Settings > General:**
   - **Root Directory:** KOSONGKAN
   - **Auto Deploy:** DISABLE (matikan)
6. Deploy sekali manual
7. Copy **Project ID** dari Settings > General
8. Add ke GitHub Secrets: `VERCEL_BACKEND_PROJECT_ID`

### Vercel Configuration

File `vercel.json` mengkonfigurasi:
- Serverless function handler: `api/index.js`
- Routes: Semua `/api/*` routes ke serverless function
- Health check routes

### CI/CD Deployment

Setelah manual deploy pertama, CI/CD akan otomatis deploy via GitHub Actions:
- Push ke `main` branch → Auto deploy
- Workflow menggunakan `working-directory: ./apps/backend`

## 🔧 Development Scripts

```bash
# Development dengan watch mode
pnpm dev

# Start production server (untuk testing)
pnpm start

# Run tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration
```

## 📦 Dependencies

**Production:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `express-validator` - Input validation
- `swagger-jsdoc` - Swagger documentation
- `swagger-ui-express` - Swagger UI
- `serverless-http` - Serverless adapter

## 🗄 Database Schema

### User Model

```javascript
{
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Todo Model

```javascript
{
  title: String (required),
  description: String,
  completed: Boolean (default: false),
  user: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

1. User register/login → Get JWT token
2. Include token di header: `Authorization: Bearer <token>`
3. Middleware validates token
4. Extract user ID dari token
5. Attach user to request object
6. Routes can access `req.user`

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: Could not connect`

**Solutions:**
1. Verify `MONGODB_URI` di Vercel environment variables
2. Check MongoDB Atlas IP whitelist:
   - Go to MongoDB Atlas > Network Access
   - Add IP: `0.0.0.0/0` (allow from anywhere)
3. Verify database user credentials
4. Check connection string format

### JWT Authentication Error

**Error:** `Invalid token` atau `Token expired`

**Solutions:**
1. Verify `JWT_SECRET` di Vercel environment variables
2. Ensure JWT_SECRET is at least 32 characters
3. Check token expiration time
4. Verify token is sent in Authorization header

### Root Directory Error

**Error:** `The specified Root Directory does not exist`

**Solutions:**
1. Go to Vercel Project > Settings > General
2. Clear **Root Directory** field (biarkan kosong)
3. Save settings
4. Workflow menggunakan `working-directory` parameter

### Cold Start Issues

**Issue:** First request after inactivity is slow

**Solutions:**
- Normal untuk serverless functions
- Vercel keeps functions warm for active projects
- Consider using Vercel Pro untuk better cold start performance

## 📖 API Documentation

Swagger documentation tersedia di:
- **Local:** http://localhost:3001/api-docs
- **Production:** https://your-backend.vercel.app/api-docs

Documentation includes:
- All endpoints
- Request/response schemas
- Authentication requirements
- Example requests

## 🔗 Resources

- [Express Documentation](https://expressjs.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [JWT Best Practices](https://jwt.io/introduction)

