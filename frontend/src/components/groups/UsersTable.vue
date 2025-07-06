<script setup lang="ts">
  import { computed } from 'vue';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import { useAsyncState } from '@/composables/useAsyncState';
  import setFullImgPath from '@/helpers/fullPathImg.ts';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';

  interface Props {
    role: string;
  }

  const props = defineProps<Props>();


  // state
  const profileStore = useProfileStore();
  const asyncState = useAsyncState();

  // actions


  /// getters

  const usersList = computed(() => (props.role === 'user' ? profileStore.userList : profileStore.superAdminList));

</script>

<template>
  <DataTable
    v-if="!asyncState.loadingStatus.value"
    :value="usersList"
    paginator
    :rows="10"
    :rowsPerPageOptions="[10, 20, 50]"
    tableStyle="min-width: 50rem"
  >
    <Column field="username" :header="$t('fields.Username')">
      <template #body="slotProps">
        {{ slotProps.data.username || 'Default' }}
      </template>
    </Column>

    <Column :header="$t('table.Image')" class="text-center">
      <template #body="slotProps">
        <img
          v-if="slotProps.data.avatar"
          :src="setFullImgPath(slotProps.data.avatarFullPath)"
          :alt="slotProps.data.avatar"
          class="w-24 rounded"
        />
        <i v-else class="pi pi-user-minus mx-auto text-2xl"></i>
      </template>
    </Column>

    <Column field="email" :header="$t('fields.Email')">
      <template #body="slotProps">
        {{ slotProps.data.email }}
      </template>
    </Column>

    <Column field="role" :header="$t('fields.Select_role')"></Column>

    <Column field="createdAt" :header="$t('table.created_at')">
      <template #body="slotProps">
        {{ formatDataWithTime(slotProps.data.createdAt) }}
      </template>
    </Column>

    <Column :exportable="false" style="min-width: 12rem" class="text-end">
      <template #body="slotProps">
        <slot name="actions" :data="slotProps.data" />
      </template>
    </Column>

    <template #empty>
      <div class="p-datatable-empty-message">
        {{ $t('default.no_data_available') }}
      </div>
    </template>
  </DataTable>
</template>