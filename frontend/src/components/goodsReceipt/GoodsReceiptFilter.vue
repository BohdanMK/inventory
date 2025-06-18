<script setup lang="ts">
  import { defineAsyncComponent, computed } from 'vue';
  import { useGoodsReceiptStore } from '@/stores/goodsReceiptStore';
  import FilterWrapper from '@/components/filterWrapper/FilterWrapper.vue';
  const GoodsReceiptFilterFields = defineAsyncComponent(
    () => import('@/components/goodsReceipt/GoodsReceiptFilterFields.vue')
  );

  // emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  //state
  const goodsReceiptStore = useGoodsReceiptStore();

  //actions

  const resetFilter = () => {
    goodsReceiptStore.resetFiltersGoodsReceipt();
    emit('updateData');
  };

  // getters

  const emptyStatusFilter = computed(() => goodsReceiptStore.isFiltersGoodsReceiptEmpty);
</script>

<template>
  <div class="flex gap-3">
    <FilterWrapper :emptyStatusFilter="emptyStatusFilter" @resetFilter="resetFilter()">
      <GoodsReceiptFilterFields @updateData="emit('updateData')" />
    </FilterWrapper>
  </div>
</template>

<style scoped></style>
