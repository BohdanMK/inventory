import axiosInstance from '@/api/axiosInstance';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ApiResponse, ApiResponsePaginated } from '@/types/axiosResponce';
import { staticEndpoints } from '@/api/endpoints';
import type { IProductTemplate } from '@/types/product/product';
import type { IPaginatorData } from '@/types/index';
import type { UsersQuery } from '@/types';
import toSelectOptions from '@/helpers/selectData';
import { defaultPaginatedData } from '@/helpers/defaultResponses';

export const useProductTemplateStore = defineStore('productTemplateStore', () => {
  // state
  const productTemplateList = ref<IProductTemplate[]>([]);

  const currentPageProducts = ref(1);
  const totalProducts = ref(0);
  const perPageProducts = ref(10);



  //actions
   const setActionsPagination = (data: IPaginatorData<IProductTemplate[]>) => {
      currentPageProducts.value = data.page;
      totalProducts.value = data.total;
      perPageProducts.value = data.perPage;
  }
  const getProductTemplateList = async (params?: UsersQuery): Promise<ApiResponsePaginated<IProductTemplate[]>> => {
    const url = staticEndpoints.products.getAll;

    try {
      const response: ApiResponsePaginated<IProductTemplate[]> = await axiosInstance.get(url, {
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
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || 'Unknown error',
        data: defaultPaginatedData<IProductTemplate>(),
      };
    }
  };

  const createProductTemplate = async (data: IProductTemplate): Promise<ApiResponse<IProductTemplate>> => {
    const url = staticEndpoints.products.create;
    try {
      const response: ApiResponse<IProductTemplate> = await axiosInstance.post(url, {
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
        data: {} as IProductTemplate,
      };
    }
  };

  const deleteProduct = async (id: string | number): Promise<ApiResponse<null>> => {
    const url = staticEndpoints.products.delete(id);
    try {
      const response: ApiResponse<IProductTemplate> = await axiosInstance.delete(url);

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

  const editProductTemplate = async (data: IProductTemplate): Promise<ApiResponse<IProductTemplate>> => {
    const { _id, ...rest } = data;
    const url = staticEndpoints.products.update(_id as string);
    try {
      const response: ApiResponse<IProductTemplate> = await axiosInstance.put(url, {
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
        data: {} as IProductTemplate,
      };
    }
  };

  // getters

  const filtersProducts = computed((): UsersQuery => {
    return {
      page: currentPageProducts.value,
      perPage: perPageProducts.value
    }
  })

  return {
    productTemplateList,
    getProductTemplateList,
    createProductTemplate,
    deleteProduct,
    editProductTemplate,
    filtersProducts,
    currentPageProducts,
    totalProducts,
    perPageProducts,
    setActionsPagination
  };
});
