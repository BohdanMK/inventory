<script setup lang="ts">
  import { ref } from 'vue';
  import { useGoodsReceiptStore } from '@/stores/goodsReceiptStore';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import setFullImgPath from '@/helpers/fullPathImg';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import { useAsyncState } from '@/composables/useAsyncState';
  import Paginator from 'primevue/paginator';

  // props + emits
  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state
  const expandedRows = ref({});
  const goodsReceiptStore = useGoodsReceiptStore();
  const asyncState = useAsyncState();

  // actions

  const onPageChange = (event: any) => {
    goodsReceiptStore.currentPageReceipts = event.page + 1;
    goodsReceiptStore.perPageReceipts = event.rows;
    emit('updateData');
  };
</script>
<template>
  <DataTable
    v-if="!asyncState.loadingStatus.value"
    v-model:expandedRows="expandedRows"
    :value="goodsReceiptStore.goodsReceiptList"
    dataKey="_id"
    responsiveLayout="scroll"
    rowExpansion
  >
    <Column expander style="width: 3rem" />
    <Column style="width: 20rem" field="name" :header="$t('goodsReceipt.receiptName')" />
    <Column style="width: 8rem" field="createdAt" :header="$t('goodsReceipt.createdAt')">
      <template #body="slotProps">
        {{ formatDataWithTime(slotProps.data.createdAt) }}
      </template>
    </Column>
    <Column style="width: 10rem" field="warehouse" :header="$t('goodsReceipt.warehouse')">
      <template #body="slotProps">
        {{ slotProps.data.warehouse.name }}
      </template>
    </Column>
    <Column style="width: 20rem" field="comment" :header="$t('goodsReceipt.details')" />
    <Column :exportable="false" class="text-end" style="min-width: 12rem">
      <template #body="slotProps">
        <router-link :to="{ name: 'GoodReceiptShow', params: { id: slotProps.data._id } }">
          <Button outlined icon="pi pi-eye" />
        </router-link>
      </template>
    </Column>

    <template #expansion="slotProps">
      <div class="p-3">
        <h4>{{ $t('goodsReceipt.productsInReceipt') }} "{{ slotProps.data.name }}"</h4>
        <DataTable :value="slotProps.data.products" responsiveLayout="scroll">
          <Column field="imagePath" :header="$t('goodsReceipt.productName')" style="width: 8rem">
            <template #body="slotProps">
              <img :src="setFullImgPath(slotProps.data.imagePath)" />
            </template>
          </Column>
          <Column field="name" :header="$t('goodsReceipt.productName')" />
          <Column field="category" :header="$t('goodsReceipt.category')" />
          <Column field="status" :header="$t('goodsReceipt.status')" />
          <Column field="price" :header="$t('goodsReceipt.unitPrice')" />
          <Column field="count" :header="$t('goodsReceipt.count')" />
        </DataTable>
      </div>
    </template>

    <template #empty>
      <div class="p-datatable-empty-message">
        {{ $t('goodsReceipt.noData') }}
      </div>
    </template>
  </DataTable>

  <Paginator
    :rows="goodsReceiptStore.perPageReceipts"
    :first="(goodsReceiptStore.currentPageReceipts - 1) * goodsReceiptStore.perPageReceipts"
    :totalRecords="goodsReceiptStore.totalReceipts"
    :rowsPerPageOptions="[10, 20, 30]"
    @page="onPageChange"
  />
</template>
