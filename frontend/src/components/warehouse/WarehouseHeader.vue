<script setup lang="ts">
  import { ref } from 'vue';
  import { useWarehouseStore } from '@/stores/warehouseStore';
  import Toolbar from 'primevue/toolbar';
  import AddWarehouseItemPopUp from '@/components/warehouse/popup/AddWarehouseItem.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

  //emits + props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state
  const warehouseStore = useWarehouseStore();
  const createPopUpVisible = ref<boolean>(false);

  /// updateData

  const updateData = () => {
    emit('updateData');
  };

  // actions
  const togglePopUpVisible = (): void => {
    createPopUpVisible.value = !createPopUpVisible.value;
  };
</script>

<template>
  <Toolbar class="mb-6">
    <template #start>
      <TotalResultItem :total="warehouseStore.totalWarehouses" />
      <AddWarehouseItemPopUp
        v-model:dialogVisible="createPopUpVisible"
        title="Create category"
        @updateList="updateData()"
      />
    </template>
    <template #end>
      <Button
        v-tooltip.top="$t('popup.create_warehouse')"
        :label="$t('button.new')"
        icon="pi pi-plus"
        class="mr-2"
        @click="togglePopUpVisible"
      />
      <Button v-tooltip.top="$t('button.refresh')" icon="pi pi-refresh" rounded raised @click="updateData()" />
    </template>
  </Toolbar>
</template>

<style scoped></style>
