import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';

function isAuthenticated(): boolean {
  const fromLocal = localStorage.getItem('auth_user');
  const fromSession = sessionStorage.getItem('auth_user');
  if (fromLocal) {
    try { return JSON.parse(fromLocal).loggedIn === true; } catch { return false; }
  }
  if (fromSession) {
    try { return JSON.parse(fromSession).loggedIn === true; } catch { return false; }
  }
  return false;
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { isAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { isAuth: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { isAuth: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/rejects',
      name: 'rejects',
      component: () => import('../views/RejectView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tracking',
      name: 'tracking',
      component: () => import('../views/TrackingView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authed = isAuthenticated();

  if (to.meta.requiresAuth && !authed) {
    next({ name: 'login' });
  } else if (to.meta.isAuth && authed) {
    // Already logged in, redirect to dashboard
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
