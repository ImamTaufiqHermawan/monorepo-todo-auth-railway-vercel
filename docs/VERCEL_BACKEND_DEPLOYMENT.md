# Deploy Backend ke Vercel (Serverless Functions)

Vercel mendukung deployment backend Node.js/Express menggunakan Serverless Functions. Ini adalah alternatif untuk Railway jika Railway free tier terbatas.

## Vercel untuk Backend

### Konsep Vercel Serverless Functions

Vercel menggunakan serverless functions untuk menjalankan backend code:
- Setiap route menjadi serverless function
- Auto-scaling
- Pay-per-use
- Free tier yang generous

### Free Tier Vercel

- **100GB bandwidth** per month
- **100GB-hours** function execution
- **Unlimited** deployments
- Perfect untuk small to medium applications

## Setup Backend di Vercel

### Option 1: Express sebagai Serverless Function

Vercel dapat menjalankan Express app sebagai serverless function dengan adapter.

### Option 2: API Routes (Recommended untuk Vercel)

Restructure Express app menjadi Vercel API routes pattern.

## Alternatif Free Tier untuk Backend

Jika Vercel serverless functions tidak sesuai, berikut alternatif free tier:

### 1. Render (Recommended)

**Free Tier:**
- Free tier untuk web services
- 750 hours per month
- Auto-sleep after 15 minutes inactivity
- Perfect untuk backend Node.js

**Setup:**
1. Sign up di https://render.com
2. Connect GitHub repository
3. Create new Web Service
4. Set root directory: `apps/backend`
5. Build command: (auto dari Dockerfile atau npm install)
6. Start command: `node src/index.js`

**Keuntungan:**
- Free tier tersedia
- Docker support
- Auto-deploy dari GitHub
- Environment variables management

### 2. Fly.io

**Free Tier:**
- 3 shared-cpu VMs
- 3GB persistent volumes
- 160GB outbound data transfer
- Perfect untuk containerized apps

**Setup:**
1. Sign up di https://fly.io
2. Install Fly CLI
3. Deploy dengan Dockerfile

### 3. Railway (Dengan Batasan)

**Free Tier:**
- $5 credit per month
- 500 hours compute time
- Terbatas untuk database di free trial
- Perlu upgrade untuk service deployment

### 4. Render vs Railway vs Vercel

| Platform | Free Tier | Backend Support | Docker | Auto-Deploy |
|----------|-----------|-----------------|--------|-------------|
| **Render** | 750 hours/month | Yes | Yes | Yes |
| **Railway** | $5 credit/month | Limited | Yes | Yes |
| **Vercel** | 100GB-hours | Serverless only | No | Yes |
| **Fly.io** | 3 VMs | Yes | Yes | Yes |

## Rekomendasi Setup

### Setup 1: Render (Backend) + Vercel (Frontend)

**Backend di Render:**
- Free tier available
- Docker support
- Auto-deploy dari GitHub
- Perfect untuk Express apps

**Frontend di Vercel:**
- Free tier
- Global CDN
- Perfect untuk React apps

### Setup 2: Vercel (Fullstack dengan Serverless)

**Backend sebagai Serverless Functions:**
- Restructure Express ke Vercel API routes
- Semua di Vercel (free tier)
- Simpler deployment

**Frontend di Vercel:**
- Same platform
- Easy integration

## Migrasi ke Render

Jika ingin menggunakan Render untuk backend:

### Step 1: Setup Render Account

1. Sign up di https://render.com
2. Connect GitHub account

### Step 2: Create Web Service

1. Click "New +" > "Web Service"
2. Connect repository
3. Configure:
   - **Name:** todo-backend
   - **Root Directory:** `apps/backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`

### Step 3: Environment Variables

Add environment variables di Render dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `PORT` (Render sets automatically)

### Step 4: Deploy

Render akan auto-deploy dari GitHub.

## Update CI/CD untuk Render

Update GitHub Actions workflow untuk deploy ke Render:

```yaml
deploy-backend-render:
  name: Deploy Backend to Render
  needs: build-backend
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  steps:
    - uses: actions/checkout@v4
    - name: Trigger Render Deploy
      run: |
        curl -X POST "https://api.render.com/deploy/srv/${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}"
```

## Kesimpulan

**Untuk Free Tier Fullstack:**
- **Backend:** Render (750 hours/month free)
- **Frontend:** Vercel (unlimited free)
- **Database:** MongoDB Atlas (512MB free)

Ini adalah kombinasi terbaik untuk free tier deployment.

