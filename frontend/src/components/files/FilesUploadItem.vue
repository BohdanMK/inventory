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
    chooseLabel?: string,
    type?: string,
    acceptType?: string,
    justFile?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    file: undefined,
    saveBtn: false,
    chooseLabel: 'Upload',
    type: 'img',
    acceptType: 'image/*',
    justFile: false
  });

  const emit = defineEmits<{
    (e: 'updateData', value: DataFile): void;
  }>();

  // state
  const toast = useToast();

  const src = ref<string | null>(null); // preview base64
  const selectedFile = ref<File | null>(null); // actual file
  const visibleSaveBtn = ref<boolean>(true);

  // Вибір файлу
  const onFileSelect = (event: any) => {
    const file = event.files?.[0];
    if (file) {
      selectedFile.value = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        src.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Надсилання на бекенд
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
    visibleSaveBtn.value = true;
  };

  //watch and hooks
  onMounted(() => {
    if(props.file) {
      src.value = props.file;
      visibleSaveBtn.value = false;
    }
  })
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
      :disabled="!!src"
      @select="onFileSelect"
    />

    <div v-if="src || file" class="flex w-full flex-col items-center gap-2">
      <img
        v-if="src"
        :src="src"
        alt="Image"
        class="w-full rounded-xl shadow-md sm:w-64"
        style="filter: grayscale(100%)"
      />
        <div class="flex gap-2">
          <template v-if="src">

            <Button label="Remove" severity="danger" @click="remove" />
          </template>
          <template v-if="visibleSaveBtn">
            <Button v-if="src" label="Save" severity="primary" @click="onUpload" />
          </template>
        </div>

    </div>
  </div>
</template>



<style scoped>
/* Приховати дефолтну кнопку FileUpload */
</style>