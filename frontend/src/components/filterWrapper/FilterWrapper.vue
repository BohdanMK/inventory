<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Button from 'primevue/button';

  // props + emits
  interface Props {
    emptyStatusFilter?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    emptyStatusFilter: false,
  });

  const emit = defineEmits<{
    (e: 'resetFilter'): void;
  }>();

  // state
  const visible = ref<boolean>(false);

  // actions

  const toggleVisible = () => {
    visible.value = !visible.value;
  };

  const resetFilter = () => {
    emit('resetFilter');
  };

  // watch + hooks
  watch(
    () => props.emptyStatusFilter,
    newValue => {
      console.log('emptyStatusFilter changed to:', newValue);
      // Додайте логіку, якщо потрібно реагувати на зміну
    }
  );
</script>

<template>
  <div class="relative">
    <Button
      id="dropdownButton"
      v-tooltip.top="'Filter'"
      data-dropdown-toggle="dropdown"
      :severity="visible ? 'warn' : ''"
      icon="pi pi-filter"
      aria-label="Filter"
      @click="toggleVisible()"
    />
    <Button
      v-if="!props.emptyStatusFilter"
      id="dropdownButton"
      v-tooltip.top="'Reset filter'"
      class="ms-2"
      data-dropdown-toggle="dropdown"
      severity="danger"
      icon="pi pi-eraser"
      aria-label="Reset"
      @click="resetFilter()"
    />
    <Transition name="bounce">
      <div
        v-if="visible"
        id="dropdown"
        class="absolute z-10 list-none divide-y divide-gray-100 rounded-lg bg-white p-4 text-base shadow-2xl dark:bg-gray-700"
      >
        <slot> </slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }
  .bounce-leave-active {
    animation: bounce-in 0.5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.25);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
