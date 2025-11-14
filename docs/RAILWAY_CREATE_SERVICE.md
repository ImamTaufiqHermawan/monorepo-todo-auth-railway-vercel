# Cara Membuat Service Backend di Railway

Panduan step-by-step untuk membuat service backend di Railway project.

## Situasi

Setelah membuat project baru di Railway, biasanya hanya ada opsi untuk create database. Untuk deploy aplikasi backend, kita perlu create service terlebih dahulu.

## Cara Membuat Service Backend

### Method 1: Deploy dari GitHub Repository (Recommended)

**Langkah-langkah:**

1. **Buka Project di Railway Dashboard**
   - Login ke https://railway.app
   - Pilih project yang sudah dibuat

2. **Add New Service**
   - Di project dashboard, cari tombol "New" atau "+" (biasanya di bagian atas atau sidebar)
   - Klik tombol tersebut

3. **Pilih Source**
   - Pilih "GitHub Repo" atau "Deploy from GitHub repo"
   - Jika belum connect GitHub, akan diminta authorize Railway untuk access GitHub

4. **Pilih Repository**
   - Pilih repository yang berisi project monorepo Anda
   - Railway akan scan repository

5. **Configure Service**
   - Railway akan detect services atau menawarkan untuk create service
   - Jika belum ada service, pilih "Create Service" atau "Add Service"
   - Set name: "backend"
   - Set root directory: `apps/backend`
   - Railway akan auto-detect Dockerfile

6. **Deploy**
   - Railway akan otomatis build dan deploy
   - Monitor deployment di dashboard

### Method 2: Create Empty Service dan Connect GitHub

**Langkah-langkah:**

1. **Buka Project di Railway Dashboard**
   - Login ke Railway
   - Pilih project

2. **Add Empty Service**
   - Klik "New" atau "+" button
   - Pilih "Empty Service" atau "Dockerfile"
   - Service baru akan dibuat dengan nama default (misalnya "web")

3. **Rename Service (Optional)**
   - Klik pada service
   - Go to Settings
   - Rename menjadi "backend"

4. **Connect to GitHub**
   - Di service settings, cari bagian "Source" atau "Repository"
   - Klik "Connect Repository" atau "Link GitHub Repo"
   - Pilih repository yang berisi project
   - Set root directory: `apps/backend`

5. **Configure Build Settings**
   - Railway akan auto-detect Dockerfile
   - Atau set manual:
     - **Dockerfile Path:** `apps/backend/Dockerfile`
     - **Start Command:** `node src/index.js`

6. **Deploy**
   - Railway akan build dan deploy otomatis

### Method 3: Deploy dengan Railway CLI

**Langkah-langkah:**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Link Project**
   ```bash
   # Di root project directory
   railway link
   # Pilih project yang sudah dibuat
   ```

4. **Create Service**
   ```bash
   # Masuk ke backend directory
   cd apps/backend
   
   # Deploy (akan create service jika belum ada)
   railway up
   ```

5. **Configure di Dashboard**
   - Buka Railway dashboard
   - Service akan muncul di project
   - Configure environment variables di service settings

## Troubleshooting

### Tidak Ada Tombol "New" atau "+"

- Pastikan Anda adalah owner atau memiliki permission untuk create service
- Refresh halaman
- Coba buka project dari dashboard utama

### Service Tidak Terdeteksi dari GitHub

- Pastikan repository sudah di-connect ke Railway
- Pastikan Dockerfile ada di `apps/backend/Dockerfile`
- Coba create service manual (Method 2)

### Build Gagal

- Pastikan Dockerfile valid
- Check logs di Railway dashboard
- Pastikan root directory benar: `apps/backend`
- Pastikan start command benar: `node src/index.js`

### Service ID Tidak Ditemukan

- Setelah service dibuat, Service ID akan muncul di:
  - Service Settings (scroll ke bawah)
  - URL browser (setelah `/service/`)
  - Railway CLI: `railway service`

## Tips

1. **Gunakan Method 1** jika repository sudah di-connect ke Railway
2. **Gunakan Method 2** jika ingin lebih control atas service creation
3. **Gunakan Method 3** jika lebih nyaman dengan CLI
4. **Set Root Directory** dengan benar: `apps/backend` untuk monorepo
5. **Monitor First Deployment** untuk memastikan tidak ada error

## Setelah Service Dibuat

1. **Get Service ID** (untuk CI/CD)
   - Dari Service Settings
   - Dari URL browser
   - Dari Railway CLI

2. **Configure Environment Variables**
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV=production

3. **Test Deployment**
   - Check logs
   - Test health endpoint
   - Verify service running

## Next Steps

Setelah service backend dibuat dan berjalan:
1. Get Service ID untuk CI/CD
2. Configure environment variables
3. Test deployment
4. Setup CI/CD pipeline
5. Deploy frontend ke Vercel

