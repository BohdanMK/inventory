<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useToast } from 'primevue/usetoast';
  import { useProductTemplateStore } from '@/stores/productTemplateStore';
  import type { IProductTemplate } from '@/types/product/product';
  import setFullImgPath from '@/helpers/fullPathImg';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import AddProduct from '@/components/products/popup/AddProduct.vue';
  import DeleteItemPopUp from '@/components/popup/DeleteItem.vue';
  import EditProductPopUp from '@/components/products/popup/EditProduct.vue';
  import Paginator from 'primevue/paginator';
  import ProductsFilter from '@/components/products/ProductsFilter.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

  // state
  const toast = useToast();
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
        toast.add({ severity: 'success', detail: message, life: 3000 });
        toggleDeleteModal(null);
        getProductList();
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

  const setEditData = (data: IProductTemplate) => {
    editData.value = { ...data };
  };

  const toggleEditModal = (data: IProductTemplate) => {
    console.log('клік для редагування');
    setEditData(data);
    editPopUpVisible.value = !editPopUpVisible.value;
  };

  const onPageChange = (event: any) => {
    productTemplateStore.currentPageProducts = event.page + 1;
    productTemplateStore.perPageProducts = event.rows;
    getProductList();
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
        title="Are you sure want delete this product?"
        @deleteItem="deleteItem"
      />
      <EditProductPopUp
        v-model:dialogVisible="editPopUpVisible"
        title="Edit category"
        :data="editData"
        @updateProducts="getProductList()"
      />
      <div class="card">
        <Toolbar class="mb-6">
          <template #start>
            <TotalResultItem :total="productTemplateStore.totalProducts" />
            <ProductsFilter :loadingStatus="asyncState.loadingStatus.value" @updateData="getProductList()" />
          </template>
          <template #end>
            <Button label="New" icon="pi pi-plus" class="mr-2" @click="toggleAddModalStatus()" />
            <Button icon="pi pi-refresh" rounded raised @click="getProductList()" />
          </template>
        </Toolbar>
        <div v-if="!asyncState.loadingStatus.value">
          <DataTable
            :value="productTemplateStore.productTemplateList"
            dataKey="id"
            :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          >
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column header="Image">
              <template #body="slotProps">
                <img
                  :src="setFullImgPath(slotProps.data.imagePath)"
                  :alt="slotProps.data.image"
                  class="rounded"
                  style="width: 164px"
                />
              </template>
            </Column>
            <Column field="name" header="Name" style="min-width: 16rem"></Column>

            <Column field="category" header="Category" style="min-width: 10rem">
              <template #body="slotProps">
                <span>{{ slotProps.data.category.name }}</span>
              </template>
            </Column>
            <Column field="status" header="Status" style="min-width: 10rem">
              <template #body="slotProps">
                <span>{{ slotProps.data.status.name }}</span>
              </template></Column
            >
            <Column field="createdAt" header="Created At" style="min-width: 10rem">
              <template #body="slotProps">
                {{ formatDataWithTime(slotProps.data.createdAt) }}
              </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="toggleEditModal(slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="slotProps.data._id" />
              </template>
            </Column>
            <template #empty>
              <div class="p-datatable-empty-message">No data available.</div>
            </template>
          </DataTable>
        </div>
        <Skeleton v-else height="20rem" />
      </div>
      <Paginator
        :rows="productTemplateStore.perPageProducts"
        :first="(productTemplateStore.currentPageProducts - 1) * productTemplateStore.perPageProducts"
        :totalRecords="productTemplateStore.totalProducts"
        :rowsPerPageOptions="[10, 20, 30]"
        @page="onPageChange"
      />
    </div>
  </div>
</template>

<style scoped></style>
