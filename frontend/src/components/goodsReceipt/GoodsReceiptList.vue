<script setup lang="ts">
  import { onMounted, provide } from 'vue';
  import { useGoodsReceiptStore } from '@/stores/goodsReceiptStore';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import GoodsReceiptTable from '@/components/goodsReceipt/GoodsReceiptTable.vue';
  import GoodsReceiptHeader from '@/components/goodsReceipt/GoodsReceiptHeader.vue';

  // state
  const goodsReceiptStore = useGoodsReceiptStore();
  const asyncState = useAsyncState();
  provide('localLoading', asyncState.loadingStatus);

  // actions

  const getGoodsList = async (): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await goodsReceiptStore.getGoodsReceiptList({
        ...goodsReceiptStore.getfiltersReceipts,
      });

      if (success) {
        goodsReceiptStore.goodsReceiptList = data.data;
        asyncState.successLoading();
        goodsReceiptStore.setReceiptsPagination(data);
      } else {
        asyncState.failedLoading(message || 'error loading');
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
    }
  };

  //getters

  onMounted(() => {
    getGoodsList();
  });
</script>

<template>
  <div>
    <ErrorBoundary v-if="asyncState.errorText.value" @reload="getGoodsList" />
    <div v-else class="card">
      <GoodsReceiptHeader
        @updateData="getGoodsList()"
      />
      <div v-if="!asyncState.loadingStatus.value">
        <GoodsReceiptTable
          @updateData="getGoodsList()"
        />
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>


<style scoped></style>
