<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';

  interface Props {
    id: string | number | null;
    title: string;
    dialogVisible: boolean;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'deleteItem', id: string | number): void;
    (e: 'update:dialogVisible', value: boolean): void;
  }>();
  /// state

  const localLoading = ref<boolean>(false);

  //actions

  const deleteUser = async () => {
    if (props.id) {
      localLoading.value = true;
      emit('deleteItem', props.id);
    }
  };

  const closeModal = async () => {
    emit('update:dialogVisible', false);
  };

  // getters
  const modelValue = computed({
    get: () => props.dialogVisible,
    set: (val: boolean) => emit('update:dialogVisible', val),
  });

  // lifecycle hooks and watchers
  watch(
    () => props.dialogVisible,
    newVal => {
      if (newVal) {
      } else {
        localLoading.value = false;
      }
    }
  );
</script>

<template>
  <Dialog v-model:visible="modelValue" :style="{ width: '450px' }" header="Confirm" modal>
    <div class="relative">
      <div v-if="localLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
        <i class="pi pi-spinner pi-spin text-2xl" />
      </div>
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>{{ title }}</span>
      </div>
    </div>
    <template #footer>
      <Button :label="$t('button.no')" icon="pi pi-times" text @click="closeModal()" />
      <Button :label="$t('button.yes')" icon="pi pi-check" text :loading="localLoading" @click="deleteUser()" />
    </template>
  </Dialog>
</template>
