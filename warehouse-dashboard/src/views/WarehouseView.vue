<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Product Maintenance</h2>
        <p class="text-slate-500 mt-1">Lacak dan kelola status produk yang telah terjual ke customer</p>
      </div>
      <div class="flex gap-2">
        <Button label="Tambah Customer" icon="pi pi-user-plus" severity="secondary" class="shadow-sm" @click="showCustomerModal = true" />
        <Button label="Input Produk Terjual" icon="pi pi-plus" class="shadow-sm" @click="showProductModal = true" />
      </div>
    </div>

    <!-- Main Table -->
    <Card class="border border-slate-100 shadow-sm">
      <template #content>
        <DataTable :value="soldProducts" rowGroupMode="subheader" groupRowsBy="customerName" sortMode="single" sortField="customerName" :sortOrder="1" 
                   paginator :rows="10" filterDisplay="menu" :filters="filters" :globalFilterFields="['customerName', 'sn', 'productName']" class="p-datatable-sm" stripedRows>
          
          <template #header>
            <div class="flex justify-end">
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Cari Customer atau SN" />
                </span>
            </div>
          </template>

          <template #groupheader="slotProps">
              <div class="flex items-center gap-2 py-2">
                  <i class="pi pi-building text-slate-500"></i>
                  <span class="font-bold text-slate-800 text-lg">{{ slotProps.data.customerName }}</span>
              </div>
          </template>

          <Column field="customerName" header="Nama Customer" class="hidden"></Column>
          <Column field="productName" header="Nama Produk" sortable></Column>
          <Column field="sn" header="Serial Number (SN)" sortable>
              <template #body="{ data }">
                  <span class="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{{ data.sn }}</span>
              </template>
          </Column>
          <Column field="soldDate" header="Tanggal Terjual" sortable></Column>
          <Column field="status" header="Status" sortable>
            <template #body="{ data }">
              <Tag :value="data.status" :severity="data.status === 'Normal' ? 'success' : 'danger'" />
            </template>
          </Column>
          <Column header="Aksi">
            <template #body="{ data }">
              <Button icon="pi pi-eye" text rounded aria-label="Detail" @click="viewDetails(data)" />
            </template>
          </Column>
          <template #empty>
              <div class="text-center p-4 text-slate-500">Tidak ada produk ditemukan.</div>
          </template>
        </DataTable>
      </template>
    </Card>

    <!-- Modal Tambah Customer -->
    <Dialog v-model:visible="showCustomerModal" modal header="Tambah Customer Baru" :style="{ width: '400px' }">
        <div class="flex flex-col gap-4 mt-2">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-slate-700">Nama Customer / Perusahaan</label>
                <InputText v-model="newCustomer.name" placeholder="Masukkan nama" />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium text-slate-700">Kontak (Email / No. HP)</label>
                <InputText v-model="newCustomer.contact" placeholder="Masukkan kontak" />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium text-slate-700">Alamat Lengkap</label>
                <Textarea v-model="newCustomer.address" rows="3" placeholder="Masukkan alamat" />
            </div>
        </div>
        <template #footer>
            <Button label="Batal" text severity="secondary" @click="showCustomerModal = false" />
            <Button label="Simpan" icon="pi pi-check" @click="saveCustomer" />
        </template>
    </Dialog>

    <!-- Modal Input Produk Terjual -->
    <Dialog v-model:visible="showProductModal" modal header="Input Produk Terjual" :style="{ width: '450px' }">
        <div class="flex flex-col gap-4 mt-2">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-slate-700">Pilih Customer</label>
                <Dropdown v-model="newProduct.customerName" :options="customers.map(c => c.name)" placeholder="Pilih Customer" class="w-full" filter />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium text-slate-700">Nama Produk</label>
                <InputText v-model="newProduct.productName" placeholder="Contoh: Server Rack Alpha" />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium text-slate-700">Serial Number (SN)</label>
                <InputText v-model="newProduct.sn" placeholder="Masukkan SN produk" />
            </div>
            <div class="flex flex-col gap-2">
                <label class="font-medium text-slate-700">Tanggal Terjual</label>
                <InputText v-model="newProduct.soldDate" type="date" class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="Batal" text severity="secondary" @click="showProductModal = false" />
            <Button label="Simpan" icon="pi pi-check" @click="saveProduct" />
        </template>
    </Dialog>

    <!-- Modal Detail Produk -->
    <Dialog v-model:visible="showDetailsModal" modal header="Detail Pemeliharaan Produk" :style="{ width: '600px' }">
      <div v-if="selectedProduct" class="flex flex-col gap-6 mt-2">
         <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
               <h4 class="font-bold text-slate-700 mb-3 border-b pb-2"><i class="pi pi-building mr-2"></i>Info Customer</h4>
               <p class="text-xs text-slate-500 mb-1">Nama Perusahaan</p>
               <p class="font-medium text-slate-800 mb-3">{{ getCustomer(selectedProduct.customerName)?.name || selectedProduct.customerName }}</p>
               <p class="text-xs text-slate-500 mb-1">Kontak</p>
               <p class="font-medium text-slate-800 mb-3">{{ getCustomer(selectedProduct.customerName)?.contact || '-' }}</p>
               <p class="text-xs text-slate-500 mb-1">Alamat</p>
               <p class="font-medium text-slate-800">{{ getCustomer(selectedProduct.customerName)?.address || '-' }}</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
               <h4 class="font-bold text-slate-700 mb-3 border-b pb-2"><i class="pi pi-box mr-2"></i>Detail Produk</h4>
               <p class="text-xs text-slate-500 mb-1">Nama Produk</p>
               <p class="font-medium text-slate-800 mb-3">{{ selectedProduct.productName }}</p>
               <p class="text-xs text-slate-500 mb-1">Serial Number (SN)</p>
               <p class="font-medium font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block mb-3">{{ selectedProduct.sn }}</p>
               <p class="text-xs text-slate-500 mb-1">Tanggal Pembelian</p>
               <p class="font-medium text-slate-800">{{ selectedProduct.soldDate }}</p>
            </div>
         </div>
         <div class="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
               <p class="text-sm text-slate-500 mb-1 font-medium">Status Kondisi Saat Ini</p>
               <Tag :value="selectedProduct.status" :severity="selectedProduct.status === 'Normal' ? 'success' : 'danger'" class="text-base px-3 py-1" />
            </div>
            <div class="flex flex-col gap-2">
               <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">Ubah Status</label>
               <Dropdown v-model="selectedProduct.status" :options="['Normal', 'Rejected']" placeholder="Update Status" class="w-40" />
            </div>
         </div>
      </div>
      <template #footer>
          <Button label="Tutup" text severity="secondary" @click="showDetailsModal = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const showCustomerModal = ref(false);
const showProductModal = ref(false);
const showDetailsModal = ref(false);

const selectedProduct = ref<any>(null);

const customers = ref([
    { id: 'CUST-001', name: 'TechCorp Solutions', contact: 'contact@techcorp.com', address: '123 Innovation Drive, Silicon Valley, CA 94025' },
    { id: 'CUST-002', name: 'Global Industries', contact: 'info@globalind.com', address: '456 Enterprise Way, New York, NY 10001' },
    { id: 'CUST-003', name: 'Startup Hub', contact: 'hello@startuphub.io', address: '789 Agile Blvd, Austin, TX 73301' },
]);

const soldProducts = ref([
    { id: 'SP-001', customerName: 'TechCorp Solutions', productName: 'Enterprise Server Rack Alpha', sn: 'PRD-A100-231024-8891', soldDate: '2023-10-24', status: 'Normal' },
    { id: 'SP-002', customerName: 'TechCorp Solutions', productName: 'Edge AI Gateway Module', sn: 'PRD-M500-231024-0012', soldDate: '2023-10-25', status: 'Normal' },
    { id: 'SP-003', customerName: 'Global Industries', productName: 'Gaming Desktop Titan', sn: 'PRD-B200-231023-1102', soldDate: '2023-10-23', status: 'Rejected' },
    { id: 'SP-004', customerName: 'Startup Hub', productName: 'Network Switch 48-Port', sn: 'PRD-N700-231020-5511', soldDate: '2023-10-20', status: 'Normal' },
]);

const newCustomer = ref({ name: '', contact: '', address: '' });
const newProduct = ref({ customerName: null, productName: '', sn: '', soldDate: new Date().toISOString().split('T')[0], status: 'Normal' });

const getCustomer = (name: string) => {
    return customers.value.find(c => c.name === name);
};

const saveCustomer = () => {
    if (!newCustomer.value.name) return;
    customers.value.push({
        id: `CUST-00${customers.value.length + 1}`,
        name: newCustomer.value.name,
        contact: newCustomer.value.contact,
        address: newCustomer.value.address
    });
    showCustomerModal.value = false;
    newCustomer.value = { name: '', contact: '', address: '' };
};

const saveProduct = () => {
    if (!newProduct.value.customerName || !newProduct.value.sn) return;
    soldProducts.value.push({
        id: `SP-00${soldProducts.value.length + 1}`,
        customerName: newProduct.value.customerName,
        productName: newProduct.value.productName,
        sn: newProduct.value.sn,
        soldDate: newProduct.value.soldDate,
        status: newProduct.value.status as 'Normal' | 'Rejected'
    });
    showProductModal.value = false;
    newProduct.value = { customerName: null, productName: '', sn: '', soldDate: new Date().toISOString().split('T')[0], status: 'Normal' };
};

const viewDetails = (product: any) => {
    selectedProduct.value = product;
    showDetailsModal.value = true;
};
</script>
