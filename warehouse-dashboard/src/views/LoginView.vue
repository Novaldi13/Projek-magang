<template>
  <div class="auth-page">
    <!-- Animated Background -->
    <div class="auth-bg">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <!-- Centered Card -->
    <div class="auth-card fade-in">
      <!-- Logo -->
      <div class="auth-logo">
        <img src="/Logo Gitronik.png" alt="Gitronik Logo" />
      </div>

      <!-- Title -->
      <div class="auth-header">
        <h1>Welcome Back</h1>
        <p>Login untuk mengakses sistem tracking produk</p>
      </div>

      <!-- Error Message -->
      <transition name="slide-fade">
        <div v-if="errorMessage" class="auth-error">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </transition>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="auth-form">
        <!-- Email -->
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label for="login-email">Email</label>
          <div class="input-wrapper">
            <i class="pi pi-envelope input-icon"></i>
            <input
              id="login-email"
              v-model="form.email"
              type="email"
              placeholder="email@gitronik.com"
              autocomplete="email"
              @focus="clearError('email')"
            />
          </div>
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- Password -->
        <div class="form-group" :class="{ 'has-error': errors.password }">
          <label for="login-password">Password</label>
          <div class="input-wrapper">
            <i class="pi pi-lock input-icon"></i>
            <input
              id="login-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan password"
              autocomplete="current-password"
              @focus="clearError('password')"
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Remember Me + Forgot -->
        <div class="form-row">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.rememberMe" />
            <span>Remember me</span>
          </label>
          <router-link to="/forgot-password" class="forgot-link">Forgot password?</router-link>
        </div>

        <!-- Submit -->
        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="btn-loader"></span>
          <i v-else class="pi pi-sign-in"></i>
          <span>{{ isLoading ? 'Logging in...' : 'Login' }}</span>
        </button>
      </form>

      <!-- Footer -->
      <p class="auth-footer">
        Belum punya akun? <router-link to="/register">Buat akun baru</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const form = reactive({ email: '', password: '', rememberMe: false });
const errors = reactive({ email: '', password: '' });

function clearError(field: 'email' | 'password') {
  errors[field] = '';
  errorMessage.value = '';
}

function validate(): boolean {
  let valid = true;
  if (!form.email.trim()) {
    errors.email = 'Email wajib diisi';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid';
    valid = false;
  }
  if (!form.password.trim()) {
    errors.password = 'Password wajib diisi';
    valid = false;
  }
  return valid;
}

function handleLogin() {
  errorMessage.value = '';
  if (!validate()) return;
  isLoading.value = true;
  setTimeout(() => {
    if (form.email === 'admin@gitronik.com' && form.password === 'admin123') {
      const userData = { name: 'Admin Gitronik', email: form.email, role: 'Administrator', loggedIn: true };
      if (form.rememberMe) localStorage.setItem('auth_user', JSON.stringify(userData));
      else sessionStorage.setItem('auth_user', JSON.stringify(userData));
      router.push('/');
    } else {
      errorMessage.value = 'Email atau password salah. Gunakan admin@gitronik.com / admin123';
    }
    isLoading.value = false;
  }, 1500);
}
</script>

<style scoped>
/* ─── Page ─────────────────────────────────────── */
.auth-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  overflow: hidden;
}

/* ─── Background ────────────────────────────────── */
.auth-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(145deg, #f0f7ff 0%, #f8fafc 50%, #f0fdf4 100%);
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.45;
  animation: drift 18s ease-in-out infinite;
}
.shape-1 {
  width: 480px; height: 480px;
  background: radial-gradient(circle, rgba(14,165,233,0.18), transparent 70%);
  top: -100px; left: -80px;
}
.shape-2 {
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(16,185,129,0.14), transparent 70%);
  bottom: -80px; right: -60px;
  animation-delay: -9s;
}
@keyframes drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(24px, -24px); }
}

/* ─── Card ──────────────────────────────────────── */
.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px);
  border-radius: 20px;
  padding: 40px 36px;
  box-shadow:
    0 1px 3px rgba(0,0,0,0.04),
    0 12px 40px rgba(0,0,0,0.08),
    0 0 0 1px rgba(255,255,255,0.7) inset;
}

/* ─── Logo ──────────────────────────────────────── */
.auth-logo {
  text-align: center;
  margin-bottom: 28px;
}
.auth-logo img {
  height: 42px;
  object-fit: contain;
}

/* ─── Header ────────────────────────────────────── */
.auth-header {
  text-align: center;
  margin-bottom: 28px;
}
.auth-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}
.auth-header p {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

/* ─── Error Alert ───────────────────────────────── */
.auth-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  margin-bottom: 18px;
  font-size: 12.5px;
  color: #dc2626;
  line-height: 1.4;
}
.auth-error .pi { font-size: 14px; flex-shrink: 0; }

/* ─── Form ──────────────────────────────────────── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 14px;
  font-size: 14px;
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.2s;
}
.input-wrapper input {
  width: 100%;
  padding: 11px 14px 11px 42px;
  border: 1.5px solid #e2e8f0;
  border-radius: 11px;
  font-size: 13.5px;
  color: #1e293b;
  background: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}
.input-wrapper input::placeholder { color: #c8d5e3; }
.input-wrapper input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
}
.has-error .input-wrapper input {
  border-color: #fca5a5;
  box-shadow: 0 0 0 3px rgba(248,113,113,0.1);
}

.field-error {
  font-size: 11.5px;
  color: #ef4444;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.toggle-password:hover { color: #64748b; }

/* ─── Row: Remember + Forgot ────────────────────── */
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  user-select: none;
}
.checkbox-label input[type="checkbox"] {
  width: 15px; height: 15px;
  accent-color: #0ea5e9;
  cursor: pointer;
}
.forgot-link {
  font-size: 13px;
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.forgot-link:hover { color: #0284c7; }

/* ─── Button ─────────────────────────────────────── */
.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 11px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(14,165,233,0.28);
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  font-family: inherit;
  margin-top: 4px;
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14,165,233,0.38);
}
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

.btn-loader {
  width: 17px; height: 17px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Footer ─────────────────────────────────────── */
.auth-footer {
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  margin: 22px 0 0;
}
.auth-footer a {
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}
.auth-footer a:hover { color: #0284c7; }

/* ─── Animations ─────────────────────────────────── */
.fade-in { animation: fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.slide-fade-enter-active { transition: all 0.25s ease-out; }
.slide-fade-leave-active { transition: all 0.2s ease-in; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-8px); }

/* ─── Mobile ─────────────────────────────────────── */
@media (max-width: 480px) {
  .auth-card { padding: 32px 24px; border-radius: 16px; }
  .auth-header h1 { font-size: 21px; }
}
</style>
