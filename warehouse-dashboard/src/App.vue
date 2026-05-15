<template>
  <!-- Auth pages (no sidebar/header) -->
  <div v-if="isAuthPage" class="auth-layout">
    <router-view />
  </div>

  <!-- Main Dashboard Layout -->
  <div
    v-else
    class="flex h-screen w-full bg-[#f8f9fa] dark:bg-slate-900 overflow-hidden text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300"
  >
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white dark:bg-slate-800 flex flex-col shrink-0 overflow-y-auto border-r border-transparent dark:border-slate-700 transition-all duration-300 ease-in-out',
        isSidebarOpen
          ? 'w-[260px] opacity-100 translate-x-0'
          : 'w-0 opacity-0 -translate-x-full pointer-events-none',
      ]"
    >
      <nav class="flex-1 px-4 py-8 space-y-8">
        <!-- HOME Group -->
        <div>
          <h3
            class="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3"
          >
            HOME
          </h3>
          <div class="space-y-1">
            <router-link
              to="/"
              class="nav-link"
              exact-active-class="nav-active"
            >
              <i class="pi pi-home text-[1.1rem]"></i>
              <span>Dashboard</span>
            </router-link>
          </div>
        </div>

        <!-- OPERATIONS Group -->
        <div>
          <h3
            class="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3"
          >
            OPERATIONS
          </h3>
          <div class="space-y-1">
            <router-link
              to="/rejects"
              class="nav-link"
              active-class="nav-active"
            >
              <i class="pi pi-exclamation-triangle text-[1.1rem]"></i>
              <span>Barang Reject</span>
            </router-link>
            <router-link
              to="/tracking"
              class="nav-link"
              active-class="nav-active"
            >
              <i class="pi pi-map-marker text-[1.1rem]"></i>
              <span>Tracking Produk</span>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Sidebar Footer: User Info -->
      <div class="px-4 py-4 border-t border-slate-100 dark:border-slate-700">
        <div class="flex items-center gap-3 px-2">
          <div
            class="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate"
            >
              {{ userName }}
            </p>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {{ userRole }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Header -->
      <header
        class="h-[70px] bg-white dark:bg-slate-800 flex items-center px-6 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] shrink-0 justify-between z-10 border-b border-transparent dark:border-slate-700 transition-colors duration-300"
      >
        <div class="flex items-center gap-4">
          <button
            class="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            @click="toggleSidebar"
          >
            <i class="pi pi-bars text-xl"></i>
          </button>
          <div class="flex items-center gap-3">
            <img
              src="/Logo Gitronik.png"
              alt="Gitronik Logo"
              class="h-10 object-contain"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="toggleTheme"
            class="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Theme"
          >
            <i
              class="pi text-[1.1rem]"
              :class="isDark ? 'pi-sun' : 'pi-moon'"
            ></i>
          </button>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-red-600 dark:hover:bg-red-700 hover:border-red-600 dark:hover:border-red-700 active:bg-red-700 dark:active:bg-red-800 active:scale-95 rounded-lg border border-slate-200 dark:border-slate-600 transition-all duration-200"
            title="Logout"
          >
            <i class="pi pi-sign-out text-sm"></i>
            <span class="hidden sm:inline">Logout</span>
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
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const isDark = ref(false);
const isSidebarOpen = ref(true);

const authPages = ["/login", "/register", "/forgot-password"];
const isAuthPage = computed(() => authPages.includes(route.path));

// User info from storage
const userData = computed(() => {
  try {
    const local = localStorage.getItem("auth_user");
    const session = sessionStorage.getItem("auth_user");
    const raw = local || session;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
});

const userName = computed(() => userData.value?.name || "User");
const userRole = computed(() => userData.value?.role || "User");
const userInitials = computed(() => {
  const name = userName.value;
  const parts = name.split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
});

function handleLogout() {
  localStorage.removeItem("auth_user");
  sessionStorage.removeItem("auth_user");
  router.push("/login");
}

const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  // Check local storage or system preference on mount
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    isDark.value = true;
  } else {
    isDark.value = false;
  }
  updateTheme();
});
</script>

<style scoped>
.auth-layout {
  width: 100%;
  min-height: 100vh;
}

.nav-link {
  @apply flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 dark:text-slate-400 font-medium transition-colors border-l-[3px] border-transparent;
}
.nav-link:hover {
  @apply text-[#0ea5e9] dark:text-[#38bdf8];
}
.nav-active {
  @apply text-[#0ea5e9] dark:text-[#38bdf8] border-[#0ea5e9] dark:border-[#38bdf8] bg-[#f0f9ff] dark:bg-slate-700/50;
}
.pi {
  @apply font-normal;
}
</style>
