# Render Setup Guide - Alternatif Railway

Panduan setup backend di Render sebagai alternatif Railway untuk free tier deployment.

## Mengapa Render?

- **Free Tier:** 750 hours per month (cukup untuk 24/7 operation)
- **Docker Support:** Full Docker support
- **Auto-Deploy:** Auto-deploy dari GitHub
- **No Credit Card Required:** Untuk free tier
- **Perfect untuk Express/Node.js:** Native support

## Render vs Railway

| Feature | Render Free | Railway Free |
|---------|-------------|--------------|
| Compute Hours | 750/month | 500 hours ($5 credit) |
| Auto-sleep | 15 min inactivity | Yes |
| Docker | Yes | Yes |
| Database | Separate service | Included |
| Credit Card | Not required | Required |

## Setup Render

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up dengan GitHub account
3. Verify email

### Step 2: Create Web Service

1. Click "New +" button
2. Select "Web Service"
3. Connect GitHub repository
4. Select repository yang berisi project

### Step 3: Configure Service

**Basic Settings:**
- **Name:** todo-backend
- **Region:** Singapore (atau terdekat)
- **Branch:** main
- **Root Directory:** `apps/backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `node src/index.js`

**Advanced Settings (Optional):**
- **Docker:** Jika menggunakan Dockerfile, set "Docker" sebagai runtime
- **Dockerfile Path:** `apps/backend/Dockerfile` (jika menggunakan Docker)
- **Docker Context:** `apps/backend`

### Step 4: Environment Variables

Add environment variables di Render dashboard:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=10000
```

**Note:** Render menggunakan port dari environment variable `PORT` (biasanya 10000).

### Step 5: Deploy

1. Click "Create Web Service"
2. Render akan build dan deploy
3. Get public URL setelah deploy selesai
4. URL format: `https://todo-backend.onrender.com`

## Render CLI (Optional)

### Installation

```bash
npm install -g render-cli
```

### Login

```bash
render login
```

### Deploy

```bash
render deploy
```

## CI/CD dengan Render

Render memiliki built-in auto-deploy dari GitHub, tapi bisa juga trigger via API.

### Auto-Deploy (Built-in)

1. Connect GitHub repository
2. Render akan auto-deploy pada setiap push ke main branch
3. No additional setup needed

### Manual Deploy via API

```yaml
deploy-backend-render:
  name: Deploy Backend to Render
  runs-on: ubuntu-latest
  steps:
    - name: Trigger Render Deploy
      run: |
        curl -X POST \
          "https://api.render.com/deploy/srv/${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}"
```

**Get Render API Key:**
1. Go to Render dashboard
2. Account Settings > API Keys
3. Create new API key

**Get Service ID:**
1. Go to service settings
2. Service ID ada di URL atau settings page

## Free Tier Limits

### Render Free Tier

- **750 hours** compute time per month
- **Auto-sleep** after 15 minutes inactivity
- **Wake on request** (first request might be slow)
- **512MB RAM**
- **Sufficient** untuk small to medium applications

### Tips untuk Free Tier

1. **Keep service awake:** Use uptime monitoring (UptimeRobot, dll)
2. **Optimize cold starts:** Minimize dependencies
3. **Monitor usage:** Check dashboard regularly

## Update Project untuk Render

### Update Backend untuk Render Port

Render menggunakan dynamic port. Update backend code:

```javascript
// src/index.js
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Update Frontend Environment Variable

Update `VITE_API_URL` di Vercel dengan Render backend URL:
```
VITE_API_URL=https://todo-backend.onrender.com
```

## Monitoring

### Render Dashboard

- View logs
- Monitor metrics
- Check deployment history
- View environment variables

### Logs

```bash
# Via Render CLI
render logs

# Atau view di dashboard
```

## Troubleshooting

### Service Sleep

- Free tier services sleep after 15 min inactivity
- First request after sleep might be slow (cold start)
- Use uptime monitoring untuk keep service awake

### Build Failures

- Check build logs di Render dashboard
- Verify build command
- Check dependencies

### Port Issues

- Render sets PORT automatically
- Ensure app listens on `process.env.PORT`
- Default Render port: 10000

## Best Practices

1. **Use Environment Variables:** Never hardcode secrets
2. **Monitor Logs:** Check logs regularly
3. **Optimize Dependencies:** Minimize package size
4. **Use Health Checks:** Implement `/health` endpoint
5. **Monitor Usage:** Stay within free tier limits

## Migration dari Railway ke Render

1. Create Render account
2. Create new Web Service
3. Connect same GitHub repository
4. Set root directory: `apps/backend`
5. Copy environment variables dari Railway
6. Deploy
7. Update frontend `VITE_API_URL` dengan Render URL
8. Test deployment

## Kesimpulan

Render adalah alternatif yang bagus untuk Railway dengan free tier yang lebih generous. Perfect untuk deployment backend Node.js/Express dengan Docker support.

