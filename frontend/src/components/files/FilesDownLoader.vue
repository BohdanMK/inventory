<script setup lang="ts">
  interface Props {
    file?: string;
    filePath?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    file: undefined,
    filePath: undefined,
  });

  const downloadFile = async () => {
    if (!props.filePath) return;

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    const fullUrl = `${baseURL}/${props.filePath}`;

    try {
      const res = await fetch(fullUrl);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', props.file || 'file.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
    }
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
