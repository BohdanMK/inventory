<script setup lang="ts">
  import { ref } from 'vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  import SettingsGenaralTab from '@/components/settings/SettingsGenaralTab.vue';
  import ProductsSettingTab from '@/components/settings/ProductsSettingTab.vue';
  import UsersSettingsTab from '@/components/settings/UsersSettingsTab.vue';
  import WarehouseList from '@/components/warehouse/WarehouseList.vue';
  import BreadcrumbItem from '@/components/ui/BreadcrumbItem.vue';

  // state
  const tabListKey = ref<string>('0');

  /// actions
</script>

<template>
  <div>
    <BreadcrumbItem/>
    <Tabs v-model:value="tabListKey">
      <TabList>
        <Tab value="0">
          <i class="pi pi-cog"></i>
          {{ $t('settings.general_settings') }}
        </Tab>
        <Tab value="1">
          <i class="pi pi-user"></i>
          {{ $t('settings.users_settings') }}
        </Tab>
        <Tab value="2">
          <i class="pi pi-barcode"></i>
          {{ $t('settings.products_settings') }}
        </Tab>
        <Tab value="3">
          <i class="pi pi-barcode"></i>
          {{ $t('settings.warehouses_settings') }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <Suspense>
            <template #default>
              <SettingsGenaralTab v-if="tabListKey === '0'" />
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
              <UsersSettingsTab />
            </template>
            <template #fallback>
              <div class="flex h-full w-full items-center justify-center">
                <!-- <ProgressSpinner /> -->
              </div>
            </template>
          </Suspense>
        </TabPanel>
        <TabPanel value="2">
          <Suspense>
            <template #default>
              <ProductsSettingTab v-if="tabListKey === '2'" />
            </template>
            <template #fallback>
              <div class="flex h-full w-full items-center justify-center">
                <!-- <ProgressSpinner /> -->
              </div>
            </template>
          </Suspense>
        </TabPanel>
        <TabPanel value="3">
          <Suspense>
            <template #default>
              <WarehouseList v-if="tabListKey === '3'" />
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
