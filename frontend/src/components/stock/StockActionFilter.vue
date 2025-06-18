<script setup lang="ts">
  import { defineAsyncComponent, computed } from 'vue';
  import { useStocksStore } from '@/stores/stocksStore';
  import FilterWrapper from '@/components/filterWrapper/FilterWrapper.vue';
  const StockActionFilterFields = defineAsyncComponent(() => import('@/components/stock/StockActionFilterFields.vue'));

  // emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  //state
  const stoksStore = useStocksStore();

  //actions

  const resetFilter = () => {
    stoksStore.resetFiltersStockAction();
    emit('updateData');
  };

  // getters

  const isFiltersStockActionEmpty = computed(() => stoksStore.isFiltersStockActionEmpty);
</script>

<template>
  <div class="flex gap-3">
    <FilterWrapper :emptyStatusFilter="isFiltersStockActionEmpty" @resetFilter="resetFilter()">
      <StockActionFilterFields @updateData="emit('updateData')" />
    </FilterWrapper>
  </div>
</template>

<style scoped></style>
