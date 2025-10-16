<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Toast from 'primevue/toast';
  import { useRouter } from 'vue-router';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import { useStocksStore } from '@/stores/stocksStore';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import Select from 'primevue/select';
  import Toolbar from 'primevue/toolbar';
  import StockActivityCreatePageForm from '@/components/stock/StockActivityCreatePageForm.vue';
  import ProductList from '@/components/stock/ProductList.vue';
  import BreadcrumbItem from '@/components/ui/BreadcrumbItem.vue';
  import { useI18n } from 'vue-i18n';

  ///state
  const formRef = ref();
  const stocksStore = useStocksStore();
  const warehouseStore = useWarehouseStore();
  const asyncState = useAsyncState();
  const router = useRouter();
  const localWarehouse = ref<{ name: string; code: string } | undefined>(undefined);
  const { t } = useI18n();

  // actions

  const getWarehouseList = async (): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await warehouseStore.getWarehouseList();

      if (success) {
        warehouseStore.warehouseList = data.data;
        asyncState.successLoading();
      } else {
        asyncState.failedLoading(message || 'error loading');
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
    }
  };

  const moveBack = (): void => {
    router.push({ name: 'StockActivity' });
  };
  // getters

  onMounted(() => {
    stocksStore.productListForCreateAction = [];
    getWarehouseList();
  });
</script>

<template>
  <div>
    <Toast />
    <ErrorBoundary v-if="asyncState.errorText.value" @reload="getWarehouseList" />
    <div v-else class="card">
      <BreadcrumbItem />
      <div v-if="!asyncState.loadingStatus.value">
        <Toolbar class="mb-6">
          <template #start>
            <h3 class="text-xl font-medium">{{ t('goodsReceipt.stock_action_create') }}</h3>
          </template>
          <template #end>
            <Button :label="t('button.back')" outlined icon="pi pi-arrow-left" class="mr-2" @click="moveBack()" />
            <Button
              v-if="localWarehouse"
              type="submit"
              :label="t('button.create')"
              icon="pi pi-plus"
              class="mr-2"
              @click="formRef?.submit()"
            />
          </template>
        </Toolbar>
        <Toolbar class="mb-0 items-start border-0 px-0">
          <template #start>
            <Select
              v-model="localWarehouse"
              :options="warehouseStore.warehouseListForSelect"
              optionLabel="name"
              :placeholder="t('goodsReceipt.select_warehouse')"
              class="w-full min-w-[230px]"
              :disabled="stocksStore.productListForCreateAction.length > 0"
            />
          </template>
          <template #end> </template>
        </Toolbar>
        <StockActivityCreatePageForm ref="formRef" :localWarehouse="localWarehouse" @success="moveBack()" />
        <ProductList v-if="localWarehouse" />
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>

<style scoped></style>
