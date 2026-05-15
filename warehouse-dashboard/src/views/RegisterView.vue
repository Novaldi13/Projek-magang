<template>
  <div class="auth-page">
    <div class="auth-bg">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <div class="auth-card fade-in">
      <!-- Logo -->
      <div class="auth-logo">
        <img src="/Logo Gitronik.png" alt="Gitronik Logo" />
      </div>

      <!-- Title -->
      <div class="auth-header">
        <h1>Create Account</h1>
        <p>Daftar akun baru untuk mengakses sistem</p>
      </div>

      <!-- Alerts -->
      <transition name="slide-fade">
        <div v-if="successMessage" class="auth-success">
          <i class="pi pi-check-circle"></i>
          <span>{{ successMessage }}</span>
        </div>
      </transition>
      <transition name="slide-fade">
        <div v-if="errorMessage" class="auth-error">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </transition>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="auth-form">
        <!-- Full Name -->
        <div class="form-group" :class="{ 'has-error': errors.fullName }">
          <label for="reg-name">Full Name</label>
          <div class="input-wrapper">
            <i class="pi pi-user input-icon"></i>
            <input id="reg-name" v-model="form.fullName" type="text" placeholder="Nama lengkap" @focus="clearError('fullName')" />
          </div>
          <span v-if="errors.fullName" class="field-error">{{ errors.fullName }}</span>
        </div>

        <!-- Username -->
        <div class="form-group" :class="{ 'has-error': errors.username }">
          <label for="reg-user">Username</label>
          <div class="input-wrapper">
            <i class="pi pi-at input-icon"></i>
            <input id="reg-user" v-model="form.username" type="text" placeholder="Username" @focus="clearError('username')" />
          </div>
          <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
        </div>

        <!-- Email -->
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label for="reg-email">Email</label>
          <div class="input-wrapper">
            <i class="pi pi-envelope input-icon"></i>
            <input id="reg-email" v-model="form.email" type="email" placeholder="email@example.com" @focus="clearError('email')" />
          </div>
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- Password -->
        <div class="form-group" :class="{ 'has-error': errors.password }">
          <label for="reg-pass">Password</label>
          <div class="input-wrapper">
            <i class="pi pi-lock input-icon"></i>
            <input id="reg-pass" v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Min. 6 karakter" @focus="clearError('password')" @input="updateStrength" />
            <button type="button" class="toggle-password" @click="showPass = !showPass">
              <i :class="showPass ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <!-- Strength indicator -->
          <div v-if="form.password" class="strength-row">
            <div class="strength-bars">
              <div v-for="i in 4" :key="i" class="strength-bar" :class="{ active: i <= strengthLevel, [`s${strengthLevel}`]: i <= strengthLevel }"></div>
            </div>
            <span class="strength-text" :class="`s${strengthLevel}`">{{ strengthLabel }}</span>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Confirm Password -->
        <div class="form-group" :class="{ 'has-error': errors.confirmPassword }">
          <label for="reg-confirm">Confirm Password</label>
          <div class="input-wrapper">
            <i class="pi pi-lock input-icon"></i>
            <input id="reg-confirm" v-model="form.confirmPassword" :type="showConfirm ? 'text' : 'password'" placeholder="Ulangi password" @focus="clearError('confirmPassword')" />
            <button type="button" class="toggle-password" @click="showConfirm = !showConfirm">
              <i :class="showConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Terms -->
        <div>
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.agreeTerms" />
            <span>Saya setuju dengan <a href="#" @click.prevent class="terms-link">Terms & Conditions</a></span>
          </label>
          <span v-if="errors.agreeTerms" class="field-error" style="display:block;margin-top:4px">{{ errors.agreeTerms }}</span>
        </div>

        <!-- Submit -->
        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="btn-loader"></span>
          <i v-else class="pi pi-user-plus"></i>
          <span>{{ isLoading ? 'Creating account...' : 'Create Account' }}</span>
        </button>
      </form>

      <p class="auth-footer">
        Sudah punya akun? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showPass = ref(false);
const showConfirm = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const strengthLevel = ref(0);
const strengthLabel = ref('');

const form = reactive({ fullName: '', username: '', email: '', password: '', confirmPassword: '', agreeTerms: false });
const errors = reactive({ fullName: '', username: '', email: '', password: '', confirmPassword: '', agreeTerms: '' });

function clearError(f: keyof typeof errors) { errors[f] = ''; errorMessage.value = ''; }

function updateStrength() {
  const p = form.password;
  let s = 0;
  if (p.length >= 6) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  strengthLevel.value = s;
  strengthLabel.value = ['', 'Weak', 'Fair', 'Good', 'Strong'][s] || '';
}

function validate(): boolean {
  let ok = true;
  if (!form.fullName.trim()) { errors.fullName = 'Nama wajib diisi'; ok = false; }
  if (!form.username.trim()) { errors.username = 'Username wajib diisi'; ok = false; }
  else if (form.username.length < 3) { errors.username = 'Min. 3 karakter'; ok = false; }
  if (!form.email.trim()) { errors.email = 'Email wajib diisi'; ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Format email tidak valid'; ok = false; }
  if (!form.password) { errors.password = 'Password wajib diisi'; ok = false; }
  else if (form.password.length < 6) { errors.password = 'Min. 6 karakter'; ok = false; }
  if (!form.confirmPassword) { errors.confirmPassword = 'Konfirmasi password'; ok = false; }
  else if (form.password !== form.confirmPassword) { errors.confirmPassword = 'Password tidak cocok'; ok = false; }
  if (!form.agreeTerms) { errors.agreeTerms = 'Anda harus menyetujui Terms & Conditions'; ok = false; }
  return ok;
}

function handleRegister() {
  errorMessage.value = ''; successMessage.value = '';
  if (!validate()) return;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    successMessage.value = 'Akun berhasil dibuat! Redirecting ke halaman login...';
    setTimeout(() => router.push('/login'), 2000);
  }, 1800);
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
  background: linear-gradient(145deg, #f0fdf4 0%, #f8fafc 50%, #f0f7ff 100%);
}
.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.45;
  animation: drift 18s ease-in-out infinite;
}
.shape-1 {
  width: 420px; height: 420px;
  background: radial-gradient(circle, rgba(16,185,129,0.16), transparent 70%);
  top: -80px; right: -60px;
}
.shape-2 {
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(14,165,233,0.14), transparent 70%);
  bottom: -80px; left: -60px;
  animation-delay: -9s;
}
@keyframes drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
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
  padding: 36px 36px 32px;
  box-shadow:
    0 1px 3px rgba(0,0,0,0.04),
    0 12px 40px rgba(0,0,0,0.08),
    0 0 0 1px rgba(255,255,255,0.7) inset;
}

/* ─── Logo ──────────────────────────────────────── */
.auth-logo { text-align: center; margin-bottom: 24px; }
.auth-logo img { height: 40px; object-fit: contain; }

/* ─── Header ────────────────────────────────────── */
.auth-header { text-align: center; margin-bottom: 24px; }
.auth-header h1 { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 5px; letter-spacing: -0.3px; }
.auth-header p { font-size: 13px; color: #94a3b8; margin: 0; }

/* ─── Alerts ────────────────────────────────────── */
.auth-error {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; background: #fef2f2;
  border: 1px solid #fecaca; border-radius: 10px;
  margin-bottom: 16px; font-size: 12.5px; color: #dc2626;
}
.auth-success {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; background: #ecfdf5;
  border: 1px solid #a7f3d0; border-radius: 10px;
  margin-bottom: 16px; font-size: 12.5px; color: #059669;
}
.auth-error .pi, .auth-success .pi { font-size: 14px; flex-shrink: 0; }

/* ─── Form ──────────────────────────────────────── */
.auth-form { display: flex; flex-direction: column; gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label { font-size: 13px; font-weight: 600; color: #334155; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 14px; font-size: 14px; color: #94a3b8; pointer-events: none; transition: color 0.2s; }
.input-wrapper input {
  width: 100%; padding: 10px 14px 10px 42px;
  border: 1.5px solid #e2e8f0; border-radius: 11px;
  font-size: 13.5px; color: #1e293b; background: #fff;
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}
.input-wrapper input::placeholder { color: #c8d5e3; }
.input-wrapper input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
.has-error .input-wrapper input { border-color: #fca5a5; box-shadow: 0 0 0 3px rgba(248,113,113,0.1); }
.field-error { font-size: 11.5px; color: #ef4444; }
.toggle-password {
  position: absolute; right: 12px; background: none; border: none;
  cursor: pointer; color: #94a3b8; padding: 4px;
  display: flex; align-items: center; transition: color 0.2s;
}
.toggle-password:hover { color: #64748b; }

/* ─── Strength ──────────────────────────────────── */
.strength-row { display: flex; align-items: center; gap: 10px; margin-top: 5px; }
.strength-bars { display: flex; gap: 4px; }
.strength-bar { width: 36px; height: 3.5px; border-radius: 2px; background: #e2e8f0; transition: background 0.3s; }
.strength-bar.active.s1 { background: #ef4444; }
.strength-bar.active.s2 { background: #f59e0b; }
.strength-bar.active.s3 { background: #3b82f6; }
.strength-bar.active.s4 { background: #10b981; }
.strength-text { font-size: 11px; font-weight: 600; }
.strength-text.s1 { color: #ef4444; }
.strength-text.s2 { color: #f59e0b; }
.strength-text.s3 { color: #3b82f6; }
.strength-text.s4 { color: #10b981; }

/* ─── Checkbox ──────────────────────────────────── */
.checkbox-label {
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; color: #64748b; cursor: pointer; user-select: none;
}
.checkbox-label input[type="checkbox"] { width: 15px; height: 15px; accent-color: #0ea5e9; cursor: pointer; }
.terms-link { color: #0ea5e9; text-decoration: none; font-weight: 500; }
.terms-link:hover { color: #0284c7; }

/* ─── Button ─────────────────────────────────────── */
.btn-primary {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 12px 24px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white; border: none; border-radius: 11px;
  font-size: 14px; font-weight: 600; cursor: pointer;
  box-shadow: 0 4px 14px rgba(14,165,233,0.28);
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  font-family: inherit; margin-top: 2px;
}
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(14,165,233,0.38); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
.btn-loader { width: 17px; height: 17px; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.65s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Footer ─────────────────────────────────────── */
.auth-footer { text-align: center; font-size: 13px; color: #94a3b8; margin: 20px 0 0; }
.auth-footer a { color: #0ea5e9; text-decoration: none; font-weight: 600; transition: color 0.2s; }
.auth-footer a:hover { color: #0284c7; }

/* ─── Animations ─────────────────────────────────── */
.fade-in { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.slide-fade-enter-active { transition: all 0.25s ease-out; }
.slide-fade-leave-active { transition: all 0.2s ease-in; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-8px); }

/* ─── Mobile ─────────────────────────────────────── */
@media (max-width: 480px) {
  .auth-card { padding: 28px 22px; border-radius: 16px; }
  .auth-header h1 { font-size: 20px; }
}
</style>
