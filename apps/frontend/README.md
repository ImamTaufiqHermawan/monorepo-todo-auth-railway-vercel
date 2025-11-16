# Frontend - Todo Application (React + Vite)

Modern React application untuk Todo management dengan authentication, deployed ke Vercel sebagai static site.

## 🚀 Features

- ✅ Modern React 19 dengan Hooks
- ✅ React Router untuk navigation
- ✅ JWT Authentication
- ✅ Todo CRUD Operations
- ✅ Responsive UI
- ✅ Protected Routes
- ✅ Auto token refresh
- ✅ Error Handling
- ✅ Loading States

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   ├── pages/
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Register page
│   │   └── Dashboard.jsx    # Todo dashboard
│   └── utils/
│       ├── api.js           # Axios instance & interceptors
│       └── auth.js          # Auth utilities (token management)
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel configuration
├── .env.example             # Environment variables template
└── package.json
```

## 🛠 Tech Stack

- **React 19** - UI library
- **Vite 5** - Build tool & dev server
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Modern CSS** - Styling

## ⚙️ Environment Variables

Copy `.env.example` ke `.env` dan isi dengan backend URL:

```env
# Backend API URL
# For local development: http://localhost:3001
# For production: https://your-backend.vercel.app
VITE_API_URL=http://localhost:3001
```

### Environment Variables untuk Vercel

Set di Vercel Project > Settings > Environment Variables:

**Required:**
- `VITE_API_URL` - Backend API URL (contoh: `https://your-backend.vercel.app`)

**Note:** Vite requires `VITE_` prefix untuk environment variables yang di-expose ke client.

## 🚀 Local Development

### Prerequisites

- Node.js 22+
- Backend API running (atau use production URL)
- pnpm (atau npm)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env dengan backend API URL
```

### Run Development Server

```bash
# Run dev server
pnpm dev

# Server akan berjalan di http://localhost:5173
```

### Access

- **Frontend:** http://localhost:5173
- **Backend API:** (sesuai VITE_API_URL di .env)

## 📱 Pages

### Login Page (`/login`)

- Email & password input
- Form validation
- Error handling
- Redirect to dashboard setelah login

### Register Page (`/register`)

- Email & password input
- Password confirmation
- Form validation
- Auto login setelah register

### Dashboard (`/`)

- Protected route (requires authentication)
- Todo list display
- Create new todo
- Edit todo
- Delete todo
- Mark todo as complete
- Logout functionality

## 🔐 Authentication Flow

1. User login/register → Get JWT token
2. Token disimpan di localStorage
3. Token di-attach ke setiap API request via Axios interceptor
4. Jika token expired/invalid → Auto redirect ke login
5. Protected routes check token sebelum render

## 🎨 UI Features

- **Responsive Design** - Works on mobile & desktop
- **Loading States** - Show loading indicators
- **Error Messages** - User-friendly error handling
- **Form Validation** - Client-side validation
- **Auto Redirect** - Smart navigation based on auth state

## 🚀 Deployment ke Vercel

### Manual Deploy Pertama Kali

1. **Login ke Vercel:** https://vercel.com
2. **Add New Project** > Import dari GitHub
3. **Configure:**
   - Project Name: `your-repo-name-frontend`
   - **Root Directory:** KOSONGKAN (biarkan kosong)
   - Framework: Vite (auto-detect)
   - Build Command: `pnpm build` (auto-detect)
   - Output Directory: `dist` (auto-detect)
4. **Environment Variables:**
   - `VITE_API_URL` - Backend Vercel URL
5. **Settings > General:**
   - **Root Directory:** KOSONGKAN
   - **Auto Deploy:** DISABLE (matikan)
6. Deploy sekali manual
7. Copy **Project ID** dari Settings > General
8. Add ke GitHub Secrets: `VERCEL_FRONTEND_PROJECT_ID`

### Vercel Configuration

File `vercel.json` mengkonfigurasi:
- Build command: `pnpm build`
- Output directory: `dist`
- Framework: Vite
- SPA routing (rewrites semua routes ke index.html)
- Cache headers untuk assets

### CI/CD Deployment

Setelah manual deploy pertama, CI/CD akan otomatis deploy via GitHub Actions:
- Push ke `main` branch → Auto deploy
- Workflow menggunakan `working-directory: ./apps/frontend`

## 🔧 Development Scripts

```bash
# Development server dengan hot reload
pnpm dev

# Build untuk production
pnpm build

# Preview production build
pnpm preview

# Run tests (if configured)
pnpm test
```

## 📦 Dependencies

**Production:**
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client

**Development:**
- `vite` - Build tool
- `@vitejs/plugin-react` - Vite React plugin
- `vite-plugin-pwa` - PWA support (optional)

## 🔄 API Integration

### API Client Setup

File `src/utils/api.js` mengkonfigurasi Axios:
- Base URL dari `VITE_API_URL`
- Auto-attach JWT token ke requests
- Auto-redirect ke login jika 401
- Error handling

### API Calls

**Authentication:**
```javascript
import api from './utils/api';

// Login
const response = await api.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Register
const response = await api.post('/api/auth/register', {
  email: 'user@example.com',
  password: 'password123'
});
```

**Todos:**
```javascript
// Get all todos
const todos = await api.get('/api/todos');

// Create todo
const todo = await api.post('/api/todos', {
  title: 'My Todo',
  description: 'Description',
  completed: false
});

// Update todo
const updated = await api.put(`/api/todos/${id}`, {
  title: 'Updated Todo',
  completed: true
});

// Delete todo
await api.delete(`/api/todos/${id}`);
```

## 🐛 Troubleshooting

### API Connection Error

**Error:** `Network Error` atau `CORS Error`

**Solutions:**
1. Verify `VITE_API_URL` di Vercel environment variables
2. Check backend URL is correct
3. Ensure backend is deployed and running
4. Check CORS settings di backend

### Build Errors

**Error:** Build fails di Vercel

**Solutions:**
1. Check Node version (22+)
2. Clear `node_modules` dan reinstall
3. Check environment variables are set
4. Review build logs di Vercel dashboard

### Routing Issues

**Error:** 404 pada refresh atau direct URL access

**Solutions:**
- Normal untuk SPA, Vercel sudah dikonfigurasi dengan rewrites
- Check `vercel.json` rewrites configuration
- Ensure all routes redirect ke `/index.html`

### Environment Variables Not Working

**Error:** `VITE_API_URL` is undefined

**Solutions:**
1. Ensure variable name starts with `VITE_`
2. Restart dev server setelah edit .env
3. Check variable is set di Vercel environment variables
4. Rebuild setelah set environment variables

## 🎯 Best Practices

1. **Environment Variables:**
   - Always use `VITE_` prefix untuk client-side variables
   - Never expose sensitive data (secrets, API keys)
   - Use different URLs untuk dev/prod

2. **API Calls:**
   - Use centralized API client (api.js)
   - Handle errors gracefully
   - Show loading states
   - Validate user input

3. **Authentication:**
   - Store token securely (localStorage)
   - Auto-refresh token jika expired
   - Clear token on logout
   - Protect routes dengan auth check

4. **Performance:**
   - Lazy load routes jika perlu
   - Optimize images
   - Use code splitting
   - Minimize bundle size

## 🔗 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vercel Deployment](https://vercel.com/docs)

