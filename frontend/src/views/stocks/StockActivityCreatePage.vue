<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { useRouter } from 'vue-router';
  import setFullImgPath from '@/helpers/fullPathImg';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import { stockActionData } from '@/staticData/stockActionData.ts';
  import type { DataFile } from '@/interfaces/index';
  import type {
    IProductTemplate,
    IProductInStockAction,
  } from '@/types/product/product';
  import { useStocksStore } from '@/stores/stocksStore';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import { Form } from '@primevue/forms';
  import { z } from 'zod';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import Select from 'primevue/select';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import debounce from '@/utils/debounce';
  import AutoComplete from 'primevue/autocomplete';
  import ProductList from '@/components/stock/ProductList.vue';
  import Textarea from 'primevue/textarea';
  import FilesUploadItem from '@/components/files/FilesUploadItem.vue';

  ///state
  const toast = useToast();
  const profile = useProfileStore();
  const formRef = ref();
  const stocksStore = useStocksStore();
  const warehouseStore = useWarehouseStore();
  const asyncState = useAsyncState();
  const router = useRouter();
  const localWarehouse = ref<{ name: string; code: string } | null>(null);

  const productName = ref<string>('');
  const selectedProduct = ref<IProductTemplate>({} as IProductTemplate);
  const productList = ref<IProductTemplate[]>([]);

  const initialValues = ref({

  });

  const resolver = zodResolver(
    z.object({
      typeAction: z.object({ name: z.string(), code: z.string() }),
      comment: z.string().optional(),
    })
  );

  const dataFile = ref<DataFile>({
    fileName: '',
    filePath: '',
  });

  // actions
  const onSubmit = async ({
    valid,
    values,
  }: {
    valid: boolean;
    values: any;
  }) => {
    console.log('Valid:', valid);
    console.log('Form values:', values);
    if (!valid) return;
    console.log(values)
    const payload = {
      ...values,
      fileName: dataFile.value.fileName,
      filePath: dataFile.value.filePath,
      products: [...transformProductsData.value],
      typeAction: values.typeAction.code,
      warehouse: localWarehouse.value?.code || null,
      comment: values.comment,
      user: profile.userProfile?._id
    };
    console.log(payload);

    const { success, message } =
      await stocksStore.stockskActions(payload);

    if (success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Goods receipt created',
      });
      setTimeout(() => {
        router.push('/stock-activity');
      }, 800);
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: message });
    }
  };



  const addProductInList = () => {
    if (!selectedProductStatus.value) {
      const product = selectedProduct.value as Partial<IProductInStockAction>;

      const data: IProductInStockAction = {
        ...selectedProduct.value,
        count: product.count ?? 0,
        price: product.price ?? 0,
        countNew: 0,
        priceNew: 0
      };
      stocksStore.addProductInList(data);
      selectedProduct.value = {} as IProductTemplate;
      productName.value = '';
    }
  };

  const fetchProducts = async () => {
    try {
      const { success, message, data } =
        await stocksStore.getProductsInStockList({
          name: productName.value,
        });

      if (!success) {
        console.error('Failed to fetch profile:', message);
      } else {
        productList.value = data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWarehouseList = async (): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await warehouseStore.getWarehouseList();

      if (success) {
        warehouseStore.warehouseList = data.data;
        asyncState.successLoading();
      } else {
        asyncState.failedLoading(message || 'error loading');
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
    }
  };

  const debouncedFetchProducts = debounce(fetchProducts, 300);

  const moveBack = (): void => {
    router.push({ name: 'GoodsReceipt' });
  };

  const updateFile = async (data: DataFile) => {
    console.log(data);
    dataFile.value.fileName = data.fileName;
    dataFile.value.filePath = data.filePath
  }

  // getters

  const selectedProductStatus = computed((): boolean => {
    return Object.keys(selectedProduct.value).length === 0;
  });

  const transformProductsData = computed(() => {
      if(stocksStore.productListForCreateAction) {
        return stocksStore.productListForCreateAction.map(item => ({
          product: item._id,
          count: Number(item.countNew),
          price: Number(item.priceNew),
        }))
      } else {
        return []
      }
  })

  onMounted(() => {
    stocksStore.productListForCreateAction = []
    getWarehouseList();
  });
</script>

<template>
  <div>
    <Toast />
    <ErrorBoundary v-if="asyncState.errorText.value" @reload="getWarehouseList" />
    <div v-else class="card">
      <div v-if="!asyncState.loadingStatus.value">
          <Toolbar class="mb-6 ">
            <template #start>
              <h3 class="text-xl font-medium">Create goods receipt</h3>
            </template>
            <template #end>
              <Button
                label="Back"
                outlined
                icon="pi pi-arrow-left"
                class="mr-2"
                @click="moveBack()"
              />
              <Button
                v-if="localWarehouse"
                type="submit"
                label="Create"
                icon="pi pi-plus"
                class="mr-2"
                @click="formRef?.submit()"
              />
            </template>
          </Toolbar>
          <Toolbar class="mb-0 border-0 px-0 items-start">
            <template #start>
              <Select
                  v-model="localWarehouse"
                  :options="warehouseStore.warehouseListForSelect"
                  optionLabel="name"
                  placeholder="Select warehouse"
                  class="w-full min-w-[230px]"
                  :disabled="stocksStore.productListForCreateAction.length > 0"
                />
            </template>
            <template #end>
            </template>
          </Toolbar>
          <Form
              v-if="localWarehouse"
              v-slot="$form"
              :resolver="resolver"
              :initialValues="initialValues"
              class="mt-0 mb-5 flex w-full flex-col gap-4"
              @submit="onSubmit"
              ref="formRef"
          >
          <Toolbar class="mb-0 border-0 px-0 items-start">
            <template #start>
              <div class="flex gap-1">
                <AutoComplete
                  class="min-w-[400px]"
                  v-model="productName"
                  :suggestions="productList"
                  optionLabel="name"
                  placeholder="Product name"
                  dropdown
                  fluid
                  @complete="debouncedFetchProducts"
                  @item-select="e => {
                    selectedProduct = e.value;
                    productName = e.value.name;
                  }"
                >
                  <template #option="slotProps">
                    <div class="flex gap-3">
                      <div>
                        <img
                            :src="setFullImgPath(slotProps.option.imagePath)"
                            :alt="slotProps.option.image"
                            class="rounded"
                            style="width:64px"
                          />
                      </div>
                      <div class="flex flex-col">
                        <span class="font-medium">{{ slotProps.option.name }}</span>
                        <span>Поставка - {{ slotProps.option.goodsReceiptName }}</span>
                        <span class="text-sm text-gray-500">
                          {{ slotProps.option.warehouse.name }} — {{ slotProps.option.count }} шт.
                        </span>
                      </div>
                    </div>
                  </template>
                </AutoComplete>
                <Button
                  :disabled="selectedProductStatus"
                  icon="pi pi-plus"
                  class="mr-2"
                  @click="addProductInList()"
                />
              </div>
            </template>
            <template #end>
              <div class="flex flex-col gap-5">
                <Select
                  name="typeAction"
                  :options="stockActionData"
                  optionLabel="name"
                  placeholder="Select action"
                  class="w-full min-w-[230px]"
                />

              </div>
            </template>
          </Toolbar>
          <div class="flex  justify-between mb-0 border-0 px-0">
            <Textarea
              name="comment"
              placeholder="Goods receipt info"
              class="w-full max-w-[400px]"
              rows="3"
              cols="30"
            />
            <div>
              <FilesUploadItem
                :saveBtn="true"
                @updateData="updateFile"
                acceptType=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                justFile
              />
            </div>
          </div>
        </Form>
        <ProductList
          v-if="localWarehouse"
        />
      </div>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>

<style scoped></style>
