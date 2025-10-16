<script setup lang="ts">
  import { ref, onMounted, provide } from 'vue';
  import { useCategoryStore } from '@/stores/categoryStore';
  import { useToastNotification } from '@/composables/useToastNotification';
  import type { ICategory } from '@/types/categories/categories';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import EditItemPopUp from '@/components/popup/EditItem.vue';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import CategoriesTable from '@/components/categories/CategoriesTable.vue';
  import CategoriesHeader from '@/components/categories/CategoriesHeader.vue';
  import { useI18n } from 'vue-i18n';

  // state
  const editData = ref<ICategory | null>(null);
  const toastNotification = useToastNotification();
  const categoryStore = useCategoryStore();
  const asyncState = useAsyncState();
  const deletedItemId = ref<string | number | null>(null);
  const { t } = useI18n();
  const deletePopUpVisible = ref<boolean>(false);
  const editPopUpVisible = ref<boolean>(false);

  // action

  const getList = async (): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await categoryStore.getCategoryList({ ...categoryStore.getFiltersCategories });

      if (success) {
        categoryStore.categoryList = data.data;
        asyncState.successLoading();
        categoryStore.setCategoriesPagination(data);
      } else {
        asyncState.failedLoading(message || t('default.error_loading'));
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : t('default.error_loading'));
    }
  };

  const setEditData = (data: ICategory) => {
    editData.value = null;
    editData.value = { ...data };
  };

  const toggleEditModal = (data: ICategory) => {
    setEditData(data);
    editPopUpVisible.value = !editPopUpVisible.value;
  };

  const toggleDeleteModal = (id: string | number | null) => {
    deletedItemId.value = id;
    deletePopUpVisible.value = !deletePopUpVisible.value;
  };

  const editCategory = async (dataItem: ICategory): Promise<void> => {
    try {
      const { success, message } = await categoryStore.editCategory(dataItem);
      if (success) {
        toastNotification.showSuccess(message || '');
        editPopUpVisible.value = false;
        getList();
      } else {
        asyncState.failedLoading(message || t('default.error_loading'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id: string | number): Promise<void> => {
    try {
      const { success, message } = await categoryStore.deleteCategory(id);
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

  provide('localLoading', asyncState.loadingStatus);

  onMounted(() => {
    getList();
  });
</script>

<template>
  <div>
    <ErrorBoundary v-if="asyncState.errorText.value" @reload="getList" />
    <div class="card">
      <EditItemPopUp
        v-model:dialogVisible="editPopUpVisible"
        :data="editData || { _id: '', name: '' }"
        :title="$t('category.edit_category')"
        @editData="editCategory"
      />
      <DeleteItemPopUp
        :id="deletedItemId"
        v-model:dialogVisible="deletePopUpVisible"
        :title="$t('category.confirm_delete_category')"
        @deleteItem="deleteItem"
      />
      <Toast />
      <CategoriesHeader @updateData="getList()" />
      <div v-if="!asyncState.loadingStatus.value">
        <CategoriesTable>
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
        </CategoriesTable>
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>
