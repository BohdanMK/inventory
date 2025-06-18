<script setup lang="ts">
  import { ref, onMounted, provide } from 'vue';
  import { FilterMatchMode } from '@primevue/core/api';
  import { useToast } from 'primevue/usetoast';
  import { useStocksStore } from '@/stores/stocksStore';
  import { useAsyncState } from '@/composables/useAsyncState';
  import setFullImgPath from '@/helpers/fullPathImg';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import type { IProductInStock } from '@/types/product/product';
  import type { StoсksActionsType } from '@/constants/constants';
  import type { IActionData } from '@/types/index';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import ReplaceItem from '@/components/stock/popup/ReplaceItem.vue';
  import ActionsItem from '@/components/stock/popup/ActionsItem.vue';
  import CancelItem from '@/components/stock/popup/CancelItem.vue';
  import Paginator from 'primevue/paginator';
  import ProductsInStockFilter from '@/components/stock/ProductsInStockFilter.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

  const selectedProducts = ref();
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  // state
  const toast = useToast();
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
        toast.add({ severity: 'success', detail: message, life: 3000 });
        getProductList();
      } else {
        toast.add({
          severity: 'error',
          summary: 'Delete falled',
          detail: message,
          life: 3000,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onPageChange = (event: any) => {
    stoksStore.currentPageProducts = event.page + 1;
    stoksStore.perPageProducts = event.rows;
    console.log(stoksStore.getfiltersProducts);
    getProductList();
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
      <Toolbar class="mb-6">
        <template #start>
          <TotalResultItem :total="stoksStore.totalProducts" />
          <ProductsInStockFilter :loadingStatus="asyncState.loadingStatus.value" @updateData="getProductList()" />
        </template>
        <template #end>
          <router-link to="/stock-activity/add">
            <Button label="New group action" icon="pi pi-plus" class="mr-2" />
          </router-link>
          <Button icon="pi pi-refresh" rounded raised @click="getProductList()" />
        </template>
      </Toolbar>
      <div v-if="!asyncState.loadingStatus.value">
        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="stoksStore.productList"
          dataKey="id"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
          <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
          <Column header="Image">
            <template #body="slotProps">
              <img
                :src="setFullImgPath(slotProps.data.imagePath)"
                :alt="slotProps.data.image"
                class="rounded"
                style="width: 164px"
              />
            </template>
          </Column>
          <Column field="name" header="Name" style="min-width: 12rem"></Column>
          <Column field="goodsReceiptName" header="Goods receipt" style="min-width: 12rem"></Column>
          <Column field="count" header="Quantity" style="min-width: 4rem"></Column>
          <Column field="price" header="Price" style="min-width: 4rem"></Column>
          <Column field="category" header="Category" style="min-width: 10rem">
            <template #body="slotProps">
              <span>{{ slotProps.data.category.name || slotProps.data.category }}</span>
            </template>
          </Column>
          <Column field="status" header="Status" style="min-width: 10rem">
            <template #body="slotProps">
              <span>{{ slotProps.data.status.name || slotProps.data.status }}</span>
            </template></Column
          >
          <Column field="warehouse.name" header="Warehouse" style="min-width: 6rem"></Column>
          <Column field="createdAt" header="Created At" style="min-width: 10rem">
            <template #body="slotProps">
              {{ formatDataWithTime(slotProps.data.createdAt) }}
            </template>
          </Column>
          <Column class="text-end" :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
              <div class="flex">
                <Button
                  icon="pi pi-arrow-up"
                  v-tooltip.top="'Single-item Shipment'"
                  outlined
                  rounded
                  severity="info"
                  class="mr-2"
                  @click="toggleActionModalStatus(slotProps.data, 'SHIPMENT')"
                />
                <Button
                  icon="pi pi-arrow-right-arrow-left"
                  v-tooltip.top="'Replace'"
                  outlined
                  rounded
                  severity="warn"
                  class="mr-2"
                  @click="toggleReplaceModalStatus(slotProps.data)"
                />
                <Button
                  v-tooltip.top="'Write off goods'"
                  icon="pi pi-delete-left"
                  outlined
                  rounded
                  class="mr-2"
                  @click="toggleActionModalStatus(slotProps.data, 'WRITEOFF')"
                />
                <Button
                  icon="pi pi-trash"
                  v-tooltip.top="'Return goods'"
                  outlined
                  rounded
                  class="mr-2"
                  severity="secondary"
                  @click="toggleActionModalStatus(slotProps.data, 'RETURN')"
                >
                  <font-awesome-icon icon="arrow-rotate-left" />
                </Button>
                <Button
                  v-tooltip.top="'Cancel'"
                  icon="pi pi-trash"
                  outlined
                  rounded
                  severity="danger"
                  @click="toggleCancelModalStatus(slotProps.data, 'CANCEL')"
                >
                  <font-awesome-icon icon="fa-solid fa-xmark" />
                </Button>
              </div>
            </template>
          </Column>
          <template #empty>
            <div class="p-datatable-empty-message">No data available.</div>
          </template>
        </DataTable>
        <Paginator
          :rows="stoksStore.perPageProducts"
          :first="(stoksStore.currentPageProducts - 1) * stoksStore.perPageProducts"
          :totalRecords="stoksStore.totalProducts"
          :rowsPerPageOptions="[10, 20, 30]"
          @page="onPageChange"
        />
      </div>
      <Skeleton v-else height="20rem" />
    </div>
  </div>
</template>
