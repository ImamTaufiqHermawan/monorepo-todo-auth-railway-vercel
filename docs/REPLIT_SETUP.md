# Replit Setup Guide - Free Backend Hosting (No Credit Card)

Panduan lengkap setup backend Node.js/Express di Replit - platform free hosting tanpa credit card requirement.

## Mengapa Replit?

- ✅ **100% Free** - Tidak perlu credit card untuk starter plan
- ✅ **Online IDE** - Develop langsung di browser
- ✅ **Auto-Deploy** - Deploy otomatis saat run
- ✅ **Public URL** - Dapat public URL langsung
- ✅ **Perfect untuk Learning** - Ideal untuk belajar dan development
- ✅ **Multiple Languages** - Support banyak bahasa pemrograman

## Keterbatasan Replit

- ⚠️ **Auto-Sleep** - Sleep setelah inactivity (kecuali paket berbayar)
- ⚠️ **No Docker** - Tidak support Docker
- ⚠️ **Public Repls** - Free tier repls bisa public (optional private dengan upgrade)
- ⚠️ **Resource Limits** - Limited resources di free tier

## Setup Replit

### Step 1: Create Replit Account

1. Go to https://replit.com
2. Click "Sign Up" atau "Get Started"
3. Sign up dengan **GitHub account** (recommended) atau email
4. **No credit card required!**
5. Starter plan akan aktif otomatis

### Step 2: Create New Repl

#### Method 1: Create dari Template (Recommended)

1. Di Replit dashboard, click **"Create Repl"**
2. Select **"Node.js"** template
3. Name your repl: `todo-backend` atau nama lain
4. Click **"Create Repl"**

#### Method 2: Import dari GitHub

1. Click **"Create Repl"**
2. Select **"Import from GitHub"**
3. Paste GitHub repository URL
4. Replit akan clone repository
5. Auto-detect Node.js project

### Step 3: Configure Project Structure

Jika import dari monorepo, perlu configure:

1. **Root Directory:** Set working directory ke `apps/backend` jika perlu
2. **Package.json:** Replit akan auto-detect
3. **Start Script:** Replit akan run `npm start` atau `node src/index.js`

### Step 4: Update package.json

Pastikan `package.json` memiliki start script:

```json
{
  "name": "todo-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node src/index.js"
  },
  "dependencies": {
    "express": "^5.0.0",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.4.0",
    "cors": "^2.8.5"
  }
}
```

### Step 5: Environment Variables

#### Method 1: .env File (Recommended)

1. Di Replit file explorer, create file `.env`
2. Add environment variables:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

**Note:** Replit akan auto-load `.env` file jika menggunakan `dotenv`.

#### Method 2: Replit Secrets (More Secure)

1. Click **"Secrets"** tab (lock icon) di sidebar
2. Add secrets:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=3000`

**Access secrets di code:**

```javascript
process.env.MONGODB_URI; // Auto-loaded by Replit
```

### Step 6: Update Backend Code untuk Replit

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
- Use `process.env.PORT` (Replit sets this automatically)
- Replit auto-loads environment variables

### Step 7: Install Dependencies

1. Di Replit terminal, run:

```bash
npm install
```

Atau Replit akan auto-install saat pertama kali run.

### Step 8: Run & Deploy

1. Click **"Run"** button (green play button)
2. Replit akan:
   - Install dependencies (jika belum)
   - Run `npm start` atau start command
   - Provide public URL: `https://your-repl-name.username.repl.co`

### Step 9: Get Public URL

Setelah run, Replit akan provide:

- **Webview URL:** `https://your-repl-name.username.repl.co`
- **Always On URL:** (jika upgrade ke paid plan)

## Replit Auto-Deploy

### Always On (Paid Feature)

- **Free Tier:** Aplikasi akan sleep setelah inactivity
- **Paid Tier:** "Always On" feature untuk keep app running 24/7

### Keep Free Tier Alive

Untuk free tier, aplikasi akan sleep setelah inactivity. Solusi:

1. **Uptime Monitoring:**

   - Use UptimeRobot (https://uptimerobot.com)
   - Ping setiap 5 minutes ke Replit URL
   - Free tier: 50 monitors

2. **Health Check Endpoint:**

   ```javascript
   app.get("/health", (req, res) => {
     res.json({ status: "ok", timestamp: new Date() });
   });
   ```

3. **Keep-Alive Script:**
   ```javascript
   // keep-alive.js
   setInterval(() => {
     fetch("https://your-repl-name.username.repl.co/health")
       .then(() => console.log("Keep-alive ping"))
       .catch((err) => console.error("Keep-alive error:", err));
   }, 4 * 60 * 1000); // Every 4 minutes
   ```

## Import dari Monorepo

Jika project adalah monorepo:

### Option 1: Copy Files

1. Create new Node.js repl
2. Copy files dari `apps/backend/` ke Replit
3. Update paths jika perlu

### Option 2: Import dari GitHub

1. Create repl dari GitHub
2. Set working directory ke `apps/backend`
3. Update start command jika perlu

### Option 3: Deploy Subdirectory

1. Import full repository
2. Update `.replit` file:
   ```
   run = "cd apps/backend && npm start"
   ```

## Update Frontend untuk Replit Backend

Update frontend `.env` atau Vercel environment variables:

```env
VITE_API_URL=https://your-repl-name.username.repl.co
```

## Replit Configuration File

Create `.replit` file untuk custom configuration:

```toml
language = "nodejs"
run = "npm start"

[deploy]
run = ["sh", "-c", "npm start"]
```

## CI/CD dengan Replit

### ⚠️ Important: Replit CI/CD Limitations

**Replit tidak support CI/CD secara langsung.** Replit lebih fokus pada development environment daripada production deployment dengan CI/CD.

### Option 1: Manual Deploy

- Deploy manual dengan click "Run" button
- Atau import dari GitHub (auto-sync)

### Option 2: API Trigger (Limited)

Bisa trigger deploy via API, tapi **tidak ideal untuk production CI/CD**:

```yaml
deploy-backend-replit:
  name: Deploy Backend to Replit
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  steps:
    - name: Trigger Replit Deploy
      run: |
        curl -X POST "https://api.replit.com/v1/repls/${{ secrets.REPLIT_REPL_ID }}/deploy" \
          -H "Authorization: Bearer ${{ secrets.REPLIT_API_TOKEN }}"
```

**Get Replit API Token:**

1. Go to Replit account settings
2. API section
3. Generate new token

**Get Repl ID:**

- Ada di URL: `https://replit.com/@username/repl-name`
- Atau dari Replit API

### ⚠️ Recommendation

Jika butuh **proper CI/CD**, pertimbangkan:

- **Netlify** - Built-in CI/CD, fullstack support
- **Cyclic** - CI/CD support, no sleep
- **Genezio** - CI/CD support, 1GB RAM

## Monitoring & Logs

### View Logs

1. Di Replit console, logs akan muncul real-time
2. Check console output untuk errors
3. Use `console.log()` untuk debugging

### Debugging

- Use Replit debugger (paid feature)
- Or use `console.log()` statements
- Check logs di console tab

## Best Practices untuk Replit

1. **Use Environment Variables:** Never hardcode secrets
2. **Optimize Dependencies:** Minimize package size
3. **Handle Auto-Sleep:** Use uptime monitoring
4. **Monitor Logs:** Check console regularly
5. **Use Health Endpoint:** Create `/health` endpoint
6. **Keep Dependencies Updated:** Regularly update packages

## Troubleshooting

### Service Not Starting

- Check console logs
- Verify `package.json` start script
- Check environment variables
- Verify port configuration

### Auto-Sleep Issues

- Setup uptime monitoring
- Use keep-alive script
- Accept cold starts (first request might be slow)
- Consider upgrade untuk "Always On"

### Port Issues

- Use `process.env.PORT` (Replit sets automatically)
- Don't hardcode port numbers
- Use `0.0.0.0` sebagai host

### Import Issues

- Verify GitHub repository access
- Check file paths
- Update working directory jika perlu

## Replit vs Other Platforms

| Feature     | Replit     | Netlify     | Cyclic | Genezio |
| ----------- | ---------- | ----------- | ------ | ------- |
| Free Tier   | ✅ Yes     | ✅ Yes      | ✅ Yes | ✅ Yes  |
| CC Required | ❌ No      | ❌ No       | ❌ No  | ❌ No   |
| Auto-Deploy | ✅ Yes     | ✅ Yes      | ✅ Yes | ✅ Yes  |
| CI/CD       | ❌ Limited | ✅ Built-in | ✅ Yes | ✅ Yes  |
| Docker      | ❌ No      | ❌ No       | ❌ No  | ❌ No   |
| RAM         | 512MB      | 512MB       | 512MB  | 1GB     |
| Sleep       | Yes        | No          | No     | No      |
| Online IDE  | ✅ Yes     | ❌ No       | ❌ No  | ❌ No   |
| Fullstack   | ❌ No      | ✅ Yes      | ❌ No  | ❌ No   |
| Setup Time  | 2 min      | 5 min       | 3 min  | 3 min   |

## Migration dari Platform Lain ke Replit

1. Create Replit account
2. Create new Node.js repl
3. Import dari GitHub atau copy files
4. Set environment variables
5. Install dependencies
6. Run dan test
7. Update frontend `VITE_API_URL` dengan Replit URL
8. Setup uptime monitoring untuk prevent sleep

## Kesimpulan

Replit adalah pilihan yang bagus untuk:

- ✅ **Free hosting** tanpa credit card
- ✅ **Quick setup** dalam hitungan menit
- ✅ **Online development** - develop langsung di browser
- ✅ **Learning projects** dan small apps
- ✅ **Auto-deploy** saat run

Perfect untuk deployment backend Express tanpa requirement credit card, dengan bonus online IDE untuk development!
