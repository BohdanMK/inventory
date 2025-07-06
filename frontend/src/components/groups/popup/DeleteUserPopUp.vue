<script setup lang="ts">
  import { ref } from 'vue';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { useToastNotification } from '@/composables/useToastNotification';
  import Toast from 'primevue/toast';
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
  const toastNotification = useToastNotification();
  const visible = ref<boolean>(false);

  //actions

  const toggleDialog = () => {
    visible.value = !visible.value;
  };

  const deleteUser = async () => {
    const { success, message } = await profileStore.deleteUser(props.id);

    if (success) {
      toastNotification.showSuccess(message || '');
      toggleDialog();

      setTimeout(() => {
        emit('updateData');
      }, 1000);
    } else {
      toastNotification.showError(message || '');
    }
  };
</script>

<template>
  <Button icon="pi pi-trash" outlined rounded severity="danger" @click="toggleDialog()" />
  <Toast />
  <Dialog v-model:visible="visible" :style="{ width: '450px' }" :header="$t('default.Confirm')" modal>
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span>
        {{ $t('user.Are_you_sure_you_want_to_delete_this_user') }}
      </span>
    </div>
    <template #footer>
      <Button :label="$t('button.no')" icon="pi pi-times" text @click="toggleDialog()" />
      <Button :label="$t('button.yes')" icon="pi pi-check" text @click="deleteUser()" />
    </template>
  </Dialog>
</template>
