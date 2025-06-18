<script setup lang="ts">
  import { onMounted, computed } from 'vue';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { formatDataWithTime } from '@/composables/formatDate.ts';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import setFullImgPath from '@/helpers/fullPathImg.ts';
  import Toolbar from 'primevue/toolbar';
  import Button from 'primevue/button';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import CreateUserPopUp from '@/components/groups/popup/CreateUserPopUp.vue';
  import DeleteUserPopUp from '@/components/groups/popup/DeleteUserPopUp.vue';
  import EditUserPopUp from '@/components/groups/popup/EditUserPopUp.vue';
  import TotalResultItem from '@/components/ui/TotalResultItem.vue';



  interface Props {
    role: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'forceReload'): void;
  }>();

  // state
  const profileStore = useProfileStore();
  const asyncState = useAsyncState();

  // actions
  const fetchUsers = async (): Promise<void> => {
    try {
      asyncState.startLoading();
      const { success, message, data } = await profileStore.fetchUsersList({
        role: props.role,
      });

      if (!success) {
        asyncState.failedLoading(message || 'error loading');
      } else {
        if (props.role === 'user') {
          profileStore.userList = data.data;
        }

        if (props.role === 'super_admin') {
          profileStore.superAdminList = data.data;
        }
        asyncState.successLoading();
      }
    } catch (e) {
      asyncState.failedLoading(e instanceof Error ? e.message : 'error loading');
    }
  };

  const toggleModal = () => {
    if (props.role === 'super_admin') {
      profileStore.createSuperAdmin = !profileStore.createSuperAdmin;
    } else {
      profileStore.createUserPopUp = !profileStore.createUserPopUp;
    }
  };

  /// getters

  const usersList = computed(() => (props.role === 'user' ? profileStore.userList : profileStore.superAdminList));

  onMounted(() => {
    fetchUsers();
  });
</script>

<template>
  <div>
    <ErrorBoundary v-if="asyncState.errorText.value" @reload="fetchUsers" />
    <div v-else class="card">
      <Toolbar class="mb-6">
        <template #start>
          <TotalResultItem :total="usersList.length" />
        </template>
        <template #end>
          <Button label="New User" icon="pi pi-plus" class="mr-2" @click="toggleModal()" />
          <Button icon="pi pi-refresh" rounded raised @click="fetchUsers()" />
        </template>
      </Toolbar>
      <CreateUserPopUp :role="props.role" @updateData="fetchUsers()" />
      <DataTable
        v-if="!asyncState.loadingStatus.value"
        :value="usersList"
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        tableStyle="min-width: 50rem"
      >
        <Column field="username" header="Username">
          <template #body="slotProps">
            {{ slotProps.data.username || 'Default' }}
          </template>
        </Column>
        <Column header="Image" class="text-center">
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
        <Column field="email" header="Email">
          <template #body="slotProps">
            {{ slotProps.data.email }}
          </template>
        </Column>
        <Column field="role" header="Role"></Column>
        <Column field="createdAt" header="Created At">
          <template #body="slotProps">
            {{ formatDataWithTime(slotProps.data.createdAt) }}
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 12rem" class="text-end">
          <template #body="slotProps">
            <EditUserPopUp :id="slotProps.data._id" :data="slotProps.data" @updateData="() => emit('forceReload')" />
            <DeleteUserPopUp :id="slotProps.data._id" @updateData="fetchUsers()" />
          </template>
        </Column>
        <template #empty>
          <div class="p-datatable-empty-message">No data available.</div>
        </template>
      </DataTable>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>
