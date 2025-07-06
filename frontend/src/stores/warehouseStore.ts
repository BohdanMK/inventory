import axiosInstance from '@/api/axiosInstance';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ApiResponse, ApiResponsePaginated } from '@/types/axiosResponce';
import { staticEndpoints } from '@/api/endpoints';
import type { IWarehouse } from '@/types/warehouse/warehouse';
import type { UsersQuery } from '@/types';
import type { IPaginatorData } from '@/types/index';
import toSelectOptions from '@/helpers/selectData';
import { defaultPaginatedData } from '@/helpers/defaultResponses';


export const useWarehouseStore = defineStore('warehouseStore', () => {
  // state
  const warehouseList = ref<IWarehouse[]>([]);

  const currentPageWarehouses = ref(1);
  const totalWarehouses = ref(0);
  const perPageWarehouses = ref(10);

  //actions
  const setWarehousesPagination = (data: IPaginatorData<IWarehouse[]>) => {
    currentPageWarehouses.value = data.page;
    totalWarehouses.value = data.total;
    perPageWarehouses.value = data.perPage;
  };

  const getWarehouseList = async (params?: UsersQuery): Promise<ApiResponsePaginated<IWarehouse[]>> => {
    const url = staticEndpoints.warehouse.getAll;

    try {
      const response: ApiResponsePaginated<IWarehouse[]> = await axiosInstance.get(url, {
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
        data: defaultPaginatedData<IWarehouse>(),
      };
    }
  };

  const createWarehouse = async (data: IWarehouse): Promise<ApiResponse<IWarehouse>> => {
    const url = staticEndpoints.warehouse.create;
    try {
      const response: ApiResponse<IWarehouse> = await axiosInstance.post(url, {
        ...data,
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
        data: {} as IWarehouse,
      };
    }
  };

  const deleteWarehouse = async (id: string | number): Promise<ApiResponse<null>> => {
    const url = staticEndpoints.warehouse.delete(id);
    try {
      const response: ApiResponse<IWarehouse> = await axiosInstance.delete(url);

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

  const editWarehouse = async (data: IWarehouse): Promise<ApiResponse<IWarehouse>> => {
    const { _id, ...rest } = data;
    const url = staticEndpoints.warehouse.update(_id as string);
    try {
      const response: ApiResponse<IWarehouse> = await axiosInstance.put(url, {
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
        data: {} as IWarehouse,
      };
    }
  };

  // getters

  const warehouseListForSelect = computed(() => {
    return toSelectOptions(warehouseList.value, 'name', '_id');
  });

  const warehouseLength = computed((): number => {
    return warehouseList.value.length;
  });

  const filtersWarehouses = computed((): UsersQuery => {
    return {
      page: currentPageWarehouses.value,
      perPage: perPageWarehouses.value,
    };
  });

  return {
    warehouseList,
    getWarehouseList,
    createWarehouse,
    deleteWarehouse,
    editWarehouse,
    warehouseListForSelect,
    warehouseLength,
    filtersWarehouses,
    setWarehousesPagination,
    currentPageWarehouses,
    totalWarehouses,
    perPageWarehouses,
  };
});
