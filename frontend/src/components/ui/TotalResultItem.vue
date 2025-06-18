<script setup lang="ts">
  interface Props {
    title?: string;
    total: string | number;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Results:',
  });
</script>

<template>
  <div class="me-4 flex gap-3 text-xl font-bold">
    <h4>{{ title }}</h4>
    <p>{{ total }}</p>
  </div>
</template>

<style scoped></style>
