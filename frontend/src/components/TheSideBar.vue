<script setup lang="ts">
  import axios from '@/api/axiosInstance';
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToastNotification } from '@/composables/useToastNotification';
  import Toast from 'primevue/toast';
  import ToggleSwitch from 'primevue/toggleswitch';
  import { useThemeSwitch } from '@/composables/useThemeSwitch';
  import { useProfileStore } from '@/stores/userProfileStore';
  import FileUpload from 'primevue/fileupload';
  import { staticEndpoints } from '@/api/endpoints';
  import { useI18n } from 'vue-i18n';
  // import { useSocket } from '@/composables/useSocket';
  // import { socketAPI, disconnectSocket } from '@/socket/socketManager';
  import TheSideBarMenu from '@/components/TheSideBarMenu.vue';

  // state

  const toastNotification = useToastNotification();
  const userProfile = useProfileStore();
  const route = useRoute();
  const router = useRouter();
  const { isDark } = useThemeSwitch();
  const { t } = useI18n();
  // const { isConnected, tabId } = useSocket();

  // actions

  const onUpload = async (event: any) => {
    const formData = new FormData();
    formData.append('file', event.files[0]);

    try {
      const response = await axios.put(staticEndpoints.user.updateProfileAvatar, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      userProfile.userProfile.avatarFullPath = response.data.user.avatarFullPath;
    } catch (error) {
      console.error('Помилка при завантаженні зображення:', error);
    }
  };

  const isActiveRoute = (path: string) => route.path === path;

  const logOutUser = (): void => {

    userProfile.logOutUser();
    toastNotification.showSuccess(t('sidebar.userSuccessfullyLogout') || '');
 

    setTimeout(() => {
      userProfile.loadingProfile = true;
    }, 700);
    setTimeout(() => {
      userProfile.loadingProfile = false;
      router.push('/auth');
    }, 2000);
  };

  // getters

  const getAvatar = computed(() => {
    return userProfile.userProfile.avatarFullPath
      ? `${import.meta.env.VITE_API_URL}${userProfile.userProfile.avatarFullPath}`
      : 'https://fakeimg.pl/300x300';
  });
</script>

<template>
  <div
    class="card flex min-h-[93vh] w-[250px] flex-col items-center border-r-1 border-[#e2e8f0] bg-gray-100 dark:bg-gray-700"
  >
    <Toast />

    <div class="relative mt-[50px] w-[150px]">
      <img v-if="getAvatar" class="rounded-[50%] object-cover" :src="getAvatar" alt="" />
      <img v-else class="rounded-[50%]" src="https://fakeimg.pl/150x150" alt="" />

      <FileUpload
        class="p-button-outlined custom-fileuploader !absolute right-0 bottom-[0px] !rounded-[50%] !bg-white !p-[10px]"
        mode="basic"
        name="demo[]"
        accept="image/*"
        :maxFileSize="1000000"
        :auto="true"
        chooseLabel=""
        @select="onUpload"
      >
        <template #chooseicon>
          <i class="pi pi-image text-lg"></i>
        </template>
      </FileUpload>
    </div>

    <TheSideBarMenu
      @logOut="logOutUser()"
    />

    <div class="mt-auto w-full p-4">
      <div class="flex items-center justify-between">
        <span class="font-medium">
          {{ isDark ? $t('sidebar.darkMode') : $t('sidebar.lightMode') }}
        </span>
        <ToggleSwitch v-model="isDark" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
