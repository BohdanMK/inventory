<script setup lang="ts">
  import { watch, onBeforeUnmount, ref } from 'vue';
  import { useSocket } from '@/composables/useSocket';
  import { usePagesStore } from '@/stores/pagesStore';
  import { useRouter } from 'vue-router'; //
  import { useProfileStore } from '@/stores/userProfileStore';
  import ProgressSpinner from 'primevue/progressspinner';
  import TheHeader from '@/components/TheHeader.vue';
  import TheSideBar from '@/components/TheSideBar.vue';

  const pagesStore = usePagesStore();
  const { tabId, socket } = useSocket();
  const router = useRouter();

  const profileStore = useProfileStore();

  // actions

  const getProfile = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token || token === undefined || token.trim() === '') {
      router.push('/auth');
      return;
    }

    // Якщо профіль уже є — не тягнемо ще раз
    profileStore.loadingProfile = true;

    const { success, message, data } = await profileStore.fetchUserProfile();
    if (!success) {
      console.error('Failed to fetch profile:', message);
    } else {
      // profileStore.userProfile = data
      if (profileStore.userProfile.role) {
        if (!localStorage.getItem('role')) {
          localStorage.setItem('role', profileStore.userProfile.role);
        }
        console.log(localStorage.getItem('role'));
      }
      profileStore.loadingProfile = true;
    }
    profileStore.loadingProfile = false;
  };

  getProfile();

  watch(
    () => router.currentRoute.value.path,
    newRoute => {
      // console.log(socket)
      if (socket.value && socket.value.connected) {
        socket.value.emit('update-tab', {
          tabId,
          currentPage: newRoute,
        });
      }
    },
    { immediate: true, deep: true }
  );

  onBeforeUnmount(() => {
    if (socket.value && socket.value.connected && tabId) {
      socket.value.emit('remove-tab', { tabId });
    }

    if (socket.value) {
      socket.value.off('tabs-update');
    }
  });
</script>

<template>
  <transition name="fade">
    <div
      v-if="profileStore.loadingProfile"
      class="fixed z-50 flex h-screen w-full items-center justify-center bg-white text-center"
    >
      <div>
        <ProgressSpinner />
      </div>
    </div>

    <div v-else class="dark:bg-gray-600">
      <TheHeader />
      <main>
        <div class="flex">
          <TheSideBar />
          <div
            class="m-4 w-full overflow-x-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <slot />
          </div>
        </div>
      </main>
    </div>
  </transition>
</template>

<style scoped>
  /* Анімація для спінера */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
