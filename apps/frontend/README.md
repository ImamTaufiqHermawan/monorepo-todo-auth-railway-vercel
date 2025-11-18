# Frontend - Todo Application (React + Vite)

Modern React application untuk Todo management dengan authentication, deployed ke Vercel sebagai static site.

## Features

- Modern React 19 dengan Hooks
- React Router untuk navigation
- JWT Authentication
- Todo CRUD Operations
- Responsive UI
- Protected Routes
- Auto token management
- Error Handling
- Loading States

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main app component dengan routing
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   ├── pages/
│   │   ├── Login.jsx        # Halaman login
│   │   ├── Register.jsx     # Halaman register
│   │   ├── Dashboard.jsx    # Halaman todo dashboard
│   │   └── NotFound.jsx     # Halaman 404
│   └── utils/
│       ├── api.js           # Axios instance & interceptors
│       └── auth.js          # Auth utilities (token management)
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel configuration
├── .env.example             # Environment variables template
└── package.json
```

## Tech Stack

- React 19 - UI library
- Vite 5 - Build tool & dev server
- React Router 6 - Client-side routing
- Axios - HTTP client
- Modern CSS - Styling

## Environment Variables

Copy `.env.example` ke `.env` dan isi dengan backend URL:

```env
# Backend API URL
# Untuk local development: http://localhost:3001
# Untuk production: https://your-backend.vercel.app
VITE_API_URL=http://localhost:3001
```

**PENTING:** 
- Semua environment variables yang digunakan di frontend harus pakai prefix `VITE_`
- Ini requirement dari Vite untuk security (hanya expose variable yang explicit)

### Environment Variables untuk Vercel

Set di Vercel Project > Settings > Environment Variables untuk environment "Production":

**Required:**
- `VITE_API_URL` - Backend API URL (contoh: `https://your-backend.vercel.app`)

## Local Development

### Prerequisites

- Node.js 22 atau lebih baru
- Backend API running (atau use production URL)
- pnpm (atau npm)

**PENTING: Install pnpm dulu jika belum:**
```bash
npm install -g pnpm
```

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env dan isi dengan backend API URL
# Untuk local development: VITE_API_URL=http://localhost:3001
```

### Run Development Server

```bash
# Start dev server
pnpm dev

# Server akan berjalan di http://localhost:5173
```

### Access Application

1. Buka browser: http://localhost:5173
2. Register user baru
3. Login dengan user yang sudah dibuat
4. Mulai create, update, delete todos

## Build untuk Production

```bash
# Build
pnpm build

# Build akan create folder dist/ dengan optimized production files
```

### Preview Production Build

```bash
# Preview production build locally
pnpm preview

# Server akan berjalan di http://localhost:4173
```

## Deployment ke Vercel

### Cara Deploy

1. Login ke Vercel Dashboard: https://vercel.com
2. Klik "Add New Project"
3. Import repository dari GitHub
4. Configure:
   - Root Directory: KOSONGKAN (biarkan kosong)
   - Framework Preset: Vite (auto-detect)
   - Build Command: `pnpm build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_API_URL` = Backend production URL
6. Deploy

### Vercel Configuration

File `vercel.json` sudah dikonfigurasi untuk:
- Build dengan pnpm
- Handle client-side routing (semua routes redirect ke index.html)
- Set Node.js version ke 22

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "npm install -g pnpm && pnpm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Testing Production

Setelah deploy, akses URL Vercel Anda:
```
https://<your-deployment-url>.vercel.app
```

## Application Flow

### 1. Authentication Flow

**Register:**
1. User isi form register (email & password)
2. Frontend kirim POST request ke `/api/auth/register`
3. Backend create user dan return JWT token
4. Frontend simpan token di localStorage
5. Redirect ke dashboard

**Login:**
1. User isi form login (email & password)
2. Frontend kirim POST request ke `/api/auth/login`
3. Backend verify credentials dan return JWT token
4. Frontend simpan token di localStorage
5. Redirect ke dashboard

**Logout:**
1. User klik tombol logout
2. Frontend hapus token dari localStorage
3. Redirect ke halaman login

### 2. Protected Routes

Semua routes di-protect dengan check authentication status:
- Jika belum login -> redirect ke /login
- Jika sudah login tapi akses /login atau /register -> redirect ke dashboard

### 3. API Requests

Semua API requests otomatis:
1. Tambahkan JWT token di Authorization header (via axios interceptor)
2. Handle error 401 (unauthorized) -> logout dan redirect ke login
3. Return response atau throw error

### 4. Todo Operations

**Get Todos:**
1. Dashboard component mount
2. Fetch todos dari `/api/todos`
3. Display todos di UI

**Create Todo:**
1. User ketik title dan klik tombol create
2. POST request ke `/api/todos` dengan title
3. Server return todo baru
4. UI update dengan todo baru

**Update Todo:**
1. User klik checkbox (toggle completed) atau edit title
2. PUT request ke `/api/todos/:id` dengan data update
3. Server return todo yang sudah diupdate
4. UI update dengan data baru

**Delete Todo:**
1. User klik tombol delete
2. DELETE request ke `/api/todos/:id`
3. Server return success message
4. UI remove todo dari list

## Code Structure Explanation

### src/App.jsx

Main component yang handle routing:
- Define semua routes (login, register, dashboard, 404)
- Implement protected routes logic
- Track authentication status dengan state

### src/pages/Login.jsx

Halaman login dengan:
- Form untuk email dan password
- Submit handler yang kirim request ke backend
- Error handling dan loading state
- Link ke halaman register

### src/pages/Register.jsx

Halaman register dengan:
- Form untuk email dan password
- Validation (password minimal 8 karakter)
- Submit handler yang kirim request ke backend
- Error handling dan loading state
- Link ke halaman login

### src/pages/Dashboard.jsx

Halaman utama aplikasi dengan:
- List semua todos
- Form untuk create todo baru
- Button untuk toggle completed status
- Button untuk delete todo
- Logout button

### src/pages/NotFound.jsx

Halaman 404 untuk route yang tidak ditemukan

### src/utils/api.js

Axios instance dengan konfigurasi:
- Base URL dari environment variable
- Request interceptor: tambahkan JWT token ke header
- Response interceptor: handle 401 error (logout otomatis)

### src/utils/auth.js

Helper functions untuk manage authentication:
- `getToken()` - ambil token dari localStorage
- `setToken(token)` - simpan token ke localStorage
- `removeToken()` - hapus token dari localStorage
- `isAuthenticated()` - cek apakah user sudah login

## Troubleshooting

### Issue: API request error - Network Error

**Penyebab:**
- Backend tidak running
- VITE_API_URL salah
- CORS issue

**Solusi:**
1. Pastikan backend sudah running
2. Cek VITE_API_URL di `.env` sudah benar
3. Test backend di browser: `http://localhost:3001/health`
4. Restart dev server setelah ubah .env

### Issue: Environment variable undefined

**Error:** `import.meta.env.VITE_API_URL` undefined

**Penyebab:**
- Env variable tidak pakai prefix `VITE_`
- File `.env` belum dibuat
- Dev server tidak direstart setelah ubah .env

**Solusi:**
1. Pastikan env variable pakai prefix `VITE_`
2. Buat file `.env` dari `.env.example`
3. Restart dev server dengan `pnpm dev`

### Issue: 401 Unauthorized error

**Penyebab:**
- Token tidak ada (belum login)
- Token expired
- Token invalid

**Solusi:**
1. Logout dan login ulang
2. Cek localStorage ada token atau tidak (F12 > Application > Local Storage)
3. Cek token belum expired

### Issue: Redirect loop atau blank page

**Penyebab:**
- Authentication state tidak sync
- LocalStorage corrupted

**Solusi:**
1. Clear browser cache dan localStorage
2. Logout dan login ulang
3. Restart browser

### Issue: Vercel build failed

**Error:** `pnpm not found`

**Solusi:**
Pastikan `vercel.json` ada installCommand:
```json
{
  "installCommand": "npm install -g pnpm && pnpm install"
}
```

---

**Error:** `VITE_API_URL is not defined`

**Penyebab:** Environment variable tidak diset di Vercel

**Solusi:**
1. Go to Vercel Project > Settings > Environment Variables
2. Add `VITE_API_URL` dengan backend production URL
3. Redeploy

### Issue: Production app tidak bisa routing

**Penyebab:** Client-side routing tidak dikonfigurasi

**Solusi:**
Pastikan `vercel.json` ada rewrites:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue: CORS error di production

**Penyebab:** Backend tidak allow origin dari frontend

**Solusi:**
Backend sudah pakai middleware `cors()` tanpa restriction. Jika masih error:
1. Cek browser console untuk detail error
2. Pastikan backend dan frontend sama-sama HTTPS
3. Cek backend logs di Vercel

## Tips untuk Newbie

### Cara Kerja React Hooks

**useState:**
```jsx
const [todos, setTodos] = useState([]);
// todos = state value
// setTodos = function untuk update state
```

**useEffect:**
```jsx
useEffect(() => {
  // Code di sini jalan saat component mount
  fetchTodos();
}, []); // [] = dependency array (kosong = jalan 1x saat mount)
```

### Cara Kerja Protected Routes

```jsx
isAuthenticated ? (
  <Dashboard />  // Tampilkan jika sudah login
) : (
  <Navigate to="/login" />  // Redirect jika belum login
)
```

### Cara Kerja Axios Interceptors

**Request Interceptor:**
```jsx
// Jalan sebelum request dikirim
api.interceptors.request.use((config) => {
  // Tambahkan token ke header
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Response Interceptor:**
```jsx
// Jalan setelah dapat response
api.interceptors.response.use(
  (response) => response,  // Success
  (error) => {
    // Handle error
    if (error.response?.status === 401) {
      // Logout jika unauthorized
    }
    return Promise.reject(error);
  }
);
```

### Cara Kerja LocalStorage

```jsx
// Simpan data
localStorage.setItem('key', 'value');

// Ambil data
const value = localStorage.getItem('key');

// Hapus data
localStorage.removeItem('key');
```

**PENTING:** LocalStorage hanya bisa simpan string. Untuk object, pakai JSON:
```jsx
// Simpan object
localStorage.setItem('user', JSON.stringify({ id: 1, name: 'John' }));

// Ambil object
const user = JSON.parse(localStorage.getItem('user'));
```

### Cara Kerja Vite Environment Variables

1. Buat file `.env` di root project
2. Tambahkan variable dengan prefix `VITE_`:
   ```
   VITE_API_URL=http://localhost:3001
   ```
3. Access di code:
   ```jsx
   const apiUrl = import.meta.env.VITE_API_URL;
   ```
4. Restart dev server setelah ubah `.env`

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vercel Documentation](https://vercel.com/docs)
