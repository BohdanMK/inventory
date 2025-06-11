import { ref } from 'vue';

export function useAsyncState() {
  const loadingStatus = ref(false);
  const errorText = ref<string | null>(null);

  const startLoading = () => {
    loadingStatus.value = true;
    errorText.value = null;
  };

  const successLoading = () => {
    loadingStatus.value = false;
    errorText.value = null;
  };

  const failedLoading = (errorMsg: string) => {
    loadingStatus.value = false;
    errorText.value = errorMsg;
  };

  return {
    loadingStatus,
    errorText,
    startLoading,
    successLoading,
    failedLoading,
  };
}
