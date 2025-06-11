<script setup lang="ts">
  import Button from 'primevue/button';
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center bg-[#fefefe]">
    <div class="text-center">
      <img src="@/assets/404-removebg-preview.png" alt="404" />
      <h2 class="mb-3 text-3xl font-medium">Page not found</h2>
      <router-link to="/">
        <Button label="Back to home" severity="secondary" />
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
