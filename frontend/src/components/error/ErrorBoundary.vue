<template>
  <div class="flex h-[40vh] flex-col items-center justify-center gap-4 text-center">
    <p>⚠️ {{ message || $t('default.error_occurred') }}</p>
    <Button label="Refresh" icon="pi pi-refresh" @click="$emit('reload')" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    message: {
      type: String,
    },
  });

  const emit = defineEmits(['reload']);
</script>
