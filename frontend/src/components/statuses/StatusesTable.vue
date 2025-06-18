<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useStatusStore } from '@/stores/statusStore';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import type { IStatus } from '@/types/status/statuses';
  import type { UsersQuery } from '@/types';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import CreateItemPopUp from '@/components/popup/CreateItem.vue';
  import EditItemPopUp from '@/components/popup/EditItem.vue';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import Paginator from 'primevue/paginator';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

  // state
  const editData = ref<IStatus | null>(null);
  const toast = useToast();
  const statusStore = useStatusStore();
  const asyncState = useAsyncState();
  const deletedItemId = ref<string | number | null>(null);

  const deletePopUpVisible = ref<boolean>(false);
  const editPopUpVisible = ref<boolean>(false);
  const createPopUpVisible = ref<boolean>(false);

  // action
  const togglePopUpVisible = (): void => {
    createPopUpVisible.value = !createPopUpVisible.value;
  };

  const createStatus = async (value: string): Promise<void> => {
    try {
      const { success, message } = await statusStore.createStatus(value);

      if (success) {
        createPopUpVisible.value = false;
        getList();
        toast.add({ severity: 'success', detail: message, life: 3000 });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Creating falled',
          detail: message,
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }

    createPopUpVisible.value = false;
  };

  const getList = async (params?: UsersQuery): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await statusStore.getStatusList(params);

      if (success) {
        statusStore.statusesList = data.data;
        asyncState.successLoading();
        statusStore.setStatusesPagination(data);
      } else {
        asyncState.failedLoading(message || 'error loading');
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
    }
  };

  const setEditData = (data: IStatus) => {
    editData.value = null;
    editData.value = { ...data };
  };

  const toggleEditModal = (data: IStatus) => {
    setEditData(data);
    editPopUpVisible.value = !editPopUpVisible.value;
  };

  const toggleDeleteModal = (id: string | number | null) => {
    deletedItemId.value = id;
    deletePopUpVisible.value = !deletePopUpVisible.value;
  };

  const editStatus = async (dataItem: IStatus): Promise<void> => {
    try {
      const { success, message, data } = await statusStore.editStatus(dataItem);
      if (success) {
        toast.add({ severity: 'success', detail: message, life: 3000 });
        editPopUpVisible.value = false;
        getList();
      } else {
        console.log(data, message);
        toast.add({
          severity: 'error',
          summary: 'Creating falled',
          detail: message,
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id: string | number): Promise<void> => {
    try {
      const { success, message } = await statusStore.deleteStatus(id);
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
    statusStore.currentPageStatuses = event.page + 1;
    statusStore.perPageStatuses = event.rows;
    getList({ ...statusStore.filtersStatuses });
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
      <CreateItemPopUp v-model:dialogVisible="createPopUpVisible" title="Create status" @createData="createStatus" />
      <EditItemPopUp
        v-model:dialogVisible="editPopUpVisible"
        :data="editData || { _id: '', name: '' }"
        title="Edit status"
        @editData="editStatus"
      />
      <DeleteItemPopUp
        :id="deletedItemId"
        v-model:dialogVisible="deletePopUpVisible"
        title="Are you sure want delete this status?"
        @deleteItem="deleteItem"
      />
      <Toast />
      <Toolbar class="mb-6">
        <template #start>
          <TotalResultItem :total="statusStore.totalStatuses" />
        </template>
        <template #end>
          <Button label="New" icon="pi pi-plus" class="mr-2" @click="togglePopUpVisible" />
          <Button icon="pi pi-refresh" rounded raised @click="getList()" />
        </template>
      </Toolbar>
      <div v-if="!asyncState.loadingStatus.value">
        <DataTable :value="statusStore.statusesList" tableStyle="min-width: 50rem">
          <Column field="name" header="Name"></Column>
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
          :rows="statusStore.perPageStatuses"
          :first="(statusStore.currentPageStatuses - 1) * statusStore.perPageStatuses"
          :totalRecords="statusStore.totalStatuses"
          :rowsPerPageOptions="[10, 20, 30]"
          @page="onPageChange"
        />
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>
