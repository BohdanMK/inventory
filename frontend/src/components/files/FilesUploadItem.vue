<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import axiosInstance from '@/api/axiosInstance';
  import type { DataFile } from '@/interfaces/index';
  import type { ApiResponse } from '@/types/axiosResponce';
  import { staticEndpoints } from '@/api/endpoints';
  import { useToastNotification } from '@/composables/useToastNotification';
  import FileUpload from 'primevue/fileupload';
  import { useI18n } from 'vue-i18n';

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
  const { t } = useI18n();
  const src = ref<string | null>(null);
  const fileName = ref<string | null>(null);
  const selectedFile = ref<File | null>(null);
  const visibleSaveBtn = ref<boolean>(true);
  const toastNotification = useToastNotification();

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
      data.filePath = response.data?.filePath;
      data.fileName = response.data?.fileName;
      toastNotification.showSuccess(response.message || '');

      emit('updateData', data);
      visibleSaveBtn.value = false;


    } catch (error) {
      console.error(t('default.error_occurred'), error);
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
      :chooseLabel="t('button.Upload')"
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
        <Button :label="$t('button.Remove')" severity="danger" @click="remove" />
        <Button :label="$t('button.Save')" severity="primary" @click="onUpload" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Приховати дефолтну кнопку FileUpload */
</style>
