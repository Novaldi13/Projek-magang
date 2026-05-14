<template>
  <div class="flex flex-col gap-6 max-w-[1400px]">
    <h1 class="text-[26px] font-bold text-[#1e293b] dark:text-slate-100 mb-2">Hello Super User!!</h1>

    <!-- Scorecards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-5">
      <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-5' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex flex-col gap-1">
              <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-2">On Board</span>
              <span class="text-3xl font-bold text-[#1e293b] dark:text-slate-100">128</span>
            </div>
            <div class="w-11 h-11 rounded-lg bg-[#eff6ff] dark:bg-slate-700 flex items-center justify-center text-[#3b82f6]">
              <i class="pi pi-user text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-5' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex flex-col gap-1">
              <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-2">Pekerja</span>
              <span class="text-3xl font-bold text-[#1e293b] dark:text-slate-100">373</span>
            </div>
            <div class="w-11 h-11 rounded-lg bg-[#eff6ff] dark:bg-slate-700 flex items-center justify-center text-[#3b82f6]">
              <i class="pi pi-users text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-5' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex flex-col gap-1">
              <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-2">Vendor</span>
              <span class="text-3xl font-bold text-[#1e293b] dark:text-slate-100">43</span>
            </div>
            <div class="w-11 h-11 rounded-lg bg-[#eff6ff] dark:bg-slate-700 flex items-center justify-center text-[#3b82f6]">
              <i class="pi pi-wrench text-xl transform -scale-x-100"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-5' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex flex-col gap-1">
              <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-2">Area</span>
              <span class="text-3xl font-bold text-[#1e293b] dark:text-slate-100">3</span>
            </div>
            <div class="w-11 h-11 rounded-lg bg-[#eff6ff] dark:bg-slate-700 flex items-center justify-center text-[#3b82f6]">
              <i class="pi pi-sitemap text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-5' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex flex-col gap-1">
              <span class="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-2">Gate</span>
              <span class="text-3xl font-bold text-[#1e293b] dark:text-slate-100">8</span>
            </div>
            <div class="w-11 h-11 rounded-lg bg-[#eff6ff] dark:bg-slate-700 flex items-center justify-center text-[#3b82f6]">
              <i class="pi pi-sign-in text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-1">
      <!-- Line Chart -->
      <Card class="lg:col-span-3 shadow-sm border-none rounded-xl pt-1 dark:bg-slate-800">
        <template #title>
          <div class="flex justify-between items-center mb-1 text-[15px] font-semibold text-[#1e293b] dark:text-slate-100">
            <span>Jumlah Pekerja Per Hari</span>
            <div class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded text-xs font-normal text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-50 dark:bg-slate-900">
              02/05/2026 - 02/19/2026
              <i class="pi pi-calendar text-[10px] text-slate-400"></i>
            </div>
          </div>
        </template>
        <template #content>
          <div class="mt-2">
            <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-[320px]" />
          </div>
        </template>
      </Card>
      
      <!-- Pie Chart -->
      <Card class="lg:col-span-2 shadow-sm border-none rounded-xl pt-1 dark:bg-slate-800">
        <template #title>
          <div class="flex flex-col items-center justify-center mb-2">
            <span class="text-[15px] font-semibold text-[#1e293b] dark:text-slate-100 mb-3">Pekerja Per Area</span>
            <div class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded text-xs font-normal text-slate-500 dark:text-slate-400 mb-2 cursor-pointer hover:bg-slate-50 dark:bg-slate-900">
              02/05/2026 - 02/06/2026
              <i class="pi pi-calendar text-[10px] text-slate-400"></i>
            </div>
          </div>
        </template>
        <template #content>
          <div class="flex justify-center items-center h-[300px]">
             <Chart type="pie" :data="pieChartData" :options="pieChartOptions" class="w-full max-w-[300px]" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';

const lineChartData = ref();
const lineChartOptions = ref();
const pieChartData = ref();
const pieChartOptions = ref();

onMounted(() => {
    setChartData();
});

const setChartData = () => {
    lineChartData.value = {
        labels: ['05/02/26', '06/02/26', '07/02/26', '08/02/26', '09/02/26', '10/02/26', '11/02/26', '12/02/26', '13/02/26', '14/02/26', '15/02/26', '16/02/26', '17/02/26', '18/02/26', '19/02/26'],
        datasets: [
            {
                label: 'Pekerja/Hari',
                data: [0, 5, 0, 125, 148, 195, 208, 180, 124, 158, 108, 85, 54, 142, 120],
                fill: true,
                tension: 0.1,
                borderColor: '#06b6d4', // cyan-500
                backgroundColor: 'rgba(6, 182, 212, 0.12)', // Light cyan fill
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#06b6d4',
                pointRadius: 2,
                pointHoverRadius: 4,
                borderWidth: 2
            }
        ]
    };

    lineChartOptions.value = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                position: 'top',
                align: 'center',
                labels: {
                    color: '#64748b', // slate-500
                    boxWidth: 28,
                    boxHeight: 12,
                    useBorderRadius: true,
                    borderRadius: 2,
                    font: {
                        size: 11,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#1e293b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function(context: any) {
                        return `${context.parsed.y} pekerja`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#94a3b8', // slate-400
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                        size: 10
                    }
                },
                grid: {
                    color: '#f1f5f9', // slate-100
                    drawBorder: false,
                    drawTicks: false
                }
            },
            y: {
                min: 0,
                max: 250,
                ticks: {
                    color: '#94a3b8', // slate-400
                    stepSize: 50,
                    font: {
                        size: 10
                    },
                    padding: 8
                },
                grid: {
                    color: '#f1f5f9', // slate-100
                    drawBorder: false,
                    drawTicks: false
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        }
    };

    pieChartData.value = {
        labels: ['PERAK (80.00%)', 'LPG (20.00%)', 'BANDARAN (0.00%)'],
        datasets: [
            {
                data: [80, 20, 0.1], // Adding tiny value to BANDARAN just so it technically exists in data structure if needed, but visually 0 is fine
                backgroundColor: [
                    '#4ade80', // green fallback
                    '#93c5fd', // blue fallback
                    '#f87171'  // red fallback
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 4
            }
        ]
    };
    
    // Exact colors from image
    pieChartData.value.datasets[0].backgroundColor = [
        '#42e0d1', // Bright cyan/teal for PERAK
        '#93c5fd', // Light Blue for LPG
        '#fca5a5'  // Red for BANDARAN
    ];
    pieChartData.value.datasets[0].data = [80, 20, 0]; // Exact data

    pieChartOptions.value = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'center',
                labels: {
                    color: '#64748b', // slate-500
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 10,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#1e293b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                callbacks: {
                    label: function(context: any) {
                        return ` ${context.label}`;
                    }
                }
            }
        }
    };
};
</script>
