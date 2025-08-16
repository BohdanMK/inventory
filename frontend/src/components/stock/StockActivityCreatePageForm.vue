<script setup lang="ts">
import { ref, computed } from "vue";
import { useToastNotification } from "@/composables/useToastNotification";
import setFullImgPath from "@/helpers/fullPathImg";
import { stockActionData } from "@/staticData/stockActionData.ts";
import type { DataFile } from "@/interfaces/index";
import type { IProductTemplate, IProductInStockAction } from "@/types/product/product";
import { useStocksStore } from "@/stores/stocksStore";
import { useProfileStore } from "@/stores/userProfileStore";
import { Form } from "@primevue/forms";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import Select from "primevue/select";
import Toolbar from "primevue/toolbar";
import debounce from "@/utils/debounce";
import AutoComplete from "primevue/autocomplete";
import Textarea from "primevue/textarea";
import FilesUploadItem from "@/components/files/FilesUploadItem.vue";
import { useI18n } from "vue-i18n";

interface Props {
  localWarehouse?: { name: string; code: string };
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "success"): void;
}>();

// state
const formRef = ref();
const toastNotification = useToastNotification();
const profile = useProfileStore();
const stocksStore = useStocksStore();
const { t } = useI18n();

const productName = ref<string>("");
const selectedProduct = ref<IProductTemplate>({} as IProductTemplate);
const productList = ref<IProductTemplate[]>([]);
const initialValues = ref({});

const resolver = zodResolver(
  z.object({
    typeAction: z.object({ name: z.string(), code: z.string() }),
    comment: z.string().optional(),
  })
);

const dataFile = ref<DataFile>({
  fileName: "",
  filePath: "",
});

// actions
const onSubmit = async ({ valid, values }: { valid: boolean; values: any }) => {
  if (!valid) return;
  if (checkOnEmptyValueInProducts()) {
    toastNotification.showError(t("goodsReceipt.set_count_and_price"));
    return;
  }

  const payload = {
    ...values,
    fileName: dataFile.value.fileName,
    filePath: dataFile.value.filePath,
    products: [...transformProductsData.value],
    typeAction: values.typeAction.code,
    warehouse: props.localWarehouse?.code || null,
    comment: values.comment,
    user: profile.userProfile?._id,
  };

  const { success, message } = await stocksStore.stockskActions(payload);

  if (success) {
    toastNotification.showSuccess(message || "");
    emit("success");
  } else {
    toastNotification.showError(message || "");
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
      priceNew: 0,
    };
    stocksStore.addProductInList(data);
    selectedProduct.value = {} as IProductTemplate;
    productName.value = "";
  }
};

const fetchProducts = async () => {
  if (!props.localWarehouse?.code) {
    productList.value = [];
    return;
  }
  try {
    const { success, message, data } = await stocksStore.getProductsInStockList({
      name: productName.value,
      warehouse: props.localWarehouse?.code,
    });

    if (success) {
      productList.value = data.data;
    } else {
      console.error("Failed to fetch products:", message);
    }
  } catch (error) {
    console.log(error);
  }
};

const debouncedFetchProducts = debounce(fetchProducts, 300);

const updateFile = async (data: DataFile) => {
  dataFile.value.fileName = data.fileName;
  dataFile.value.filePath = data.filePath;
};

// getters
const selectedProductStatus = computed((): boolean => {
  return Object.keys(selectedProduct.value).length === 0;
});

const checkOnEmptyValueInProducts = (): boolean => {
  return transformProductsData.value.some((item) => !item.count || !item.price);
};

const transformProductsData = computed(() => {
  if (stocksStore.productListForCreateAction) {
    return stocksStore.productListForCreateAction.map((item) => ({
      product: item._id,
      count: Number(item.countNew),
      price: Number(item.priceNew),
    }));
  } else {
    return [];
  }
});
/// expose methods
defineExpose({
    submit: () => formRef.value?.submit()
});
</script>

<template>
  <Form
    v-if="localWarehouse"
    ref="formRef"
    :resolver="resolver"
    :initialValues="initialValues"
    class="mt-0 mb-5 flex w-full flex-col gap-4"
    @submit="onSubmit"
  >
    <Toolbar class="mb-0 items-start border-0 px-0">
      <template #start>
        <div class="flex gap-1">
          <AutoComplete
            v-model="productName"
            class="min-w-[400px]"
            :suggestions="productList"
            optionLabel="name"
            :placeholder="t('goodsReceipt.productName')"
            dropdown
            fluid
            @complete="debouncedFetchProducts"
            @item-select="
              e => {
                selectedProduct = e.value;
                productName = e.value.name;
              }
            "
          >
            <template #option="slotProps">
              <div class="flex gap-3">
                <img
                  :src="setFullImgPath(slotProps.option.imagePath)"
                  :alt="slotProps.option.image"
                  class="rounded"
                  style="width: 64px"
                />
                <div class="flex flex-col">
                  <span class="font-medium">{{ slotProps.option.name }}</span>
                  <span>{{ t('goodsReceipt.receiptName') }} - {{ slotProps.option.goodsReceiptName }}</span>
                  <span class="text-sm text-gray-500">
                    {{ slotProps.option.warehouse.name }} — {{ slotProps.option.count }} {{ t('goodsReceipt.count') }}
                  </span>
                </div>
              </div>
            </template>
          </AutoComplete>
          <Button :disabled="selectedProductStatus" icon="pi pi-plus" class="mr-2" @click="addProductInList()" />
        </div>
      </template>
      <template #end>
        <Select
          name="typeAction"
          :options="stockActionData"
          optionLabel="name"
          :placeholder="t('goodsReceipt.select_action')"
          class="w-full min-w-[230px]"
        />
      </template>
    </Toolbar>

    <div class="mb-0 flex justify-between border-0 px-0">
      <Textarea
        name="comment"
        :placeholder="t('goodsReceipt.goods_receipt_info')"
        class="w-full max-w-[400px]"
        rows="3"
        cols="30"
      />
      <FilesUploadItem
        :saveBtn="true"
        acceptType=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
        :justFile="true"
        @updateData="updateFile"
      />
    </div>
  </Form>
</template>
