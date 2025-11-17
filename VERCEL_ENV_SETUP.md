# Vercel Environment Variables Setup

## Masalah: API Backend Loading Terus

Jika API backend hanya loading terus tanpa response, kemungkinan besar **Environment Variables belum di-set** di Vercel.

## Solusi: Set Environment Variables di Vercel

### 1. Buka Vercel Dashboard

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project backend Anda (misalnya: `monorepo-todo-auth-railway-vercel-backend`)

### 2. Set Environment Variables

1. Klik **Settings** di menu project
2. Klik **Environment Variables** di sidebar kiri
3. Tambahkan environment variables berikut:

#### Required Environment Variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/todo?retryWrites=true&w=majority` | MongoDB connection string (PENTING: harus include database name, contoh: `/todo`) |
| `JWT_SECRET` | `your-super-secret-jwt-key-min-32-characters-long` | JWT secret key (minimal 32 karakter) |

#### Cara Set:

1. Klik **Add New**
2. Masukkan **Name**: `MONGODB_URI`
3. Masukkan **Value**: MongoDB connection string Anda
4. Pilih **Environment**: 
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Klik **Save**

6. Ulangi untuk `JWT_SECRET`

### 3. Redeploy Project

Setelah set environment variables:

1. Klik **Deployments** di menu project
2. Klik **...** (three dots) pada deployment terbaru
3. Klik **Redeploy**
4. Atau push commit baru ke repository

### 4. Verifikasi

Setelah redeploy, test API:

1. Buka: `https://your-backend-url.vercel.app/health`
2. Seharusnya mendapat response:
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "uptime": ...
   }
   ```

3. Buka: `https://your-backend-url.vercel.app/`
4. Seharusnya mendapat response dengan informasi API

## Troubleshooting

### Masalah: Masih Loading

1. **Cek Logs di Vercel:**
   - Buka **Deployments** > Pilih deployment terbaru > **View Function Logs**
   - Cari error message tentang MongoDB connection

2. **Cek Environment Variables:**
   - Pastikan `MONGODB_URI` dan `JWT_SECRET` sudah di-set
   - Pastikan value-nya benar (tidak ada typo)
   - Pastikan sudah di-set untuk **Production** environment

3. **Cek MongoDB Connection String:**
   - Pastikan format benar: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - **PENTING**: Harus include database name setelah cluster URL (contoh: `/todo` atau `/your-db-name`)
   - Pastikan username dan password benar
   - Pastikan IP whitelist di MongoDB Atlas sudah include Vercel IPs (atau set ke `0.0.0.0/0` untuk development)
   - Contoh yang BENAR: `mongodb+srv://user:pass@cluster.mongodb.net/todo?retryWrites=true&w=majority`
   - Contoh yang SALAH: `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` (tidak ada database name)

4. **Test MongoDB Connection:**
   - Coba connect dari local dengan connection string yang sama
   - Pastikan MongoDB Atlas cluster sudah running

### Masalah: Error "MONGODB_URI environment variable is not set"

- Pastikan environment variable sudah di-set di Vercel Dashboard
- Pastikan sudah di-set untuk **Production** environment
- Redeploy project setelah set environment variables

### Masalah: Error "Authentication failed"

- Cek username dan password di MongoDB connection string
- Pastikan user di MongoDB Atlas memiliki permission yang benar
- Cek IP whitelist di MongoDB Atlas

## Catatan Penting

- Environment variables yang di-set di Vercel Dashboard **hanya berlaku untuk deployment baru**
- Setelah set environment variables, **harus redeploy** project
- Environment variables **case-sensitive** (huruf besar/kecil penting)
- Jangan commit environment variables ke Git (sudah ada di `.gitignore`)

