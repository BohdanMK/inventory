import { useToast } from 'primevue/usetoast';

export function useToastNotification() {
  const toast = useToast();

  const showSuccess = (detail: string, summary = 'Success', life = 3000) => {
    toast.add({
      severity: 'success',
      summary,
      detail,
      life,
    });
  };

  const showError = (detail: string, summary = 'Error', life = 3000) => {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life,
    });
  };

  const showWarning = (detail: string, summary = 'Warning', life = 3000) => {
    toast.add({
      severity: 'warn',
      summary,
      detail,
      life,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
  };
}