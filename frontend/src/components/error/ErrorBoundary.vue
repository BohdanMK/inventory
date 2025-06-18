<template>
  <div class="flex h-[40vh] flex-col items-center justify-center gap-4 text-center">
    <p>⚠️ {{ message }}</p>
    <Button label="Refresh" icon="pi pi-refresh" @click="$emit('reload')" />
  </div>
</template>

<script setup lang="ts">
  import Button from 'primevue/button';

  const props = defineProps({
    message: {
      type: String,
      default: 'Сталася помилка при завантаженні даних',
    },
  });

  const emit = defineEmits(['reload']);
</script>
