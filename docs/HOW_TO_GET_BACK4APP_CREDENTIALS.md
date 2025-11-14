# Cara Setup Back4app untuk Full Automation via GitHub Actions

Panduan step-by-step untuk setup full automation deployment ke Back4app via GitHub Actions.

## ⭐ Recommended: Built-in GitHub Integration (Paling Mudah)

Back4app memiliki built-in GitHub integration yang lebih mudah dan reliable daripada API method.

## Method 1: Built-in GitHub Integration (Recommended) ⭐

### Step 1: Connect GitHub Repository

1. Login ke https://backend.back4app.com
2. Buka container yang ingin di-deploy
3. Go to **"Settings"** atau **"Deploy"** tab
4. Cari section **"GitHub Integration"** atau **"Source Control"**
5. Click **"Connect GitHub"** atau **"Link Repository"**
6. Authorize Back4app untuk access GitHub
7. Select repository yang ingin di-deploy
8. Set branch: `main`
9. Set root directory: `apps/backend`
10. Enable **"Auto Deploy"**
11. Save settings

### Step 2: Done! ✅

Dengan setup ini, Back4app akan **otomatis deploy** pada setiap push ke `main` branch. Tidak perlu API key atau secrets!

---

## Method 2: API Method (Alternative)

Jika ingin menggunakan API method untuk lebih control:

## BACK4APP_REST_API_KEY dan BACK4APP_APP_ID

### Step 1: Get REST API Key

1. Login ke https://backend.back4app.com
2. Buka container yang ingin di-deploy
3. Go to **"Settings"** tab
4. Navigate ke **"Security & Keys"** section
5. Copy **"REST API Key"** (bukan Master Key)
6. Format biasanya: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Get Application ID

1. Di halaman yang sama (Settings > Security & Keys)
2. Copy **"Application ID"** atau **"App ID"**
3. Format biasanya: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

**Contoh lokasi:**

```
Back4app Dashboard
  └── Profile Icon (top right)
      └── Account Settings
          └── API Keys
              └── Generate New API Key
```

### Step 5: Simpan API Key

Simpan API key di tempat yang aman (akan digunakan untuk GitHub Secrets).

---

## BACK4APP_CONTAINER_ID (Optional - untuk reference)

### Method 1: Dari URL (Paling Mudah) ⭐

1. Di Back4app dashboard, click **"Containers"** di sidebar kiri
2. Click pada container yang ingin di-deploy (atau create container baru jika belum ada)
3. Lihat URL di browser address bar:
   ```
   https://backend.back4app.com/apps/{CONTAINER_ID}/overview
   ```
4. Copy bagian `CONTAINER_ID` dari URL

**Contoh:**

- URL: `https://backend.back4app.com/apps/66369ba9-12d7-49c3-b531-4f6505cfdbf4/overview`
- Container ID: `66369ba9-12d7-49c3-b531-4f6505cfdbf4`

### Method 2: Dari Container Settings

1. Di container page, click **"Settings"** tab
2. Scroll ke bagian **"Container Information"** atau **"General"**
3. Container ID akan terlihat di sana
4. Copy Container ID

### Method 3: Via API (Advanced)

Jika sudah punya API key, bisa get via API:

```bash
curl -X GET "https://api.back4app.com/containers" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Response akan berisi list containers dengan ID masing-masing.

---

## BACK4APP_BACKEND_URL (Optional)

Untuk frontend build, perlu backend public URL:

1. Di container page, cari **"Public URL"** atau **"Endpoint"**
2. Copy URL tersebut
3. Format biasanya: `https://your-container-name.back4app.io`

**Contoh:**

- `https://todo-backend.back4app.io`
- `https://my-app-12345.back4app.io`

---

## Menambahkan ke GitHub Secrets

Setelah mendapatkan semua credentials:

### Step 1: Buka GitHub Repository

1. Go to GitHub repository Anda
2. Click **"Settings"** tab (di top menu)

### Step 2: Buka Secrets Section

1. Di sidebar kiri, click **"Secrets and variables"**
2. Click **"Actions"**

### Step 3: Add Secrets

Untuk setiap secret, click **"New repository secret"**:

#### Secret 1: BACK4APP_REST_API_KEY (Optional)

- **Name:** `BACK4APP_REST_API_KEY`
- **Value:** Paste REST API Key dari Step 1 di atas
- Click **"Add secret"**

#### Secret 2: BACK4APP_APP_ID (Optional)

- **Name:** `BACK4APP_APP_ID`
- **Value:** Paste Application ID dari Step 2 di atas
- Click **"Add secret"**

#### Secret 3: BACK4APP_BACKEND_URL (Optional)

- **Name:** `BACK4APP_BACKEND_URL`
- **Value:** Paste Public URL dari container
- Click **"Add secret"**

---

## Verifikasi

Setelah menambahkan secrets:

1. Go to **Actions** tab di GitHub
2. Check workflow file sudah valid
3. Push perubahan ke `main` branch
4. Monitor workflow execution
5. Check Back4app dashboard untuk deployment status

---

## Troubleshooting

### API Key Tidak Muncul

- Pastikan sudah generate API key
- Check di Account Settings > API Keys
- Generate ulang jika perlu (tapi yang lama akan invalid)

### Container ID Tidak Ditemukan

- Pastikan container sudah dibuat
- Check URL di browser address bar
- Atau check di Container Settings

### Deployment Gagal

- Verify API key valid
- Verify Container ID benar
- Check GitHub Actions logs untuk error details
- Verify secrets sudah di-set dengan benar

---

## Quick Reference

### Method 1: Built-in GitHub Integration (Recommended) ⭐

| Step | Action                      | Result                |
| ---- | --------------------------- | --------------------- |
| 1    | Connect GitHub di Back4app  | Auto-deploy enabled   |
| 2    | Set branch & root directory | Configuration done    |
| 3    | Push to main                | Auto-deploy triggered |

**Tidak perlu secrets!**

### Method 2: API Method (Alternative)

| Secret Name             | Cara Dapatkan                               | Format                                 |
| ----------------------- | ------------------------------------------- | -------------------------------------- |
| `BACK4APP_REST_API_KEY` | Settings > Security & Keys > REST API Key   | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`     |
| `BACK4APP_APP_ID`       | Settings > Security & Keys > Application ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `BACK4APP_BACKEND_URL`  | Container Public URL                        | `https://your-app.back4app.io`         |

---

## Next Steps

### Jika menggunakan Built-in GitHub Integration (Recommended):

1. ✅ Connect GitHub repository di Back4app
2. ✅ Enable Auto Deploy
3. ✅ Push code ke `main` branch
4. ✅ Back4app akan auto-deploy
5. ✅ Monitor deployment di Back4app dashboard

### Jika menggunakan API Method:

1. ✅ Add secrets ke GitHub
2. ✅ Push code ke `main` branch
3. ✅ GitHub Actions akan trigger API deploy
4. ✅ Monitor deployment di Actions tab
5. ✅ Check Back4app dashboard untuk status

**Selamat! Deployment automation sudah siap! 🚀**

**Rekomendasi:** Gunakan Built-in GitHub Integration karena lebih mudah dan reliable!
