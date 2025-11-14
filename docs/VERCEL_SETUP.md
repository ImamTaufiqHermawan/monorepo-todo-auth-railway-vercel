# Vercel Setup Guide

Panduan detail untuk setup frontend di Vercel.

## Vercel Overview

Vercel adalah platform optimal untuk frontend applications dengan:
- Zero-config deployment
- Global CDN
- Automatic HTTPS
- Preview deployments
- Free tier dengan generous limits

## Initial Setup

### 1. Create Vercel Account

1. Go to https://vercel.com
2. Sign up dengan GitHub account
3. Verify email

### 2. Import Project

1. Click "Add New Project"
2. Import dari GitHub repository
3. Select repository
4. Configure project settings

### 3. Configure Project

**Project Settings:**
- **Framework Preset:** Vite
- **Root Directory:** `apps/frontend`
- **Build Command:** `pnpm build` (atau `npm run build`)
- **Output Directory:** `dist`
- **Install Command:** `pnpm install` (atau `npm install`)

**Environment Variables:**
- `VITE_API_URL`: Backend API URL (Railway URL)

### 4. Deploy

1. Click "Deploy"
2. Vercel akan build dan deploy
3. Get public URL setelah deploy selesai
4. Test application

## Vercel Configuration

### vercel.json

File `vercel.json` di `apps/frontend/` mengkonfigurasi:
- Build settings
- Routing rules
- Headers
- Redirects

### Environment Variables

**Via Dashboard:**
1. Go to project settings
2. Click "Environment Variables"
3. Add variables per environment:
   - Production
   - Preview
   - Development

**Via CLI:**
```bash
vercel env add VITE_API_URL production
```

## Vercel CLI

### Installation

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### View Deployments

```bash
vercel ls
```

### View Logs

```bash
vercel logs
```

## Build Configuration

### Vite Build

Vercel auto-detects Vite dan configures:
- Build command
- Output directory
- Framework settings

### Custom Build

Jika perlu custom build:
- Set build command di project settings
- Configure di vercel.json
- Use build scripts

## Environment Variables

### Build-time Variables

Variables dengan prefix `VITE_` akan di-inject saat build:
- `VITE_API_URL`: Backend API URL
- Other Vite variables

### Runtime Variables

Untuk runtime variables, use:
- Vercel Edge Config
- Serverless functions
- API routes

### Setting Variables

**Production:**
```bash
vercel env add VITE_API_URL production
```

**Preview:**
```bash
vercel env add VITE_API_URL preview
```

**Development:**
```bash
vercel env add VITE_API_URL development
```

## Routing

### SPA Routing

Vercel auto-configures SPA routing via `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Custom Routes

Add custom routes di `vercel.json`:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

## CI/CD Integration

### GitHub Actions

Vercel dapat di-deploy via GitHub Actions menggunakan Vercel CLI atau API.

**Using Vercel CLI in Actions:**
```yaml
- uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

### Auto-Deploy

Vercel supports:
- Auto-deploy dari main branch
- Preview deployments untuk PRs
- Branch-based deployments

## Preview Deployments

Vercel automatically creates preview deployments untuk:
- Pull requests
- Feature branches
- Commits

Each preview gets:
- Unique URL
- Isolated environment
- Full functionality

## Custom Domain

1. Go to project settings
2. Click "Domains"
3. Add custom domain
4. Configure DNS records
5. Vercel provides SSL automatically

## Performance

### Edge Network

Vercel provides:
- Global CDN
- Edge caching
- Automatic optimization
- Fast TTFB

### Optimization

Vercel automatically:
- Optimizes images
- Minifies code
- Compresses assets
- Caches static files

## Monitoring

### Analytics

Vercel provides:
- Page views
- Unique visitors
- Performance metrics
- Real-time analytics

### Logs

View logs di Vercel dashboard:
- Function logs
- Build logs
- Runtime logs
- Error tracking

## Free Tier Limits

- Unlimited deployments
- 100GB bandwidth per month
- 100GB-hours function execution
- Perfect untuk small to medium apps

## Troubleshooting

### Build Fails

1. Check build logs
2. Verify build command
3. Check dependencies
4. Verify environment variables

### Routing Issues

1. Check vercel.json configuration
2. Verify SPA routing setup
3. Check React Router configuration

### API Connection

1. Verify VITE_API_URL is correct
2. Check CORS settings
3. Verify backend is accessible
4. Check network requests

## Best Practices

1. **Environment Variables:**
   - Use VITE_ prefix untuk build-time vars
   - Separate dev/prod variables
   - Never commit secrets

2. **Build Optimization:**
   - Minimize bundle size
   - Use code splitting
   - Optimize images
   - Enable compression

3. **Caching:**
   - Configure cache headers
   - Use static generation
   - Cache API responses
   - Optimize assets

4. **Performance:**
   - Use Vercel Analytics
   - Monitor Core Web Vitals
   - Optimize images
   - Minimize JavaScript

5. **Security:**
   - Use HTTPS (automatic)
   - Secure environment variables
   - Regular updates
   - Security headers

