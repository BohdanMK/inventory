<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import { useRouter } from 'vue-router';
  import { useToastNotification } from '@/composables/useToastNotification';
  import { useGoodsReceiptStore } from '@/stores/goodsReceiptStore';
  import { useProductTemplateStore } from '@/stores/productTemplateStore';
  import type { IProductTemplate, IProductInStock } from '@/types/product/product';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import { Form } from '@primevue/forms';
  import { z } from 'zod';
  import { zodResolver } from '@primevue/forms/resolvers/zod';
  import Select from 'primevue/select';
  import Button from 'primevue/button';
  import Toolbar from 'primevue/toolbar';
  import debounce from '@/utils/debounce';
  import AutoComplete from 'primevue/autocomplete';
  import ProductList from '@/components/goodsReceipt/ProductList.vue';
  import Textarea from 'primevue/textarea';
  import BreadcrumbItem from '@/components/ui/BreadcrumbItem.vue';
  import { useI18n } from 'vue-i18n';

  ///state
  const toast = useToast();
  const productTemplateStore = useProductTemplateStore();
  const warehouseStore = useWarehouseStore();
  const goodsReceiptStore = useGoodsReceiptStore();
  const router = useRouter();
  const toastNotification = useToastNotification();
  const { t } = useI18n();

  const productName = ref<string>('');
  const selectedProduct = ref<IProductTemplate>({} as IProductTemplate);
  const productList = ref<IProductTemplate[]>([]);

  const initialValues = ref({
    warehouse: null,
    comment: '',
  });

  const resolver = zodResolver(
    z.object({
      warehouse: z.object({ name: z.string(), code: z.string() }),
      comment: z.string().optional(),
    })
  );

  // actions
  const onSubmit = async ({ valid, values }: { valid: boolean; values: any }) => {
    if (!valid) return;

    if(!goodsReceiptStore.productList || goodsReceiptStore.productList.length === 0) {
      toastNotification.showError(t('goodsReceipt.add_product_in_list'));
      return
    }

    if(goodsReceiptStore.checkOnEmptyValueInProducts()) {
      toastNotification.showError(t('goodsReceipt.set_count_and_price'));
      return
    }

    const payload = {
      ...values,
      products: goodsReceiptStore.productList,
    };
    console.log(payload);

    const { success, message } = await goodsReceiptStore.createGoodsReceipt(payload);

    if (success) {
      toastNotification.showSuccess(message || '');
      setTimeout(() => {
        router.push('/goods-receipt');
      }, 800);
    } else {
      toastNotification.showError(message || '');
    }
  };

  const addProductInList = () => {
    if (!selectedProductStatus.value) {
      const data: IProductInStock = {
        ...selectedProduct.value,
        count: 0,
        price: 0,
      };
      goodsReceiptStore.addProductInList(data);
      selectedProduct.value = {} as IProductTemplate;
      productName.value = '';
    }
  };

  const getWarehouseList = async (): Promise<void> => {
    const { success, message, data } = await warehouseStore.getWarehouseList();

    if (success) {
      warehouseStore.warehouseList = data.data;
    } else {
      console.log(data, message);
    }
  };

  const fetchProducts = async () => {
    try {
      const { success, message, data } = await productTemplateStore.getProductTemplateList({
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

  const debouncedFetchProducts = debounce(fetchProducts, 300);

  const moveBack = (): void => {
    router.push({ name: 'GoodsReceipt' });
  };

  // getters

  const selectedProductStatus = computed((): boolean => {
    return Object.keys(selectedProduct.value).length === 0;
  });

  onMounted(() => {
    getWarehouseList();
    goodsReceiptStore.resetProductList();
  });
</script>

<template>
  <div>
    <Toast />
    <BreadcrumbItem/>
    <div class="card">
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="initialValues"
        class="mt-0 mb-5 flex w-full flex-col gap-4"
        @submit="onSubmit"
      >
        <Toolbar class="mb-6">
          <template #start>
            <h3 class="text-xl font-medium"> {{ $t('goodsReceipt.Create_goods_receipt') }}</h3>
          </template>
          <template #end>
            <Button :label="$t('button.back')" outlined icon="pi pi-arrow-left" class="mr-2" @click="moveBack()" />
            <Button type="submit" :label="$t('button.create')" icon="pi pi-plus" class="mr-2" />
          </template>
        </Toolbar>
        <Toolbar class="mb-0 border-0 px-0">
          <template #start>
            <div class="flex gap-1">
              <AutoComplete
                v-model="productName"
                :suggestions="productList"
                optionLabel="name"
                :placeholder="$t('goodsReceipt.productName')"
                dropdown
                fluid
                @complete="debouncedFetchProducts"
                @item-select="
                  e => {
                    selectedProduct = e.value;
                    productName = e.value.name;
                  }
                "
              />
              <Button :disabled="selectedProductStatus" icon="pi pi-plus" class="mr-2" @click="addProductInList()" />
            </div>
          </template>
          <template #end>
            <div class="flex flex-col gap-1">
              <Select
                name="warehouse"
                :options="warehouseStore.warehouseListForSelect"
                optionLabel="name"
                :placeholder="$t('goodsReceipt.select_warehouse')"
                class="w-full min-w-[230px]"
              />
            </div>
          </template>
        </Toolbar>
        <div class="mb-0 border-0 px-0">
          <Textarea name="comment" :placeholder="$t('goodsReceipt.goods_receipt_info')" class="w-full max-w-[400px]" rows="3" cols="30" />
        </div>
      </Form>
      <ProductList />
    </div>
  </div>
</template>

<style scoped></style>
