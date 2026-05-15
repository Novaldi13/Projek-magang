<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
      <div>
        <h1 class="text-[24px] font-bold text-[#1e293b] dark:text-slate-100 leading-tight">
          Manajemen Barang Reject
        </h1>
        <p class="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5">
          Monitoring dan validasi barang reject dari produksi ke gudang
        </p>
      </div>
      <Button 
        label="Input Barang Reject" 
        icon="pi pi-plus" 
        @click="openAddModal" 
        class="shadow-md hover:shadow-lg transition-all" 
      />
    </div>

    <!-- Statistics Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card v-for="stat in rejectStats" :key="stat.label" class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-4' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-center gap-4">
            <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`">
              <i :class="`${stat.icon} text-xl ${stat.color}`"></i>
            </div>
            <div class="flex flex-col">
              <span class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ stat.label }}</span>
              <span class="text-2xl font-bold text-[#1e293b] dark:text-slate-100 leading-tight">{{ stat.value }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Data Table Section -->
    <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800 overflow-hidden">
      <template #content>
        <DataTable 
          :value="rejects" 
          paginator 
          :rows="10" 
          dataKey="id" 
          filterDisplay="menu" 
          :filters="filters"
          :globalFilterFields="['id', 'itemName', 'pic.name', 'status', 'rejectReason']" 
          class="p-datatable-sm"
          rowHover
          stripedRows
        >
          <template #header>
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
              <div class="flex gap-2 w-full sm:w-auto">
                <Dropdown 
                  v-model="filters['status'].value" 
                  :options="statusOptions" 
                  placeholder="Filter Status" 
                  showClear 
                  class="w-full sm:w-48" 
                />
              </div>
              <span class="p-input-icon-left w-full sm:w-auto">
                <i class="pi pi-search" />
                <InputText 
                  v-model="filters['global'].value" 
                  placeholder="Cari ID / Nama Barang / PIC..." 
                  class="w-full sm:w-64"
                />
              </span>
            </div>
          </template>
          
          <Column field="id" header="Batch ID" sortable class="font-mono text-xs text-blue-500 font-semibold"></Column>
          
          <Column header="Informasi Barang" sortable field="itemName">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                  <i class="pi pi-box"></i>
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-slate-700 dark:text-slate-100 text-sm">{{ slotProps.data.itemName }}</span>
                  <span class="text-xs text-slate-500">{{ slotProps.data.rejectReason }}</span>
                </div>
              </div>
            </template>
          </Column>

          <Column field="quantity" header="Qty" sortable class="text-center font-bold text-slate-700 dark:text-slate-200"></Column>
          
          <Column field="pic.name" header="PIC / Pelapor" sortable>
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-200">
                  {{ slotProps.data.pic.name.charAt(0) }}
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-medium text-slate-700 dark:text-slate-200 leading-tight">{{ slotProps.data.pic.name }}</span>
                  <span class="text-[10px] text-slate-500">{{ slotProps.data.pic.role }}</span>
                </div>
              </div>
            </template>
          </Column>

          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <Tag 
                :value="slotProps.data.status" 
                :severity="getStatusSeverity(slotProps.data.status)"
                rounded
                class="text-[10px] px-3 font-bold"
              />
            </template>
          </Column>

          <Column header="Validasi">
            <template #body="slotProps">
              <div class="flex gap-1">
                <Button 
                  v-if="slotProps.data.status === 'No Submit'" 
                  icon="pi pi-check" 
                  text 
                  rounded 
                  severity="success" 
                  size="small"
                  class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Proses ke Gudang" 
                  @click="openProcessModal(slotProps.data)" 
                />
                  <Button 
                    v-else 
                    icon="pi pi-check" 
                    text 
                    rounded 
                    class="invisible" 
                  />
              </div>
            </template>
          </Column>

          <Column header="Detail">
            <template #body="slotProps">
              <div class="flex gap-1">
                <Button 
                  icon="pi pi-eye" 
                  text 
                  rounded 
                  severity="info" 
                  size="small"
                  class="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  @click="viewDetails(slotProps.data)" 
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Modal Input Barang Reject -->
    <Dialog 
      v-model:visible="showAddModal" 
      modal 
      header="Input Barang Reject Baru" 
      :draggable="false"
      :style="{ width: '450px' }" 
      :breakpoints="{ '641px': '95vw' }"
      class="custom-dialog"
    >
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Nama Barang</label>
          <InputText v-model="newItem.itemName" placeholder="Contoh: Motherboard X100" class="w-full" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Jumlah (Qty)</label>
            <InputNumber v-model="newItem.quantity" mode="decimal" showButtons :min="1" class="w-full" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Alasan Reject</label>
            <Dropdown v-model="newItem.rejectReason" :options="rejectReasons" placeholder="Pilih alasan" class="w-full" />
          </div>
        </div>
        
        <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col gap-3">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Data Pelapor (PIC)</p>
          <div class="flex flex-col gap-1.5">
             <label class="text-xs font-medium text-slate-600 dark:text-slate-300">Nama Lengkap</label>
             <InputText v-model="newItem.pic.name" placeholder="Nama PIC" size="small" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
               <label class="text-xs font-medium text-slate-600 dark:text-slate-300">ID User</label>
               <InputText v-model="newItem.pic.id" placeholder="ID" size="small" />
            </div>
            <div class="flex flex-col gap-1.5">
               <label class="text-xs font-medium text-slate-600 dark:text-slate-300">Divisi</label>
               <InputText v-model="newItem.pic.role" placeholder="Contoh: QC" size="small" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Batal" text severity="secondary" @click="showAddModal = false" />
        <Button label="Simpan Reject" icon="pi pi-check" @click="saveRejectItem" />
      </template>
    </Dialog>

    <!-- Process / View Details Modal -->
    <Dialog 
      v-model:visible="showProcessModal" 
      modal 
      :header="isViewingOnly ? 'Detail Item Reject' : 'Validasi Masuk Gudang'" 
      :draggable="false"
      :style="{ width: '500px' }" 
      :breakpoints="{ '641px': '95vw' }"
    >
      <div v-if="selectedItem" class="flex flex-col gap-5 mt-2">
        <!-- Item Overview Card -->
        <div class="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                <i class="pi pi-box"></i>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-mono text-blue-500 font-bold uppercase">{{ selectedItem.id }}</span>
                <span class="font-bold text-slate-800 dark:text-slate-100">{{ selectedItem.itemName }}</span>
              </div>
            </div>
            <Tag :value="selectedItem.status" :severity="getStatusSeverity(selectedItem.status)" rounded />
          </div>
          
          <div class="grid grid-cols-2 gap-y-3 text-sm">
            <div class="flex flex-col">
              <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Jumlah</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200">{{ selectedItem.quantity }} Unit</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Alasan</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200">{{ selectedItem.rejectReason }}</span>
            </div>
            <div class="flex flex-col col-span-2 border-t border-slate-100 dark:border-slate-700 pt-2 mt-1">
              <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dilaporkan Oleh</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200">{{ selectedItem.pic.name }} ({{ selectedItem.pic.role }})</span>
            </div>
          </div>
        </div>
        
        <!-- Form Section -->
        <div v-if="!isViewingOnly" class="flex flex-col gap-4">
           <div class="flex flex-col gap-1.5">
             <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Kondisi Detail Barang</label>
             <Textarea v-model="processData.details" rows="3" placeholder="Masukkan detail kerusakan..." class="text-sm" />
           </div>
           <div class="flex flex-col gap-1.5">
             <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Instruksi / Catatan Gudang</label>
             <Textarea v-model="processData.notes" rows="2" placeholder="Contoh: Segera retur ke vendor..." class="text-sm" />
           </div>
        </div>
        
        <!-- View Only Section -->
        <div v-else class="flex flex-col gap-4">
           <div class="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
             <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Detail Kondisi</span>
             <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ selectedItem.details || 'Tidak ada detail kondisi.' }}</p>
           </div>
           <div class="flex flex-col gap-1.5 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
             <span class="text-xs font-bold text-amber-500 uppercase tracking-widest">Catatan / Instruksi</span>
             <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ selectedItem.notes || 'Tidak ada catatan.' }}</p>
           </div>
        </div>
      </div>

      <template #footer>
        <Button label="Tutup" text severity="secondary" @click="showProcessModal = false" />
        <Button v-if="!isViewingOnly" label="Konfirmasi Masuk Gudang" severity="success" icon="pi pi-check-circle" @click="submitToGudang" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';

const showAddModal = ref(false);
const showProcessModal = ref(false);
const isViewingOnly = ref(false);
const selectedItem = ref<any>(null);

const rejectReasons = ref([
    'Human Error saat pengerjaan',
    'Cacat dari pabrik',
    'Kerusakan komponen',
    'Kesalahan produksi',
    'Lainnya'
]);

const statusOptions = ref(['Submit', 'No Submit']);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const defaultNewItem = () => ({
    itemName: '',
    quantity: 1,
    rejectReason: null,
    pic: {
        name: '',
        id: '',
        role: ''
    }
});

const newItem = ref(defaultNewItem());

const processData = ref({
    details: '',
    notes: ''
});

// Data awal sebagai simulasi
const rejects = ref([
    {
        id: 'RJT-1001',
        itemName: 'Motherboard X100',
        quantity: 2,
        rejectReason: 'Cacat dari pabrik',
        pic: { name: 'Budi Santoso', id: 'USR-011', role: 'Production Line 1' },
        status: 'No Submit',
        details: '',
        notes: ''
    },
    {
        id: 'RJT-1002',
        itemName: 'Cooling Fan 120mm',
        quantity: 12,
        rejectReason: 'Kerusakan komponen',
        pic: { name: 'Andi Wijaya', id: 'USR-025', role: 'Quality Control' },
        status: 'Submit',
        details: 'Baling-baling patah saat diterima dari vendor.',
        notes: 'Segera diretur ke vendor untuk penggantian.'
    },
    {
        id: 'RJT-1003',
        itemName: 'Power Supply 500W',
        quantity: 3,
        rejectReason: 'Kesalahan produksi',
        pic: { name: 'Siti Aminah', id: 'USR-042', role: 'Production Line 2' },
        status: 'No Submit',
        details: '',
        notes: ''
    },
    {
        id: 'RJT-1004',
        itemName: 'RAM DDR4 8GB',
        quantity: 25,
        rejectReason: 'Kerusakan komponen',
        pic: { name: 'Bambang Kusumo', id: 'USR-015', role: 'Warehouse' },
        status: 'Submit',
        details: 'Chipset terbakar saat pengujian stabilitas.',
        notes: 'Simpan di rak barang reject blok C.'
    }
]);

// Statistics Calculation
const rejectStats = computed(() => {
  const total = rejects.value.reduce((acc, curr) => acc + curr.quantity, 0);
  const noSubmitCount = rejects.value.filter(r => r.status === 'No Submit').length;
  const submitCount = rejects.value.filter(r => r.status === 'Submit').length;

  return [
    { label: 'Total Unit Reject', value: total, icon: 'pi pi-shopping-cart', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'No Submit', value: noSubmitCount, icon: 'pi pi-file', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Submit', value: submitCount, icon: 'pi pi-check-circle', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
  ];
});

const getStatusSeverity = (status: string) => {
    switch (status) {
        case 'Submit': return 'success';
        case 'No Submit': return 'warn';
        default: return 'secondary';
    }
};

const openAddModal = () => {
    newItem.value = defaultNewItem();
    showAddModal.value = true;
};

const saveRejectItem = () => {
    if (!newItem.value.itemName || !newItem.value.rejectReason || !newItem.value.pic.name) return;
    
    rejects.value.unshift({
        id: `RJT-${Math.floor(1000 + Math.random() * 9000)}`,
        itemName: newItem.value.itemName,
        quantity: newItem.value.quantity,
        rejectReason: newItem.value.rejectReason,
        pic: { ...newItem.value.pic },
        status: 'No Submit',
        details: '',
        notes: ''
    });
    
    showAddModal.value = false;
};

const openProcessModal = (item: any) => {
    selectedItem.value = item;
    isViewingOnly.value = false;
    processData.value = { details: '', notes: '' };
    showProcessModal.value = true;
};

const viewDetails = (item: any) => {
    selectedItem.value = item;
    isViewingOnly.value = true;
    showProcessModal.value = true;
};

const submitToGudang = () => {
    if (!selectedItem.value) return;
    
    const index = rejects.value.findIndex(r => r.id === selectedItem.value.id);
    if (index !== -1) {
        rejects.value[index].status = 'Submit';
        rejects.value[index].details = processData.value.details;
        rejects.value[index].notes = processData.value.notes;
    }
    
    showProcessModal.value = false;
};
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  @apply bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-bold text-[11px] uppercase tracking-wider py-3;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  @apply transition-colors;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  @apply py-3 border-b border-slate-50 dark:border-slate-700/50;
}

.custom-dialog :deep(.p-dialog-header) {
  @apply bg-slate-50 dark:bg-slate-900 pb-4;
}
</style>

