<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import axiosInstance from '@/api/axiosInstance';
  import type { DataFile } from '@/interfaces/index';
  import type { ApiResponse } from '@/types/axiosResponce';
  import { staticEndpoints } from '@/api/endpoints';
  import FileUpload from 'primevue/fileupload';
  import Button from 'primevue/button';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';

  interface Props {
    file?: string | undefined;
    saveBtn: boolean;
    chooseLabel?: string;
    type?: string;
    acceptType?: string;
    justFile?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    file: undefined,
    saveBtn: false,
    chooseLabel: 'Upload',
    type: 'img',
    acceptType: 'image/*',
    justFile: false,
  });

  const emit = defineEmits<{
    (e: 'updateData', value: DataFile): void;
  }>();

  // state
  const toast = useToast();

  const src = ref<string | null>(null);
  const fileName = ref<string | null>(null);
  const selectedFile = ref<File | null>(null);
  const visibleSaveBtn = ref<boolean>(true);

  const onFileSelect = (event: any) => {
    const file = event.files?.[0];
    if (file) {
      console.log(file);
      selectedFile.value = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        src.value = e.target.result;
      };
      if (props.justFile) {
        fileName.value = file.name;
      }
      reader.readAsDataURL(file);
      visibleSaveBtn.value = true;
    }
  };

  const onUpload = async () => {
    if (!selectedFile.value) return;

    const formData = new FormData();
    formData.append('file', selectedFile.value);

    try {
      const response: ApiResponse<DataFile> = await axiosInstance.post(staticEndpoints.uploads.file, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data: DataFile = {
        fileName: '',
        filePath: '',
      };
      data.filePath = response.data?.filePath || null;
      data.fileName = response.data?.fileName || null;

      toast.add({ severity: 'success', detail: response.message, life: 3000 });
      emit('updateData', data);
      visibleSaveBtn.value = false;

      // TODO: можеш зробити emit або оновити store / props / щось інше тут
    } catch (error) {
      console.error('Помилка при завантаженні зображення:', error);
    }
  };

  const remove = () => {
    src.value = null;
    selectedFile.value = null;
    visibleSaveBtn.value = false;
  };

  //watch and hooks
  onMounted(() => {
    if (props.file) {
      src.value = props.file;
      visibleSaveBtn.value = false;
    }
  });
</script>

<template>
  <div class="card flex min-w-[250px] flex-col items-center gap-6">
    <Toast />
    <FileUpload
      mode="basic"
      auto
      customUpload
      :multiple="false"
      :accept="acceptType"
      class="p-button-outlined w-full"
      chooseLabel="Upload"
      @select="onFileSelect"
    />
    <div v-if="src || file" class="flex w-full flex-col items-center gap-2">
      <template v-if="!justFile">
        <img
          v-if="src"
          :src="src"
          alt="Image"
          class="w-full rounded-xl shadow-md sm:w-64"
          style="filter: grayscale(100%)"
        />
      </template>
      <span v-else>
        {{ fileName }}
      </span>
      <div v-if="visibleSaveBtn" class="flex gap-2">
        <Button label="Remove" severity="danger" @click="remove" />
        <Button label="Save" severity="primary" @click="onUpload" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Приховати дефолтну кнопку FileUpload */
</style>
