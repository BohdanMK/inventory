<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useStocksStore } from '@/stores/stocksStore.ts';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import StockActionFilter from '@/components/stock/StockActionFilter.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';
  import StockActionTable from '@/components/stock/StockActionTable.vue';

  // state

  const stoksStore = useStocksStore();
  const localLoadingList = ref<boolean>(false);
  const asyncState = useAsyncState();

  // actions

  const getStoksActionList = async (): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await stoksStore.getStockActionList({ ...stoksStore.getFiltersActions });

      if (success) {
        stoksStore.stockActionList = data.data;
        asyncState.successLoading();
        stoksStore.setActionsPagination(data);
      } else {
        asyncState.failedLoading(message || 'error loading');
      }
      localLoadingList.value = false;
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
    }
  };

  onMounted(() => {
    getStoksActionList();
  });
</script>

<template>
  <div>
    <ErrorBoundary v-if="asyncState.errorText.value" @reload="getStoksActionList" />
    <div v-else class="card">
      <Toolbar class="mb-6">
        <template #start>
          <TotalResultItem :total="stoksStore.totalActions" />
          <StockActionFilter :loadingStatus="asyncState.loadingStatus.value" @updateData="getStoksActionList()" />
        </template>
        <template #end>
          <router-link to="/stock-activity/add">
            <Button label="New " icon="pi pi-plus" class="mr-2" />
          </router-link>
          <Button icon="pi pi-refresh" rounded raised @click="getStoksActionList()" />
        </template>
      </Toolbar>
      <div v-if="!asyncState.loadingStatus.value">
        <StockActionTable
          @updateData="getStoksActionList()"
        />
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>

<style scoped></style>
