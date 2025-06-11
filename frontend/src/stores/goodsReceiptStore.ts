import { ref, computed } from 'vue';
import axiosInstance from '@/api/axiosInstance';
import { defineStore } from 'pinia';
import type { IProductInStock } from '@/types/product/product';
import { staticEndpoints } from '@/api/endpoints';
import type { ApiResponse, ApiResponsePaginated } from '@/types/axiosResponce';
import type { IPaginatorData } from '@/types/index';
import type { GoodsReceipt } from '@/types/goodsReceipt/goodsReceipt';
import type { UsersQuery } from '@/types';
import { defaultPaginatedData } from '@/helpers/defaultResponses';

export const useGoodsReceiptStore = defineStore('goodsReceiptStore', () => {
  // state
  const productList = ref<IProductInStock[]>([]);
  const goodsReceipt = ref<GoodsReceipt>({} as GoodsReceipt);
  const goodsReceiptList = ref<GoodsReceipt[]>([]);

  const currentPageReceipts = ref(1);
  const totalReceipts = ref(0);
  const perPageReceipts = ref(10);

  // actions
  const setReceiptsPagination = (data: IPaginatorData<GoodsReceipt[]>) => {
    currentPageReceipts.value = data.page;
    totalReceipts.value = data.total;
    perPageReceipts.value = data.perPage;
  }

  const addProductInList = (dataItem: IProductInStock) => {
    productList.value.unshift(dataItem);
  };

  const deleteLocalItem = (id: string | number): void => {
    productList.value = productList.value.filter(item => item._id !== id);
  };

  const createGoodsReceipt = async (dataItems: GoodsReceipt): Promise<ApiResponse<GoodsReceipt>> => {
    const url = staticEndpoints.goodsReceipts.create;

    try {
      const response: ApiResponse<GoodsReceipt> = await axiosInstance.post(url, {
        ...dataItems,
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
        data: {} as GoodsReceipt,
      };
    }
  };

  const getGoodsReceipt = async (id: string | number, params?: UsersQuery): Promise<ApiResponse<GoodsReceipt>> => {
    const url = staticEndpoints.goodsReceipts.getById(id);

    try {
      const response: ApiResponse<GoodsReceipt> = await axiosInstance.get(url, {
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
        data: {} as GoodsReceipt,
      };
    }
  };

  const getGoodsReceiptList = async (params?: UsersQuery): Promise<ApiResponsePaginated<GoodsReceipt[]>> => {
    const url = staticEndpoints.goodsReceipts.getAll;

    try {
      const response: ApiResponsePaginated<GoodsReceipt[]> = await axiosInstance.get(url, {
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
        data: defaultPaginatedData<GoodsReceipt>(),
      };
    }
  };

  // getters

  const filtersReceipts = computed((): UsersQuery => {
    return {
      page: currentPageReceipts.value,
      perPage: perPageReceipts.value
    }
  })

  return {
    productList,
    addProductInList,
    deleteLocalItem,
    createGoodsReceipt,
    goodsReceiptList,
    getGoodsReceiptList,
    goodsReceipt,
    getGoodsReceipt,
    filtersReceipts,
    setReceiptsPagination,
    currentPageReceipts,
    totalReceipts,
    perPageReceipts
  };
});
