<script setup lang="ts">
  import { defineAsyncComponent, computed } from 'vue';
  import { useCategoryStore } from '@/stores/categoryStore';
  import FilterWrapper from '@/components/filterWrapper/FilterWrapper.vue';
  const CategoriesFilterFields = defineAsyncComponent(
    () => import('@/components/categories/CategoriesFilterFields.vue')
  );

  // emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  //state
  const categoryStore = useCategoryStore();

  //actions

  const resetFilter = () => {
    categoryStore.resetFiltersCategory();
    emit('updateData');
  };

  // getters

  const isFiltersCategoriesEmpty = computed(() => categoryStore.isFiltersCategoryEmpty);
</script>

<template>
  <div class="flex gap-3">
    <FilterWrapper :emptyStatusFilter="isFiltersCategoriesEmpty" @resetFilter="resetFilter()">
      <CategoriesFilterFields @updateData="emit('updateData')" />
    </FilterWrapper>
  </div>
</template>

<style scoped></style>
