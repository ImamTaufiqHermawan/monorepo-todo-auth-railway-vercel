# Back4app Troubleshooting Guide

Panduan lengkap troubleshooting deployment backend ke Back4app.

## Common Issues

### Issue 1: Container Not Starting / Health Check Failing

**Gejala:**
```
SYSTEM: it looks that no process is listening to the 3001 port using http
SYSTEM: The container exited before becoming healthy
SYSTEM: deployment failed
```

**Penyebab:**
Aplikasi crash sebelum server start, biasanya karena:
1. **MONGODB_URI tidak di-set** (90% kasus)
2. MongoDB connection gagal
3. Environment variables tidak lengkap

**Solusi:**

1. **Check logs di Back4app dashboard:**
   - Go to container > **"Logs"** tab
   - Scroll ke bagian error messages
   - Look for: `MongoDB connection error`, `MONGODB_URI not set`, dll

2. **Set environment variables:**
   - Go to container > **"Environment Variables"**
   - Add semua required variables:
     ```
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo
     JWT_SECRET=your-secret-key-here
     JWT_EXPIRES_IN=7d
     NODE_ENV=production
     PORT=3001
     ```

3. **Verify MongoDB connection:**
   - Test connection string dengan MongoDB Compass
   - Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0`)
   - Verify username dan password

4. **Redeploy:**
   - Setelah set environment variables, click **"Redeploy"** atau **"Deploy"**

### Issue 2: MongoDB Connection Error

**Error Messages:**
- `MongoServerError: Authentication failed`
- `MongoNetworkError: getaddrinfo ENOTFOUND`
- `MongoServerSelectionError: connection timed out`

**Solusi:**

1. **Authentication Failed:**
   - Check username dan password di `MONGODB_URI`
   - Verify database user exists di MongoDB Atlas
   - Reset password jika perlu

2. **ENOTFOUND / Connection String Format:**
   - Verify format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
   - Pastikan tidak ada space atau karakter khusus yang tidak di-escape
   - URL-encode password jika mengandung karakter khusus

3. **Connection Timeout:**
   - Check MongoDB Atlas IP whitelist
   - Add `0.0.0.0/0` untuk allow all IPs (untuk testing)
   - Check cluster status di MongoDB Atlas dashboard
   - Verify network connectivity

### Issue 3: Port Mismatch

**Gejala:**
- Health check mencari port yang berbeda
- Container start tapi tidak accessible

**Solusi:**

1. **Check PORT environment variable:**
   - Set `PORT=3001` di Back4app environment variables
   - Atau biarkan Back4app set otomatis dan update Dockerfile

2. **Verify Dockerfile:**
   ```dockerfile
   EXPOSE 3001
   ```
   - Pastikan EXPOSE port sama dengan PORT di environment variable

3. **Check Back4app container settings:**
   - Verify port configuration di container settings
   - Pastikan port match dengan aplikasi

### Issue 4: Build Fails

**Error Messages:**
- `npm install` fails
- Docker build fails
- Dependencies not found

**Solusi:**

1. **Check build logs:**
   - Go to container > **"Deployments"** > Click latest deployment
   - Check build logs untuk error details

2. **Verify package.json:**
   - Check dependencies di `apps/backend/package.json`
   - Verify Node.js version compatibility

3. **Check Dockerfile:**
   - Verify Dockerfile syntax
   - Check build context path
   - Verify COPY paths

4. **Monorepo issues:**
   - Pastikan root directory di-set: `apps/backend`
   - Verify build context includes semua files yang diperlukan

### Issue 5: Environment Variables Not Loading

**Gejala:**
- Aplikasi menggunakan default values
- Environment variables tidak terbaca

**Solusi:**

1. **Verify variable names:**
   - Pastikan case-sensitive (uppercase/lowercase)
   - No typos: `MONGODB_URI` bukan `MONGODB_URL`

2. **Check variable format:**
   - No quotes needed di Back4app UI
   - No spaces around `=`
   - Example: `MONGODB_URI=mongodb+srv://...` (not `MONGODB_URI = "..."`)

3. **Redeploy after changes:**
   - Environment variable changes require redeploy
   - Click **"Redeploy"** setelah update variables

### Issue 6: Auto-Sleep / Cold Start

**Gejala:**
- Aplikasi lambat di first request
- Aplikasi tidak accessible setelah inactivity

**Solusi:**

1. **Accept cold starts:**
   - First request setelah sleep akan lambat (10-30 detik)
   - Subsequent requests akan cepat

2. **Use uptime monitoring:**
   - Setup UptimeRobot atau similar
   - Ping health endpoint setiap 5-10 menit
   - Prevent auto-sleep

3. **Health check endpoint:**
   - Aplikasi sudah punya `/health` endpoint
   - Setup monitoring untuk ping endpoint ini

## Debugging Steps

### Step 1: Check Logs

1. Go to Back4app dashboard
2. Select container
3. Click **"Logs"** tab
4. Look for:
   - Error messages
   - Startup messages
   - Connection attempts
   - Port binding messages

### Step 2: Verify Environment Variables

1. Go to container > **"Environment Variables"**
2. Verify semua required variables:
   - `MONGODB_URI` ✅
   - `JWT_SECRET` ✅
   - `JWT_EXPIRES_IN` ✅ (optional)
   - `NODE_ENV` ✅ (optional)
   - `PORT` ✅ (optional, default 3001)

### Step 3: Test MongoDB Connection

1. Get `MONGODB_URI` dari Back4app environment variables
2. Test dengan MongoDB Compass:
   - Open MongoDB Compass
   - Paste connection string
   - Click "Connect"
   - Verify connection successful

3. Or test dengan `mongosh`:
   ```bash
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/todo"
   ```

### Step 4: Verify Container Settings

1. **Root Directory:** `apps/backend`
2. **Dockerfile Path:** `apps/backend/Dockerfile` (if using Dockerfile)
3. **Port:** `3001` (or match with PORT env var)
4. **Build Context:** `apps/backend`

### Step 5: Check Deployment History

1. Go to container > **"Deployments"**
2. Check latest deployment:
   - Status (Success/Failed)
   - Build logs
   - Deploy logs
   - Timestamp

## Quick Fix Checklist

Jika deployment gagal, check list berikut:

- [ ] `MONGODB_URI` di-set di environment variables
- [ ] `JWT_SECRET` di-set di environment variables
- [ ] MongoDB connection string format benar
- [ ] MongoDB Atlas IP whitelist include `0.0.0.0/0`
- [ ] MongoDB credentials (username/password) benar
- [ ] `PORT` di environment variable match dengan Dockerfile EXPOSE
- [ ] Root directory di-set: `apps/backend`
- [ ] Dockerfile path benar (jika menggunakan)
- [ ] Build context benar
- [ ] Check logs untuk error messages
- [ ] Redeploy setelah update environment variables

## Getting Help

Jika masih mengalami issues:

1. **Check Back4app documentation:**
   - https://www.back4app.com/docs

2. **Check logs:**
   - Copy error messages dari logs
   - Include dalam issue report

3. **Verify setup:**
   - Follow setup guide step-by-step
   - Verify setiap step completed

4. **Test locally:**
   - Test aplikasi dengan Docker locally
   - Verify environment variables work
   - Test MongoDB connection

## Common Error Messages Reference

| Error | Cause | Solution |
|-------|-------|----------|
| `no process is listening` | App crashed before start | Check logs, usually MongoDB connection |
| `MONGODB_URI not set` | Missing env var | Set `MONGODB_URI` in Back4app |
| `Authentication failed` | Wrong credentials | Check MongoDB username/password |
| `ENOTFOUND` | Wrong connection string | Verify `MONGODB_URI` format |
| `connection timed out` | Network/IP issue | Check MongoDB Atlas IP whitelist |
| `Port already in use` | Port conflict | Change PORT or check container settings |
| `Module not found` | Missing dependency | Check `package.json` and build logs |

