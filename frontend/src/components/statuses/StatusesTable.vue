<script setup lang="ts">
  import { useStatusStore } from '@/stores/statusStore';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Paginator from 'primevue/paginator';

  //emits + props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state

  const statusStore = useStatusStore();

  // action

  const onPageChange = (event: any) => {
    statusStore.currentPageStatuses = event.page + 1;
    statusStore.perPageStatuses = event.rows;
    emit('updateData');
  };
</script>

<template>
  <DataTable :value="statusStore.statusesList" tableStyle="min-width: 50rem">
    <Column field="name" :header="$t('table.Name')"></Column>
    <Column field="createdAt" :header="$t('table.created_at')">
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
      <div class="p-datatable-empty-message">{{ $t('default.no_data_available') }}</div>
    </template>
  </DataTable>
  <Paginator
    :rows="statusStore.perPageStatuses"
    :first="(statusStore.currentPageStatuses - 1) * statusStore.perPageStatuses"
    :totalRecords="statusStore.totalStatuses"
    :rowsPerPageOptions="[10, 20, 30]"
    @page="onPageChange"
  />
</template>
