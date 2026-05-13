<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-slate-500 mt-1">Manage and monitor reject items between production and warehouse</p>
      </div>
      <Button label="Add Reject Item" icon="pi pi-plus" @click="openAddModal" class="shadow-sm" />
    </div>

    <!-- Reject Items Data Table -->
    <Card class="border border-slate-100 shadow-sm">
      <template #content>
        <DataTable :value="rejects" paginator :rows="10" dataKey="id" filterDisplay="menu" :filters="filters"
            :globalFilterFields="['itemName', 'pic.name', 'status', 'rejectReason']" class="p-datatable-sm">
            <template #header>
                <div class="flex justify-between items-center">
                    <Dropdown v-model="filters['status'].value" :options="statusOptions" placeholder="Filter Status" showClear class="w-48" />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </span>
                </div>
            </template>
            <Column field="id" header="ID" sortable></Column>
            <Column field="itemName" header="Item Name" sortable></Column>
            <Column field="quantity" header="Quantity" sortable></Column>
            <Column field="rejectReason" header="Reject Reason" sortable></Column>
            <Column field="pic.name" header="PIC Reject" sortable>
              <template #body="slotProps">
                <div class="flex flex-col">
                  <span class="font-medium">{{ slotProps.data.pic.name }}</span>
                  <span class="text-xs text-slate-500">{{ slotProps.data.pic.role || 'No Role' }}</span>
                </div>
              </template>
            </Column>
            <Column field="status" header="Status" sortable>
              <template #body="slotProps">
                <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
              </template>
            </Column>
            <Column header="Actions">
              <template #body="slotProps">
                <Button v-if="slotProps.data.status === 'No Submit'" label="Process" size="small" icon="pi pi-check" @click="openProcessModal(slotProps.data)" />
                <Button v-else icon="pi pi-eye" text rounded aria-label="View Details" @click="viewDetails(slotProps.data)" />
              </template>
            </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Add Reject Item Modal -->
    <Dialog v-model:visible="showAddModal" modal header="Add Barang Reject" :style="{ width: '40vw' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <label for="itemName" class="font-medium text-slate-700">Nama Barang</label>
          <InputText id="itemName" v-model="newItem.itemName" placeholder="Masukkan nama barang" />
        </div>
        
        <div class="flex flex-col gap-2">
          <label for="quantity" class="font-medium text-slate-700">Jumlah Barang</label>
          <InputNumber id="quantity" v-model="newItem.quantity" inputId="minmax-buttons" mode="decimal" showButtons :min="1" />
        </div>
        
        <div class="flex flex-col gap-2">
          <label for="rejectReason" class="font-medium text-slate-700">Status / Alasan Reject</label>
          <Dropdown id="rejectReason" v-model="newItem.rejectReason" :options="rejectReasons" placeholder="Pilih alasan reject" class="w-full" />
        </div>
        
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col gap-3">
          <p class="font-medium text-slate-700">PIC Reject (Penanggung Jawab)</p>
          <div class="flex flex-col gap-2">
             <label for="picName" class="text-sm text-slate-600">Nama PIC</label>
             <InputText id="picName" v-model="newItem.pic.name" placeholder="Masukkan nama PIC" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-2">
               <label for="picId" class="text-sm text-slate-600">ID User</label>
               <InputText id="picId" v-model="newItem.pic.id" placeholder="Masukkan ID User" />
            </div>
            <div class="flex flex-col gap-2">
               <label for="picRole" class="text-sm text-slate-600">Divisi / Role (Opsional)</label>
               <InputText id="picRole" v-model="newItem.pic.role" placeholder="Masukkan divisi" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Batal" text severity="secondary" @click="showAddModal = false" autofocus />
        <Button label="Simpan Barang" @click="saveRejectItem" autofocus />
      </template>
    </Dialog>

    <!-- Process / View Details Modal -->
    <Dialog v-model:visible="showProcessModal" modal :header="isViewingOnly ? 'Detail Barang Reject' : 'Proses ke Gudang (Submit)'" :style="{ width: '40vw' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
      <div v-if="selectedItem" class="flex flex-col gap-4 mt-2">
        <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div>
            <p class="text-sm text-slate-500 mb-1">Nama Barang</p>
            <p class="font-medium text-slate-800">{{ selectedItem.itemName }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-500 mb-1">Jumlah</p>
            <p class="font-medium text-slate-800">{{ selectedItem.quantity }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-500 mb-1">Alasan Reject</p>
            <p class="font-medium text-slate-800">{{ selectedItem.rejectReason }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-500 mb-1">Status Saat Ini</p>
            <Tag :value="selectedItem.status" :severity="getStatusSeverity(selectedItem.status)" />
          </div>
        </div>
        
        <div v-if="!isViewingOnly" class="flex flex-col gap-4 mt-2">
           <div class="flex flex-col gap-2">
             <label for="processDetail" class="font-medium text-slate-700">Detail Barang Reject</label>
             <Textarea id="processDetail" v-model="processData.details" rows="3" placeholder="Masukkan detail kondisi barang" />
           </div>
           <div class="flex flex-col gap-2">
             <label for="processNote" class="font-medium text-slate-700">Catatan Tambahan</label>
             <Textarea id="processNote" v-model="processData.notes" rows="2" placeholder="Catatan tambahan untuk tim gudang" />
           </div>
        </div>
        
        <div v-else class="flex flex-col gap-4 mt-2">
           <div class="flex flex-col gap-1">
             <span class="font-medium text-slate-700 text-sm">Detail Barang Reject</span>
             <p class="text-slate-600 bg-slate-50 p-3 rounded border border-slate-100 whitespace-pre-wrap">{{ selectedItem.details || '-' }}</p>
           </div>
           <div class="flex flex-col gap-1">
             <span class="font-medium text-slate-700 text-sm">Catatan Tambahan</span>
             <p class="text-slate-600 bg-slate-50 p-3 rounded border border-slate-100 whitespace-pre-wrap">{{ selectedItem.notes || '-' }}</p>
           </div>
        </div>
      </div>

      <template #footer>
        <Button label="Tutup" text severity="secondary" @click="showProcessModal = false" autofocus />
        <Button v-if="!isViewingOnly" label="Submit (Masuk Gudang)" severity="success" @click="submitToGudang" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
        quantity: 5,
        rejectReason: 'Kerusakan komponen',
        pic: { name: 'Andi Wijaya', id: 'USR-025', role: 'Quality Control' },
        status: 'Submit',
        details: 'Baling-baling patah saat diterima dari vendor.',
        notes: 'Segera diretur ke vendor untuk penggantian.'
    }
]);

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
        status: 'No Submit', // Otomatis No Submit saat pertama ditambahkan
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
