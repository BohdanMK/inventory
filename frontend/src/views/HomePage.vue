<script setup lang="ts">
  import { onMounted } from 'vue';
  import { usePagesStore } from '@/stores/pagesStore';
  import { copyValue } from '@/helpers/copy';
  import { useRouter } from 'vue-router';
  import ProductsInfoCard from '@/components/dashBoard/ProductsInfoCard.vue';
  import StockActionsPieChart from '@/components/dashBoard/StockActionsPieChart.vue';
  import ListActiveUser from '@/components/dashBoard/ListActiveUser.vue';
  import { useAsyncState } from '@/composables/useAsyncState';
  import { useDashBoardStore } from '@/stores/dashBoard';
  import { useI18n } from 'vue-i18n';

  const router = useRouter();
  const pagesStore = usePagesStore();
  const asyncStateProducts = useAsyncState();
  const asyncStateStocksActions = useAsyncState();
  const dashBoardStore = useDashBoardStore();
  const { t } = useI18n();

  // actions

  const getProductsInfo = async (): Promise<void> => {
    try {
      asyncStateProducts.startLoading();
      const { success, message, data } = await dashBoardStore.getStatusList();

      if (success) {
        // categoryStore.categoryList = data;
        asyncStateProducts.successLoading();
        console.log('success', data)
        // categoryStore.setCategoriesPagination(data);
        dashBoardStore.productsInfo = data
      } else {
        asyncStateProducts.failedLoading(message || t('default.error_loading'));
      }
    } catch (e) {
      asyncStateProducts.failedLoading(e instanceof Error ? e.message : t('default.error_loading'));
    }
  };

   const getStockActionsSummaryInfo = async (): Promise<void> => {
    try {
      asyncStateStocksActions.startLoading();
      const { success, message, data } = await dashBoardStore.getStockActionsSummary();

      if (success) {

        asyncStateStocksActions.successLoading();
        console.log('success', data)

        dashBoardStore.stockActionsSummary = data
      } else {
        asyncStateStocksActions.failedLoading(message || t('default.error_loading'));
      }
    } catch (e) {
      asyncStateProducts.failedLoading(e instanceof Error ? e.message : t('default.error_loading'));
    }
  };

  // getters

  function getPageTitleByRoute(routePath: string) {
    const matchedRoute = router.getRoutes().find(r => r.path === routePath);
    console.log(matchedRoute);
    return matchedRoute?.name || routePath;
  }

  // hooks
  onMounted(() => {
    getProductsInfo();
    getStockActionsSummaryInfo();
  })

</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <!--dashboard cards-->
    <div class="col-span-6 m-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
    <div class="col-span-6">
      <ProductsInfoCard
        :loading="asyncStateProducts.loadingStatus.value"
        @updateData="getProductsInfo()"
      />
    </div>
    <div class="col-span-9">
      <StockActionsPieChart
        :loading="asyncStateProducts.loadingStatus.value"
        @updateData="getProductsInfo()"
      />
    </div>
    <div class="col-span-3">
      <ListActiveUser/>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
