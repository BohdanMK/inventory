<script setup lang="ts">
  import { onMounted, inject } from 'vue';
  import { useCategoryStore } from '@/stores/categoryStore';
  import { useStatusStore } from '@/stores/statusStore';
  import { useProductTemplateStore } from '@/stores/productTemplateStore';
  import InputText from 'primevue/inputtext';
  import Select from 'primevue/select';
  import Button from 'primevue/button';

  /// emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();

  // state
  const productTemplateStore = useProductTemplateStore();
  const categoryStore = useCategoryStore();
  const statusStore = useStatusStore();
  const localLoading = inject('localLoading') as boolean;

  // actions

  const getCategoryList = async (): Promise<void> => {
    try {
      const { success, data } = await categoryStore.getCategoryList({ all: true });
      if (success) {
        categoryStore.categoryList = data.data;
        categoryStore.setCategoriesPagination(data);
      } else {
      }
    } catch (e) {}
  };

  const getStatusesList = async (): Promise<void> => {
    try {
      const { success, data } = await statusStore.getStatusList({ all: true });

      if (success) {
        statusStore.statusesList = data.data;
      } else {
      }
    } catch (e) {}
  };

  const updatateData = () => {
    emit('updateData');
  };

  // watch and hooks

  onMounted(() => {
    if (categoryStore.categoryListForSelect.length === 0) {
      getCategoryList();
    }
    if (statusStore.statusListForSelect.length === 0) {
      getStatusesList();
    }
  });
</script>

<template>
  <div>
    <div class="flex flex-col gap-2">
      <label for="name">{{ $t('fields.name') }}</label>
      <InputText id="name" v-model="productTemplateStore.filtersProduct.name" aria-describedby="name-help" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="category">{{ $t('goodsReceipt.category') }}</label>
      <Select
        v-model="productTemplateStore.filtersProduct.category"
        :options="categoryStore.categoryListForSelect"
        optionLabel="name"
        optionValue="name"
        class="w-full md:w-56"
        showClear
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="status">{{ $t('goodsReceipt.status') }}</label>
      <Select
        v-model="productTemplateStore.filtersProduct.status"
        :options="statusStore.statusListForSelect"
        optionLabel="name"
        optionValue="code"
        class="w-full md:w-56"
        showClear
      />
    </div>
    <div class="mt-3 flex flex-col gap-2">
      <Button :label="$t('button.filter')" :loading="localLoading" @click="updatateData()" />
    </div>
  </div>
</template>

<style scoped></style>
