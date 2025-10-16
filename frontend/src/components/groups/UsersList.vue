<script setup lang="ts">
  import { onMounted, computed } from 'vue';
  import { useProfileStore } from '@/stores/userProfileStore';
  import { useAsyncState } from '@/composables/useAsyncState';
  import ErrorBoundary from '@/components/error/ErrorBoundary.vue';
  import Skeleton from 'primevue/skeleton';
  import CreateUserPopUp from '@/components/groups/popup/CreateUserPopUp.vue';
  import DeleteUserPopUp from '@/components/groups/popup/DeleteUserPopUp.vue';
  import EditUserPopUp from '@/components/groups/popup/EditUserPopUp.vue';
  import UsersTable from '@/components/groups/UsersTable.vue';
  import UsersHeader from '@/components/groups/UsersHeader.vue';

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
      <UsersHeader :length="usersList.length" @toggleModal="toggleModal()" @reloadList="fetchUsers()" />
      <CreateUserPopUp :role="props.role" @updateData="fetchUsers()" />
      <UsersTable :role="role" v-if="!asyncState.loadingStatus.value">
        <template #actions="{ data }">
          <EditUserPopUp :id="data._id" :data="data" @updateData="() => emit('forceReload')" />
          <DeleteUserPopUp :id="data._id" @updateData="fetchUsers()" />
        </template>
      </UsersTable>
      <Skeleton v-else width="100%" height="60vh" />
    </div>
  </div>
</template>
