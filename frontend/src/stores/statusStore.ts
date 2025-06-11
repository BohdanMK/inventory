import axiosInstance from '@/api/axiosInstance';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ApiResponse, ApiResponsePaginated } from '@/types/axiosResponce';
import { staticEndpoints } from '@/api/endpoints';
import type { IStatus } from '@/types/status/statuses';
import type { UsersQuery } from '@/types';
import type { IPaginatorData } from '@/types/index';
import toSelectOptions from '@/helpers/selectData';
import { defaultPaginatedData } from '@/helpers/defaultResponses';

export const useStatusStore = defineStore('statusStore', () => {
  // state
  const statusesList = ref<IStatus[]>([]);

  const currentPageStatuses = ref(1);
  const totalStatuses = ref(0);
  const perPageStatuses = ref(10);

  // actions

  const setStatusesPagination = (data: IPaginatorData<IStatus[]>) => {
    currentPageStatuses.value = data.page;
    totalStatuses.value = data.total;
    perPageStatuses.value = data.perPage;
  }

  const getStatusList = async (params?: UsersQuery): Promise<ApiResponsePaginated<IStatus[]>> => {
    const url = staticEndpoints.statuses.getStatuses;

    try {
      const response: ApiResponsePaginated<IStatus[]> = await axiosInstance.get(url, {
        params,
      });

      if (response.success === false) {
        return {
          success: false,
          message: response.message,
          data: response.data,
        };
      } else {
        return {
          success: true,
          message: response.message,
          data: response.data,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message,
        data: defaultPaginatedData<IStatus>(),
      };
    }
  };

  const createStatus = async (name: string): Promise<ApiResponse<IStatus>> => {
    const url = staticEndpoints.statuses.addStatus;
    try {
      const response: ApiResponse<IStatus> = await axiosInstance.post(url, {
        name,
      });

      if (response.success === false) {
        return {
          success: false,
          message: response.message,
          data: response.data,
        };
      } else {
        return {
          success: true,
          message: response.message,
          data: response.data,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message,
        data: {} as IStatus,
      };
    }
  };

  const editStatus = async (data: IStatus): Promise<ApiResponse<IStatus>> => {
    const { _id, ...rest } = data;
    const url = staticEndpoints.statuses.editdStatus(_id);
    try {
      const response: ApiResponse<IStatus> = await axiosInstance.put(url, {
        ...rest,
      });

      if (response.success === false) {
        return {
          success: false,
          message: response.message,
          data: response.data,
        };
      } else {
        return {
          success: true,
          message: response.message,
          data: response.data,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message,
        data: {} as IStatus,
      };
    }
  };

  const deleteStatus = async (id: string | number): Promise<ApiResponse<null>> => {
    const url = staticEndpoints.statuses.deletedStatus(id);
    try {
      const response: ApiResponse<IStatus> = await axiosInstance.post(url);

      if (response.success === false) {
        return { success: false, message: response.message, data: null };
      } else {
        return { success: true, message: response.message, data: null };
      }
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message,
        data: null,
      };
    }
  };

  // getters

  const statusListForSelect = computed(() => {
    return toSelectOptions(statusesList.value, 'name', '_id');
  });

  const filtersStatuses = computed((): UsersQuery => {
    return {
      page: currentPageStatuses.value,
      perPage: perPageStatuses.value
    }
  })

  return {
    createStatus,
    getStatusList,
    statusesList,
    editStatus,
    deleteStatus,
    statusListForSelect,
    setStatusesPagination,
    currentPageStatuses,
    totalStatuses,
    perPageStatuses,
    filtersStatuses
  };
});
