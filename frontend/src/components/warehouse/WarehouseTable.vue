<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import type { UsersQuery } from '@/types';
  import type { IWarehouse } from '@/types/warehouse/warehouse';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import AddWarehouseItemPopUp from '@/components/warehouse/popup/AddWarehouseItem.vue';
  import EditWarehouseItemPopUp from '@/components/warehouse/popup/EditWarehouseItem.vue';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import Paginator from 'primevue/paginator';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

  // state
  const editData = ref<IWarehouse | null>(null);
  const toast = useToast();
  const warehouseStore = useWarehouseStore();
  const asyncState = useAsyncState();
  const deletedItemId = ref<string | number | null>(null);

  const deletePopUpVisible = ref<boolean>(false);
  const editPopUpVisible = ref<boolean>(false);
  const createPopUpVisible = ref<boolean>(false);

  // action
  const togglePopUpVisible = (): void => {
    createPopUpVisible.value = !createPopUpVisible.value;
  };

  const getList = async (params?: UsersQuery): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await warehouseStore.getWarehouseList(params);

      if (success) {
        warehouseStore.warehouseList = data.data;
        asyncState.successLoading();
        warehouseStore.setWarehousesPagination(data);
      } else {
        asyncState.failedLoading(message || 'error loading');
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
    }
  };

  const setEditData = (data: IWarehouse) => {
    editData.value = { ...data };
  };

  const toggleEditModal = (data: IWarehouse) => {
    setEditData(data);
    editPopUpVisible.value = !editPopUpVisible.value;
  };

  const toggleDeleteModal = (id: string | number | null) => {
    deletedItemId.value = id;
    deletePopUpVisible.value = !deletePopUpVisible.value;
  };

  const deleteItem = async (id: string | number): Promise<void> => {
    try {
      const { success, message } = await warehouseStore.deleteWarehouse(id);
      if (success) {
        toast.add({ severity: 'success', detail: message, life: 3000 });
        toggleDeleteModal(null);
        getList();
      } else {
        toast.add({
          severity: 'error',
          summary: 'Delete falled',
          detail: message,
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPageChange = (event: any) => {
    warehouseStore.currentPageWarehouses = event.page + 1;
    warehouseStore.perPageWarehouses = event.rows;
    getList({ ...warehouseStore.filtersWarehouses });
  };

  /// hooks

  onMounted(() => {
    getList();
  });
</script>
<template>
  <div>
    <ErrorBoundary v-if="asyncState.errorText.value" @reload="getList" />
    <div v-else class="card">
      <AddWarehouseItemPopUp v-model:dialogVisible="createPopUpVisible" title="Create category" @updateList="getList" />
      <EditWarehouseItemPopUp
        v-model:dialogVisible="editPopUpVisible"
        title="Edit category"
        :data="editData as IWarehouse"
        @updateList="getList"
      />
      <DeleteItemPopUp
        :id="deletedItemId"
        v-model:dialogVisible="deletePopUpVisible"
        title="Are you sure want delete this warehouse?"
        @deleteItem="deleteItem"
      />
      <Toast />
      <Toolbar class="mb-6">
        <template #start>
          <TotalResultItem :total="warehouseStore.totalWarehouses" />
        </template>
        <template #end>
          <Button label="New" icon="pi pi-plus" class="mr-2" @click="togglePopUpVisible" />
          <Button icon="pi pi-refresh" rounded raised @click="getList()" />
        </template>
      </Toolbar>
      <div v-if="!asyncState.loadingStatus.value">
        <DataTable :value="warehouseStore.warehouseList" tableStyle="min-width: 50rem">
          <Column field="name" header="Name"></Column>
          <Column field="address" header="Address"></Column>
          <Column field="contact_person" header="Contact person"></Column>
          <Column field="contact" header="Contact"></Column>
          <Column field="createdAt" header="Created at">
            <template #body="slotProps">
              {{ formatDataWithTime(slotProps.data.createdAt) }}
            </template>
          </Column>
          <Column :exportable="false" class="text-end" style="min-width: 12rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="toggleEditModal(slotProps.data)" />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="toggleDeleteModal(slotProps.data._id)"
              />
            </template>
          </Column>
          <template #empty>
            <div class="p-datatable-empty-message">No data available.</div>
          </template>
        </DataTable>
        <Paginator
          :rows="warehouseStore.perPageWarehouses"
          :first="(warehouseStore.currentPageWarehouses - 1) * warehouseStore.perPageWarehouses"
          :totalRecords="warehouseStore.totalWarehouses"
          :rowsPerPageOptions="[10, 20, 30]"
          @page="onPageChange"
        />
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>
