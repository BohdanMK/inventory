<template>
  <div>
    <BreadcrumbItem/>
    <ProductList />
  </div>
</template>

<script setup lang="ts">
  import ProductList from '@/components/products/ProductList.vue';
  import BreadcrumbItem from '@/components/ui/BreadcrumbItem.vue';
</script>

<style scoped></style>
