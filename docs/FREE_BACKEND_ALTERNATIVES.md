# Alternatif Free Backend Hosting (Tanpa Credit Card)

Dokumentasi alternatif platform hosting backend Node.js/Express yang benar-benar free tanpa requirement credit card.

## Platform Comparison

| Platform     | Free Tier  | CC Required | Docker | Auto-Deploy | CI/CD       | Best For       |
| ------------ | ---------- | ----------- | ------ | ----------- | ----------- | -------------- |
| **Back4app** | 256MB RAM  | ❌ No       | ✅ Yes | ✅ Yes      | ✅ Yes      | Container apps |
| **Netlify**  | 100GB      | ❌ No       | ❌ No  | ✅ Yes      | ✅ Built-in | Fullstack      |
| **Replit**   | Starter    | ❌ No       | ❌ No  | ✅ Yes      | ❌ Limited  | Learning/Dev   |
| **Genezio**  | 1GB RAM    | ✅ Yes      | ❌ No  | ✅ Yes      | ✅ Yes      | Serverless     |
| **Koyeb**    | 2 Services | ✅ Yes      | ✅ Yes | ✅ Yes      | ✅ Yes      | Docker apps    |
| **Fly.io**   | 3 VMs      | ✅ Yes      | ✅ Yes | ✅ Yes      | ✅ Yes      | Container apps |
| **Render**   | 750 hrs    | ✅ Yes      | ✅ Yes | ✅ Yes      | ✅ Yes      | Full apps      |
| **Railway**  | $5 credit  | ✅ Yes      | ✅ Yes | ✅ Yes      | ✅ Yes      | Full apps      |

**Note:** Cyclic.sh sudah shutdown. Genezio sekarang memerlukan credit card.

## Option 1: Netlify (Recommended - No CC, Built-in CI/CD, Fullstack)

### Keuntungan

- **100% Free** tanpa credit card
- **Built-in CI/CD** - Auto-deploy dari GitHub
- **Fullstack Support** - Frontend + Backend di satu platform
- **Serverless Functions** - Auto-scaling
- **Global CDN** - Fast global delivery
- **Perfect** untuk fullstack apps

### Keterbatasan

- **Serverless Only** - Perlu restructure Express ke serverless functions
- **Function-based** - Setiap route menjadi function terpisah
- **No Traditional Server** - Tidak bisa run Express server langsung

### Setup Netlify

#### Step 1: Create Account

1. Go to https://netlify.com
2. Sign up dengan GitHub account
3. No credit card required

#### Step 2: Restructure Express App

Netlify perlu Express app di-restructure menjadi serverless functions menggunakan `serverless-http`.

#### Step 3: Deploy

1. Connect GitHub repository
2. Set build settings
3. Add environment variables
4. Deploy

**Lihat dokumentasi lengkap:** [NETLIFY_BACKEND_SETUP.md](./NETLIFY_BACKEND_SETUP.md)

## Option 2: Genezio (Perlu CC - 1GB RAM, No Sleep, CI/CD)

**Note:** Genezio sekarang memerlukan credit card untuk verifikasi.

### Keuntungan

- **1GB RAM** free (paling besar)
- **No sleep** - aplikasi tidak akan sleep
- **100% Free** tanpa credit card
- **CI/CD Support** - Auto-deploy dari GitHub
- **Perfect** untuk Express apps

### Keterbatasan

- **No Docker** (serverless only)
- **Function-based** architecture

### Setup Genezio

#### Step 1: Create Account

1. Go to https://genezio.com
2. Sign up dengan GitHub
3. No credit card required

#### Step 2: Deploy

1. Connect GitHub repository
2. Genezio auto-detects Node.js
3. Set root directory: `apps/backend`
4. Auto-deploy

## Option 3: Replit (No CC, Online IDE, Limited CI/CD)

### Keuntungan

- **100% Free** tanpa credit card (Starter plan)
- **Online IDE** - Develop langsung di browser
- **Auto-Deploy** - Deploy otomatis saat run
- **Public URL** - Dapat public URL langsung
- **Perfect** untuk learning dan development
- **Multiple Languages** - Support banyak bahasa

### Keterbatasan

- **No Docker** support
- **512MB RAM** limit
- **Auto-Sleep** setelah inactivity (kecuali paid plan)
- **Public Repls** - Free tier repls bisa public
- **Limited CI/CD** - Tidak support CI/CD secara langsung (hanya via API)

### Setup Replit

#### Step 1: Create Account

1. Go to https://replit.com
2. Sign up dengan GitHub account atau email
3. No credit card required
4. Starter plan akan aktif otomatis

#### Step 2: Create New Repl

1. Click "Create Repl"
2. Select "Node.js" template
3. Name your repl: `todo-backend`
4. Click "Create Repl"

#### Step 3: Import dari GitHub (Optional)

1. Click "Create Repl"
2. Select "Import from GitHub"
3. Paste GitHub repository URL
4. Replit akan clone repository

#### Step 4: Configure Project

1. Set working directory ke `apps/backend` jika perlu
2. Update `package.json` dengan dependencies
3. Create `.env` file dengan environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret
   NODE_ENV=production
   PORT=3000
   ```

#### Step 5: Run & Deploy

1. Click "Run" button
2. Replit akan install dependencies dan run
3. Get public URL: `https://your-repl-name.username.repl.co`

**Lihat dokumentasi lengkap:** [REPLIT_SETUP.md](./REPLIT_SETUP.md)

## Option 4: Back4app Containers (No CC - Docker Support, CI/CD) ⭐ Recommended

**Back4app Containers** adalah platform container hosting dengan **Docker support** dan **CI/CD** yang **tidak memerlukan credit card**.

**Keuntungan Back4app:**

- ✅ **100% Free** tanpa credit card
- ✅ **Docker Support** - Full Docker support
- ✅ **CI/CD Support** - Auto-deploy dari GitHub
- ✅ **Container-based** - Perfect untuk containerized apps
- ✅ **Easy Setup** - Setup dalam hitungan menit

**Keterbatasan:**

- ⚠️ **256MB RAM** limit di free tier
- ⚠️ **Auto-sleep** setelah inactivity
- ⚠️ **1GB storage** limit

**Setup:**

1. Sign up di back4app.com (no credit card)
2. Go to "Containers" > "New Container"
3. Connect GitHub repository
4. Set root directory: `apps/backend`
5. Configure build settings (Dockerfile atau build command)
6. Add environment variables
7. Deploy

**Lihat dokumentasi lengkap:** [BACK4APP_SETUP.md](./BACK4APP_SETUP.md)

### Keuntungan

- **Free tier** tanpa credit card
- **Docker support** full
- **256MB RAM** free
- **Auto-deploy** dari GitHub
- **Container-based** deployment

### Keterbatasan

- **256MB RAM** limit
- **Limited** compute time
- **Auto-sleep** setelah inactivity

### Setup Back4app

#### Step 1: Create Account

1. Go to https://www.back4app.com
2. Sign up (no credit card)
3. Verify email

#### Step 2: Create Container

1. Dashboard > "Containers"
2. Click "New Container"
3. Connect GitHub repository
4. Select branch dan root directory: `apps/backend`

#### Step 3: Configure

- **Build Command:** `npm install`
- **Start Command:** `node src/index.js`
- **Port:** 3000 (atau dari env)

#### Step 4: Environment Variables

Add di Back4app dashboard:

```
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=production
PORT=3000
```

### Keuntungan

- **100% Free** tanpa credit card
- **Unlimited** deployments
- **No sleep** - aplikasi tidak akan sleep
- **Serverless** architecture
- **Auto-deploy** dari GitHub
- **Perfect** untuk Express apps

### Keterbatasan

- **No Docker** (serverless only)
- **Function-based** architecture
- **Cold starts** mungkin terjadi

### Setup Cyclic

#### Step 1: Create Account

1. Go to https://cyclic.sh
2. Sign up dengan GitHub
3. No credit card required

#### Step 2: Deploy

1. Connect GitHub repository
2. Cyclic auto-detects Node.js
3. Set root directory: `apps/backend`
4. Auto-deploy

#### Step 3: Environment Variables

Add di Cyclic dashboard:

```
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=production
```

### Keuntungan

- **100% Free** tanpa credit card
- **Unlimited** deployments
- **Serverless** architecture
- **Auto-deploy** dari GitHub
- **Perfect** untuk Express apps

### Keterbatasan

- **No Docker** (serverless only)
- **Cold starts** mungkin terjadi
- **Function-based** architecture

### Setup Cyclic

#### Step 1: Create Account

1. Go to https://cyclic.sh
2. Sign up dengan GitHub
3. No credit card required

#### Step 2: Deploy

1. Connect GitHub repository
2. Cyclic auto-detects Node.js
3. Set root directory: `apps/backend`
4. Auto-deploy

#### Step 3: Environment Variables

Add di Cyclic dashboard:

```
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=production
```

### Keuntungan

- **1GB RAM** free
- **No sleep** - aplikasi tidak akan sleep
- **Serverless** architecture
- **Auto-deploy** dari GitHub
- **Perfect** untuk Express apps

### Keterbatasan

- **No Docker** (serverless only)
- **Function-based** architecture

### Setup Genezio

#### Step 1: Create Account

1. Go to https://genezio.com
2. Sign up dengan GitHub
3. No credit card required

#### Step 2: Deploy

1. Connect GitHub repository
2. Genezio auto-detects Node.js
3. Set root directory: `apps/backend`
4. Auto-deploy

## Option 5: Fly.io (Perlu CC)

**Note:** Fly.io sekarang memerlukan credit card untuk verifikasi, meskipun free tier tersedia.

### Keuntungan

- **3 VMs** free
- **Docker support** full
- **No credit card** required
- **Global** edge network
- **Perfect** untuk containerized apps

### Keterbatasan

- **3 VMs** limit
- **160GB** outbound transfer
- **Need** Fly CLI untuk deploy

### Setup Fly.io

#### Step 1: Install Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

#### Step 2: Sign Up

```bash
fly auth signup
# Or via web: https://fly.io
```

#### Step 3: Deploy

```bash
cd apps/backend
fly launch
# Follow prompts
fly deploy
```

#### Step 4: Environment Variables

```bash
fly secrets set MONGODB_URI=...
fly secrets set JWT_SECRET=...
```

## Option 6: Koyeb (Perlu CC)

**Note:** Koyeb sekarang memerlukan credit card untuk verifikasi, meskipun free tier tersedia.

### Keuntungan

- **2 Services** free
- **Docker support**
- **Auto-deploy** dari GitHub
- **Global** edge network

### Keterbatasan

- **Credit card required** untuk verifikasi
- **2 services** limit
- **Auto-sleep** setelah inactivity

### Setup Koyeb

#### Step 1: Create Account

1. Go to https://www.koyeb.com
2. Sign up dengan GitHub
3. **Credit card required** untuk verifikasi

#### Step 2: Create Service

1. Dashboard > "Services"
2. "Create Service"
3. Connect GitHub repository
4. Set root directory: `apps/backend`

#### Step 3: Configure

- **Build:** Docker atau npm
- **Start:** `node src/index.js`
- **Port:** 3000

## Option 6: Vercel Serverless (No CC)

### Keuntungan

- **100% Free** tanpa credit card
- **Unlimited** deployments
- **Global** CDN
- **Perfect** untuk serverless

### Keterbatasan

- **Need restructure** Express ke serverless functions
- **No Docker** support
- **Function-based** architecture

### Setup Vercel Serverless

Lihat: [VERCEL_BACKEND_DEPLOYMENT.md](./VERCEL_BACKEND_DEPLOYMENT.md)

## Rekomendasi Berdasarkan Use Case

### Small Projects / Learning

**→ Replit**

- Online IDE, develop langsung di browser
- No CC required
- Perfect untuk belajar
- Limited CI/CD support

### Production Apps (No CC)

**→ Back4app atau Netlify**

- **Back4app:** Docker support, CI/CD support, no CC required ⭐ Recommended
- **Netlify:** Built-in CI/CD, fullstack support, perlu restructure ke serverless
- Both: No CC required

### Container Apps (No CC)

**→ Back4app** ⭐ Recommended

- Back4app: Docker support, CI/CD support, no CC required
- Perfect untuk containerized Express apps
- Easy setup dengan Dockerfile

### Full Free Stack (No CC)

**→ Back4app (Backend) + Vercel (Frontend) atau Netlify (Fullstack)**

- **Back4app:** Backend Express (Docker support, CI/CD) ⭐ Recommended
- **Vercel:** Frontend React (unlimited, perfect untuk React)
- **Netlify:** Fullstack (Frontend + Backend), built-in CI/CD, perlu restructure
- All: No CC required

## CI/CD Integration

### Netlify

Netlify memiliki **built-in CI/CD**:

- Auto-deploy dari GitHub
- Preview deployments untuk PR
- Branch deploys
- Deploy notifications

### Back4app

Back4app memiliki **built-in GitHub integration** untuk auto-deploy:

- Connect GitHub repository di container settings
- Enable Auto Deploy
- Back4app akan auto-deploy pada setiap push ke connected branch
- Atau bisa trigger via API (jika credentials tersedia)

### Replit

Replit **tidak support CI/CD secara langsung**. Bisa trigger deploy via API tapi tidak ideal untuk production CI/CD.

### Fly.io

```yaml
deploy-backend-fly:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: superfly/flyctl-actions/setup-flyctl@master
    - run: flyctl deploy --remote-only
      working-directory: apps/backend
      env:
        FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Cyclic

Cyclic auto-deploys dari GitHub.

### Back4app

Back4app auto-deploys dari GitHub dengan CI/CD support.

## Comparison Table: Free Tier Details

| Platform | RAM      | Storage   | Bandwidth | Sleep  | CC  | CI/CD       |
| -------- | -------- | --------- | --------- | ------ | --- | ----------- |
| Back4app | 256MB    | 1GB       | Unlimited | Yes    | ❌  | ✅ Yes      |
| Netlify  | 512MB    | Unlimited | 100GB     | No     | ❌  | ✅ Built-in |
| Replit   | 512MB    | Unlimited | Unlimited | Yes    | ❌  | ❌ Limited  |
| Genezio  | **1GB**  | 1GB       | Unlimited | **No** | ✅  | ✅ Yes      |
| Fly.io   | 256MB/VM | 3GB       | 160GB     | No     | ✅  | ✅ Yes      |
| Koyeb    | 512MB    | 1GB       | Unlimited | Yes    | ✅  | ✅ Yes      |

**Note:** Cyclic.sh sudah shutdown. Genezio sekarang memerlukan credit card.

## Troubleshooting

### Netlify Cold Starts

- Minimize dependencies
- Use connection pooling
- Keep functions warm dengan periodic requests

### Replit Auto-Sleep

- Use uptime monitoring (UptimeRobot)
- Or keep service active dengan periodic requests

### Fly.io Cold Starts

- Minimize dependencies
- Use connection pooling untuk database

### Back4app Limits

- Monitor RAM usage
- Optimize dependencies

## Best Practice: Multi-Platform Setup

Untuk maximum reliability tanpa CC:

1. **Primary:** Glitch atau Fly.io
2. **Backup:** Cyclic atau Back4app
3. **Frontend:** Vercel (always free)

## Kesimpulan

**Untuk deployment tanpa credit card:**

- **Best Docker + CI/CD:** Back4app (Docker support, CI/CD support) ⭐ Recommended
- **Best CI/CD + Fullstack:** Netlify (built-in CI/CD, fullstack support)
- **Online IDE:** Replit (develop di browser, limited CI/CD)

**Rekomendasi berdasarkan kebutuhan:**

- **Production dengan CI/CD + Docker:** Back4app (Docker support, CI/CD) ⭐ Best Choice
- **Production dengan CI/CD + Fullstack:** Netlify (built-in CI/CD, fullstack, perlu restructure)
- **Docker Apps:** Back4app (Docker support, CI/CD) ⭐ Recommended
- **Learning/Quick Setup:** Replit (online IDE, tapi limited CI/CD)

**Platform yang perlu credit card:**

- Genezio (perlu CC untuk verifikasi)
- Fly.io (perlu CC untuk verifikasi)
- Koyeb (perlu CC untuk verifikasi)
- Render (perlu CC untuk verifikasi)
- Railway (perlu CC untuk verifikasi)

**Platform yang sudah tidak tersedia:**

- Cyclic.sh (shutdown)
- Glitch (shutdown)

**Platform yang masih tersedia tanpa credit card:**

- **Back4app** ⭐ (Docker support, CI/CD) - Recommended
- **Netlify** (Fullstack, built-in CI/CD, perlu restructure)
- **Replit** (Online IDE, limited CI/CD)
