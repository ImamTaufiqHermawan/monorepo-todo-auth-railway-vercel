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
- Backend deployed ke Railway (Free Tier)
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
- Railway untuk backend hosting (Free Tier)
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
- Railway account (Free Tier)
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

### Railway (Backend)

Railway adalah platform yang mendukung deployment langsung dari GitHub dengan Docker support.

**Setup:**
1. Login ke Railway (railway.app)
2. Create new project
3. Connect GitHub repository
4. Add new service dari GitHub
5. Select backend folder atau Dockerfile
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (Railway akan set otomatis)
   - `NODE_ENV=production`

**Railway akan:**
- Auto-detect Dockerfile
- Build dan deploy otomatis
- Provide public URL
- Auto-redeploy pada push ke main branch

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

### Railway
- $5 credit per month (Free Tier)
- 500 hours compute time
- Sufficient untuk small to medium applications

### Vercel
- Unlimited deployments
- 100GB bandwidth per month
- Perfect untuk frontend applications

### MongoDB Atlas
- 512MB storage (Free Tier)
- Shared cluster
- Sufficient untuk development dan small production apps

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

