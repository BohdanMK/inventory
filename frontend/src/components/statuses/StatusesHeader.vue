<script setup lang="ts">
  import { ref } from 'vue';
  import { useStatusStore } from '@/stores/statusStore';
  import { useToastNotification } from '@/composables/useToastNotification';
  import Toolbar from 'primevue/toolbar';
  import CreateItemPopUp from '@/components/popup/CreateItem.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';


  //emits + props

  const emit = defineEmits<{
      (e: 'updateData'): void;
  }>();

  // state
  const toastNotification = useToastNotification();
  const statusStore = useStatusStore();
  const createPopUpVisible = ref<boolean>(false);

  // action

  const updateData = () => {
      emit('updateData')
  };

  const togglePopUpVisible = (): void => {
    createPopUpVisible.value = !createPopUpVisible.value;
  };

  const createStatus = async (value: string): Promise<void> => {
    try {
      const { success, message } = await statusStore.createStatus(value);

      if (success) {
        createPopUpVisible.value = false;
        updateData();
        toastNotification.showSuccess(message || '');
      } else {
        toastNotification.showError(message || '');
      }
    } catch (error) {
      console.log(error);
    }

    createPopUpVisible.value = false;
  };

  /// hooks


</script>

<template>
      <Toolbar class="mb-6">
        <template #start>
          <TotalResultItem :total="statusStore.totalStatuses" />
        </template>
        <template #end>
          <CreateItemPopUp v-model:dialogVisible="createPopUpVisible" :title="$t('popup.create_status')" @createData="createStatus" />
          <Button :label="$t('button.new')" icon="pi pi-plus" class="mr-2" @click="togglePopUpVisible" />
          <Button icon="pi pi-refresh" rounded raised @click="updateData()" />
        </template>
      </Toolbar>
</template>
