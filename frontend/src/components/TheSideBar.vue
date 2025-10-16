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
  import TheSideBarMenu from '@/components/TheSideBarMenu.vue';
  import ImgItem from '@/components/ui/ImgItem.vue';
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
    if (!userProfile.userProfile?.avatarFullPath) return false;
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

    <div class="relative mt-[50px] flex w-[150px] justify-center">
      <ImgItem v-if="getAvatar" :src="getAvatar" alt="User Avatar" class="rounded-[50%] object-cover" />
      <div v-else class="flex h-[80px] w-[80px] items-center rounded-full bg-white">
        <i class="pi pi-user-minus mx-auto text-5xl"></i>
      </div>

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

    <TheSideBarMenu @logOut="logOutUser()" />

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
