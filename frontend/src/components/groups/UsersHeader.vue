<script setup lang="ts">
  import Toolbar from 'primevue/toolbar';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';

  interface Props {
    length: string | number;
  }

  const props = defineProps<Props>();

   const emit = defineEmits<{
    (e: 'toggleModal'): void;
    (e: 'reloadList'): void;
  }>();

  // state

  // actions

  /// getters

</script>

<template>

    <Toolbar class="mb-6">
        <template #start>
            <TotalResultItem :total="length" />
        </template>
        <template #end>
            <Button label="New User" icon="pi pi-plus" class="mr-2" @click="() => emit('toggleModal')" />
            <Button icon="pi pi-refresh" rounded raised @click="() => emit('reloadList')" />
        </template>
    </Toolbar>

</template>
