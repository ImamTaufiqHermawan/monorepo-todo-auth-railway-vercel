# Troubleshooting Vercel Deployment Issues

## Issue: Backend URL Shows Frontend App

**Problem:** Backend URL di Vercel menampilkan aplikasi frontend, bukan API backend.

**Root Cause:**

- Root `vercel.json` di root project berisi konfigurasi frontend
- Root directory di Vercel project settings tidak di-set dengan benar
- Frontend dan backend menggunakan root directory yang sama

**Solution:**

1. Hapus root `vercel.json` (tidak diperlukan)
2. Set root directory di Vercel project settings:
   - Backend Project: `apps/backend`
   - Frontend Project: `apps/frontend`
3. Pastikan `apps/backend/vercel.json` dan `apps/frontend/vercel.json` ada dan benar

## Issue: Backend "No entrypoint found"

**Problem:** Vercel tidak menemukan entrypoint untuk serverless function.

**Root Cause:**

- Vercel menjalankan build command dari root monorepo
- `builds` configuration tidak dibaca dengan benar
- Root directory tidak di-set dengan benar

**Solution:**

1. Pastikan root directory di Vercel project settings: `apps/backend`
2. Pastikan `apps/backend/api/index.js` ada
3. Pastikan `apps/backend/vercel.json` memiliki `builds` configuration:
   ```json
   {
     "builds": [
       {
         "src": "api/index.js",
         "use": "@vercel/node"
       }
     ]
   }
   ```
4. Pastikan install command menginstall dependencies dari root monorepo

## Issue: Frontend "vite: command not found"

**Problem:** Build command tidak menemukan vite command.

**Root Cause:**

- Build command dijalankan dari `apps/frontend` tanpa akses ke dependencies
- Dependencies terinstall di root monorepo, bukan di `apps/frontend`

**Solution:**

1. Update build command di `apps/frontend/vercel.json`:
   ```json
   {
     "buildCommand": "cd ../.. && pnpm --filter @todo/frontend build"
   }
   ```
2. Pastikan install command menginstall dependencies dari root monorepo:
   ```json
   {
     "installCommand": "cd ../.. && pnpm install --frozen-lockfile"
   }
   ```

## Issue: Frontend Build Stuck

**Problem:** Frontend build stuck atau tidak selesai.

**Root Cause:**

- Build command tidak selesai
- Dependencies tidak terinstall dengan benar
- Output directory tidak ditemukan

**Solution:**

1. Pastikan build command benar:
   ```json
   {
     "buildCommand": "cd ../.. && pnpm --filter @todo/frontend build"
   }
   ```
2. Pastikan output directory benar (relatif dari root directory):
   ```json
   {
     "outputDirectory": "dist"
   }
   ```
3. Pastikan install command menginstall dependencies dengan benar

## Issue: Backend "No entrypoint found" setelah Build

**Problem:** Vercel tidak menemukan entrypoint setelah build selesai, meskipun build berhasil.

**Root Cause:**

- Vercel menjalankan `pnpm run build` dari root monorepo (karena install command mengubah directory ke root)
- Setelah build selesai, Vercel mencari entrypoint tapi tidak menemukan karena `builds` configuration tidak dibaca dengan benar
- Root directory di Vercel project settings mungkin tidak di-set dengan benar

**Solution:**

1. Pastikan root directory di Vercel Dashboard: `apps/backend`
2. Pastikan `apps/backend/vercel.json` tidak memiliki `buildCommand` (atau kosong)
3. Pastikan `apps/backend/api/index.js` ada
4. **IMPORTANT:** Di Vercel Dashboard > Backend Project > Settings > General:
   - **Root Directory:** `apps/backend`
   - **Build Command:** KOSONGKAN (biarkan kosong) - JANGAN set ke `pnpm run build`
   - **Output Directory:** KOSONGKAN (biarkan kosong)
   - **Install Command:** `cd ../.. && pnpm install --frozen-lockfile`

## Issue: Frontend "No Output Directory named 'dist' found"

**Problem:** Vercel tidak menemukan output directory setelah build selesai, meskipun build berhasil.

**Root Cause:**

- Build command dijalankan dari root monorepo, output ada di `apps/frontend/dist`
- Tapi Vercel mencari di `dist` relatif dari root directory `apps/frontend`
- Output directory tidak ditemukan karena path tidak sesuai

**Solution:**

1. Pastikan root directory di Vercel Dashboard: `apps/frontend`
2. **IMPORTANT:** Di Vercel Dashboard > Frontend Project > Settings > General:
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `cd ../.. && pnpm --filter @todo/frontend build`
   - **Output Directory:** `dist`
   - **Install Command:** `cd ../.. && pnpm install --frozen-lockfile`

## Manual Fix di Vercel Dashboard

Jika masalah masih terjadi, lakukan manual fix di Vercel Dashboard:

### Backend Project:

1. Go to Vercel Dashboard > Backend Project > Settings > General
2. Set **Root Directory:** `apps/backend`
3. **Build Command:** KOSONGKAN (hapus semua isinya, biarkan kosong)
4. **Output Directory:** KOSONGKAN (hapus semua isinya, biarkan kosong)
5. **Install Command:** `cd ../.. && pnpm install --frozen-lockfile`
6. Go to Settings > Git
7. **Disable Auto Deploy** untuk main branch
8. Redeploy project

### Frontend Project:

1. Go to Vercel Dashboard > Frontend Project > Settings > General
2. Set **Root Directory:** `apps/frontend`
3. **Build Command:** `cd ../.. && pnpm --filter @todo/frontend build`
4. **Output Directory:** `dist`
5. **Install Command:** `cd ../.. && pnpm install --frozen-lockfile`
6. Go to Settings > Git
7. **Disable Auto Deploy** untuk main branch
8. Redeploy project

## Verify Configuration

Setelah fix, verify:

1. Backend URL harus menampilkan API (bukan frontend)
2. Frontend URL harus menampilkan React app
3. Backend API endpoints harus accessible
4. Frontend dapat connect ke backend API
