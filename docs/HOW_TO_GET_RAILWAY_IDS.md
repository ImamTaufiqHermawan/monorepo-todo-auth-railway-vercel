# Cara Mendapatkan Railway IDs

Panduan lengkap untuk mendapatkan Railway Project ID dan Service ID yang diperlukan untuk CI/CD.

## Railway Project ID

### Method 1: Dari Project Settings

1. Login ke Railway dashboard (https://railway.app)
2. Pilih project yang ingin digunakan
3. Klik "Settings" (ikon gear di sidebar atau di project menu)
4. Scroll ke bawah ke bagian "Project"
5. Project ID akan terlihat di bagian bawah, format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Method 2: Dari URL

1. Buka project di Railway dashboard
2. Lihat URL di browser
3. Format URL: `https://railway.app/project/<project-id>`
4. Copy Project ID dari URL (bagian setelah `/project/`)

### Method 3: Menggunakan Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# List projects
railway projects

# Atau jika sudah di dalam project directory
railway status
# Akan menampilkan project ID
```

## Railway Service ID

### Method 1: Dari Service Settings

1. Login ke Railway dashboard
2. Pilih project
3. Klik pada service yang ingin digunakan (misalnya "backend")
4. Klik "Settings" tab
5. Scroll ke bawah ke bagian "Service"
6. Service ID akan terlihat di bagian bawah, format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Method 2: Dari URL

1. Buka service di Railway dashboard
2. Lihat URL di browser
3. Format URL: `https://railway.app/project/<project-id>/service/<service-id>`
4. Copy Service ID dari URL (bagian setelah `/service/`)

**Contoh URL:**

```
https://railway.app/project/abc123-def456/service/xyz789-uvw012
                              ^^^^^^^^              ^^^^^^^^^^^^
                            Project ID            Service ID
```

### Method 3: Menggunakan Railway CLI

```bash
# Jika sudah di dalam project directory
railway service

# Atau list semua services
railway services

# Akan menampilkan list services dengan IDs
```

### Method 4: Menggunakan Railway API

```bash
# Get project info (termasuk services)
curl -H "Authorization: Bearer $RAILWAY_TOKEN" \
  https://api.railway.app/v1/projects/$RAILWAY_PROJECT_ID

# Response akan berisi list services dengan IDs
```

## Railway Token

### Cara Mendapatkan Token

1. Login ke Railway dashboard
2. Klik pada profile icon (pojok kanan atas)
3. Pilih "Account Settings" atau "Tokens"
4. Klik "New Token" atau "Create Token"
5. Beri nama token (misalnya: "GitHub Actions CI/CD")
6. Copy token yang di-generate (hanya muncul sekali, simpan dengan aman)
7. Token format: `railway_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Important:**

- Token hanya ditampilkan sekali saat dibuat
- Simpan token dengan aman
- Jangan commit token ke repository
- Gunakan GitHub Secrets untuk menyimpan token

## Setup GitHub Secrets

Setelah mendapatkan semua IDs dan token, tambahkan ke GitHub Secrets:

1. Buka GitHub repository
2. Go to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Tambahkan secrets berikut:

| Secret Name          | Value                        | Contoh              |
| -------------------- | ---------------------------- | ------------------- |
| `RAILWAY_TOKEN`      | Railway authentication token | `railway_abc123...` |
| `RAILWAY_PROJECT_ID` | Railway project ID           | `abc123-def456-...` |
| `RAILWAY_SERVICE_ID` | Railway service ID           | `xyz789-uvw012-...` |

## Verifikasi

Setelah setup, verifikasi dengan:

```bash
# Test Railway CLI dengan token
export RAILWAY_TOKEN="your-token-here"
railway whoami

# Test link ke project
railway link --project <project-id>
railway status
```

## Troubleshooting

### Token tidak bekerja

- Pastikan token masih valid (belum expired)
- Pastikan token memiliki permission yang cukup
- Coba buat token baru

### Project ID tidak ditemukan

- Pastikan Anda adalah member dari project
- Pastikan project masih aktif
- Cek di Railway dashboard

### Service ID tidak ditemukan

- Pastikan service sudah dibuat
- Pastikan Anda berada di project yang benar
- Cek di Railway dashboard

## Tips

1. **Simpan IDs di tempat aman** - Jangan commit ke repository
2. **Gunakan descriptive names** - Untuk token, gunakan nama yang jelas seperti "GitHub Actions Production"
3. **Rotate tokens regularly** - Untuk security, ganti token secara berkala
4. **Use different tokens** - Gunakan token berbeda untuk development dan production
