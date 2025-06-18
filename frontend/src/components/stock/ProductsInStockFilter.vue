<script setup lang="ts">
  import { defineAsyncComponent, computed } from 'vue';
  import { sortAlphabet, sortPrice, sortQuantity } from '@/staticData/sortOptions';
  import { useStocksStore } from '@/stores/stocksStore';
  import FilterWrapper from '@/components/filterWrapper/FilterWrapper.vue';
  import Select from 'primevue/select';
  const ProductsInStockFilterFields = defineAsyncComponent(
    () => import('@/components/stock/ProductsInStockFilterFields.vue')
  );

  // emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  //state
  const stoksStore = useStocksStore();

  const localOptions = [...sortAlphabet, ...sortPrice, ...sortQuantity];

  //actions
  const updateSortStatus = () => {
    emit('updateData');
  };

  const resetFilter = () => {
    stoksStore.resetFiltersProduct();
    emit('updateData');
  };

  // getters

  const emptyStatusFilter = computed(() => stoksStore.isFiltersProductEmpty);
</script>

<template>
  <div class="flex gap-3">
    <Select
      v-model="stoksStore.sortByForProduct"
      name="sort"
      :options="localOptions"
      optionLabel="name"
      placeholder="Sort by:"
      class="w-[200px]"
      showClear
      @change="updateSortStatus()"
    />
    <FilterWrapper :emptyStatusFilter="emptyStatusFilter" @resetFilter="resetFilter()">
      <ProductsInStockFilterFields @updateData="emit('updateData')" />
    </FilterWrapper>
  </div>
</template>

<style scoped></style>
