<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useStatusStore } from '@/stores/statusStore';
  import { useToastNotification } from '@/composables/useToastNotification';
  import Toast from 'primevue/toast';
  import type { IStatus } from '@/types/status/statuses';
  import type { UsersQuery } from '@/types';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import EditItemPopUp from '@/components/popup/EditItem.vue';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import StatusesTable from '@/components/statuses/StatusesTable.vue';
  import StatusesHeader from '@/components/statuses/StatusesHeader.vue'

  // state
  const editData = ref<IStatus | null>(null);
  const toastNotification = useToastNotification();
  const statusStore = useStatusStore();
  const asyncState = useAsyncState();
  const deletedItemId = ref<string | number | null>(null);

  const deletePopUpVisible = ref<boolean>(false);
  const editPopUpVisible = ref<boolean>(false);

  // action

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
      const { success, message } = await statusStore.editStatus(dataItem);
      if (success) {
        toastNotification.showSuccess(message || '');
        editPopUpVisible.value = false;
        getList();
      } else {
        toastNotification.showError(message || '');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id: string | number): Promise<void> => {
    try {
      const { success, message } = await statusStore.deleteStatus(id);
      if (success) {
        toastNotification.showSuccess(message || '');
        toggleDeleteModal(null);
        getList();
      } else {
        toastNotification.showError(message || '');
      }
    } catch (error) {
      console.log(error);
    }
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
      <EditItemPopUp
        v-model:dialogVisible="editPopUpVisible"
        :data="editData || { _id: '', name: '' }"
        :title="$t('popup.edit_status')"
        @editData="editStatus"
      />
      <DeleteItemPopUp
        :id="deletedItemId"
        v-model:dialogVisible="deletePopUpVisible"
        :title="$t('default.want_delete_this_status')"
        @deleteItem="deleteItem"
      />
      <Toast />
      <StatusesHeader
        @updateData="getList()"
      />
      <div v-if="!asyncState.loadingStatus.value">
        <StatusesTable>
          <template #actions="{ data }">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="toggleEditModal(data)" />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="toggleDeleteModal(data._id)"
            />
          </template>
        </StatusesTable>
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>
