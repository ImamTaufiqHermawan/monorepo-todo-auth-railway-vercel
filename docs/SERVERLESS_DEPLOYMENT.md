# Serverless Deployment Guide - Netlify & Vercel

Panduan lengkap deployment aplikasi Express ke Netlify dan Vercel menggunakan serverless functions.

## Overview

Aplikasi sudah di-convert menjadi serverless-ready dan bisa di-deploy ke:
- **Netlify Functions** - Serverless functions dengan built-in CI/CD
- **Vercel Serverless Functions** - Serverless functions dengan global edge network

## Struktur File Serverless

### Todo App

```
apps/backend/
├── src/
│   ├── app.js              # Express app (serverless-ready)
│   ├── index.js            # Traditional server entry point
│   ├── routes/
│   ├── controllers/
│   └── models/
├── netlify/
│   └── functions/
│       └── api.js          # Netlify serverless wrapper
├── api/
│   └── index.js            # Vercel serverless wrapper
├── netlify.toml            # Netlify configuration
└── vercel.json             # Vercel configuration
```

### Health E-Commerce

```
finished-project/
├── app.js                  # Express app (serverless-ready)
├── server.js               # Traditional server entry point
├── netlify/
│   └── functions/
│       └── api.js          # Netlify serverless wrapper
├── api/
│   └── index.js            # Vercel serverless wrapper
├── netlify.toml            # Netlify configuration
└── vercel.json             # Vercel configuration
```

## Deployment ke Netlify

### Step 1: Install Dependencies

```bash
cd apps/backend  # atau finished-project untuk Health E-Commerce
npm install
```

### Step 2: Setup Netlify Account

1. Go to https://netlify.com
2. Sign up dengan GitHub account (recommended)
3. **No credit card required!**

### Step 3: Deploy dari GitHub (Recommended)

1. **Connect Repository:**
   - Di Netlify dashboard, click **"Add new site"** > **"Import an existing project"**
   - Connect GitHub repository
   - Select repository

2. **Configure Build Settings:**
   - **Base directory:** `apps/backend` (untuk Todo App) atau root (untuk Health E-Commerce)
   - **Build command:** `npm install` (atau `cd apps/backend && npm install`)
   - **Publish directory:** (leave empty)
   - **Functions directory:** `apps/backend/netlify/functions` (untuk Todo App) atau `netlify/functions` (untuk Health E-Commerce)

3. **Environment Variables:**
   - Go to **Site settings** > **Environment variables**
   - Add:
     ```
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
     JWT_SECRET=your-secret-key-here
     JWT_EXPIRES_IN=7d
     NODE_ENV=production
     API_URL=https://your-site.netlify.app
     ```

4. **Deploy:**
   - Click **"Deploy site"**
   - Netlify akan auto-deploy dari GitHub

### Step 4: Test Deployment

Setelah deploy, test endpoints:
- Health: `https://your-site.netlify.app/.netlify/functions/api/health`
- API: `https://your-site.netlify.app/.netlify/functions/api/api/auth/register`
- Swagger: `https://your-site.netlify.app/.netlify/functions/api/api-docs`

### Netlify Redirects

File `netlify.toml` sudah dikonfigurasi untuk redirect:
- `/api/*` → `/.netlify/functions/api/:splat`
- `/api-docs/*` → `/.netlify/functions/api/api-docs/:splat`
- `/health` → `/.netlify/functions/api/health`

Jadi bisa akses langsung:
- `https://your-site.netlify.app/api/auth/register`
- `https://your-site.netlify.app/api-docs`
- `https://your-site.netlify.app/health`

## Deployment ke Vercel

### Step 1: Install Dercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Setup Vercel Account

1. Go to https://vercel.com
2. Sign up dengan GitHub account (recommended)
3. **No credit card required!**

### Step 3: Deploy dari GitHub (Recommended)

1. **Connect Repository:**
   - Di Vercel dashboard, click **"Add New Project"**
   - Import GitHub repository
   - Select repository

2. **Configure Project:**
   - **Root Directory:** `apps/backend` (untuk Todo App) atau root (untuk Health E-Commerce)
   - **Framework Preset:** Other
   - **Build Command:** (leave empty atau `npm install`)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`

3. **Environment Variables:**
   - Add environment variables:
     ```
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
     JWT_SECRET=your-secret-key-here
     JWT_EXPIRES_IN=7d
     NODE_ENV=production
     ```

4. **Deploy:**
   - Click **"Deploy"**
   - Vercel akan auto-deploy dari GitHub

### Step 4: Test Deployment

Setelah deploy, test endpoints:
- Health: `https://your-site.vercel.app/health`
- API: `https://your-site.vercel.app/api/auth/register`
- Swagger: `https://your-site.vercel.app/api-docs`

### Vercel Routes

File `vercel.json` sudah dikonfigurasi untuk routing:
- `/api/*` → `/api/index.js`
- `/api-docs/*` → `/api/index.js`
- `/health` → `/api/index.js`

## Perbedaan Netlify vs Vercel

| Feature | Netlify | Vercel |
|---------|---------|--------|
| **Free Tier** | ✅ 100GB bandwidth | ✅ 100GB bandwidth |
| **Function Invocations** | 125,000/month | Unlimited |
| **Function Duration** | 10s (free), 26s (paid) | 10s (free), 60s (paid) |
| **Cold Start** | ~1-2s | ~0.5-1s |
| **CI/CD** | ✅ Built-in | ✅ Built-in |
| **Preview Deployments** | ✅ Yes | ✅ Yes |
| **Custom Domain** | ✅ Free | ✅ Free |
| **Environment Variables** | ✅ Yes | ✅ Yes |

## Important Notes

### MongoDB Connection

- **Connection Pooling:** MongoDB connection di-reuse untuk mengurangi cold start
- **Connection Timeout:** Set ke 10 seconds untuk serverless
- **Auto-reconnect:** Mongoose akan auto-reconnect jika connection terputus

### Rate Limiting

- **In-Memory Store:** Rate limiting menggunakan in-memory store
- **Not Shared:** Setiap serverless instance punya rate limit sendiri
- **Alternative:** Gunakan Redis untuk shared rate limiting (paid service)

### File Upload

- **Multer:** File upload dengan Multer tetap bekerja
- **Cloudinary:** Cloudinary upload tetap bekerja
- **Size Limit:** Check platform limits (Netlify: 6MB, Vercel: 4.5MB)

### Cold Starts

- **First Request:** Mungkin lambat (1-2 detik) karena cold start
- **Subsequent Requests:** Cepat karena function sudah warm
- **Keep Warm:** Gunakan uptime monitoring untuk keep functions warm

## Troubleshooting

### Function Timeout

**Error:** `Function execution exceeded timeout`

**Solution:**
- Optimize database queries
- Reduce function execution time
- Consider upgrading to paid tier untuk longer timeout

### MongoDB Connection Failed

**Error:** `Database connection failed`

**Solution:**
- Check `MONGODB_URI` environment variable
- Verify MongoDB Atlas IP whitelist (allow `0.0.0.0/0`)
- Check MongoDB connection string format

### CORS Issues

**Error:** `CORS policy blocked`

**Solution:**
- Update `ALLOWED_ORIGINS` environment variable
- Or set `cors({ origin: true })` untuk development

### Module Not Found

**Error:** `Cannot find module`

**Solution:**
- Check `netlify.toml` `included_files` configuration
- Verify all dependencies di `package.json`
- Check build logs untuk missing modules

## Best Practices

1. **Environment Variables:**
   - Never commit secrets ke repository
   - Use environment variables untuk semua sensitive data
   - Use different values untuk dev/staging/prod

2. **Error Handling:**
   - Always handle errors gracefully
   - Return proper HTTP status codes
   - Log errors untuk debugging

3. **Performance:**
   - Minimize dependencies
   - Use connection pooling
   - Cache frequently accessed data

4. **Security:**
   - Use HTTPS (automatic di Netlify/Vercel)
   - Validate all inputs
   - Use rate limiting
   - Sanitize user inputs

## Migration dari Traditional Server

Jika sudah punya traditional Express server:

1. **Separate App Creation:**
   - Move Express app creation ke `app.js`
   - Keep `server.js` untuk traditional deployment

2. **Create Serverless Wrappers:**
   - Create `netlify/functions/api.js` untuk Netlify
   - Create `api/index.js` untuk Vercel

3. **Update Configuration:**
   - Add `netlify.toml` untuk Netlify
   - Add `vercel.json` untuk Vercel

4. **Test Locally:**
   - Test traditional server: `npm start`
   - Test serverless: Use Netlify CLI atau Vercel CLI

## Local Development

### Traditional Server

```bash
npm start
# atau
node src/index.js  # Todo App
node server.js     # Health E-Commerce
```

### Netlify Functions (Local)

```bash
npm install -g netlify-cli
netlify dev
```

### Vercel Functions (Local)

```bash
npm install -g vercel
vercel dev
```

## CI/CD

### Netlify

- **Auto-deploy:** Automatic dari GitHub
- **Preview deployments:** Automatic untuk PR
- **Branch deploys:** Automatic untuk setiap branch

### Vercel

- **Auto-deploy:** Automatic dari GitHub
- **Preview deployments:** Automatic untuk PR
- **Branch deploys:** Automatic untuk setiap branch

## Free Tier Limits

### Netlify

- **100GB bandwidth** per month
- **300 build minutes** per month
- **125,000 function invocations** per month
- **100GB-hours** function execution

### Vercel

- **100GB bandwidth** per month
- **100GB-hours** function execution
- **Unlimited** function invocations
- **Unlimited** deployments

## Kesimpulan

Aplikasi sudah siap untuk deployment ke Netlify atau Vercel sebagai serverless functions. Perubahan code minimal karena hanya perlu wrap Express app dengan serverless handler. Semua routes, controllers, dan models tetap sama.

**Recommended Setup:**
- **Backend:** Netlify atau Vercel (serverless)
- **Frontend:** Netlify atau Vercel (static hosting)
- **Database:** MongoDB Atlas (free tier)

Perfect untuk fullstack deployment dengan free tier!

