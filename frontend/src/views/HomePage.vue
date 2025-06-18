<script setup lang="ts">
  import { usePagesStore } from '@/stores/pagesStore';
  import { copyValue } from '@/helpers/copy';
  import { useRouter } from 'vue-router';
  import Button from 'primevue/button';

  const router = useRouter();

  const pagesStore = usePagesStore();

  function getPageTitleByRoute(routePath: string) {
    const matchedRoute = router.getRoutes().find(r => r.path === routePath);
    console.log(matchedRoute);
    return matchedRoute?.name || routePath;
  }
</script>

<template>
  <div>
    <div class="m-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Active page tabs: {{ pagesStore.countActivePages }}
      </h2>
      <ul class="max-w-md list-inside list-disc space-y-1 text-gray-500 dark:text-gray-400">
        <li v-for="page in pagesStore.activePages" :key="page.id" class="list-none p-2">
          <Button icon="pi pi-clone" severity="secondary" aria-label="Bookmark" @click="copyValue(page.id)" />
          <b>
            Page:
            {{ getPageTitleByRoute(page.route) }}
          </b>
          <router-link :to="page.route">
            <Button label="Link" variant="link" />
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
