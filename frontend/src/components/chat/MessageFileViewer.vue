<script setup lang="ts">
  import { computed } from 'vue';
  import Image from 'primevue/image';
  import FilesDownLoader from '@/components/files/FilesDownLoader.vue';
  import type { DataFile } from '@/interfaces/index';
  import setFullImgPath from '@/helpers/fullPathImg.ts';

  interface IMessageFileViewer {
    file: Partial<DataFile>;
  }

  const props = defineProps<IMessageFileViewer>();

  const isPicture = computed((): boolean => {
    if (!props.file) return false;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const fileExtention = props.file?.fileName?.split('.').pop()?.toLowerCase();
    return !!fileExtention && imageExtensions.includes(fileExtention);
  });
</script>
<template>
  <div>
    <Image v-if="isPicture" :src="setFullImgPath(file.filePath as string)" :alt="file.fileName" width="70" preview />
    <FilesDownLoader v-else :file="file.fileName" :filePath="file.filePath" />
  </div>
</template>

<style scoped></style>
