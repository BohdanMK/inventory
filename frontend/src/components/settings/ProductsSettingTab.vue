<script setup lang="ts">
  import { ref } from 'vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import CategoriesList from '@/components/categories/CategoriesList.vue';
  import StatusesTable from '@/components/statuses/StatusesTable.vue';

  const tabListKey = ref<string>('0');
</script>

<template>
  <div>
    <Tabs v-model:value="tabListKey">
      <TabList>
        <Tab value="0">
          <font-awesome-icon icon="fa-solid fa-list" />
          Product statuses
        </Tab>
        <Tab value="1">
          <font-awesome-icon icon="fa-solid fa-table-cells" />
          Product category
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <Suspense>
            <template #default>
              <StatusesTable v-if="tabListKey === '0'" />
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
