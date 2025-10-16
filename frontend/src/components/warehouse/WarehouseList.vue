<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import { useToast } from 'primevue/usetoast';
  import { useI18n } from 'vue-i18n';
  import Toast from 'primevue/toast';
  import type { IWarehouse } from '@/types/warehouse/warehouse';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import Button from 'primevue/button';
  import EditWarehouseItemPopUp from '@/components/warehouse/popup/EditWarehouseItem.vue';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import WarehouseTable from '@/components/warehouse/WarehouseTable.vue';
  import WarehouseHeader from '@/components/warehouse/WarehouseHeader.vue';

  //emits + props

  const { t } = useI18n();

  // state
  const editData = ref<IWarehouse | null>(null);
  const toast = useToast();
  const warehouseStore = useWarehouseStore();
  const asyncState = useAsyncState();
  const deletedItemId = ref<string | number | null>(null);

  const deletePopUpVisible = ref<boolean>(false);
  const editPopUpVisible = ref<boolean>(false);

  // action

  const getList = async (): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await warehouseStore.getWarehouseList({ ...warehouseStore.filtersWarehouses });

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
        toast.add({ severity: t('notification.success'), detail: message, life: 3000 });
        toggleDeleteModal(null);
        getList();
      } else {
        toast.add({
          severity: t('notification.error'),
          summary: t('error.delete_falled'),
          detail: message,
          life: 3000,
        });
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
      <EditWarehouseItemPopUp
        v-model:dialogVisible="editPopUpVisible"
        title="Edit category"
        :data="editData as IWarehouse"
        @updateList="getList"
      />
      <DeleteItemPopUp
        :id="deletedItemId"
        v-model:dialogVisible="deletePopUpVisible"
        :title="$t('warehouseTable.delete_wh_notification')"
        @deleteItem="deleteItem"
      />
      <Toast />
      <WarehouseHeader @updateData="getList()" />
      <div v-if="!asyncState.loadingStatus.value">
        <WarehouseTable>
          <template #actions="{ data }">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              v-tooltip.top="$t('button.edit')"
              @click="toggleEditModal(data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              v-tooltip.top="$t('button.delete')"
              @click="toggleDeleteModal(data._id)"
            />
          </template>
        </WarehouseTable>
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>
