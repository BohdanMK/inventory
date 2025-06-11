<script setup lang="ts">
  import { ref } from 'vue';
  import { sortAlphabet, sortPrice, sortQuantity } from '@/staticData/sortOptions';
  import Select from 'primevue/select';

  // emits and props

  const emit = defineEmits<{
    (e: 'updateData'): void;
  }>();


  //state
  const localOptions = [
    ...sortAlphabet,
    ...sortPrice,
    ...sortQuantity
  ];

  const selectedSortType = ref(null);

  //actions
  const updateSortStatus = () => {
    emit('updateData')
  }

</script>

<template>
  <div>

    <Select
      v-model="selectedSortType"
      name="sort"
      :options="localOptions"
      optionLabel="name"
      placeholder="Sort by:"
      class="w-[200px]"
      showClear
      @change="updateSortStatus()"
    />
  </div>
</template>



<style scoped>

</style>