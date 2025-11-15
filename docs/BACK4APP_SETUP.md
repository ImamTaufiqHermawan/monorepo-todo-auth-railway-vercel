# Back4app Containers Setup Guide - Free Backend Hosting (No Credit Card)

Panduan lengkap setup backend Node.js/Express di Back4app Containers - platform free hosting dengan Docker support tanpa credit card requirement.

## Mengapa Back4app?

- ✅ **100% Free** - Tidak perlu credit card untuk free tier
- ✅ **Docker Support** - Full Docker support
- ✅ **CI/CD Support** - Auto-deploy dari GitHub
- ✅ **Container-based** - Perfect untuk containerized apps
- ✅ **256MB RAM** - Free tier available
- ✅ **Easy Setup** - Setup dalam hitungan menit

## Keterbatasan Back4app

- ⚠️ **256MB RAM** limit di free tier
- ⚠️ **Auto-sleep** setelah inactivity
- ⚠️ **Limited compute time** di free tier
- ⚠️ **1GB storage** limit

## Setup Back4app Containers

### Step 1: Create Back4app Account

1. Go to https://www.back4app.com
2. Sign up dengan GitHub account atau email
3. **No credit card required!**
4. Verify email jika diperlukan

### Step 2: Create Container

1. Di Back4app dashboard, click **"Containers"** di sidebar
2. Click **"New Container"** atau **"Create Container"**
3. Select **"From GitHub"** atau **"From Dockerfile"**

### Step 3: Connect GitHub Repository

#### Option 1: Deploy dari GitHub (Recommended)

1. Click **"From GitHub"**
2. Authorize Back4app untuk access GitHub
3. Select repository yang berisi project
4. Select branch (biasanya `main` atau `master`)
5. Set **Root Directory:** `apps/backend` (untuk monorepo)

#### Option 2: Deploy dari Dockerfile

1. Click **"From Dockerfile"**
2. Connect GitHub repository
3. Set Dockerfile path: `apps/backend/Dockerfile`
4. Set build context: `apps/backend`

### Step 4: Configure Container

#### Basic Settings

- **Container Name:** `todo-backend` atau nama lain
- **Region:** Pilih region terdekat (Singapore, US, dll)
- **Root Directory:** `apps/backend` (untuk monorepo)

#### Build Settings

Jika menggunakan Dockerfile:

- **Dockerfile Path:** `apps/backend/Dockerfile`
- **Build Context:** `apps/backend`

Jika tidak menggunakan Dockerfile:

- **Build Command:** `npm install`
- **Start Command:** `node src/index.js`
- **Port:** `3000` (atau dari environment variable)

### Step 5: Environment Variables ⚠️ **CRITICAL**

**Environment variables HARUS di-set sebelum deployment, atau aplikasi akan crash!**

Add environment variables di Back4app dashboard:

1. Di container settings, click **"Environment Variables"** atau **"Env Vars"**
2. Click **"Add Variable"** untuk setiap variable
3. Add variables berikut (semua **REQUIRED**):

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=3001
   ```

**Important Notes:**

- **MONGODB_URI**: **REQUIRED** - Get dari MongoDB Atlas (free tier available)

  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
  - Replace `username`, `password`, `cluster`, dan `database-name` dengan nilai Anda
  - **Tanpa ini, aplikasi akan crash saat startup!**

- **JWT_SECRET**: **REQUIRED** - Secret key untuk JWT token (min 32 characters)

  - Generate random string: `openssl rand -base64 32`
  - Atau gunakan online generator

- **JWT_EXPIRES_IN**: Optional (default: `7d`)

  - Format: `7d`, `24h`, `3600s`, dll

- **NODE_ENV**: Optional (default: `development`)

  - Set ke `production` untuk production

- **PORT**: Optional (default: `3001`)
  - Back4app mungkin set PORT otomatis, tapi kita set `3001` untuk konsistensi
  - **Pastikan PORT di environment variable sama dengan EXPOSE di Dockerfile!**

**Cara mendapatkan MONGODB_URI dari MongoDB Atlas:**

1. Login ke [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (free tier M0 available)
3. Click **"Connect"** pada cluster
4. Select **"Connect your application"**
5. Copy connection string
6. Replace `<password>` dengan password database user Anda
7. Replace `<dbname>` dengan nama database (misal: `todo`)

**⚠️ CRITICAL: Configure IP Whitelist di MongoDB Atlas**

**Ini adalah step yang SANGAT PENTING dan sering terlewat!**

MongoDB Atlas memblokir koneksi dari IP yang tidak ada di whitelist. Karena Back4app menggunakan dynamic IP addresses, kita perlu allow all IPs:

1. Di MongoDB Atlas dashboard, go to **"Network Access"** (sidebar kiri)
2. Click **"Add IP Address"** button
3. Click **"Allow Access from Anywhere"** button (akan set `0.0.0.0/0`)
   - **Atau** manually add: `0.0.0.0/0` dengan comment "Allow Back4app"
4. Click **"Confirm"**

**Note:**

- `0.0.0.0/0` berarti allow all IP addresses (untuk development/testing)
- Untuk production, lebih baik gunakan specific IP ranges jika diketahui
- Tapi untuk free tier dan testing, `0.0.0.0/0` adalah solusi yang praktis

**Tanpa step ini, aplikasi akan selalu gagal connect ke MongoDB dengan error:**

```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

### Step 6: Update Backend Code untuk Back4app

Pastikan backend code menggunakan environment variables:

```javascript
// src/index.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ... rest of your code

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Important:**

- Use `0.0.0.0` sebagai host (bukan `localhost`)
- Use `process.env.PORT` (Back4app sets this automatically)
- Back4app auto-loads environment variables

### Step 7: Dockerfile (Optional tapi Recommended)

Jika menggunakan Dockerfile, create di `apps/backend/Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "src/index.js"]
```

### Step 8: Deploy

1. Click **"Deploy"** atau **"Save"**
2. Back4app akan:
   - Build container dari Dockerfile atau build command
   - Install dependencies
   - Start application
   - Provide public URL

### Step 9: Get Public URL

Setelah deploy, Back4app akan provide:

- **Public URL:** `https://your-container-name.back4app.io`
- **Or custom domain** jika dikonfigurasi

## Back4app Auto-Deploy

### GitHub Integration

Back4app akan auto-deploy dari GitHub:

- Auto-deploy pada setiap push ke connected branch
- Manual deploy juga tersedia
- Deploy history tersedia di dashboard

### CI/CD Support

Back4app memiliki built-in CI/CD:

- Auto-deploy dari GitHub
- Build logs tersedia
- Deploy notifications

## Update Frontend untuk Back4app Backend

Update frontend `.env` atau Vercel environment variables:

```env
VITE_API_URL=https://your-container-name.back4app.io
```

## Back4app Container Settings

### Scaling

- **Free Tier:** 1 instance
- **Auto-scaling:** Available di paid tier
- **Manual scaling:** Available di paid tier

### Monitoring

- **Logs:** View logs di dashboard
- **Metrics:** CPU, Memory, Network
- **Health Checks:** Automatic health checks

### Environment Variables

- Add/edit di container settings
- Support multiple environments (dev, staging, prod)
- Secure storage

## Free Tier Limits

- **256MB RAM** per container
- **1GB storage**
- **Unlimited bandwidth** (dengan fair use)
- **Auto-sleep** setelah inactivity
- **1 container** per account (free tier)

## Troubleshooting

### Container Not Starting / Health Check Failing

**Gejala:** Container build berhasil, tapi health check gagal dengan error "no process is listening to the 3001 port"

**Penyebab Umum:**

1. **MONGODB_URI tidak di-set** ⚠️ **MOST COMMON**

   - **Solusi:** Set `MONGODB_URI` di Back4app environment variables
   - Aplikasi akan exit sebelum server start jika MongoDB connection gagal
   - Check logs di Back4app dashboard untuk error message

2. **MongoDB connection string salah**

   - **Solusi:** Verify format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
   - Pastikan username dan password benar
   - Pastikan IP whitelist di MongoDB Atlas sudah include `0.0.0.0/0` (allow all)

3. **Port mismatch**

   - **Solusi:** Pastikan `PORT` di environment variable sama dengan `EXPOSE` di Dockerfile (3001)
   - Atau biarkan Back4app set PORT otomatis dan update Dockerfile

4. **MongoDB Atlas IP whitelist** ⚠️ **VERY COMMON**
   - **Error:** `MongooseServerSelectionError: Could not connect to any servers... IP that isn't whitelisted`
   - **Solusi:**
     1. Go to MongoDB Atlas dashboard
     2. Click **"Network Access"** di sidebar
     3. Click **"Add IP Address"**
     4. Click **"Allow Access from Anywhere"** (sets `0.0.0.0/0`)
     5. Click **"Confirm"**
   - **Tanpa ini, aplikasi TIDAK AKAN BISA connect ke MongoDB!**

**Cara Debug:**

1. **Check logs di Back4app dashboard:**

   - Go to container > **"Logs"** tab
   - Look for error messages seperti:
     - `MongoDB connection error`
     - `MONGODB_URI not set`
     - `authentication failed`
     - `ENOTFOUND` atau `getaddrinfo`

2. **Verify environment variables:**

   - Go to container > **"Environment Variables"**
   - Pastikan semua required variables sudah di-set
   - Pastikan tidak ada typo (case-sensitive)

3. **Test MongoDB connection:**
   - Test connection string dengan MongoDB Compass atau `mongosh`
   - Pastikan credentials benar

**Error Messages dan Solusinya:**

| Error Message               | Penyebab                          | Solusi                                           |
| --------------------------- | --------------------------------- | ------------------------------------------------ |
| `MONGODB_URI not set`       | Environment variable tidak di-set | Set `MONGODB_URI` di Back4app                    |
| `authentication failed`     | Username/password salah           | Check MongoDB Atlas credentials                  |
| `ENOTFOUND` / `getaddrinfo` | Connection string format salah    | Verify format connection string                  |
| `timeout`                   | MongoDB unreachable               | Check IP whitelist, network, atau cluster status |
| `no process is listening`   | App crashed sebelum start         | Check logs untuk root cause (usually MongoDB)    |

### Container Build Fails

- Check build logs di Back4app dashboard
- Verify `package.json` dependencies
- Check Dockerfile syntax
- Verify build context path (`apps/backend`)

### Auto-Sleep Issues

- Use uptime monitoring (UptimeRobot)
- Or keep service active dengan periodic requests
- Accept cold starts (first request might be slow)

### Build Failures

- Check build logs di dashboard
- Verify build command
- Check dependencies
- Verify Dockerfile syntax (jika menggunakan)

### Port Issues

- Use `process.env.PORT` (Back4app sets automatically)
- Don't hardcode port numbers
- Use `0.0.0.0` sebagai host

### Memory Issues

- Monitor RAM usage di dashboard
- Optimize dependencies
- Remove unused packages
- Consider upgrade jika perlu lebih banyak RAM

## Best Practices untuk Back4app

1. **Use Dockerfile:** Recommended untuk consistent builds
2. **Use Environment Variables:** Never hardcode secrets
3. **Optimize Dependencies:** Minimize package size
4. **Handle Auto-Sleep:** Use uptime monitoring
5. **Monitor Logs:** Check logs regularly
6. **Use Health Endpoint:** Create `/health` endpoint
7. **Optimize Memory:** Stay under 256MB RAM limit

## Back4app vs Other Platforms

| Feature         | Back4app | Netlify        | Cyclic | Genezio | Replit     |
| --------------- | -------- | -------------- | ------ | ------- | ---------- |
| Free Tier       | ✅ Yes   | ✅ Yes         | ✅ Yes | ✅ Yes  | ✅ Yes     |
| CC Required     | ❌ No    | ❌ No          | ❌ No  | ❌ No   | ❌ No      |
| Docker          | ✅ Yes   | ❌ No          | ❌ No  | ❌ No   | ❌ No      |
| CI/CD           | ✅ Yes   | ✅ Built-in    | ✅ Yes | ✅ Yes  | ❌ Limited |
| RAM             | 256MB    | 512MB          | 512MB  | 1GB     | 512MB      |
| Sleep           | Yes      | No             | No     | No      | Yes        |
| Express Support | ✅ Yes   | ⚠️ Restructure | ✅ Yes | ✅ Yes  | ✅ Yes     |

## Migration dari Platform Lain ke Back4app

1. Create Back4app account
2. Create new Container
3. Connect GitHub repository
4. Set root directory: `apps/backend`
5. Configure build settings (Dockerfile atau build command)
6. Add environment variables
7. Deploy
8. Update frontend `VITE_API_URL` dengan Back4app URL
9. Setup uptime monitoring untuk prevent sleep

## CI/CD dengan GitHub Actions (Full Automation)

**Lihat panduan lengkap:** [GITHUB_ACTIONS_BACK4APP.md](./GITHUB_ACTIONS_BACK4APP.md)

Untuk full automation via GitHub Actions, hanya perlu provide:

1. `BACK4APP_API_KEY` - API key dari Back4app
2. `BACK4APP_CONTAINER_ID` - Container ID
3. `BACK4APP_BACKEND_URL` - Public URL (optional, untuk frontend)

Workflow sudah tersedia di `.github/workflows/ci-cd.yml` dan akan auto-deploy pada setiap push ke `main` branch.

## CI/CD dengan GitHub Actions (Manual Setup)

Back4app bisa di-deploy otomatis via GitHub Actions dengan API. Setup full automation:

### Step 1: Get Back4app API Key

1. Login ke Back4app dashboard
2. Go to **Account Settings** (click profile icon di top right)
3. Navigate ke **"API Keys"** section
4. Click **"Generate New API Key"**
5. Copy API key (simpan dengan aman, hanya muncul sekali)

### Step 2: Get Container ID

1. Di Back4app dashboard, go to **"Containers"**
2. Click pada container yang ingin di-deploy
3. Container ID ada di:
   - **URL:** `https://backend.back4app.com/apps/{CONTAINER_ID}/overview`
   - **Settings page:** Di bagian "Container Information"
   - **API:** Bisa diambil via API call

**Alternative: Get via API**

```bash
curl -X GET "https://api.back4app.com/containers" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Step 3: Add GitHub Secrets

Di GitHub repository, go to **Settings > Secrets and variables > Actions**, tambahkan:

- `BACK4APP_API_KEY` - API key dari Step 1
- `BACK4APP_CONTAINER_ID` - Container ID dari Step 2
- `BACK4APP_BACKEND_URL` - Public URL container (optional, untuk frontend build)

### Step 4: GitHub Actions Workflow

Workflow sudah tersedia di `.github/workflows/ci-cd.yml`:

```yaml
deploy-backend-back4app:
  name: Deploy Backend to Back4app
  needs: build-backend
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main' && secrets.BACK4APP_API_KEY != ''
  environment: production
  steps:
    - uses: actions/checkout@v4
    - name: Trigger Back4app Deploy
      run: |
        curl -X POST "https://api.back4app.com/containers/${{ secrets.BACK4APP_CONTAINER_ID }}/deploy" \
          -H "Authorization: Bearer ${{ secrets.BACK4APP_API_KEY }}" \
          -H "Content-Type: application/json" \
          -d '{"branch": "main", "rootDirectory": "apps/backend"}'
```

### Step 5: Test Deployment

1. Push perubahan ke `main` branch
2. GitHub Actions akan:
   - Run tests
   - Build Docker image
   - Trigger Back4app deployment
   - Deploy frontend ke Vercel

### Alternative: Back4app Auto-Deploy (Built-in)

Back4app juga punya built-in auto-deploy dari GitHub:

1. Di container settings, enable **"Auto Deploy"**
2. Select branch (biasanya `main`)
3. Back4app akan auto-deploy pada setiap push

**Note:** Untuk full control via GitHub Actions, gunakan API method di atas.

## Kesimpulan

Back4app adalah pilihan yang bagus untuk:

- ✅ **Free hosting** tanpa credit card
- ✅ **Docker support** untuk containerized apps
- ✅ **CI/CD support** dari GitHub
- ✅ **Easy setup** dalam hitungan menit
- ⚠️ **256MB RAM** limit (cukup untuk small to medium apps)

Perfect untuk deployment backend Express dengan Docker support tanpa requirement credit card!
