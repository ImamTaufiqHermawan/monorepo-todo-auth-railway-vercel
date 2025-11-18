// Key untuk menyimpan JWT token di localStorage
const TOKEN_KEY = 'todo_token';

// Ambil JWT token dari localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Simpan JWT token ke localStorage
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Hapus JWT token dari localStorage (saat logout)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Cek apakah user sudah login (ada token atau tidak)
export const isAuthenticated = () => {
  return !!getToken();
};

