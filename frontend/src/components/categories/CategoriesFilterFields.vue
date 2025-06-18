<script setup lang="ts">
  import { inject } from 'vue';
  import { useCategoryStore } from '@/stores/categoryStore';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';

  /// emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state
  const categoryStore = useCategoryStore();
  const localLoading = inject('localLoading') as boolean;

  // actions

  const updatateData = () => {
    emit('updateData');
  };

  // watch and hooks
</script>

<template>
  <div>
    <div class="flex flex-col gap-2">
      <label for="name">{{ $t('fields.name') }}</label>
      <InputText id="name" v-model="categoryStore.filtersCategory.name" aria-describedby="name-help" />
    </div>
    <div class="mt-3 flex flex-col gap-2">
      <Button
        :label="$t('button.filter')"
        :loading="localLoading"
        v-tooltip.top="$t('button.filter')"
        @click="updatateData()"
      />
    </div>
  </div>
</template>

<style scoped></style>
