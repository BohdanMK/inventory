<script setup lang="ts">
  import { onMounted, inject } from 'vue';
  import { useGoodsReceiptStore } from '@/stores/goodsReceiptStore';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import InputText from 'primevue/inputtext';
  import Select from 'primevue/select';

  /// emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state
  const goodsReceiptStore = useGoodsReceiptStore();
  const warehouseStore = useWarehouseStore();
  const localLoading = inject('localLoading') as boolean;

  // actions

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
    if (warehouseStore.warehouseListForSelect.length === 0) {
      getWarehouseList();
    }
  });
</script>

<template>
  <div>
    <div class="flex flex-col gap-2">
      <label for="name">{{ $t('goodsReceipt.nameLabel') }}</label>
      <InputText id="name" v-model="goodsReceiptStore.filtersGoodsReceipt.name" aria-describedby="name-help" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="warehouse">{{ $t('goodsReceipt.warehouseLabel') }}</label>
      <Select
        v-model="goodsReceiptStore.filtersGoodsReceipt.warehouse"
        :options="warehouseStore.warehouseListForSelect"
        optionLabel="name"
        optionValue="code"
        class="w-full md:w-56"
        showClear
      />
    </div>
    <div class="mt-3 flex flex-col gap-2">
      <Button :label="$t('goodsReceipt.filterButton')" :loading="localLoading" @click="updatateData()" />
    </div>
  </div>
</template>

<style scoped></style>
