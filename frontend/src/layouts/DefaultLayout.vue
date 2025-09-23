<script setup lang="ts">
  import { watch, onUnmounted, onMounted, ref } from 'vue';
  import { useProfileStore } from "@/stores/userProfileStore";
  import { useSocketStore } from '@/stores/socketStore';
  import { usePagesStore } from '@/stores/pagesStore';
  import { useUsersStore } from "@/stores/usersStore";
  import { useRouter } from 'vue-router'; //
  import ProgressSpinner from 'primevue/progressspinner';
  import TheHeader from '@/components/TheHeader.vue';
  import TheSideBar from '@/components/TheSideBar.vue';
  import ActionsBar from '@/components/actions/ActionsBar.vue';

  // state
  const pagesStore = usePagesStore();
  const usersStore = useUsersStore();
  const socketStore = useSocketStore();
  const router = useRouter();
  const profileStore = useProfileStore();
  const isDesktop = ref(true);

  // actions
  const checkScreen = () => {
    isDesktop.value = window.innerWidth > 991;
  };

  const getProfile = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token || token === undefined || token.trim() === '') {
      router.push('/auth');
      return;
    }

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



  onMounted(async () => {
    // check screen size
    checkScreen();
    window.addEventListener('resize', checkScreen);

    await getProfile();
    if (profileStore.userProfile && profileStore.userProfile._id) {
      // connect socket
      socketStore.connect(profileStore.userProfile._id);

      pagesStore.initTabs();

      const myTabId = crypto.randomUUID();
      pagesStore.registerTab(myTabId, router.currentRoute.value.fullPath);

      watch(() => router.currentRoute.value.fullPath, (newPath) => {
        pagesStore.updateTab(myTabId, newPath);
      });

      // init users list
      usersStore.registerUser(profileStore.userProfile._id);
      usersStore.initUsersListeners();

    } else {
      console.warn("⚠️ No userId found, socket not connected");
    }
});

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreen);

    socketStore.disconnect();
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

    <div v-else class="dark:bg-gray-600 relative">
        <TheHeader />
        <main v-if="isDesktop">
          <div class="flex">
            <TheSideBar />
            <div
              class="m-4 w-full overflow-x-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <slot />
            </div>
          </div>
          <ActionsBar/>
      </main>
      <div v-else class="w-full text-3xl text-center mt-[50px] font-medium">{{ $t('modile_version_is_comming_soon') }}</div>
    </div>
  </transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
