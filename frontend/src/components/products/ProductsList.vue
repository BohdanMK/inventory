<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useToastNotification } from '@/composables/useToastNotification';
  import { useProductTemplateStore } from '@/stores/productTemplateStore';
  import type { IProductTemplate } from '@/types/product/product';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import AddProduct from '@/components/products/popup/AddProduct.vue';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import EditProductPopUp from '@/components/products/popup/EditProduct.vue';
  import ProductsTable from '@/components/products/ProductsTable.vue';
  import ProductsHeader from '@/components/products/ProductsHeader.vue';

  // state

  const toastNotification = useToastNotification();
  const productTemplateStore = useProductTemplateStore();
  const asyncState = useAsyncState();

  const deletePopUpVisible = ref<boolean>(false);
  const editPopUpVisible = ref<boolean>(false);
  const addModalStatus = ref<boolean>(false);
  const deletedItemId = ref<string | number | null>(null);

  const editData = ref<IProductTemplate>({} as IProductTemplate);
  // actions

  const toggleAddModalStatus = (): void => {
    addModalStatus.value = !addModalStatus.value;
  };

  const getProductList = async (): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await productTemplateStore.getProductTemplateList({
        ...productTemplateStore.getfiltersProducts,
      });
      if (success) {
        productTemplateStore.productTemplateList = data.data;
        asyncState.successLoading();
        productTemplateStore.setActionsPagination(data);
      } else {
        asyncState.failedLoading(message || 'error loading');
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
    }
  };

  const toggleDeleteModal = (id: string | number | null) => {
    deletedItemId.value = id;
    deletePopUpVisible.value = !deletePopUpVisible.value;
  };

  const deleteItem = async (id: string | number): Promise<void> => {
    try {
      const { success, message } = await productTemplateStore.deleteProduct(id);
      if (success) {
        toastNotification.showSuccess(message || '');
        toggleDeleteModal(null);
        getProductList();
      } else {
        toastNotification.showError(message || '');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setEditData = (data: IProductTemplate) => {
    editData.value = { ...data };
  };

  const toggleEditModal = (data: IProductTemplate) => {
    setEditData(data);
    editPopUpVisible.value = !editPopUpVisible.value;
  };

  //watch and hooks

  onMounted(() => {
    getProductList();
  });
</script>

<template>
  <div>
    <ErrorBoundary v-if="asyncState.errorText.value" @reload="getProductList" />
    <div v-else class="card">
      <AddProduct v-model:dialog-visible="addModalStatus" @updateProducts="getProductList()" />
      <DeleteItemPopUp
        :id="deletedItemId"
        v-model:dialogVisible="deletePopUpVisible"
        :title="$t('productTemplate.delete_confirm_message')"
        @deleteItem="deleteItem"
      />
      <EditProductPopUp
        v-model:dialogVisible="editPopUpVisible"
        :title="$t('productTemplate.edit_category')"
        :data="editData"
        @updateProducts="getProductList()"
      />
      <div class="card">
        <ProductsHeader @updateData="getProductList()" @openCreate="toggleAddModalStatus()" />
        <div v-if="!asyncState.loadingStatus.value">
          <ProductsTable @updateData="getProductList()">
            <template #actions="{ data }">
              <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="toggleEditModal(data)" />
              <Button icon="pi pi-trash" outlined rounded severity="danger" @click="toggleDeleteModal(data._id)" />
            </template>
          </ProductsTable>
        </div>
        <Skeleton v-else height="20rem" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
