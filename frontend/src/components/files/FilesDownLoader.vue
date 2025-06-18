<script setup lang="ts">
  import Button from 'primevue/button';

  interface Props {
    file?: string;
    filePath?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    file: undefined,
    filePath: undefined,
  });

  const downloadFile = () => {
    if (!props.filePath) return;

    const baseURL = import.meta.env.VITE_API_BASE_URL || ''; // приклад: http://localhost:3000
    const fullUrl = `${baseURL}/${props.filePath}`;

    const link = document.createElement('a');
    link.href = fullUrl;
    link.setAttribute('download', props.file || 'file');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
</script>

<template>
  <div class="flex gap-5">
    <div class="flex flex-col">
      <span>File:</span>
      <span class="max-w-[150px] break-all">
        {{ props.file }}
      </span>
    </div>
    <Button
      v-tooltip.top="'Download file'"
      class="h-fit"
      icon="pi pi-download"
      severity="warn"
      aria-label="Download"
      @click="downloadFile"
    />
  </div>
</template>
