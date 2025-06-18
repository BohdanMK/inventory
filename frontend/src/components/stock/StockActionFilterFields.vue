<script setup lang="ts">
  import { onMounted, inject } from 'vue';
  import { useStocksStore } from '@/stores/stocksStore';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import { stockActionData } from '@/staticData/stockActionData.ts';
  import InputText from 'primevue/inputtext';
  import Select from 'primevue/select';
  import Button from 'primevue/button';

  /// emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state
  const stoksStore = useStocksStore();
  const warehouseStore = useWarehouseStore();
  const localLoading = inject('localLoading') as boolean;

  // actions

  const getWarehouseList = async (): Promise<void> => {
    try {
      const { success, message, data } = await warehouseStore.getWarehouseList({ all: true });

      if (success) {
        warehouseStore.warehouseList = data.data;
      } else {
      }
    } catch (e) {}
  };

  const updatateData = () => {
    emit('updateData');
  };

  // watch and hooks

  onMounted(() => {
    if (warehouseStore.warehouseListForSelect.length === 0) {
      getWarehouseList();
    }
  });
</script>

<template>
  <div>
    <div class="flex flex-col gap-2">
      <label for="Price">Type Action</label>
      <Select
        v-model="stoksStore.filtersStockAction.typeAction"
        name="typeAction"
        :options="stockActionData"
        optionLabel="name"
        optionValue="code"
        placeholder="Select action"
        class="w-full min-w-[230px]"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="Price">Warehouse</label>
      <Select
        v-model="stoksStore.filtersStockAction.warehouse"
        :options="warehouseStore.warehouseListForSelect"
        optionLabel="name"
        optionValue="code"
        class="w-full md:w-56"
        showClear
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="Price">Desctiption</label>
      <InputText id="Price" v-model="stoksStore.filtersStockAction.description" aria-describedby="price-help" />
    </div>
    <div class="mt-3 flex flex-col gap-2">
      <Button label="Filter" :loading="localLoading" @click="updatateData()" />
    </div>
  </div>
</template>

<style scoped></style>
