# Railway Setup Guide

Panduan detail untuk setup backend di Railway.

## Railway Overview

Railway adalah platform yang memudahkan deployment aplikasi dengan:
- Docker support
- Auto-deployment dari GitHub
- Environment variables management
- Built-in monitoring
- Free tier dengan $5 credit per month

## Initial Setup

### 1. Create Railway Account

1. Go to https://railway.app
2. Sign up dengan GitHub account
3. Verify email

### 2. Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Authorize Railway untuk access GitHub
4. Select repository
5. Railway akan auto-detect services

### 3. Configure Backend Service

1. Railway akan create service dari repository
2. Go to service settings
3. Configure:
   - **Name:** backend (atau todo-backend)
   - **Root Directory:** `apps/backend`
   - **Build Command:** (auto dari Dockerfile)
   - **Start Command:** `node src/index.js`

### 4. Environment Variables

Add environment variables di Railway dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your-very-secure-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
```

**Security Notes:**
- JWT_SECRET harus strong (min 32 characters)
- Jangan commit secrets ke repository
- Use Railway secrets management

### 5. Deploy

1. Railway akan auto-deploy dari main branch
2. Monitor deployment di dashboard
3. Check logs untuk errors
4. Get public URL setelah deploy selesai

## Railway CLI

### Installation

```bash
npm install -g @railway/cli
```

### Login

```bash
railway login
```

### Link Project

```bash
railway link
```

### Deploy

```bash
railway up
```

### View Logs

```bash
railway logs
```

### Open Service

```bash
railway open
```

## Dockerfile Configuration

Railway akan menggunakan Dockerfile di `apps/backend/Dockerfile`.

Ensure Dockerfile:
- Exposes correct port
- Uses PORT environment variable
- Has health check
- Optimized untuk production

## Environment Variables

### Required Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret untuk JWT signing
- `NODE_ENV`: Set to `production`

### Optional Variables

- `PORT`: Port number (Railway sets automatically)
- `JWT_EXPIRES_IN`: JWT expiration time
- Other app-specific variables

### Setting Variables

**Via Dashboard:**
1. Go to service settings
2. Click "Variables"
3. Add/edit variables
4. Save (triggers redeploy)

**Via CLI:**
```bash
railway variables set MONGODB_URI="your-connection-string"
railway variables set JWT_SECRET="your-secret"
```

## Monitoring

### Logs

View logs di Railway dashboard:
- Real-time logs
- Filter by level
- Search functionality
- Download logs

### Metrics

Railway provides:
- CPU usage
- Memory usage
- Network traffic
- Request count

### Alerts

Setup alerts untuk:
- High resource usage
- Deployment failures
- Service downtime

## CI/CD Integration

### GitHub Actions

Railway dapat di-deploy via GitHub Actions menggunakan Railway CLI atau API.

**Using Railway CLI in Actions:**
```yaml
- run: npm install -g @railway/cli
- run: railway login --token ${{ secrets.RAILWAY_TOKEN }}
- run: railway link ${{ secrets.RAILWAY_PROJECT_ID }}
- run: railway up
```

### Auto-Deploy

Railway supports auto-deploy:
- Enable di service settings
- Deploys on push to main branch
- Can configure branch untuk auto-deploy

## Custom Domain

1. Go to service settings
2. Click "Domains"
3. Add custom domain
4. Configure DNS records
5. Railway provides SSL automatically

## Scaling

### Free Tier

- $5 credit per month
- 500 hours compute time
- Auto-sleep after inactivity

### Paid Plans

- More compute time
- No sleep
- Better performance
- Priority support

## Troubleshooting

### Deployment Fails

1. Check build logs
2. Verify Dockerfile syntax
3. Check environment variables
4. Verify dependencies

### Service Won't Start

1. Check start command
2. Verify PORT is set correctly
3. Check application logs
4. Verify database connection

### High Resource Usage

1. Optimize Docker image
2. Review application code
3. Check for memory leaks
4. Consider upgrading plan

## Best Practices

1. **Use Environment Variables:**
   - Never hardcode secrets
   - Use Railway secrets management
   - Separate dev/prod variables

2. **Optimize Docker Image:**
   - Use multi-stage builds
   - Minimize image size
   - Use .dockerignore

3. **Monitor Resources:**
   - Check metrics regularly
   - Setup alerts
   - Optimize when needed

4. **Logging:**
   - Use structured logging
   - Log important events
   - Monitor error logs

5. **Security:**
   - Use strong secrets
   - Enable HTTPS
   - Regular updates
   - Security scanning

