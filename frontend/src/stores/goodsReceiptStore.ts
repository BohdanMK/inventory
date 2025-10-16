import { ref, computed, reactive } from 'vue';
import axiosInstance from '@/api/axiosInstance';
import { defineStore } from 'pinia';
import type { IProductInStock } from '@/types/product/product';
import { staticEndpoints } from '@/api/endpoints';
import type { ApiResponse, ApiResponsePaginated } from '@/types/axiosResponce';
import type { IPaginatorData } from '@/types/index';
import type { GoodsReceipt } from '@/types/goodsReceipt/goodsReceipt';
import type { UsersQuery, IFilters } from '@/types';
import { defaultPaginatedData } from '@/helpers/defaultResponses';

export const useGoodsReceiptStore = defineStore('goodsReceiptStore', () => {
  // state
  const productList = ref<IProductInStock[]>([]);
  const goodsReceipt = ref<GoodsReceipt>({} as GoodsReceipt);
  const goodsReceiptList = ref<GoodsReceipt[]>([]);
  const filtersGoodsReceipt = <Pick<IFilters, 'name' | 'warehouse'>>reactive({
    name: null,
    warehouse: null,
  });

  const currentPageReceipts = ref(1);
  const totalReceipts = ref(0);
  const perPageReceipts = ref(10);

  // actions
  const resetFiltersGoodsReceipt = () => {
    for (const key in filtersGoodsReceipt) {
      filtersGoodsReceipt[key as keyof typeof filtersGoodsReceipt] = null;
    }
  };

  const setReceiptsPagination = (data: IPaginatorData<GoodsReceipt[]>) => {
    currentPageReceipts.value = data.page;
    totalReceipts.value = data.total;
    perPageReceipts.value = data.perPage;
  };

  const addProductInList = (dataItem: IProductInStock) => {
    productList.value.unshift(dataItem);
  };

  const resetProductList = () => {
    productList.value = [];
  };

  const checkOnEmptyValueInProducts = (): boolean => {
    return productList.value.some((item: IProductInStock) => !item.count || !item.price);
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

  const getfiltersReceipts = computed((): UsersQuery => {
    return {
      page: currentPageReceipts.value,
      perPage: perPageReceipts.value,
      name: filtersGoodsReceipt.name || null,
      warehouse: filtersGoodsReceipt.warehouse || null,
    };
  });

  const isFiltersGoodsReceiptEmpty = computed(() => {
    return Object.values(filtersGoodsReceipt).every(value => value === null || value === '' || value === undefined);
  });

  return {
    productList,
    addProductInList,
    resetProductList,
    deleteLocalItem,
    createGoodsReceipt,
    goodsReceiptList,
    getGoodsReceiptList,
    goodsReceipt,
    getGoodsReceipt,
    getfiltersReceipts,
    setReceiptsPagination,
    currentPageReceipts,
    totalReceipts,
    perPageReceipts,
    filtersGoodsReceipt,
    resetFiltersGoodsReceipt,
    isFiltersGoodsReceiptEmpty,
    checkOnEmptyValueInProducts,
  };
});
