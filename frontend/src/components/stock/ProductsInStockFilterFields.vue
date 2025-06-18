<script setup lang="ts">
  import { onMounted, inject } from 'vue';
  import { useStocksStore } from '@/stores/stocksStore';
  import { useCategoryStore } from '@/stores/categoryStore';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import InputText from 'primevue/inputtext';
  import Select from 'primevue/select';
  import Button from 'primevue/button';

  /// emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state
  const stoksStore = useStocksStore();
  const categoryStore = useCategoryStore();
  const warehouseStore = useWarehouseStore();
  const localLoading = inject('localLoading') as boolean;

  // actions

  const getCategoryList = async (): Promise<void> => {
    try {
      const { success, data } = await categoryStore.getCategoryList({ all: true });
      if (success) {
        categoryStore.categoryList = data.data;
        categoryStore.setCategoriesPagination(data);
      } else {
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getWarehouseList = async (): Promise<void> => {
    try {
      const { success, data } = await warehouseStore.getWarehouseList({ all: true });

      if (success) {
        warehouseStore.warehouseList = data.data;
      } else {
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updatateData = () => {
    emit('updateData');
  };

  // watch and hooks

  onMounted(() => {
    if (categoryStore.categoryListForSelect.length === 0) {
      getCategoryList();
    }
    if (warehouseStore.warehouseListForSelect.length === 0) {
      getWarehouseList();
    }
  });
</script>

<template>
  <div>
    <div class="flex flex-col gap-2">
      <label for="name">Name</label>
      <InputText id="name" v-model="stoksStore.filtersProduct.name" aria-describedby="name-help" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="quantity">Quantity</label>
      <InputText id="quantity" v-model="stoksStore.filtersProduct.quantity" aria-describedby="quantity-help" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="Price">Price</label>
      <InputText id="Price" v-model="stoksStore.filtersProduct.price" aria-describedby="price-help" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="Price">Category</label>
      <Select
        v-model="stoksStore.filtersProduct.category"
        :options="categoryStore.categoryListForSelect"
        optionLabel="name"
        optionValue="name"
        class="w-full md:w-56"
        showClear
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="Price">Warehouse</label>
      <Select
        v-model="stoksStore.filtersProduct.warehouse"
        :options="warehouseStore.warehouseListForSelect"
        optionLabel="name"
        optionValue="code"
        class="w-full md:w-56"
        showClear
      />
    </div>
    <div class="mt-3 flex flex-col gap-2">
      <Button label="Filter" :loading="localLoading" @click="updatateData()" />
    </div>
  </div>
</template>

<style scoped></style>
