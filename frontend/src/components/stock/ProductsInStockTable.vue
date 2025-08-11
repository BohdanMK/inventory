<script setup lang="ts">
  import { useStocksStore } from '@/stores/stocksStore';
  import setFullImgPath from '@/helpers/fullPathImg';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Paginator from 'primevue/paginator';


  //emits + props

  const emit = defineEmits<{
      (e: 'updateData'): void;
  }>();



  // state
  const stoksStore = useStocksStore();

  // actions



  const onPageChange = (event: any) => {
    stoksStore.currentPageProducts = event.page + 1;
    stoksStore.perPageProducts = event.rows;
    console.log(stoksStore.getfiltersProducts);
    emit('updateData');
  };

  //getters

  //watch and hooks



</script>

<template>
        <DataTable
          ref="dt"
          :value="stoksStore.productList"
          dataKey="id"
          :rows="10"
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
                <slot name="actions" :data="slotProps.data" />
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
</template>
