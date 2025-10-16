<script setup lang="ts">
  import { computed } from 'vue';
  import { useBreadcrumbs } from '@/composables/useBreadcrumbs';
  import Breadcrumb from 'primevue/breadcrumb';

  const { breadcrumbs } = useBreadcrumbs();

  const home = computed(() => breadcrumbs.value[0]);
  const items = computed(() => breadcrumbs.value.slice(1));
</script>

<template>
  <Breadcrumb :home="home" :model="items">
    <template #item="{ item, props }">
      <router-link v-if="item.to" v-slot="{ href, navigate }" :to="item.to" custom>
        <a :href="href" v-bind="props.action" @click="navigate">
          <span v-if="item.icon" :class="[item.icon, 'mr-1']" />
          <span class="text-primary font-semibold"> {{ $t(item.label as string) }}</span>
        </a>
      </router-link>
      <span v-else class="text-gray-500">
        <span v-if="item.icon" :class="[item.icon, 'mr-1']" />
        <span> {{ $t(item.label as string) }}</span>
      </span>
    </template>
  </Breadcrumb>
</template>
