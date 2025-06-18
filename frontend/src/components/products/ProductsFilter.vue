<script setup lang="ts">
  import { defineAsyncComponent, computed } from 'vue';
  import { useProductTemplateStore } from '@/stores/productTemplateStore';
  import FilterWrapper from '@/components/filterWrapper/FilterWrapper.vue';
  const ProductsFilterFields = defineAsyncComponent(() => import('@/components/products/ProductsFilterFields.vue'));

  // emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  //state
  const productTemplateStore = useProductTemplateStore();

  //actions

  const resetFilter = () => {
    productTemplateStore.resetFiltersProduct();
    emit('updateData');
  };

  // getters

  const emptyStatusFilter = computed(() => productTemplateStore.isFiltersProductEmpty);
</script>

<template>
  <div class="flex gap-3">
    <FilterWrapper :emptyStatusFilter="emptyStatusFilter" @resetFilter="resetFilter()">
      <ProductsFilterFields @updateData="emit('updateData')" />
    </FilterWrapper>
  </div>
</template>

<style scoped></style>
