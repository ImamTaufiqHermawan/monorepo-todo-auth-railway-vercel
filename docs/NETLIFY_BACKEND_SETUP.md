# Netlify Backend Setup Guide - Serverless Functions

Panduan setup backend Node.js/Express di Netlify menggunakan serverless functions.

## Mengapa Netlify?

- ✅ **100% Free** - Tidak perlu credit card untuk free tier
- ✅ **CI/CD Built-in** - Auto-deploy dari GitHub
- ✅ **Serverless Functions** - Auto-scaling
- ✅ **Global CDN** - Fast global delivery
- ✅ **Perfect untuk Fullstack** - Frontend + Backend di satu platform

## Keterbatasan Netlify

- ⚠️ **Serverless Only** - Perlu restructure Express ke serverless functions
- ⚠️ **Function-based** - Setiap route menjadi function terpisah
- ⚠️ **No Traditional Server** - Tidak bisa run Express server langsung
- ⚠️ **Cold Starts** - Mungkin terjadi cold start pada first request

## Netlify untuk Backend

Netlify tidak support traditional Express server. Perlu convert ke **Netlify Functions** (serverless functions).

### Konsep Netlify Functions

- Setiap API route menjadi serverless function
- Functions di folder `netlify/functions/`
- Auto-deploy dari GitHub
- Pay-per-use execution

## Setup Netlify Backend

### Step 1: Create Netlify Account

1. Go to https://netlify.com
2. Sign up dengan GitHub account (recommended)
3. **No credit card required!**
4. Free tier akan aktif otomatis

### Step 2: Restructure Express App

Netlify perlu Express app di-restructure menjadi serverless functions.

#### Option 1: Netlify Functions dengan Express (Recommended)

Gunakan `@netlify/aws-lambda` untuk wrap Express app:

**Install dependencies:**

```bash
npm install @netlify/aws-lambda serverless-http
```

**Create function:**

```javascript
// netlify/functions/api.js
const express = require("express");
const serverless = require("serverless-http");
const app = express();

// Your Express routes
app.use(express.json());
app.use("/api/auth", require("../../src/routes/auth"));
app.use("/api/todos", require("../../src/routes/todos"));

// Export handler
exports.handler = serverless(app);
```

#### Option 2: Individual Functions (More Control)

Create individual functions untuk setiap route:

```javascript
// netlify/functions/auth.js
exports.handler = async (event, context) => {
  // Handle auth logic
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Auth endpoint" }),
  };
};
```

### Step 3: Project Structure

```
apps/backend/
├── src/
│   ├── routes/
│   │   ├── auth.js
│   │   └── todos.js
│   └── index.js
├── netlify/
│   └── functions/
│       └── api.js
├── netlify.toml
└── package.json
```

### Step 4: Configure netlify.toml

Create `netlify.toml` di root:

```toml
[build]
  command = "npm install"
  functions = "netlify/functions"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
```

### Step 5: Environment Variables

Add di Netlify dashboard:

1. Go to Site Settings > Environment Variables
2. Add:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Step 6: Deploy

#### Method 1: Deploy dari GitHub (Recommended)

1. Connect GitHub repository
2. Set build settings:
   - **Base directory:** `apps/backend`
   - **Build command:** `npm install`
   - **Publish directory:** (leave empty atau `dist`)
3. Add environment variables
4. Deploy

#### Method 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## CI/CD dengan Netlify

Netlify memiliki **built-in CI/CD**:

- Auto-deploy dari GitHub
- Preview deployments untuk PR
- Branch deploys
- Deploy notifications

### GitHub Integration

1. Connect repository di Netlify
2. Netlify akan auto-deploy pada setiap push
3. Preview deployments untuk pull requests
4. Production deploy untuk main branch

### Custom Build Commands

Di `netlify.toml`:

```toml
[build]
  command = "npm install && npm run build"
  functions = "netlify/functions"
```

## Netlify Functions Best Practices

### 1. Keep Functions Small

- One function per route atau group of routes
- Minimize dependencies
- Fast cold starts

### 2. Use Environment Variables

```javascript
// Access env vars
const mongodbUri = process.env.MONGODB_URI;
```

### 3. Handle CORS

```javascript
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};
```

### 4. Error Handling

```javascript
exports.handler = async (event, context) => {
  try {
    // Your logic
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

## Fullstack Deployment

Netlify perfect untuk fullstack:

### Frontend + Backend di Netlify

1. **Frontend:** Deploy React/Vue/etc ke Netlify
2. **Backend:** Deploy functions ke Netlify
3. **Same Domain:** Frontend dan API di same domain
4. **No CORS Issues:** Same origin

### Example Structure

```
monorepo/
├── apps/
│   ├── frontend/     # React app
│   └── backend/      # Express app
├── netlify/
│   └── functions/
│       └── api.js    # Serverless wrapper
└── netlify.toml
```

## Free Tier Limits

- **100GB bandwidth** per month
- **300 build minutes** per month
- **125,000 function invocations** per month
- **100GB-hours** function execution
- **Unlimited** sites

## Troubleshooting

### Cold Starts

- Minimize dependencies
- Use connection pooling
- Keep functions warm dengan periodic requests

### Function Timeout

- Default: 10 seconds (free tier)
- Max: 26 seconds (paid tier)
- Optimize function execution time

### CORS Issues

- Add CORS headers di functions
- Or use Netlify redirects untuk same origin

## Migration dari Express ke Netlify Functions

1. Install `serverless-http`
2. Wrap Express app dengan `serverless()`
3. Move to `netlify/functions/`
4. Update `netlify.toml`
5. Deploy

## Netlify vs Other Platforms

| Feature         | Netlify        | Cyclic | Genezio | Replit     |
| --------------- | -------------- | ------ | ------- | ---------- |
| Free Tier       | ✅ Yes         | ✅ Yes | ✅ Yes  | ✅ Yes     |
| CC Required     | ❌ No          | ❌ No  | ❌ No   | ❌ No      |
| CI/CD           | ✅ Built-in    | ✅ Yes | ✅ Yes  | ❌ Limited |
| Serverless      | ✅ Yes         | ✅ Yes | ✅ Yes  | ❌ No      |
| Fullstack       | ✅ Yes         | ❌ No  | ❌ No   | ❌ No      |
| Express Support | ⚠️ Restructure | ✅ Yes | ✅ Yes  | ✅ Yes     |

## Kesimpulan

Netlify adalah pilihan yang bagus untuk:

- ✅ **Fullstack deployment** (Frontend + Backend)
- ✅ **Built-in CI/CD** dari GitHub
- ✅ **Free tier** tanpa credit card
- ⚠️ **Perlu restructure** Express ke serverless functions

Perfect untuk fullstack apps dengan CI/CD built-in, tapi perlu restructure Express app ke serverless functions pattern.
