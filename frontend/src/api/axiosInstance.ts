// api/axiosInstance.ts
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/axiosResponce';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    return {
      ...response,
      // added message in axios response for toast
      message: response.data?.message ?? '',
    } as AxiosResponse & { message: string };
  },
  (error: AxiosError<{ message?: string; details?: string }>) => {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
        return Promise.reject(new Error('Unauthorized'));
      }

      let errorMessage = 'An error occurred';
      if (error.response?.data && typeof error.response.data === 'object') {
        console.log('тут відпрацював121');
        const data = error.response.data as {
          message?: string;
          details?: string;
        };
        errorMessage = data.message || data.details || `Error ${error.response.status}`;
      } else if (error.request) {
        console.log('тут відпрацював123');
        errorMessage =
          error.request.statusText ||
          error.request.responseText ||
          error.request.toString() ||
          'No response from server. Please try again later.';
      } else {
        console.log('тут відпрацював1234');
        errorMessage = error.message;
      }

      return Promise.resolve({
        data: undefined,
        success: false,
        message: errorMessage,
      } as ApiResponse<unknown>);
    }

    return Promise.reject(error);
  }
);

export default instance;
