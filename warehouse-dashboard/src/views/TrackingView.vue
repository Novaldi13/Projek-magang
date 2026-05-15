<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="flex justify-between items-center mb-2">
      <div>
        <h1 class="text-[24px] font-bold text-[#1e293b] dark:text-slate-100">Tracking Produk Terkirim</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1 text-sm">Monitor pengiriman, garansi, dan riwayat perbaikan/reject produk Gitronik</p>
      </div>
      <Button label="Kirim Produk Baru" icon="pi pi-send" @click="openSendModal" class="shadow-sm" />
    </div>

    <!-- Dashboard Statistik -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-4' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
              <i class="pi pi-box text-xl"></i>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Terkirim (Hari Ini)</span>
              <span class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ stats.terkirimToday }}</span>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-4' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <i class="pi pi-truck text-xl"></i>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Semua Terkirim</span>
              <span class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ stats.totalTerkirim }}</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-4' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
              <i class="pi pi-exclamation-triangle text-xl"></i>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Barang Reject</span>
              <span class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ stats.totalReject }}</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800" :pt="{ body: { class: 'p-4' }, content: { class: 'p-0' } }">
        <template #content>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <i class="pi pi-wrench text-xl"></i>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Dalam Perbaikan</span>
              <span class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ stats.totalPerbaikan }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Tabel Tracking -->
    <Card class="shadow-sm border-none rounded-xl dark:bg-slate-800">
      <template #content>
        <DataTable :value="products" paginator :rows="10" dataKey="id" filterDisplay="menu" :filters="filters"
            :globalFilterFields="['sn', 'name', 'company.name']" class="p-datatable-sm" rowHover stripedRows>
            <template #header>
                <div class="flex justify-between items-center mb-2">
                    <div class="flex gap-2">
                       <Dropdown v-model="filters['status'].value" :options="statusOptions" placeholder="Filter Status" showClear class="w-40" />
                    </div>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Cari SN / Produk / Company" />
                    </span>
                </div>
            </template>
            
            <Column header="Produk">
              <template #body="slotProps">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 border border-slate-200 dark:border-slate-600 rounded overflow-hidden flex shrink-0 items-center justify-center bg-slate-50 dark:bg-slate-900 cursor-pointer hover:border-blue-400" @click="viewImage(slotProps.data)">
                     <img v-if="slotProps.data.image" :src="slotProps.data.image" class="object-cover w-full h-full" />
                     <i v-else class="pi pi-image text-slate-300"></i>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800 dark:text-slate-100 text-sm">{{ slotProps.data.sn }}</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ slotProps.data.name }}</span>
                  </div>
                </div>
              </template>
            </Column>

            <Column field="company.name" header="Company Tujuan">
              <template #body="slotProps">
                <div class="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors" @click="viewCompany(slotProps.data.company)">
                  <i class="pi pi-building text-xs text-slate-400"></i>
                  <span class="font-medium text-sm">{{ slotProps.data.company.name }}</span>
                </div>
              </template>
            </Column>

            <Column field="sendDate" header="Tanggal Kirim & Garansi">
              <template #body="slotProps">
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-slate-600 dark:text-slate-300"><i class="pi pi-calendar mr-1"></i>{{ formatDate(slotProps.data.sendDate) }}</span>
                  <div class="flex items-center gap-1 mt-1">
                     <Tag :severity="getWarrantySeverity(slotProps.data).severity" class="text-[10px] px-2 py-0.5" rounded>
                       {{ getWarrantySeverity(slotProps.data).label }}
                     </Tag>
                     <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">({{ getWarrantySeverity(slotProps.data).remainingText }})</span>
                  </div>
                </div>
              </template>
            </Column>

            <Column field="totalItems" header="Qty" class="text-center font-semibold text-slate-700 dark:text-slate-200"></Column>

            <Column field="status" header="Status">
              <template #body="slotProps">
                <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" rounded />
              </template>
            </Column>

            <Column header="Aksi">
              <template #body="slotProps">
                <div class="flex gap-1">
                  <!-- Actions based on status -->
                  <Button v-if="slotProps.data.status === 'Terkirim' || slotProps.data.status === 'Selesai'" icon="pi pi-times-circle" text rounded severity="danger" title="Reject Barang" @click="openRejectModal(slotProps.data)" />
                  <Button v-if="slotProps.data.status.startsWith('Rejected')" icon="pi pi-wrench" text rounded severity="warning" title="Proses Perbaikan" @click="startPerbaikan(slotProps.data)" />
                  <Button v-if="slotProps.data.status === 'Perbaikan'" icon="pi pi-check-circle" text rounded severity="success" title="Selesai Perbaikan" @click="finishPerbaikan(slotProps.data)" />
                  
                  <Button icon="pi pi-history" text rounded severity="info" title="Riwayat Reject" @click="viewHistory(slotProps.data)" />
                </div>
              </template>
            </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Modal Kirim Produk Baru -->
    <Dialog v-model:visible="showSendModal" modal header="Kirim Produk Baru" :style="{ width: '45vw' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
      <div class="flex flex-col gap-5 mt-2">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Kode SN (Serial Number)</label>
            <InputText v-model="newProduct.sn" placeholder="Contoh: SN-GIT-001" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Nama Produk</label>
            <InputText v-model="newProduct.name" placeholder="Nama barang" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Tanggal Kirim</label>
            <InputText type="date" v-model="newProduct.sendDate" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Durasi Garansi (Bulan)</label>
            <InputNumber v-model="newProduct.warrantyMonths" inputId="minmax-buttons" mode="decimal" showButtons :min="1" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">Jumlah Barang (Qty)</label>
            <InputNumber v-model="newProduct.totalItems" :min="1" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">URL Gambar Produk (Opsional)</label>
            <InputText v-model="newProduct.image" placeholder="https://..." />
          </div>
        </div>

        <div class="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 flex flex-col gap-3">
          <h3 class="font-semibold text-slate-700 dark:text-slate-200 text-sm">Data Perusahaan (Tujuan)</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-2">
               <label class="text-xs text-slate-600 dark:text-slate-300">Nama Company</label>
               <InputText v-model="newProduct.company.name" placeholder="PT. ABC" />
            </div>
            <div class="flex flex-col gap-2">
               <label class="text-xs text-slate-600 dark:text-slate-300">Nama PIC</label>
               <InputText v-model="newProduct.company.pic" placeholder="Bpk. Budi" />
            </div>
            <div class="col-span-2 flex flex-col gap-2">
               <label class="text-xs text-slate-600 dark:text-slate-300">Alamat</label>
               <InputText v-model="newProduct.company.address" placeholder="Jl. Raya No 1..." />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Batal" text severity="secondary" @click="showSendModal = false" />
        <Button label="Simpan & Kirim" @click="saveProduct" />
      </template>
    </Dialog>

    <!-- Modal Reject Barang -->
    <Dialog v-model:visible="showRejectModal" modal header="Input Reject Barang" :style="{ width: '35vw' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
      <div v-if="selectedProduct" class="flex flex-col gap-4 mt-2">
        <div class="bg-red-50 p-3 rounded border border-red-100 text-red-700 text-sm">
          Anda akan me-reject barang <b>{{ selectedProduct.sn }}</b> dari perusahaan <b>{{ selectedProduct.company.name }}</b>.
          <br/>Counter reject akan naik menjadi <b>Rejected {{ selectedProduct.rejectCounter + 1 }}</b>.
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-slate-700 dark:text-slate-200 text-sm">Catatan / Alasan Reject</label>
          <Textarea v-model="rejectNote" rows="4" placeholder="Contoh: Barang tidak menyala saat di-test..." />
        </div>
      </div>
      <template #footer>
        <Button label="Batal" text severity="secondary" @click="showRejectModal = false" />
        <Button label="Submit Reject" severity="danger" @click="processReject" />
      </template>
    </Dialog>

    <!-- Modal Riwayat Reject -->
    <Dialog v-model:visible="showHistoryModal" modal header="Riwayat Reject & Perbaikan" :style="{ width: '40vw' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
      <div v-if="selectedProduct" class="flex flex-col gap-4 mt-2">
        <div class="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-600">
          <div>
             <div class="font-bold text-slate-800 dark:text-slate-100">{{ selectedProduct.sn }}</div>
             <div class="text-sm text-slate-500 dark:text-slate-400">{{ selectedProduct.name }}</div>
          </div>
          <div class="text-right">
             <div class="text-xs text-slate-400">Total Reject</div>
             <div class="font-bold text-red-500 text-lg">{{ selectedProduct.rejectCounter }}x</div>
          </div>
        </div>

        <div v-if="selectedProduct.rejectHistory.length === 0" class="text-center p-6 text-slate-400 italic">
           Belum ada riwayat reject untuk produk ini.
        </div>
        <div v-else class="flex flex-col gap-3">
          <div v-for="(hist, idx) in selectedProduct.rejectHistory" :key="idx" class="border-l-2 border-red-400 pl-3 pb-2">
             <div class="flex items-center gap-2 mb-1">
                <Tag severity="danger" :value="hist.statusName" class="text-[10px] px-1 py-0"></Tag>
                <span class="text-xs text-slate-400">{{ formatDate(hist.date) }}</span>
             </div>
             <p class="text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 p-2 rounded">{{ hist.note }}</p>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Modal Company Profile -->
    <Dialog v-model:visible="showCompanyModal" modal header="Profil Perusahaan (Customer)" :style="{ width: '30vw' }">
      <div v-if="selectedCompany" class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
           <div class="w-16 h-16 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-2xl font-bold mb-3">
             {{ selectedCompany.name.charAt(0) }}
           </div>
           <h2 class="font-bold text-lg text-slate-800 dark:text-slate-100">{{ selectedCompany.name }}</h2>
           <span class="text-sm text-slate-500 dark:text-slate-400">Customer Gitronik</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between border-b border-slate-100 py-2">
            <span class="text-slate-500 dark:text-slate-400 text-sm">PIC</span>
            <span class="font-medium text-slate-800 dark:text-slate-100 text-sm">{{ selectedCompany.pic }}</span>
          </div>
          <div class="flex justify-between border-b border-slate-100 py-2">
            <span class="text-slate-500 dark:text-slate-400 text-sm">Alamat</span>
            <span class="font-medium text-slate-800 dark:text-slate-100 text-sm text-right max-w-[60%]">{{ selectedCompany.address }}</span>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Modal Gambar -->
    <Dialog v-model:visible="showImageModal" modal :header="selectedProduct?.name" :style="{ width: 'auto' }">
      <div v-if="selectedProduct" class="p-2">
         <img v-if="selectedProduct.image" :src="selectedProduct.image" class="max-w-[600px] max-h-[600px] object-contain rounded" />
         <div v-else class="w-[300px] h-[200px] bg-slate-100 flex items-center justify-center text-slate-400 rounded">
            Tidak ada gambar produk
         </div>
      </div>
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

// Models
interface Company {
  name: string;
  address: string;
  pic: string;
}

interface RejectHistory {
  date: string;
  statusName: string;
  note: string;
}

interface Product {
  id: string;
  sn: string;
  name: string;
  image: string;
  company: Company;
  sendDate: string;
  warrantyMonths: number;
  totalItems: number;
  status: string;
  rejectCounter: number;
  rejectHistory: RejectHistory[];
}

// State
const showSendModal = ref(false);
const showRejectModal = ref(false);
const showHistoryModal = ref(false);
const showCompanyModal = ref(false);
const showImageModal = ref(false);

const selectedProduct = ref<Product | null>(null);
const selectedCompany = ref<Company | null>(null);
const rejectNote = ref('');

const statusOptions = ref(['Terkirim', 'Rejected', 'Perbaikan', 'Selesai']);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
});

const defaultNewProduct = () => ({
    id: '',
    sn: '',
    name: '',
    image: '',
    company: { name: '', address: '', pic: '' },
    sendDate: new Date().toISOString().split('T')[0],
    warrantyMonths: 12,
    totalItems: 1,
    status: 'Terkirim',
    rejectCounter: 0,
    rejectHistory: []
});

const newProduct = ref<Product>(defaultNewProduct());

// Mock Data
const products = ref<Product[]>([
    {
        id: '1',
        sn: 'SN-GTK-1029',
        name: 'Controller Board V2',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200',
        company: { name: 'PT. Teknologi Maju', address: 'Kawasan Industri Rungkut', pic: 'Bpk. Ahmad' },
        sendDate: '2026-01-15',
        warrantyMonths: 12,
        totalItems: 5,
        status: 'Terkirim',
        rejectCounter: 0,
        rejectHistory: []
    },
    {
        id: '2',
        sn: 'SN-GTK-1030',
        name: 'Sensor Panel',
        image: '',
        company: { name: 'PT. Indo Makmur', address: 'Sidoarjo', pic: 'Ibu Dina' },
        sendDate: '2025-06-10',
        warrantyMonths: 6,
        totalItems: 2,
        status: 'Rejected 1',
        rejectCounter: 1,
        rejectHistory: [
            { date: '2026-04-12', statusName: 'Rejected 1', note: 'Layar sensor tidak merespon sentuhan setelah 2 minggu.' }
        ]
    },
    {
        id: '3',
        sn: 'SN-GTK-0988',
        name: 'Power Module 500W',
        image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=200',
        company: { name: 'CV. Global Parts', address: 'Gresik', pic: 'Bpk. Yanto' },
        sendDate: '2026-05-01',
        warrantyMonths: 24,
        totalItems: 10,
        status: 'Perbaikan',
        rejectCounter: 2,
        rejectHistory: [
            { date: '2026-05-05', statusName: 'Rejected 1', note: 'Overheating.' },
            { date: '2026-05-10', statusName: 'Rejected 2', note: 'Masih overheating setelah perbaikan pertama.' }
        ]
    }
]);

// Computed Stats
const stats = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    let terkirimToday = 0;
    let totalTerkirim = 0;
    let totalReject = 0;
    let totalPerbaikan = 0;

    products.value.forEach(p => {
        if (p.sendDate === today) terkirimToday += p.totalItems;
        if (p.status === 'Terkirim' || p.status === 'Selesai') totalTerkirim += p.totalItems;
        if (p.status.startsWith('Rejected')) totalReject += p.totalItems;
        if (p.status === 'Perbaikan') totalPerbaikan += p.totalItems;
    });

    return { terkirimToday, totalTerkirim, totalReject, totalPerbaikan };
});

// Methods
const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getStatusSeverity = (status: string) => {
    if (status === 'Terkirim' || status === 'Selesai') return 'success';
    if (status.startsWith('Rejected')) return 'danger';
    if (status === 'Perbaikan') return 'warn';
    return 'info';
};

const getWarrantySeverity = (product: Product) => {
    const start = new Date(product.sendDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + product.warrantyMonths);
    const now = new Date();
    
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
        return { label: 'Expired', severity: 'danger', remainingText: '0 hari' };
    } else if (diffDays <= 30) {
        return { label: 'Hampir Habis', severity: 'warn', remainingText: `${diffDays} hari` };
    } else {
        const diffMonths = Math.floor(diffDays / 30);
        return { label: 'Aktif', severity: 'success', remainingText: `${diffMonths} bln sisa` };
    }
};

const openSendModal = () => {
    newProduct.value = defaultNewProduct();
    showSendModal.value = true;
};

const saveProduct = () => {
    if (!newProduct.value.sn || !newProduct.value.name) return;
    
    newProduct.value.id = Math.random().toString(36).substr(2, 9);
    products.value.unshift(JSON.parse(JSON.stringify(newProduct.value)));
    showSendModal.value = false;
};

const openRejectModal = (product: Product) => {
    selectedProduct.value = product;
    rejectNote.value = '';
    showRejectModal.value = true;
};

const processReject = () => {
    if (!selectedProduct.value) return;
    
    const product = products.value.find(p => p.id === selectedProduct.value!.id);
    if (product) {
        product.rejectCounter++;
        const newStatus = `Rejected ${product.rejectCounter}`;
        product.status = newStatus;
        product.rejectHistory.push({
            date: new Date().toISOString(),
            statusName: newStatus,
            note: rejectNote.value || 'Tanpa catatan'
        });
    }
    showRejectModal.value = false;
};

const startPerbaikan = (product: Product) => {
    product.status = 'Perbaikan';
};

const finishPerbaikan = (product: Product) => {
    product.status = 'Terkirim'; // Atau Selesai
};

const viewHistory = (product: Product) => {
    selectedProduct.value = product;
    showHistoryModal.value = true;
};

const viewCompany = (company: Company) => {
    selectedCompany.value = company;
    showCompanyModal.value = true;
};

const viewImage = (product: Product) => {
    selectedProduct.value = product;
    showImageModal.value = true;
};
</script>
