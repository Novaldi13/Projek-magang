import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/rejects',
      name: 'rejects',
      component: () => import('../views/RejectView.vue')
    },
    {
      path: '/tracking',
      name: 'tracking',
      component: () => import('../views/TrackingView.vue')
    }
  ]
});

export default router;
