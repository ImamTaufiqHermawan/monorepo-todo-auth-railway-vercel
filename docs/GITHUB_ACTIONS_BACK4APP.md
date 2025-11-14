# GitHub Actions Setup untuk Back4app

Panduan lengkap setup full automation deployment ke Back4app via GitHub Actions.

## Overview

Dengan setup ini, setiap push ke `main` branch akan:
1. ✅ Run tests
2. ✅ Build Docker image
3. ✅ Deploy ke Back4app (otomatis)
4. ✅ Deploy frontend ke Vercel

**Hanya perlu provide API key dan Container ID ke GitHub Secrets!**

## Step-by-Step Setup

### Step 1: Get Back4app API Key

1. Login ke [Back4app Dashboard](https://backend.back4app.com)
2. Click **profile icon** di top right corner
3. Select **"Account Settings"**
4. Navigate ke **"API Keys"** section
5. Click **"Generate New API Key"**
6. **Copy dan simpan API key** (hanya muncul sekali!)

**Note:** API key format biasanya: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Step 2: Get Container ID

#### Method 1: Dari URL

1. Di Back4app dashboard, go to **"Containers"**
2. Click pada container yang ingin di-deploy
3. Lihat URL di browser:
   ```
   https://backend.back4app.com/apps/{CONTAINER_ID}/overview
   ```
4. Copy `CONTAINER_ID` dari URL

#### Method 2: Dari Container Settings

1. Di container page, click **"Settings"**
2. Container ID ada di bagian **"Container Information"**

#### Method 3: Via API

```bash
curl -X GET "https://api.back4app.com/containers" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Response akan berisi list containers dengan ID masing-masing.

### Step 3: Get Backend URL (Optional)

Untuk frontend build, perlu backend URL:

1. Di container page, copy **Public URL**
2. Format: `https://your-container-name.back4app.io`

### Step 4: Add GitHub Secrets

1. Go to GitHub repository
2. Navigate ke **Settings > Secrets and variables > Actions**
3. Click **"New repository secret"**
4. Add secrets berikut:

#### Required Secrets

- **Name:** `BACK4APP_API_KEY`
  - **Value:** API key dari Step 1

- **Name:** `BACK4APP_CONTAINER_ID`
  - **Value:** Container ID dari Step 2

#### Optional Secrets (untuk frontend build)

- **Name:** `BACK4APP_BACKEND_URL`
  - **Value:** Public URL dari Step 3
  - Example: `https://todo-backend.back4app.io`

### Step 5: Verify Workflow

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

### Step 6: Test Deployment

1. Make a small change di code
2. Commit dan push ke `main` branch:
   ```bash
   git add .
   git commit -m "Test Back4app deployment"
   git push origin main
   ```
3. Go to **Actions** tab di GitHub
4. Monitor workflow execution
5. Check Back4app dashboard untuk deployment status

## Workflow Flow

```
Push to main
    ↓
Run Tests
    ↓
Build Docker Image
    ↓
Deploy to Back4app (via API)
    ↓
Build Frontend
    ↓
Deploy to Vercel
    ↓
Done! ✅
```

## Troubleshooting

### Deployment Failed: Unauthorized

**Problem:** API key invalid atau expired

**Solution:**
1. Verify API key di GitHub Secrets
2. Generate new API key di Back4app
3. Update GitHub Secret dengan new key

### Deployment Failed: Container Not Found

**Problem:** Container ID salah

**Solution:**
1. Verify Container ID di GitHub Secrets
2. Get correct Container ID dari Back4app dashboard
3. Update GitHub Secret

### Deployment Triggered but Not Deploying

**Problem:** Back4app API endpoint atau payload salah

**Solution:**
1. Check Back4app API documentation
2. Verify API endpoint URL
3. Check request payload format

### Frontend Build Failed: API URL Not Found

**Problem:** `BACK4APP_BACKEND_URL` secret tidak di-set

**Solution:**
1. Add `BACK4APP_BACKEND_URL` secret
2. Set value ke Back4app container public URL
3. Re-run workflow

## Manual Deployment (Alternative)

Jika GitHub Actions tidak bekerja, bisa deploy manual:

1. Go to Back4app dashboard
2. Click container
3. Click **"Deploy"** button
4. Select branch dan root directory
5. Deploy

## Back4app Auto-Deploy (Alternative)

Back4app juga punya built-in auto-deploy:

1. Di container settings, enable **"Auto Deploy"**
2. Select branch: `main`
3. Back4app akan auto-deploy pada setiap push

**Note:** Untuk full control dan consistency dengan CI/CD pipeline, gunakan GitHub Actions method.

## Security Best Practices

1. **Never commit API keys** ke repository
2. **Use GitHub Secrets** untuk semua sensitive data
3. **Rotate API keys** secara berkala
4. **Use environment-specific secrets** (production, staging)
5. **Monitor API key usage** di Back4app dashboard

## Verification

Setelah setup, verify:

1. ✅ GitHub Secrets sudah di-set
2. ✅ Workflow file ada di `.github/workflows/ci-cd.yml`
3. ✅ Push ke main branch trigger deployment
4. ✅ Back4app container ter-update
5. ✅ Frontend build dengan correct API URL

## Next Steps

Setelah deployment berhasil:

1. Monitor logs di Back4app dashboard
2. Test API endpoints
3. Update frontend dengan Back4app backend URL
4. Setup monitoring dan alerts

## Support

Jika ada masalah:
- Check Back4app [documentation](https://www.back4app.com/docs)
- Check GitHub Actions logs
- Verify API key permissions
- Contact Back4app support jika perlu

