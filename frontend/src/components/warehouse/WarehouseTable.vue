<script setup lang="ts">
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { useI18n } from 'vue-i18n';

  // i18n
  const { t } = useI18n();

  // emits + props
  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state
  const warehouseStore = useWarehouseStore();

  // actions
  const onPageChange = (event: any) => {
    warehouseStore.currentPageWarehouses = event.page + 1;
    warehouseStore.perPageWarehouses = event.rows;
    emit('updateData');
  };
</script>

<template>
  <DataTable :value="warehouseStore.warehouseList" tableStyle="min-width: 50rem">
    <Column :header="t('warehouseTable.name')" field="name"></Column>
    <Column :header="t('warehouseTable.address')" field="address"></Column>
    <Column :header="t('warehouseTable.contactPerson')" field="contact_person"></Column>
    <Column :header="t('warehouseTable.contact')" field="contact"></Column>
    <Column :header="t('warehouseTable.createdAt')" field="createdAt">
      <template #body="slotProps">
        {{ formatDataWithTime(slotProps.data.createdAt) }}
      </template>
    </Column>
    <Column :exportable="false" class="text-end" style="min-width: 12rem">
      <template #body="slotProps">
        <slot name="actions" :data="slotProps.data" />
      </template>
    </Column>
    <template #empty>
      <div class="p-datatable-empty-message">
        {{ t('warehouseTable.noData') }}
      </div>
    </template>
  </DataTable>

  <Paginator
    :rows="warehouseStore.perPageWarehouses"
    :first="(warehouseStore.currentPageWarehouses - 1) * warehouseStore.perPageWarehouses"
    :totalRecords="warehouseStore.totalWarehouses"
    :rowsPerPageOptions="[10, 20, 30]"
    @page="onPageChange"
  />
</template>
