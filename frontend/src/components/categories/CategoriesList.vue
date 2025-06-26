<script setup lang="ts">
  import { ref, onMounted, provide } from 'vue';
  import { useCategoryStore } from '@/stores/categoryStore';
  import { useToast } from 'primevue/usetoast';
  import type { ICategory } from '@/types/categories/categories';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import EditItemPopUp from '@/components/popup/EditItem.vue';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import CategoriesTable from '@/components/categories/CategoriesTable.vue';
  import CategoriesHeader from '@/components/categories/CategoriesHeader.vue'

  // state
  const editData = ref<ICategory | null>(null);
  const toast = useToast();
  const categoryStore = useCategoryStore();
  const asyncState = useAsyncState();
  const deletedItemId = ref<string | number | null>(null);

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
        asyncState.failedLoading(message || 'error loading');
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
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
      const { success, message, data } = await categoryStore.editCategory(dataItem);
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
      const { success, message } = await categoryStore.deleteCategory(id);
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
        title="Edit category"
        @editData="editCategory"
      />
      <DeleteItemPopUp
        :id="deletedItemId"
        v-model:dialogVisible="deletePopUpVisible"
        title="Are you sure want delete this category?"
        @deleteItem="deleteItem"
      />
      <Toast />
      <CategoriesHeader
        @updateData="getList()"
      />
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
