import axiosInstance from '@/api/axiosInstance';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ApiResponse } from '@/types/axiosResponce';
import type { IAuthResponce, IRegisterProfile } from '@/types/auth/auth';
import { staticEndpoints } from '@/api/endpoints';

export const useAuthStore = defineStore('authStore', () => {
  const userData = ref<any>(null);
  const loading = ref(false);
  const token = ref(localStorage.getItem('token') || null);

  const login = async (email: string, password: string, isSuperAdmin = false): Promise<ApiResponse<IAuthResponce>> => {
    try {
      loading.value = true;

      const url = staticEndpoints.auth.loginUser;

      const response: ApiResponse<IAuthResponce> = await axiosInstance.post(url, { email, password, isSuperAdmin });

      if (response.success === false) {
        return {
          success: false,
          message: response.message,
          data: response.data,
        };
      } else {
        return {
          success: true,
          message: response.data?.message,
          data: response.data,
        };
      }
    } finally {
      loading.value = false;
    }
  };

  const register = async (
    email: string,
    password: string,
    isSuperAdmin = false
  ): Promise<ApiResponse<IRegisterProfile>> => {
    try {
      loading.value = true;
      const url = staticEndpoints.auth.registerUser;

      const response: ApiResponse<IRegisterProfile> = await axiosInstance.post(url, { email, password });

      if (response.success === false) {
        return {
          success: false,
          message: response.message,
          data: response.data,
        };
      } else {
        return {
          success: true,
          message: response.data.message,
          data: response.data,
        };
      }
    } finally {
      loading.value = false;
    }
  };

  // getters
  const isLoggedIn = computed(() => !!token.value);
  return {
    isLoggedIn,
    userData,
    loading,
    login,
    register,
  };
});
