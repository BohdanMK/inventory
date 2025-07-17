<script setup lang="ts">
    import { useRoute } from 'vue-router';

    const emit = defineEmits<{
      (e: 'logOut'): void;

    }>();

    // state
    const route = useRoute();

    const isActiveRoute = (path: string) => route.path === path;

</script>

<template>
  <ul class="m-0 w-full list-none overflow-hidden p-0">
      <li>
        <router-link
          v-ripple
          to="/"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-home mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.dashboard') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/goods-receipt"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/goods-receipt') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-angle-double-up mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.goodsReceipt') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/stock-activity"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/stock-activity') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-angle-double-down mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.stockActivity') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/stock"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/stock') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-gift mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.stock') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/products"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/products') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-gift mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.products') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/groups"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/groups') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-users mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.groups') }}</span>
        </router-link>
      </li>

      <li v-permission="'super_admin'">
        <router-link
          v-ripple
          to="/settings"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/settings') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-cog mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.settings') }}</span>
        </router-link>
      </li>

      <li>
        <a
          class="hover:bg-surface-200 flex cursor-pointer items-center justify-center rounded p-4 transition-colors duration-150"
          @click="() => emit('logOut')"
        >
          <i class="pi pi-sign-out mr-2"></i>
          <span>{{ $t('sidebar.logOut') }}</span>
        </a>
      </li>
    </ul>
</template>

<style scoped>

</style>