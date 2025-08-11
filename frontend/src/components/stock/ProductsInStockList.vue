<script setup lang="ts">
  import { ref, onMounted, provide } from 'vue';
  import { useToastNotification } from '@/composables/useToastNotification';
  import { useStocksStore } from '@/stores/stocksStore';
  import { useAsyncState } from '@/composables/useAsyncState';
  import type { IProductInStock } from '@/types/product/product';
  import type { StoсksActionsType } from '@/constants/constants';
  import type { IActionData } from '@/types/index';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import ReplaceItem from '@/components/stock/popup/ReplaceItem.vue';
  import ActionsItem from '@/components/stock/popup/ActionsItem.vue';
  import CancelItem from '@/components/stock/popup/CancelItem.vue';
  import ProductsInStockTable from '@/components/stock/ProductsInStockTable.vue';
  import ProductsInStockHeader from '@/components/stock/ProductsInStockHeader.vue';

  // state
  const toastNotification = useToastNotification();
  const asyncState = useAsyncState();
  const stoksStore = useStocksStore();
  const replacePopUpVisible = ref<boolean>(false);
  const actionPopUpVisible = ref<boolean>(false);
  const cancelPopUpVisible = ref<boolean>(false);

  const productData = ref<IProductInStock>({} as IProductInStock);
  const typeActionValue = ref<StoсksActionsType>('SHIPMENT');

  // actions

  const getProductList = async (): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await stoksStore.getProductsInStockList({ ...stoksStore.getfiltersProducts });
      if (success) {
        stoksStore.productList = data.data;
        asyncState.successLoading();
        stoksStore.setProductsPagination(data);
      } else {
        asyncState.failedLoading(message || 'error loading');
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
    }
  };

  const toggleReplaceModalStatus = (data: IProductInStock): void => {
    setProductData(data);
    replacePopUpVisible.value = !replacePopUpVisible.value;
  };

  const toggleActionModalStatus = (data: IProductInStock, typeAction: StoсksActionsType): void => {
    setProductData(data);
    typeActionValue.value = typeAction;
    actionPopUpVisible.value = !actionPopUpVisible.value;
  };

  const toggleCancelModalStatus = (data: IProductInStock, typeAction: StoсksActionsType): void => {
    setProductData(data);
    typeActionValue.value = typeAction;
    cancelPopUpVisible.value = !cancelPopUpVisible.value;
  };

  const setProductData = (data: IProductInStock) => {
    productData.value = { ...data };
  };

  const saveProductAction = async (dataItem: IActionData) => {
    console.log(dataItem);
    try {
      const { success, message } = await stoksStore.stockskActions(dataItem);
      if (success) {
        toastNotification.showSuccess(message || '');
        getProductList();
      } else {
        toastNotification.showSuccess(message || '');
        asyncState.failedLoading(message || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  //getters

  //watch and hooks

  provide('localLoading', asyncState.loadingStatus);

  onMounted(() => {
    getProductList();
  });
</script>

<template>
  <div>
    <ErrorBoundary v-if="asyncState.errorText.value" @reload="getProductList" />
    <div v-else class="card">
      <ActionsItem
        v-model:dialogVisible="actionPopUpVisible"
        title="Action"
        :typeAction="typeActionValue"
        :dataItem="productData"
        @saveAction="saveProductAction"
      />
      <CancelItem
        v-model:dialogVisible="cancelPopUpVisible"
        title="Action"
        :typeAction="typeActionValue"
        :dataItem="productData"
        @saveAction="saveProductAction"
      />
      <ReplaceItem
        v-model:dialogVisible="replacePopUpVisible"
        title="Replace product"
        :dataItem="productData"
        @updateData="getProductList()"
      />
      <ProductsInStockHeader
        @updateData="getProductList()"
      />
      <div v-if="!asyncState.loadingStatus.value">
        <ProductsInStockTable
          @updateData="getProductList()"
        >
          <template #actions="{ data }">
                <div class="flex">
                  <Button
                    icon="pi pi-arrow-up"
                    v-tooltip.top="'Single-item Shipment'"
                    outlined
                    rounded
                    severity="info"
                    class="mr-2"
                    @click="toggleActionModalStatus(data, 'SHIPMENT')"
                  />
                  <Button
                    icon="pi pi-arrow-right-arrow-left"
                    v-tooltip.top="'Replace'"
                    outlined
                    rounded
                    severity="warn"
                    class="mr-2"
                    @click="toggleReplaceModalStatus(data)"
                  />
                  <Button
                    v-tooltip.top="'Write off goods'"
                    icon="pi pi-delete-left"
                    outlined
                    rounded
                    class="mr-2"
                    @click="toggleActionModalStatus(data, 'WRITEOFF')"
                  />
                  <Button
                    icon="pi pi-trash"
                    v-tooltip.top="'Return goods'"
                    outlined
                    rounded
                    class="mr-2"
                    severity="secondary"
                    @click="toggleActionModalStatus(data, 'RETURN')"
                  >
                    <font-awesome-icon icon="arrow-rotate-left" />
                  </Button>
                  <Button
                    v-tooltip.top="'Cancel'"
                    icon="pi pi-trash"
                    outlined
                    rounded
                    severity="danger"
                    @click="toggleCancelModalStatus(data, 'CANCEL')"
                  >
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                  </Button>
                </div>
          </template>
        </ProductsInStockTable>
      </div>
      <Skeleton v-else height="20rem" />
    </div>
  </div>
</template>
