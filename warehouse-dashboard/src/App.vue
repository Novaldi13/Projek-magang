<template>
  <div class="flex h-screen w-full bg-[#f8f9fa] overflow-hidden text-slate-800 font-sans">
    <!-- Sidebar -->
    <aside class="w-[260px] bg-white flex flex-col shrink-0 overflow-y-auto">
      <nav class="flex-1 px-4 py-8 space-y-8">
        
        <!-- HOME Group -->
        <div>
          <h3 class="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">HOME</h3>
          <div class="space-y-1">
            <router-link to="/" class="nav-link" exact-active-class="nav-active">
              <i class="pi pi-home text-[1.1rem]"></i> 
              <span>Dashboard</span>
            </router-link>

          </div>
        </div>

        <!-- OPERATIONS Group -->
        <div>
          <h3 class="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">OPERATIONS</h3>
          <div class="space-y-1">
            <router-link to="/tasks" class="nav-link" active-class="nav-active">
              <i class="pi pi-check-square text-[1.1rem]"></i> 
              <span>Tasks</span>
            </router-link>
            <router-link to="/warehouse" class="nav-link" active-class="nav-active">
              <i class="pi pi-database text-[1.1rem]"></i> 
              <span>Warehouse</span>
            </router-link>
            <router-link to="/products" class="nav-link" active-class="nav-active">
              <i class="pi pi-tags text-[1.1rem]"></i> 
              <span>Products & SN</span>
            </router-link>
            <router-link to="/rejects" class="nav-link" active-class="nav-active">
              <i class="pi pi-exclamation-triangle text-[1.1rem]"></i> 
              <span>Barang Reject</span>
            </router-link>
            <router-link to="/tracking" class="nav-link" active-class="nav-active">
              <i class="pi pi-map-marker text-[1.1rem]"></i> 
              <span>Tracking Produk</span>
            </router-link>
          </div>
        </div>

      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Header -->
      <header class="h-[70px] bg-white flex items-center px-6 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] shrink-0 justify-between z-10">
        <div class="flex items-center gap-4">
          <button class="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-md">
            <i class="pi pi-bars text-xl"></i>
          </button>
          <div class="flex items-center gap-3">
            <div class="text-[#38bdf8]">
              <!-- Blue abstract logo icon from image -->
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3v18M8 8h8M12 3a5 5 0 0 1 5 5M12 21a5 5 0 0 0-5-5"></path>
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-[15px] font-semibold text-slate-700 leading-tight">Gate System</span>
              <span class="text-[10px] text-slate-400 font-medium tracking-wide">MOR V - Integrated Terminal Surabaya - PERAK</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <button class="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <i class="pi pi-sun text-[1.1rem]"></i>
          </button>
          <button class="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <i class="pi pi-user text-[1.1rem]"></i>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-8 relative">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 font-medium transition-colors border-l-[3px] border-transparent;
}
.nav-link:hover {
  @apply text-[#0ea5e9];
}
.nav-active {
  @apply text-[#0ea5e9] border-[#0ea5e9] bg-[#f0f9ff];
}
.pi {
  @apply font-normal;
}
</style>
