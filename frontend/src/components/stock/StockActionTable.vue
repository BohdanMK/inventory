<script setup lang="ts">
  import { ref } from 'vue';
  import { useStocksStore } from '@/stores/stocksStore.ts';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import setFullImgPath from '@/helpers/fullPathImg';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import Button from 'primevue/button';
  import Paginator from 'primevue/paginator';


    //emits + props

    const emit = defineEmits<{
        (e: 'updateData'): void;
    }>();

  // state
  const expandedRows = ref({});

  const stoksStore = useStocksStore();


  // actions

  const onPageChange = (event: any) => {
    stoksStore.currentPageActions = event.page + 1;
    stoksStore.perPageActions = event.rows;
    emit('updateData')
  };


</script>

<template>
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
</template>

<style scoped></style>
