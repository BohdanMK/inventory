<script setup lang="ts">
  import { ref } from 'vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import CategoriesList from '@/components/categories/CategoriesList.vue';
  import StatusesList from '@/components/statuses/StatusesList.vue';

  const tabListKey = ref<string>('0');
</script>

<template>
  <div>
    <Tabs v-model:value="tabListKey">
      <TabList>
        <Tab value="0">
          <font-awesome-icon icon="fa-solid fa-list" />
          {{ $t('settings.product_statuses') }}
        </Tab>
        <Tab value="1">
          <font-awesome-icon icon="fa-solid fa-table-cells" />
          {{ $t('settings.product_category') }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <Suspense>
            <template #default>
              <StatusesList v-if="tabListKey === '0'" />
            </template>
            <template #fallback>
              <div class="flex h-full w-full items-center justify-center">
                <!-- <ProgressSpinner /> -->
              </div>
            </template>
          </Suspense>
        </TabPanel>
        <TabPanel value="1">
          <Suspense>
            <template #default>
              <CategoriesList v-if="tabListKey === '1'" />
            </template>
            <template #fallback>
              <div class="flex h-full w-full items-center justify-center">
                <!-- <ProgressSpinner /> -->
              </div>
            </template>
          </Suspense>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped></style>
