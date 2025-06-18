<script setup lang="ts">
  import { ref } from 'vue';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';

  interface Props {
    id: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();
  /// state
  const profileStore = useProfileStore();
  const toast = useToast();
  const visible = ref<boolean>(false);

  //actions

  const toggleDialog = () => {
    visible.value = !visible.value;
  };

  const deleteUser = async () => {
    const { success, message } = await profileStore.deleteUser(props.id);

    if (success) {
      toast.add({ severity: 'success', detail: message, life: 3000 });
      toggleDialog();

      setTimeout(() => {
        emit('updateData');
      }, 1000);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Delete falled',
        detail: message,
        life: 3000,
      });
    }
  };
</script>

<template>
  <Button icon="pi pi-trash" outlined rounded severity="danger" @click="toggleDialog()" />
  <Toast />
  <Dialog v-model:visible="visible" :style="{ width: '450px' }" header="Confirm" modal>
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span>Are you sure you want to delete this user?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" text @click="toggleDialog()" />
      <Button label="Yes" icon="pi pi-check" text @click="deleteUser()" />
    </template>
  </Dialog>
</template>
