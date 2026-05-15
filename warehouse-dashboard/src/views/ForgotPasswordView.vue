<template>
  <div class="auth-page">
    <div class="auth-bg">
      <div class="auth-bg-shape shape-1"></div>
      <div class="auth-bg-shape shape-2"></div>
    </div>
    <div class="auth-container fade-in">
      <div class="auth-form-panel">
        <div class="auth-form-wrapper">
          <div class="auth-logo"><img src="/Logo Gitronik.png" alt="Gitronik Logo" /></div>
          <div class="back-link"><router-link to="/login"><i class="pi pi-arrow-left"></i> Kembali ke Login</router-link></div>
          <div class="auth-header">
            <div class="header-icon"><i class="pi pi-key"></i></div>
            <h1>Forgot Password</h1>
            <p>Masukkan email Anda untuk menerima link reset password</p>
          </div>

          <transition name="slide-fade">
            <div v-if="sent" class="auth-success">
              <i class="pi pi-check-circle"></i>
              <span>Link reset password telah dikirim ke <strong>{{ email }}</strong>. Silakan cek inbox Anda.</span>
            </div>
          </transition>

          <form v-if="!sent" @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group" :class="{ 'has-error': error }">
              <label for="fp-email">Email</label>
              <div class="input-wrapper">
                <i class="pi pi-envelope input-icon"></i>
                <input id="fp-email" v-model="email" type="email" placeholder="email@example.com" @focus="error = ''" />
              </div>
              <span v-if="error" class="field-error">{{ error }}</span>
            </div>
            <button type="submit" class="auth-btn primary" :disabled="isLoading">
              <span v-if="isLoading" class="btn-loader"></span>
              <i v-else class="pi pi-send"></i>
              <span>{{ isLoading ? 'Mengirim...' : 'Kirim Reset Link' }}</span>
            </button>
          </form>

          <button v-if="sent" class="auth-btn primary" @click="sent = false; email = ''">
            <i class="pi pi-refresh"></i><span>Kirim Ulang</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const email = ref('');
const error = ref('');
const isLoading = ref(false);
const sent = ref(false);

function handleSubmit() {
  if (!email.value.trim()) { error.value = 'Email wajib diisi'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { error.value = 'Format email tidak valid'; return; }
  isLoading.value = true;
  setTimeout(() => { isLoading.value = false; sent.value = true; }, 1500);
}
</script>

<style scoped>
.auth-page { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f4f8; overflow: hidden; padding: 20px; }
.auth-bg { position: fixed; inset: 0; z-index: 0; background: linear-gradient(135deg, #e0f2fe 0%, #f0f4f8 50%, #ecfdf5 100%); }
.auth-bg-shape { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; animation: float 20s ease-in-out infinite; }
.shape-1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(59,130,246,0.15), transparent); top: -10%; left: -5%; }
.shape-2 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(16,185,129,0.12), transparent); bottom: -10%; right: -5%; animation-delay: -7s; }
@keyframes float { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.95)} }

.auth-container { position: relative; z-index: 1; width: 100%; max-width: 440px; background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 50px -12px rgba(0,0,0,0.08); overflow: hidden; }
.auth-form-panel { padding: 40px 36px; }
.auth-form-wrapper { width: 100%; }
.auth-logo { text-align: center; margin-bottom: 16px; }
.auth-logo img { height: 40px; object-fit: contain; }
.back-link { margin-bottom: 24px; }
.back-link a { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; text-decoration: none; transition: color 0.2s; }
.back-link a:hover { color: #0ea5e9; }
.auth-header { text-align: center; margin-bottom: 28px; }
.header-icon { width: 56px; height: 56px; background: linear-gradient(135deg, rgba(14,165,233,0.1), rgba(5,150,105,0.1)); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.header-icon .pi { font-size: 24px; color: #0ea5e9; }
.auth-header h1 { font-size: 22px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
.auth-header p { font-size: 13px; color: #94a3b8; line-height: 1.5; }

.auth-success { display: flex; align-items: flex-start; gap: 8px; padding: 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; font-size: 13px; color: #059669; line-height: 1.5; }
.auth-success .pi { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

.auth-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 600; color: #334155; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 14px; font-size: 14px; color: #94a3b8; pointer-events: none; }
.input-wrapper input { width: 100%; padding: 11px 14px 11px 40px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 13px; color: #1e293b; background: #fff; outline: none; transition: all 0.2s; }
.input-wrapper input::placeholder { color: #cbd5e1; }
.input-wrapper input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
.has-error .input-wrapper input { border-color: #f87171; }
.field-error { font-size: 11px; color: #ef4444; }

.auth-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; width: 100%; }
.auth-btn.primary { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; box-shadow: 0 4px 12px rgba(14,165,233,0.3); }
.auth-btn.primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(14,165,233,0.4); }
.auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-loader { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.fade-in { animation: fadeInUp 0.6s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s ease-in; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-10px); opacity: 0; }
</style>
