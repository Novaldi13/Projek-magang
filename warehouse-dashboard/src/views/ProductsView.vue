<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <p class="text-slate-500 dark:text-slate-400 mt-1">Master list of finished products and serial numbers tracking</p>
      <div class="flex gap-2">
        <Button label="Create Product" icon="pi pi-plus" class="shadow-sm font-bold" @click="showCreateModal = true" />
        <Button label="Generate SN" icon="pi pi-barcode" severity="success" class="shadow-sm font-bold" @click="showSnModal = true" />
      </div>
    </div>

    <!-- Products Master List -->
    <Card class="border border-slate-100 shadow-sm dark:bg-slate-800">
      <template #content>
        <DataTable v-model:expandedRows="expandedRows" :value="products" dataKey="id" class="p-datatable-sm" stripedRows hoverHover>
            <Column expander style="width: 5rem" />
            <Column field="id" header="Product Code" sortable></Column>
            <Column field="name" header="Product Name" sortable></Column>
            <Column field="category" header="Category" sortable></Column>
            <Column field="inventory" header="In Stock" sortable>
                <template #body="{ data }">
                    <span class="font-bold text-slate-800 dark:text-slate-100">{{ data.inventory }}</span> units
                </template>
            </Column>
            <Column field="status" header="Production Status">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="data.status === 'Active' ? 'success' : 'warn'" />
                </template>
            </Column>
            
            <template #expansion="slotProps">
                <div class="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 rounded-lg mx-4 my-2">
                    <h4 class="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Product Details: {{ slotProps.data.name }}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-white dark:bg-slate-800 p-4 rounded shadow-sm border border-slate-100">
                            <span class="block text-slate-500 dark:text-slate-400 text-sm mb-1">Warranty Status</span>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-shield text-green-500 text-xl"></i>
                                <span class="font-bold text-slate-800 dark:text-slate-100 text-lg">{{ slotProps.data.warrantyMonths }} Months</span>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-slate-800 p-4 rounded shadow-sm border border-slate-100">
                            <span class="block text-slate-500 dark:text-slate-400 text-sm mb-1">Total Returns</span>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-refresh text-orange-500 text-xl"></i>
                                <span class="font-bold text-slate-800 dark:text-slate-100 text-lg">{{ slotProps.data.returnCount }}</span>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-slate-800 p-4 rounded shadow-sm border border-slate-100">
                            <span class="block text-slate-500 dark:text-slate-400 text-sm mb-1">Recent Serial Numbers</span>
                            <div class="flex flex-wrap gap-2 mt-1">
                                <Tag v-for="sn in slotProps.data.recentSn" :key="sn" :value="sn" severity="secondary" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataTable>
      </template>
    </Card>

    <!-- Generate SN Modal -->
    <Dialog v-model:visible="showSnModal" modal header="Generate Serial Numbers" :style="{ width: '400px' }">
        <div class="flex flex-col gap-4 mt-2">
            <div class="flex flex-col gap-2">
                <label for="productSelect" class="font-medium text-slate-700 dark:text-slate-200">Select Product</label>
                <Dropdown id="productSelect" v-model="selectedProduct" :options="products" optionLabel="name" placeholder="Choose a product" class="w-full" />
            </div>
            
            <div class="flex flex-col gap-2">
                <label for="snQuantity" class="font-medium text-slate-700 dark:text-slate-200">Quantity to Generate</label>
                <InputNumber id="snQuantity" v-model="snQuantity" showButtons :min="1" :max="100" class="w-full" />
            </div>

            <div v-if="generatedSns.length > 0" class="mt-4 border-t pt-4">
                <h5 class="font-medium text-green-600 mb-2 flex items-center gap-2">
                    <i class="pi pi-check-circle"></i> Successfully Generated {{ generatedSns.length }} SNs
                </h5>
                <div class="max-h-32 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-600">
                    <div v-for="sn in generatedSns" :key="sn" class="text-sm font-mono text-slate-700 dark:text-slate-200 py-1 border-b border-slate-100 last:border-0">
                        {{ sn }}
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Close" text severity="secondary" @click="showSnModal = false" />
            <Button label="Generate" icon="pi pi-cog" @click="generateSN" :disabled="!selectedProduct || generatedSns.length > 0" />
        </template>
    </Dialog>

    <!-- Create Product Modal -->
    <Dialog v-model:visible="showCreateModal" modal header="Create New Product" :style="{ width: '400px' }">
        <div class="flex flex-col gap-4 mt-2">
            <div class="flex flex-col gap-2">
                <label for="newProdName" class="font-medium text-slate-700 dark:text-slate-200">Product Name</label>
                <InputText id="newProdName" v-model="newProduct.name" placeholder="Enter product name" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="newProdCategory" class="font-medium text-slate-700 dark:text-slate-200">Category</label>
                <Dropdown id="newProdCategory" v-model="newProduct.category" :options="['Servers', 'Desktops', 'IoT Devices', 'Networking']" placeholder="Select category" class="w-full" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="newProdInventory" class="font-medium text-slate-700 dark:text-slate-200">Initial Stock</label>
                    <InputNumber id="newProdInventory" v-model="newProduct.inventory" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="newProdWarranty" class="font-medium text-slate-700 dark:text-slate-200">Warranty (Months)</label>
                    <InputNumber id="newProdWarranty" v-model="newProduct.warrantyMonths" class="w-full" />
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" text severity="secondary" @click="showCreateModal = false" />
            <Button label="Save Product" icon="pi pi-check" @click="createProduct" />
        </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';

const expandedRows = ref({});
const showSnModal = ref(false);
const showCreateModal = ref(false);
const selectedProduct = ref(null);
const snQuantity = ref(10);
const generatedSns = ref<string[]>([]);

const newProduct = ref({
    name: '',
    category: null,
    inventory: 0,
    warrantyMonths: 12
});

const createProduct = () => {
    if (!newProduct.value.name) return;
    
    products.value.unshift({
        id: `PRD-X${Math.floor(100 + Math.random() * 900)}`,
        name: newProduct.value.name,
        category: newProduct.value.category || 'Other',
        inventory: newProduct.value.inventory || 0,
        status: (newProduct.value.inventory || 0) > 0 ? 'Active' : 'Out of Stock',
        warrantyMonths: newProduct.value.warrantyMonths || 12,
        returnCount: 0,
        recentSn: []
    });
    
    showCreateModal.value = false;
    newProduct.value = { name: '', category: null, inventory: 0, warrantyMonths: 12 };
};

// Reset generated SNs when modal is opened/closed or product changes
watch(showSnModal, (val) => {
    if (!val) {
        generatedSns.value = [];
        selectedProduct.value = null;
        snQuantity.value = 10;
    }
});

const generateSN = () => {
    if (!selectedProduct.value) return;
    
    const prefix = (selectedProduct.value as any).id;
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    
    const newSns = [];
    for (let i = 0; i < snQuantity.value; i++) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        newSns.push(`${prefix}-${dateCode}-${randomSuffix}`);
    }
    
    generatedSns.value = newSns;
    
    // Update the recent SNs in the dummy data
    const productIndex = products.value.findIndex(p => p.id === (selectedProduct.value as any).id);
    if (productIndex !== -1) {
        products.value[productIndex].inventory += snQuantity.value;
        products.value[productIndex].recentSn = newSns.slice(0, 3);
    }
};

const products = ref([
    { 
        id: 'PRD-A100', 
        name: 'Enterprise Server Rack Alpha', 
        category: 'Servers', 
        inventory: 45, 
        status: 'Active',
        warrantyMonths: 36,
        returnCount: 2,
        recentSn: ['PRD-A100-231024-8891', 'PRD-A100-231024-4421']
    },
    { 
        id: 'PRD-B200', 
        name: 'Gaming Desktop Titan', 
        category: 'Desktops', 
        inventory: 120, 
        status: 'Active',
        warrantyMonths: 24,
        returnCount: 15,
        recentSn: ['PRD-B200-231023-1102', 'PRD-B200-231023-9934', 'PRD-B200-231023-7721']
    },
    { 
        id: 'PRD-C300', 
        name: 'Office Workstation Pro', 
        category: 'Desktops', 
        inventory: 8, 
        status: 'Low Stock',
        warrantyMonths: 12,
        returnCount: 4,
        recentSn: ['PRD-C300-231020-5511']
    },
    { 
        id: 'PRD-M500', 
        name: 'Edge AI Gateway Module', 
        category: 'IoT Devices', 
        inventory: 350, 
        status: 'Active',
        warrantyMonths: 60,
        returnCount: 0,
        recentSn: ['PRD-M500-231024-0012', 'PRD-M500-231024-0013']
    },
    { 
        id: 'PRD-N700', 
        name: 'Network Switch 48-Port', 
        category: 'Networking', 
        inventory: 0, 
        status: 'Out of Stock',
        warrantyMonths: 36,
        returnCount: 1,
        recentSn: []
    }
]);
</script>
