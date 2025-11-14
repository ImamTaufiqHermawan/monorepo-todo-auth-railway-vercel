# Deployment Guide - Railway + Vercel

Panduan lengkap untuk deployment aplikasi Todo ke Railway (Backend) dan Vercel (Frontend).

## Prerequisites

1. **MongoDB Atlas Account**
   - Sign up di https://www.mongodb.com/cloud/atlas
   - Create free cluster (M0)
   - Get connection string
   - Whitelist IP addresses (0.0.0.0/0 untuk development)

2. **Railway Account**
   - Sign up di https://railway.app
   - Connect GitHub account
   - Get Railway token untuk CI/CD

3. **Vercel Account**
   - Sign up di https://vercel.com
   - Connect GitHub account
   - Get Vercel tokens untuk CI/CD

## Backend Deployment - Railway

### Step 1: Setup Railway Project

1. Login ke Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose repository yang berisi project ini
5. Railway akan auto-detect Dockerfile

### Step 2: Configure Service

1. Railway akan create service dari root
2. Change service settings:
   - **Root Directory:** `apps/backend`
   - **Build Command:** (auto-detect dari Dockerfile)
   - **Start Command:** `node src/index.js`

### Step 3: Add Environment Variables

Di Railway dashboard, add environment variables:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
```

**Note:** Railway akan set `PORT` otomatis, tapi kita tetap set untuk konsistensi.

### Step 4: Deploy

1. Railway akan auto-deploy dari main branch
2. Wait for build to complete
3. Get public URL dari Railway dashboard
4. Test health endpoint: `https://your-app.railway.app/health`

### Step 5: Get Railway Tokens untuk CI/CD

1. Go to Railway dashboard
2. Click on your profile
3. Go to "Tokens"
4. Create new token
5. Copy token (save untuk GitHub Secrets)

Untuk Project ID:
1. Go to project settings
2. Copy Project ID

## Frontend Deployment - Vercel

### Step 1: Setup Vercel Project

1. Login ke Vercel dashboard
2. Click "Add New Project"
3. Import repository dari GitHub
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `pnpm build` (atau `npm run build`)
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install` (atau `npm install`)

### Step 2: Add Environment Variables

Di Vercel dashboard, add environment variables:

```
VITE_API_URL=https://your-backend.railway.app
```

**Important:** Ganti `your-backend.railway.app` dengan actual Railway backend URL.

### Step 3: Deploy

1. Click "Deploy"
2. Vercel akan build dan deploy
3. Get public URL dari Vercel dashboard
4. Test frontend: `https://your-app.vercel.app`

### Step 4: Get Vercel Tokens untuk CI/CD

1. Go to Vercel dashboard
2. Go to Settings > Tokens
3. Create new token
4. Copy token (save untuk GitHub Secrets)

Untuk Org ID dan Project ID:
1. Go to project settings
2. Copy Organization ID dan Project ID

## CI/CD Setup

### GitHub Secrets

Add secrets berikut di GitHub repository (Settings > Secrets and variables > Actions):

**Railway:**
- `RAILWAY_TOKEN`: Railway authentication token
- `RAILWAY_PROJECT_ID`: Railway project ID

**Vercel:**
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

**Backend URL (optional):**
- `RAILWAY_BACKEND_URL`: Railway backend URL (untuk frontend build)

### Workflow

CI/CD workflow akan:
1. Run tests pada setiap push
2. Build backend Docker image
3. Deploy backend ke Railway (main branch only)
4. Build frontend dengan backend URL
5. Deploy frontend ke Vercel (main branch only)

## Manual Deployment

### Railway (Backend)

**Using Railway CLI:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

**Using Docker:**

```bash
# Build image
docker build -t todo-backend ./apps/backend

# Tag for Railway registry (if using)
docker tag todo-backend railway.app/your-project/backend

# Push and deploy via Railway dashboard
```

### Vercel (Frontend)

**Using Vercel CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd apps/frontend
vercel --prod
```

## Environment Variables Management

### Railway

Railway menyediakan environment variables management di dashboard:
- Go to service settings
- Add/edit variables
- Variables akan di-inject ke container
- Changes require redeploy

### Vercel

Vercel environment variables:
- Go to project settings
- Add/edit variables per environment (Production, Preview, Development)
- Variables akan di-inject saat build time
- Changes require redeploy

## Monitoring

### Railway

- View logs di Railway dashboard
- Monitor resource usage
- Check deployment history
- Set up alerts

### Vercel

- View logs di Vercel dashboard
- Monitor analytics
- Check deployment history
- View performance metrics

## Troubleshooting

### Backend Issues

**Port Issues:**
- Railway sets PORT automatically
- Ensure app listens on `process.env.PORT || 3001`
- Check Railway logs untuk port conflicts

**Database Connection:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure network access is allowed

**Build Failures:**
- Check Dockerfile syntax
- Verify all dependencies in package.json
- Check Railway build logs

### Frontend Issues

**Build Failures:**
- Check Vite configuration
- Verify environment variables
- Check Vercel build logs

**API Connection:**
- Verify VITE_API_URL is correct
- Check CORS settings di backend
- Ensure backend is accessible

**Routing Issues:**
- Verify vercel.json rewrites configuration
- Check React Router setup
- Ensure SPA routing is configured

## Free Tier Limits

### Railway
- $5 credit per month
- 500 hours compute time
- Sufficient untuk small applications
- Auto-sleep after inactivity (wake on request)

### Vercel
- Unlimited deployments
- 100GB bandwidth per month
- Perfect untuk frontend
- Global CDN included

### MongoDB Atlas
- 512MB storage
- Shared cluster
- Sufficient untuk development dan small production

## Cost Optimization

1. **Railway:**
   - Use sleep on inactivity (free tier)
   - Monitor resource usage
   - Optimize Docker image size

2. **Vercel:**
   - Use edge caching
   - Optimize bundle size
   - Use static generation where possible

3. **MongoDB:**
   - Clean up old data
   - Use indexes efficiently
   - Monitor storage usage

## Next Steps

1. Setup custom domains (optional)
2. Configure monitoring dan alerts
3. Setup backup strategies
4. Implement CI/CD best practices
5. Optimize performance

