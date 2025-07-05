<script setup lang="ts">
    import { useCategoryStore } from '@/stores/categoryStore';
    import { formatDataWithTime } from '@/composables/formatDate.ts';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';

    //emits + props

    const emit = defineEmits<{
        (e: 'updateData'): void;
    }>();

    //state

    const categoryStore = useCategoryStore();

    // actions

    const onPageChange = (event: any) => {
        categoryStore.currentPageCategories = event.page + 1;
        categoryStore.perPageCategories = event.rows;
        emit('updateData')
    };
</script>
<template>
      <DataTable :value="categoryStore.categoryList" tableStyle="min-width: 50rem">
          <Column field="name"
            :header="$t('table.name')"></Column>
          <Column field="createdAt"
            :header="$t('table.created_at')"
            >
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
            <div class="p-datatable-empty-message">No data available.</div>
          </template>
        </DataTable>
        <Paginator
          :rows="categoryStore.perPageCategories"
          :first="(categoryStore.currentPageCategories - 1) * categoryStore.perPageCategories"
          :totalRecords="categoryStore.totalCategories"
          :rowsPerPageOptions="[10, 20, 30]"
          @page="onPageChange"
        />
</template>
