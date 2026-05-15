<template>
  <div class="flex flex-col gap-6 w-full">

    <!-- Header + Date Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-[24px] font-bold text-[#1e293b] dark:text-slate-100 leading-tight">
          Dashboard Tracking Produk
        </h1>
        <p class="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5">
          Sistem monitoring produk, reject, dan garansi
        </p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition-all duration-200 w-fit">
        <i class="pi pi-calendar text-blue-400"></i>
        <span>{{ dateRangeLabel }}</span>
        <i class="pi pi-chevron-down text-xs text-slate-400"></i>
      </div>
    </div>

    <!-- Stat Cards -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <div v-for="i in 6" :key="i"
        class="h-[110px] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse">
      </div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="stat-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      >
        <div class="flex items-start justify-between">
          <span class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide leading-tight">{{ card.label }}</span>
          <div :class="`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${card.iconBg}`">
            <i :class="`${card.icon} text-base ${card.iconColor}`"></i>
          </div>
        </div>
        <div>
          <span class="text-[28px] font-bold text-[#1e293b] dark:text-slate-100 leading-none">{{ card.value }}</span>
          <div class="flex items-center gap-1 mt-1.5">
            <i :class="`pi ${card.trend >= 0 ? 'pi-arrow-up text-emerald-500' : 'pi-arrow-down text-red-400'} text-[10px]`"></i>
            <span :class="`text-[11px] font-medium ${card.trend >= 0 ? 'text-emerald-500' : 'text-red-400'}`">
              {{ Math.abs(card.trend) }}% vs kemarin
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 1: Line + Donut -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <!-- Area/Line Chart -->
      <div class="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-[15px] font-semibold text-[#1e293b] dark:text-slate-100">Pengiriman Produk Per Hari</h2>
            <p class="text-[11px] text-slate-400 mt-0.5">30 hari terakhir</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Terkirim
            </span>
          </div>
        </div>
        <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-[280px]" />
      </div>

      <!-- Donut Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div class="mb-4">
          <h2 class="text-[15px] font-semibold text-[#1e293b] dark:text-slate-100">Status Produk</h2>
          <p class="text-[11px] text-slate-400 mt-0.5">Distribusi status saat ini</p>
        </div>
        <div class="flex justify-center items-center" style="height: 240px;">
          <Chart type="doughnut" :data="donutChartData" :options="donutChartOptions" class="w-full max-w-[260px]" />
        </div>
        <!-- Legend -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
          <div v-for="(item, i) in donutLegend" :key="i" class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="`background:${item.color}`"></span>
            <span class="text-[11px] text-slate-500 dark:text-slate-400 truncate">{{ item.label }}: <strong class="text-slate-700 dark:text-slate-300">{{ item.value }}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 2: Bar chart -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-[15px] font-semibold text-[#1e293b] dark:text-slate-100">Jumlah Reject Per Bulan</h2>
          <p class="text-[11px] text-slate-400 mt-0.5">Tren reject 6 bulan terakhir</p>
        </div>
      </div>
      <Chart type="bar" :data="barChartData" :options="barChartOptions" class="h-[220px]" />
    </div>

    <!-- Bottom Row: Recent Activity + Warranty Warning -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">

      <!-- Recent Activity -->
      <div class="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-[15px] font-semibold text-[#1e293b] dark:text-slate-100">Aktivitas Terbaru</h2>
            <p class="text-[11px] text-slate-400 mt-0.5">10 aktivitas terakhir sistem</p>
          </div>
          <button class="text-[12px] text-blue-500 hover:text-blue-600 font-medium transition-colors">
            Lihat Semua →
          </button>
        </div>

        <!-- Empty state -->
        <div v-if="recentActivities.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-slate-600">
          <i class="pi pi-inbox text-5xl mb-3"></i>
          <p class="text-sm font-medium text-slate-400">Belum ada aktivitas</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-[12px]">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-700">
                <th class="text-left text-slate-400 font-semibold pb-2 pr-3">SN Produk</th>
                <th class="text-left text-slate-400 font-semibold pb-2 pr-3">Nama Produk</th>
                <th class="text-left text-slate-400 font-semibold pb-2 pr-3">Company</th>
                <th class="text-left text-slate-400 font-semibold pb-2 pr-3">Status</th>
                <th class="text-left text-slate-400 font-semibold pb-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(act, i) in recentActivities"
                :key="i"
                class="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td class="py-2.5 pr-3">
                  <span class="font-mono text-slate-600 dark:text-slate-300 text-[11px]">{{ act.sn }}</span>
                </td>
                <td class="py-2.5 pr-3 text-slate-700 dark:text-slate-300 font-medium">{{ act.name }}</td>
                <td class="py-2.5 pr-3 text-slate-500 dark:text-slate-400">{{ act.company }}</td>
                <td class="py-2.5 pr-3">
                  <span :class="`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadge(act.status)}`">
                    {{ act.status }}
                  </span>
                </td>
                <td class="py-2.5 text-slate-400 dark:text-slate-500 whitespace-nowrap">{{ act.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Warranty Warning -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-[15px] font-semibold text-[#1e293b] dark:text-slate-100">Warranty Warning</h2>
            <p class="text-[11px] text-slate-400 mt-0.5">Produk perlu perhatian</p>
          </div>
          <div class="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
            <i class="pi pi-bell text-orange-400 text-sm"></i>
          </div>
        </div>

        <div v-if="warrantyItems.length === 0" class="flex flex-col items-center justify-center py-10 text-slate-300 dark:text-slate-600">
          <i class="pi pi-check-circle text-4xl mb-2 text-emerald-300"></i>
          <p class="text-sm font-medium text-slate-400">Semua warranty aktif</p>
        </div>

        <div v-else class="flex flex-col gap-2.5">
          <div
            v-for="(item, i) in warrantyItems"
            :key="i"
            class="flex items-start justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm"
            :class="warrantyRowClass(item.warrantyStatus)"
          >
            <div class="flex flex-col gap-1 min-w-0 flex-1 pr-2">
              <span class="text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate">{{ item.name }}</span>
              <span class="text-[10px] font-mono text-slate-400">{{ item.sn }}</span>
              <span class="text-[10px] text-slate-400">Exp: {{ item.expiry }}</span>
            </div>
            <span :class="`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${warrantyBadge(item.warrantyStatus)}`">
              {{ item.warrantyStatus }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Chart from 'primevue/chart';

const loading = ref(true);

const now = new Date();
const dateRangeLabel = computed(() => {
  const start = new Date(now);
  start.setDate(now.getDate() - 29);
  const fmt = (d: Date) => d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' });
  return `${fmt(start)} – ${fmt(now)}`;
});

// ─── Stat Cards ──────────────────────────────────────────────
const statCards = ref([
  {
    label: 'Terkirim Hari Ini',
    value: 24,
    icon: 'pi pi-send',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
    trend: 12,
  },
  {
    label: 'Total Produk Tracking',
    value: 1482,
    icon: 'pi pi-box',
    iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-500',
    trend: 5,
  },
  {
    label: 'Total Barang Reject',
    value: 137,
    icon: 'pi pi-times-circle',
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-500',
    trend: -3,
  },
  {
    label: 'Dalam Perbaikan',
    value: 41,
    icon: 'pi pi-wrench',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-500',
    trend: 8,
  },
  {
    label: 'Warranty Expired',
    value: 18,
    icon: 'pi pi-exclamation-triangle',
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-500',
    trend: -1,
  },
  {
    label: 'Reject Bulan Ini',
    value: 32,
    icon: 'pi pi-ban',
    iconBg: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-500',
    trend: -7,
  },
]);

// ─── Line Chart ──────────────────────────────────────────────
const lineChartData = ref<any>();
const lineChartOptions = ref<any>();

// ─── Donut Chart ─────────────────────────────────────────────
const donutChartData = ref<any>();
const donutChartOptions = ref<any>();
const donutLegend = ref([
  { label: 'Terkirim', value: 924, color: '#3b82f6' },
  { label: 'Reject',   value: 137, color: '#f87171' },
  { label: 'Perbaikan',value: 41,  color: '#fbbf24' },
  { label: 'Selesai',  value: 380, color: '#34d399' },
]);

// ─── Bar Chart ───────────────────────────────────────────────
const barChartData = ref<any>();
const barChartOptions = ref<any>();

// ─── Recent Activities ────────────────────────────────────────
const recentActivities = ref([
  { sn: 'SN-2024-0412', name: 'Laptop HP 250 G9',    company: 'PT Maju Jaya',    status: 'Terkirim',       date: '15 Mei 2026' },
  { sn: 'SN-2024-0395', name: 'Monitor LG 24MK',     company: 'CV Tekno Solusi', status: 'Reject',         date: '15 Mei 2026' },
  { sn: 'SN-2024-0388', name: 'Printer Canon G2020', company: 'PT Delta Prima',  status: 'Dalam Perbaikan',date: '14 Mei 2026' },
  { sn: 'SN-2024-0371', name: 'Router Mikrotik hEX', company: 'PT Maju Jaya',    status: 'Selesai',        date: '14 Mei 2026' },
  { sn: 'SN-2024-0350', name: 'Switch TP-Link 24P',  company: 'CV Nusa Tech',    status: 'Terkirim',       date: '13 Mei 2026' },
  { sn: 'SN-2024-0341', name: 'UPS APC BR1500',      company: 'PT Global IT',    status: 'Reject',         date: '13 Mei 2026' },
  { sn: 'SN-2024-0328', name: 'Server Dell R740',    company: 'PT Delta Prima',  status: 'Selesai',        date: '12 Mei 2026' },
  { sn: 'SN-2024-0315', name: 'NAS Synology DS920+', company: 'CV Tekno Solusi', status: 'Dalam Perbaikan',date: '12 Mei 2026' },
]);

// ─── Warranty Items ───────────────────────────────────────────
const warrantyItems = ref([
  { name: 'Laptop HP 250 G9',    sn: 'SN-2024-0412', expiry: '18 Mei 2026', warrantyStatus: 'Warning' },
  { name: 'Monitor LG 24MK',     sn: 'SN-2024-0210', expiry: '10 Mei 2026', warrantyStatus: 'Expired' },
  { name: 'UPS APC BR1500',      sn: 'SN-2024-0341', expiry: '01 Mei 2026', warrantyStatus: 'Expired' },
  { name: 'Printer Canon G2020', sn: 'SN-2024-0388', expiry: '25 Jun 2026', warrantyStatus: 'Warning' },
  { name: 'Router Mikrotik hEX', sn: 'SN-2024-0371', expiry: '10 Des 2026', warrantyStatus: 'Aktif' },
]);

// ─── Helpers ──────────────────────────────────────────────────
function statusBadge(status: string) {
  const map: Record<string, string> = {
    'Terkirim':       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'Reject':         'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    'Dalam Perbaikan':'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'Selesai':        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600';
}

function warrantyBadge(status: string) {
  const map: Record<string, string> = {
    'Aktif':   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Warning': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    'Expired': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600';
}

function warrantyRowClass(status: string) {
  const map: Record<string, string> = {
    'Aktif':   'border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-900/10',
    'Warning': 'border-orange-100 bg-orange-50/40 dark:border-orange-900/30 dark:bg-orange-900/10',
    'Expired': 'border-red-100 bg-red-50/40 dark:border-red-900/30 dark:bg-red-900/10',
  };
  return map[status] ?? 'border-slate-100';
}

// ─── Chart Setup ─────────────────────────────────────────────
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
    setupCharts();
  }, 800);
});

function setupCharts() {
  // Line Chart
  const days = Array.from({ length: 15 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (14 - i));
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  });

  lineChartData.value = {
    labels: days,
    datasets: [
      {
        label: 'Produk Terkirim',
        data: [8, 14, 11, 22, 18, 30, 25, 19, 27, 33, 28, 24, 31, 20, 24],
        fill: true,
        tension: 0.4,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.10)',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2.5,
      },
    ],
  };

  lineChartOptions.value = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (ctx: any) => ` ${ctx.parsed.y} produk terkirim`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 0 },
        grid: { color: '#f1f5f9', drawTicks: false },
      },
      y: {
        min: 0,
        ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 10, padding: 8 },
        grid: { color: '#f1f5f9', drawTicks: false },
      },
    },
    interaction: { mode: 'index', intersect: false },
  };

  // Donut Chart
  donutChartData.value = {
    labels: ['Terkirim', 'Reject', 'Perbaikan', 'Selesai'],
    datasets: [
      {
        data: [924, 137, 41, 380],
        backgroundColor: ['#3b82f6', '#f87171', '#fbbf24', '#34d399'],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  donutChartOptions.value = {
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} unit`,
        },
      },
    },
  };

  // Bar Chart
  barChartData.value = {
    labels: ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
    datasets: [
      {
        label: 'Jumlah Reject',
        data: [28, 35, 22, 40, 29, 32],
        backgroundColor: 'rgba(248,113,113,0.75)',
        borderColor: '#f87171',
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  barChartOptions.value = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: (ctx: any) => ` ${ctx.parsed.y} item reject`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        min: 0,
        ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 10, padding: 8 },
        grid: { color: '#f1f5f9', drawTicks: false },
      },
    },
  };
}
</script>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  background: linear-gradient(135deg, rgba(59,130,246,0.04), rgba(16,185,129,0.04));
  transition: opacity 0.3s ease;
}
.stat-card:hover::before {
  opacity: 1;
}
</style>
