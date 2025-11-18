# Playwright E2E Testing

## Overview

E2E (End-to-End) tests menggunakan Playwright untuk testing full user flow aplikasi Todo.

## Test Coverage

### ✅ Full User Flow (`e2e/user-flow.spec.js`)

Test ini mencakup skenario lengkap user journey:

1. **Register** - User baru melakukan registrasi
2. **Create Todos** - Membuat 3 todos berbeda
3. **Edit Todo** - Mengedit salah satu todo
4. **Complete Todo** - Menandai todo sebagai selesai
5. **Delete Todo** - Menghapus salah satu todo
6. **Logout** - User logout dari aplikasi
7. **Login** - User login kembali dengan credentials yang sama
8. **Data Persistence** - Verify data todos masih ada setelah login ulang

### ✅ Validation Tests

- Registration dengan data invalid
- Login dengan credentials yang salah
- Protected routes (dashboard tanpa auth)

## Prerequisites

### 1. Install Dependencies

```bash
# Di root project
pnpm install

# Atau specific di frontend
cd apps/frontend
pnpm install
```

### 2. Install Playwright Browsers

```bash
cd apps/frontend
pnpm exec playwright install
```

### 3. Backend Running

E2E tests membutuhkan backend API running:

## 🎬 Slow Motion Mode (NEW!)

Untuk recording video atau debugging, bisa memperlambat eksekusi test:

### Quick Commands
```bash
# UI mode dengan slow motion (500ms delay)
pnpm test:e2e:ui:slow

# Headed mode dengan slow motion
pnpm test:e2e:headed:slow
```

### Custom Speed
```bash
# Very slow (1 second delay between actions)
set SLOW_MO=1000 && pnpm test:e2e:ui

# Medium slow (500ms - default)
set SLOW_MO=500 && pnpm test:e2e:ui

# Slightly slow (100ms)
set SLOW_MO=100 && pnpm test:e2e:ui
```

**Perfect for:**
- 📹 Recording demo videos
- 🐛 Debugging test failures
- 📚 Understanding test flow
- 🎓 Presentations & tutorials

---

```bash
# Di terminal terpisah
cd apps/backend
pnpm dev
```

Backend harus accessible di `http://localhost:3000`

## Running Tests

### Development Mode

```bash
# Dari frontend directory
cd apps/frontend

# Run all E2E tests (headless, fast)
pnpm test:e2e

# Run dengan UI mode (interactive, normal speed)
pnpm test:e2e:ui

# Run dengan UI mode (SLOW MOTION - 500ms delay) 🐢
pnpm test:e2e:ui:slow

# Run dengan browser visible (headed mode, normal speed)
pnpm test:e2e:headed

# Run dengan browser visible (SLOW MOTION) 🐢
pnpm test:e2e:headed:slow

# Run dalam debug mode (step-by-step)
pnpm test:e2e:debug
```

### From Root (using Turbo)

```bash
# From monorepo root
pnpm --filter @todo/frontend test:e2e
```

## Test Environment

### Configuration

Test configuration ada di `playwright.config.js`:

- **Base URL**: `http://localhost:5173` (Vite dev server)
- **Timeout**: 30 seconds per test
- **Retries**: 2x on CI, 0x on local
- **Screenshot**: On failure only
- **Video**: On retry
- **Trace**: On first retry

### Auto Web Server

Playwright akan otomatis:
1. Start Vite dev server (`pnpm dev`)
2. Wait hingga server ready
3. Run tests
4. Stop server setelah tests selesai

## Test Structure

```
apps/frontend/
├── e2e/
│   ├── user-flow.spec.js      # Main E2E test
│   └── (future tests)
├── playwright.config.js        # Playwright configuration
├── playwright-report/          # HTML reports (gitignored)
└── test-results/               # Test artifacts (gitignored)
```

## Test Results

### HTML Report

Setelah tests selesai, HTML report otomatis di-generate:

```bash
# Open report
pnpm exec playwright show-report
```

### Screenshots & Videos

Jika test gagal, screenshots dan videos otomatis tersimpan di `test-results/`

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install Playwright Browsers
  run: pnpm exec playwright install --with-deps
  working-directory: ./apps/frontend

- name: Run E2E Tests
  run: pnpm test:e2e
  working-directory: ./apps/frontend
  env:
    BASE_URL: ${{ secrets.FRONTEND_URL }}

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: apps/frontend/playwright-report/
```

## Debugging Tests

### Visual Debugging

```bash
# UI Mode - Best untuk development
pnpm test:e2e:ui

# Debug Mode - Step through tests
pnpm test:e2e:debug
```

### Playwright Inspector

```bash
# Set environment variable
$env:PWDEBUG="1"
pnpm test:e2e
```

### Console Logs

Tests sudah include detailed console.log untuk setiap step:

```
Step 1: Testing Register Flow
✓ Register successful
Step 2: Testing Create Todos
✓ Created 3 todos successfully
...
```

## Common Issues

### Issue: Backend not running

**Error**: `page.goto: net::ERR_CONNECTION_REFUSED`

**Solution**: 
```bash
# Start backend di terminal terpisah
cd apps/backend
pnpm dev
```

### Issue: Vite port already in use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Kill process menggunakan port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5173 | xargs kill -9
```

### Issue: Selectors not found

**Error**: `Timeout 30000ms exceeded waiting for selector`

**Solution**:
- Check apakah frontend sudah running
- Verify selector di test match dengan actual HTML
- Gunakan Playwright Inspector untuk debug selectors

## Best Practices

### 1. Unique Test Data

Tests menggunakan unique email berdasarkan timestamp:

```javascript
const timestamp = Date.now();
const testEmail = `testuser${timestamp}@example.com`;
```

### 2. Wait Strategies

```javascript
// ✅ Good - Wait for element
await expect(page.locator('text=Todo')).toBeVisible();

// ❌ Bad - Fixed timeout
await page.waitForTimeout(5000);
```

### 3. Assertions

```javascript
// ✅ Good - Auto-retry assertions
await expect(page).toHaveURL('/');

// ❌ Bad - No retry
const url = page.url();
expect(url).toBe('/dashboard');
```

### 4. Cleanup

Test menggunakan unique user per run, jadi tidak perlu manual cleanup. Untuk production testing, tambahkan cleanup logic.

## Extending Tests

### Add New Test File

```javascript
// e2e/todo-operations.spec.js
import { test, expect } from '@playwright/test';

test.describe('Todo Operations', () => {
  test('should filter todos by status', async ({ page }) => {
    // Test implementation
  });
});
```

### Add New Browser

Edit `playwright.config.js`:

```javascript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
],
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Test Generator](https://playwright.dev/docs/codegen)

## Codegen - Generate Tests

Playwright dapat generate test code secara otomatis:

```bash
# Start codegen
pnpm exec playwright codegen http://localhost:5173

# Navigate aplikasi, Playwright akan generate code
```

---

**Note**: E2E tests ini tidak perlu di-run di CI/CD pipeline sesuai requirement user. Tests ini untuk local development dan manual QA testing.
