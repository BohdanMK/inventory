<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useStocksStore } from '@/stores/stocksStore.ts';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import setFullImgPath from '@/helpers/fullPathImg';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import Paginator from 'primevue/paginator';
  import StockActionFilter from '@/components/stock/StockActionFilter.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

  // state
  const expandedRows = ref({});

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

  const onPageChange = (event: any) => {
    stoksStore.currentPageActions = event.page + 1;
    stoksStore.perPageActions = event.rows;
    getStoksActionList();
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
        <DataTable
          v-model:expandedRows="expandedRows"
          :value="stoksStore.stockActionList"
          dataKey="_id"
          responsiveLayout="scroll"
          rowExpansion
        >
          <Column expander style="width: 3rem" />
          <Column style="width: 20rem" field="typeAction" header="Тип операції" />
          <Column style="width: 8rem" field="createdAt" header="Дата створення">
            <template #body="slotProps">
              {{ formatDataWithTime(slotProps.data.createdAt) }}
            </template>
          </Column>
          <Column style="width: 10rem" field="warehouse" header="Склад">
            <template #body="slotProps">
              {{ slotProps.data.warehouse.name }}
            </template>
          </Column>
          <Column style="width: 20rem" field="comment" header="Деталі"> </Column>
          <Column :exportable="false" class="text-end" style="min-width: 12rem">
            <template #body="slotProps">
              <router-link
                :to="{
                  name: 'StockActivityShow',
                  params: { id: slotProps.data._id },
                }"
              >
                <Button outlined icon="pi pi-eye" />
              </router-link>
            </template>
          </Column>
          <template #expansion="slotProps">
            <div class="p-3">
              <h4>Список товарів</h4>
              <DataTable :value="slotProps.data.products" responsiveLayout="scroll">
                <Column header="Зображення" style="width: 8rem">
                  <template #body="productSlot">
                    <img
                      :src="setFullImgPath(productSlot.data.imagePath)"
                      alt="product"
                      style="width: 50px; height: auto; object-fit: contain"
                    />
                  </template>
                </Column>
                <Column field="name" header="Назва товару" />
                <Column field="category" header="Категорія" />
                <Column field="status" header="Статус" />
                <Column field="price" header="Ціна за одиницю">
                  <template #body="productSlot"> {{ productSlot.data.price }} ₴ </template>
                </Column>
                <Column field="count" header="Кількість" />
              </DataTable>
            </div>
          </template>
          <template #empty>
            <div class="p-datatable-empty-message">No data available.</div>
          </template>
        </DataTable>
        <Paginator
          :rows="stoksStore.perPageActions"
          :first="(stoksStore.currentPageActions - 1) * stoksStore.perPageActions"
          :totalRecords="stoksStore.totalActions"
          :rowsPerPageOptions="[10, 20, 30]"
          @page="onPageChange"
        />
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>

<style scoped></style>
