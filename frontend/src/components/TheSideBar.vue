<script setup lang="ts">
  import axios from '@/api/axiosInstance';
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToast } from 'primevue/usetoast';
  import Toast from 'primevue/toast';
  import ToggleSwitch from 'primevue/toggleswitch';
  import { useThemeSwitch } from '@/composables/useThemeSwitch';
  import { useProfileStore } from '@/stores/userProfileStore';
  import FileUpload from 'primevue/fileupload';
  import { staticEndpoints } from '@/api/endpoints';
  import { useI18n } from 'vue-i18n';

  // state

  const toast = useToast();
  const userProfile = useProfileStore();
  const route = useRoute();
  const router = useRouter();
  const { isDark } = useThemeSwitch();
  const { t } = useI18n();

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

    toast.add({
      severity: 'success',
      summary: t('sidebar.userSuccessfullyLogout'),
      life: 3000,
    });

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

    <ul class="m-0 w-full list-none overflow-hidden p-0">
      <li>
        <router-link
          v-ripple
          to="/"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-home mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.dashboard') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/goods-receipt"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/goods-receipt') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-angle-double-up mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.goodsReceipt') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/stock-activity"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/stock-activity') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-angle-double-down mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.stockActivity') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/stock"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/stock') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-gift mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.stock') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/products"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/products') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-gift mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.products') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          v-ripple
          to="/groups"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/groups') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-users mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.groups') }}</span>
        </router-link>
      </li>

      <li v-permission="'super_admin'">
        <router-link
          v-ripple
          to="/settings"
          :class="[ 'flex items-center justify-center rounded p-4 transition-colors duration-150',
                    isActiveRoute('/settings') ? 'text-primary-500 font-semibold'
                    : 'text-surface-700 hover:bg-surface-200 dark:text-surface-0 dark:hover:bg-surface-800' ]"
        >
          <i class="pi pi-cog mr-2"></i>
          <span class="font-medium">{{ $t('sidebar.settings') }}</span>
        </router-link>
      </li>

      <li>
        <a
          class="hover:bg-surface-200 flex cursor-pointer items-center justify-center rounded p-4 transition-colors duration-150"
          @click="logOutUser()"
        >
          <i class="pi pi-sign-out mr-2"></i>
          <span>{{ $t('sidebar.logOut') }}</span>
        </a>
      </li>
    </ul>

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
