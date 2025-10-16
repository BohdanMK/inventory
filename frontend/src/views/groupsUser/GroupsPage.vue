<script setup lang="ts">
  import { defineAsyncComponent, ref } from 'vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
  const UserList = defineAsyncComponent(() => import('@/components/groups/UsersList.vue'));
  import BreadcrumbItem from '@/components/ui/BreadcrumbItem.vue';

  // state
  const tabListKey = ref<string>('0');

  /// actions

  const reloadUserList = () => {
    tabListKey.value = String(+tabListKey.value + 1);
  };
</script>

<template>
  <div>
    <BreadcrumbItem />
    <Tabs v-model:value="tabListKey">
      <TabList>
        <Tab value="0">
          <i class="pi pi-user"></i>
          Users
        </Tab>
        <Tab value="1" v-permission="'super_admin'">
          <i class="pi pi-crown"></i>
          Admins
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <Suspense>
            <template #default>
              <UserList v-if="tabListKey === '0'" :key="tabListKey" role="user" @forceReload="reloadUserList()" />
            </template>
            <template #fallback>
              <div class="flex h-full w-full items-center justify-center">
                <!-- <ProgressSpinner /> -->
              </div>
            </template>
          </Suspense>
        </TabPanel>
        <TabPanel value="1" v-permission="'super_admin'">
          <Suspense>
            <template #default>
              <UserList
                v-if="tabListKey === '1'"
                :key="tabListKey"
                role="super_admin"
                @forceReload="reloadUserList()"
              />
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
