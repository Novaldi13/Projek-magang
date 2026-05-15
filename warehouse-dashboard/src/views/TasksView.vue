<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage and track your operational tasks</p>
      </div>
      <Button label="Create Task" icon="pi pi-plus" @click="openCreateModal" class="shadow-sm" />
    </div>

    <!-- Tasks Data Table -->
    <Card class="border border-slate-100 shadow-sm dark:bg-slate-800">
      <template #content>
        <DataTable :value="tasks" paginator :rows="10" dataKey="id" filterDisplay="menu" :filters="filters"
            :globalFilterFields="['name', 'assignee', 'status']" class="p-datatable-sm">
            <template #header>
                <div class="flex justify-end">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </span>
                </div>
            </template>
            <Column field="id" header="Task ID" sortable></Column>
            <Column field="name" header="Task Name" sortable></Column>
            <Column field="assignee" header="Assignee" sortable>
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <Avatar :image="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.data.avatar}`" shape="circle" size="small" />
                  <span>{{ slotProps.data.assignee }}</span>
                </div>
              </template>
            </Column>
            <Column field="components" header="Allocated Components">
              <template #body="slotProps">
                <div class="flex flex-wrap gap-1">
                  <Tag v-for="comp in slotProps.data.components" :key="comp" :value="comp" severity="info" rounded class="text-xs" />
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
                <Button icon="pi pi-eye" text rounded aria-label="View Details" @click="viewTaskDetails(slotProps.data)" />
                <Button icon="pi pi-pencil" text rounded aria-label="Edit" @click="openEditModal(slotProps.data)" />
                <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Delete" />
              </template>
            </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Create/Edit Task Modal -->
    <Dialog v-model:visible="showCreateModal" modal :header="isEditMode ? 'Edit Task' : 'Create New Task'" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex flex-col gap-2">
          <label for="taskName" class="font-medium text-slate-700 dark:text-slate-200">Task Name</label>
          <InputText id="taskName" v-model="newTask.name" placeholder="Enter task name" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="assignee" class="font-medium text-slate-700 dark:text-slate-200">Assignee</label>
            <Dropdown id="assignee" v-model="newTask.assignee" :options="users" optionLabel="name" placeholder="Select Assignee" class="w-full">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center gap-2">
                  <Avatar :image="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.value.avatar}`" shape="circle" size="small" />
                  <span>{{ slotProps.value.name }}</span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <Avatar :image="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.avatar}`" shape="circle" size="small" />
                  <span>{{ slotProps.option.name }}</span>
                </div>
              </template>
            </Dropdown>
          </div>
          <div class="flex flex-col gap-2">
            <label for="status" class="font-medium text-slate-700 dark:text-slate-200">Status</label>
            <Dropdown id="status" v-model="newTask.status" :options="statuses" placeholder="Select Status" class="w-full" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="components" class="font-medium text-slate-700 dark:text-slate-200">Allocate Components (Warehouse)</label>
          <MultiSelect id="components" v-model="newTask.components" :options="warehouseItems" optionLabel="name" placeholder="Select components" display="chip" class="w-full" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text severity="secondary" @click="showCreateModal = false" autofocus />
        <Button label="Save Task" @click="saveTask" autofocus />
      </template>
    </Dialog>

    <!-- Task Details Modal -->
    <Dialog v-model:visible="showDetailsModal" modal header="Task Details" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
      <div v-if="selectedTask" class="flex flex-col gap-4 mt-2">
        <div class="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100">
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-1">Task ID</p>
            <p class="font-medium text-slate-800 dark:text-slate-100">{{ selectedTask.id }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-1">Status</p>
            <Tag :value="selectedTask.status" :severity="getStatusSeverity(selectedTask.status)" />
          </div>
          <div class="col-span-2">
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-1">Task Name</p>
            <p class="font-medium text-slate-800 dark:text-slate-100">{{ selectedTask.name }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100">
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-2">Assignee</p>
            <div class="flex items-center gap-3">
              <Avatar :image="`https://primefaces.org/cdn/primevue/images/avatar/${selectedTask.avatar}`" shape="circle" size="large" />
              <div class="flex flex-col">
                <span class="font-medium text-slate-800 dark:text-slate-100">{{ selectedTask.assignee }}</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">Warehouse Operator</span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100">
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-2">Allocated Components</p>
            <div class="flex flex-wrap gap-2">
              <Tag v-for="comp in selectedTask.components" :key="comp" :value="comp" severity="info" rounded />
              <span v-if="!selectedTask.components || selectedTask.components.length === 0" class="text-sm text-slate-400 italic">No components allocated</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Close" text severity="secondary" @click="showDetailsModal = false" autofocus />
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
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Avatar from 'primevue/avatar';

const showCreateModal = ref(false);
const showDetailsModal = ref(false);
const selectedTask = ref<any>(null);

const isEditMode = ref(false);
const editingTaskId = ref<string | null>(null);

const openCreateModal = () => {
    isEditMode.value = false;
    editingTaskId.value = null;
    newTask.value = { name: '', assignee: null, status: null, components: [] };
    showCreateModal.value = true;
};

const openEditModal = (task: any) => {
    isEditMode.value = true;
    editingTaskId.value = task.id;
    
    const assigneeObj = users.value.find(u => u.name === task.assignee) || null;
    const componentObjs = warehouseItems.value.filter(item => task.components.includes(item.name));
    
    newTask.value = {
        name: task.name,
        assignee: assigneeObj,
        status: task.status,
        components: componentObjs
    };
    showCreateModal.value = true;
};

const viewTaskDetails = (task: any) => {
    selectedTask.value = task;
    showDetailsModal.value = true;
};

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const users = ref([
    { name: 'Amy Elsner', avatar: 'amyelsner.png' },
    { name: 'Anna Fali', avatar: 'annafali.png' },
    { name: 'Asiya Javayant', avatar: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', avatar: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', avatar: 'elwinsharvill.png' }
]);

const statuses = ref(['Pending', 'In Progress', 'Completed', 'Blocked']);

const warehouseItems = ref([
    { name: 'Processor Unit v2', code: 'PU2' },
    { name: 'Chassis Type-A', code: 'CHA' },
    { name: 'Motherboard X100', code: 'MB1' },
    { name: 'Cooling Fan 120mm', code: 'CF1' },
    { name: 'Power Supply 750W', code: 'PS7' }
]);

interface User {
  name: string;
  avatar: string;
}

const newTask = ref({
    name: '',
    assignee: null as User | null,
    status: null as string | null,
    components: [] as any[]
});

const tasks = ref([
    { id: 'TSK-1001', name: 'Assemble Server Rack A', assignee: 'Amy Elsner', avatar: 'amyelsner.png', status: 'In Progress', components: ['Chassis Type-A', 'Power Supply 750W'] },
    { id: 'TSK-1002', name: 'Quality Control Batch #402', assignee: 'Anna Fali', avatar: 'annafali.png', status: 'Pending', components: [] },
    { id: 'TSK-1003', name: 'Install Processors into MB1', assignee: 'Bernardo Dominic', avatar: 'bernardodominic.png', status: 'Completed', components: ['Processor Unit v2', 'Motherboard X100'] },
    { id: 'TSK-1004', name: 'Pack and Ship Client Order', assignee: 'Elwin Sharvill', avatar: 'elwinsharvill.png', status: 'Blocked', components: ['Cooling Fan 120mm'] },
    { id: 'TSK-1005', name: 'System Calibration', assignee: 'Asiya Javayant', avatar: 'asiyajavayant.png', status: 'In Progress', components: [] }
]);

const getStatusSeverity = (status: string) => {
    switch (status) {
        case 'Completed': return 'success';
        case 'In Progress': return 'info';
        case 'Pending': return 'warn';
        case 'Blocked': return 'danger';
        default: return 'secondary';
    }
};

const saveTask = () => {
    if (!newTask.value.name) return;
    
    if (isEditMode.value && editingTaskId.value) {
        const index = tasks.value.findIndex(t => t.id === editingTaskId.value);
        if (index !== -1) {
            tasks.value[index] = {
                ...tasks.value[index],
                name: newTask.value.name,
                assignee: newTask.value.assignee?.name || 'Unassigned',
                avatar: newTask.value.assignee?.avatar || 'amyelsner.png',
                status: newTask.value.status || 'Pending',
                components: newTask.value.components.map((c: any) => c.name)
            };
        }
    } else {
        tasks.value.unshift({
            id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
            name: newTask.value.name,
            assignee: newTask.value.assignee?.name || 'Unassigned',
            avatar: newTask.value.assignee?.avatar || 'amyelsner.png',
            status: newTask.value.status || 'Pending',
            components: newTask.value.components.map((c: any) => c.name)
        });
    }
    
    showCreateModal.value = false;
    newTask.value = { name: '', assignee: null, status: null, components: [] };
};
</script>
