<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useGoodsReceiptStore } from '@/stores/goodsReceiptStore';
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
  import GoodsReceiptFilter from '@/components/goodsReceipt/GoodsReceiptFilter.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

  // state
  const expandedRows = ref({});
  const goodsReceiptStore = useGoodsReceiptStore();
  const asyncState = useAsyncState();

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

  const onPageChange = (event: any) => {
    goodsReceiptStore.currentPageReceipts = event.page + 1;
    goodsReceiptStore.perPageReceipts = event.rows;
    getGoodsList();
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
      <Toolbar class="mb-6">
        <template #start>
          <TotalResultItem :total="goodsReceiptStore.totalReceipts" />
          <GoodsReceiptFilter :loadingStatus="asyncState.loadingStatus.value" @updateData="getGoodsList()" />
        </template>
        <template #end>
          <router-link to="/goods-receipt/add">
            <Button label="New " icon="pi pi-plus" class="mr-2" />
          </router-link>
          <Button icon="pi pi-refresh" rounded raised @click="getGoodsList()" />
        </template>
      </Toolbar>
      <div v-if="!asyncState.loadingStatus.value">
        <DataTable
          v-if="!asyncState.loadingStatus.value"
          v-model:expandedRows="expandedRows"
          :value="goodsReceiptStore.goodsReceiptList"
          dataKey="_id"
          responsiveLayout="scroll"
          rowExpansion
        >
          <Column expander style="width: 3rem" />
          <Column style="width: 20rem" field="name" header="Назва приходу" />
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
                  name: 'GoodReceiptShow',
                  params: { id: slotProps.data._id },
                }"
              >
                <Button outlined icon="pi pi-eye" />
              </router-link>
            </template>
          </Column>
          <!-- Шаблон розгорнутого рядка -->
          <template #expansion="slotProps">
            <div class="p-3">
              <h4>Товари в приході "{{ slotProps.data.name }}"</h4>
              <DataTable :value="slotProps.data.products" responsiveLayout="scroll">
                <Column field="name" header="Назва товару" style="width: 8rem">
                  <template #body="slotProps">
                    <img :src="setFullImgPath(slotProps.data.imagePath)" />
                  </template>
                </Column>
                <Column field="name" header="Назва товару" />
                <Column field="category" header="Категорія" />
                <Column field="status" header="Статус" />
                <Column field="price" header="Ціна за одиницю" />
                <Column field="count" header="Кількість" />
              </DataTable>
            </div>
          </template>
          <template #empty>
            <div class="p-datatable-empty-message">No data available.</div>
          </template>
        </DataTable>
        <Paginator
          :rows="goodsReceiptStore.perPageReceipts"
          :first="(goodsReceiptStore.currentPageReceipts - 1) * goodsReceiptStore.perPageReceipts"
          :totalRecords="goodsReceiptStore.totalReceipts"
          :rowsPerPageOptions="[10, 20, 30]"
          @page="onPageChange"
        />
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>

<style scoped></style>
