<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { RouterView } from 'vue-router';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import AuthLayout from '@/layouts/AuthLayout.vue';

  const route = useRoute();

  const layoutComponent = computed(() => {
    return route.meta.layout === 'auth' ? AuthLayout : DefaultLayout;
  });
</script>

<template>
  <component :is="layoutComponent">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </component>
</template>

<style>
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease-out;
  }

  .p-filled.p-invalid {
    color: red!important;
  }
  message {
     color: red!important;
  }
</style>
