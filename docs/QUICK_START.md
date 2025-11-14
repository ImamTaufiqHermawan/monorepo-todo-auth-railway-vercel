# Quick Start Guide

Panduan cepat untuk menjalankan dan deploy aplikasi Todo.

## Local Development

### 1. Clone Repository

```bash
git clone <repository-url>
cd monorepo-todo-auth-railway-vercel
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

**Backend:**
```bash
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env dengan MongoDB URI dan JWT secret
```

**Frontend:**
```bash
cp apps/frontend/.env.example apps/frontend/.env
# Edit apps/frontend/.env dengan backend URL
```

### 4. Run Development Servers

```bash
# Run semua services
pnpm dev

# Atau run individually
pnpm --filter backend dev
pnpm --filter frontend dev
```

### 5. Access Application

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## Docker Development

### 1. Setup Environment

```bash
# Create .env file di root
cp .env.example .env
# Edit dengan MongoDB URI dan secrets
```

### 2. Run with Docker Compose

```bash
docker-compose up -d
```

### 3. Access Application

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## Deployment

### Railway (Backend)

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up dengan GitHub

2. **Create Project:**
   - New Project > Deploy from GitHub
   - Select repository
   - Railway auto-detects Dockerfile

3. **Configure Service:**
   - Set root directory: `apps/backend`
   - Add environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `NODE_ENV=production`

4. **Deploy:**
   - Railway auto-deploys dari main branch
   - Get public URL dari dashboard

### Vercel (Frontend)

1. **Create Vercel Account:**
   - Go to https://vercel.com
   - Sign up dengan GitHub

2. **Import Project:**
   - Add New Project
   - Import dari GitHub
   - Select repository

3. **Configure:**
   - Root Directory: `apps/frontend`
   - Framework: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`

4. **Environment Variables:**
   - `VITE_API_URL`: Railway backend URL

5. **Deploy:**
   - Click Deploy
   - Get public URL

## CI/CD Setup

### GitHub Secrets

Add secrets di GitHub (Settings > Secrets):

**Railway:**
- `RAILWAY_TOKEN`: Railway auth token
- `RAILWAY_PROJECT_ID`: Railway project ID
- `RAILWAY_BACKEND_URL`: Railway backend URL

**Vercel:**
- `VERCEL_TOKEN`: Vercel auth token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### Workflow

CI/CD akan:
- Run tests pada setiap push
- Deploy backend ke Railway (main branch)
- Deploy frontend ke Vercel (main branch)

## Testing

### Run Tests

```bash
# All tests
pnpm test

# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e
```

## Troubleshooting

### Backend Issues

**Port conflicts:**
- Change PORT di .env
- Check if port is already in use

**Database connection:**
- Verify MONGODB_URI
- Check MongoDB Atlas IP whitelist
- Ensure network access

### Frontend Issues

**Build errors:**
- Check Node version (22+)
- Clear node_modules dan reinstall
- Check environment variables

**API connection:**
- Verify VITE_API_URL
- Check CORS settings
- Ensure backend is running

## Next Steps

1. Setup MongoDB Atlas cluster
2. Configure Railway deployment
3. Configure Vercel deployment
4. Setup CI/CD secrets
5. Test deployment
6. Monitor applications

## Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

