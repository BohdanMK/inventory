// composables/useFileUpload.ts
import axiosInstance from '@/api/axiosInstance';
import { staticEndpoints } from '@/api/endpoints';
import { useToastNotification } from '@/composables/useToastNotification';
import type { ApiResponse } from '@/types/axiosResponce';
import type { DataFile } from '@/interfaces/index';

export function useFileUpload() {
  const toastNotification = useToastNotification();

  async function uploadFiles(files: File[]): Promise<DataFile[]> {
    if (!files.length) return [];

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const data: DataFile = {
        fileName: '',
        filePath: '',
      };

      try {
        const response: ApiResponse<DataFile> = await axiosInstance.post(
          staticEndpoints.uploads.file,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        if (response.success === false) {
          toastNotification.showError(response.message || '');
        } else {
          toastNotification.showSuccess(response.message || '');
          data.filePath = response.data?.filePath;
          data.fileName = response.data?.fileName;
        }
      } catch (error) {

        console.error(error);
      }
      console.log(data)
      return data;
    });

    return Promise.all(uploadPromises);
  }

  return { uploadFiles };
}
