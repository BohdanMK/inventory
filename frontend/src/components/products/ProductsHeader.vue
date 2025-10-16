<script setup lang="ts">
  import { useProductTemplateStore } from '@/stores/productTemplateStore';
  import { useAsyncState } from '@/composables/useAsyncState';
  import Toolbar from 'primevue/toolbar';
  import ProductsFilter from '@/components/products/ProductsFilter.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

  //emits + props

  const emit = defineEmits<{
    (e: 'updateData'): void;
    (e: 'openCreate'): void;
  }>();

  // state

  const productTemplateStore = useProductTemplateStore();
  const asyncState = useAsyncState();

  const updateData = () => {
    emit('updateData');
  };
  //watch and hooks
</script>

<template>
  <Toolbar class="mb-6">
    <template #start>
      <TotalResultItem :total="productTemplateStore.totalProducts" />
      <ProductsFilter :loadingStatus="asyncState.loadingStatus.value" @updateData="updateData()" />
    </template>
    <template #end>
      <Button :label="$t('button.new')" icon="pi pi-plus" class="mr-2" @click="() => emit('openCreate')" />
      <Button icon="pi pi-refresh" rounded raised @click="updateData()" />
    </template>
  </Toolbar>
</template>

<style scoped></style>
