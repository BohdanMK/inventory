import axiosInstance from '@/api/axiosInstance';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ApiResponse, ApiResponsePaginated } from '@/types/axiosResponce';
import { staticEndpoints } from '@/api/endpoints';
import type { UsersQuery } from '@/types';


export const useDashBoardStore = defineStore('dashBoardStore', () => {
    interface ProductsInfo {
        totalProducts: number,
        totalPrice: number
    }

    interface IStockActionsSummary {
      type: number,
      count: number
    }

  const productsInfo = ref<ProductsInfo | null>(null);
  const stockActionsSummary = ref<IStockActionsSummary[] | null>(null)


  const getStatusList = async (params?: UsersQuery): Promise<ApiResponse<ProductsInfo>> => {
    const url = staticEndpoints.dashBoard.getProductsInfo;
    try {
      const response: ApiResponse<ProductsInfo> = await axiosInstance.get(url, {
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
        data: {} as ProductsInfo,
      };
    }
  };

  const getStockActionsSummary = async (params?: UsersQuery): Promise<ApiResponse<IStockActionsSummary[]>> => {
    const url = staticEndpoints.dashBoard.getStockActionsSummary;
    try {
      const response: ApiResponse<IStockActionsSummary[]> = await axiosInstance.get(url, {
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
        data: [] as IStockActionsSummary[],
      };
    }
  };

  return {
    getStatusList,
    productsInfo,
    getStockActionsSummary,
    stockActionsSummary
  }

 });