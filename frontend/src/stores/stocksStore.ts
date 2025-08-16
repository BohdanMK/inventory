import { ref, computed, reactive } from 'vue';
import axiosInstance from '@/api/axiosInstance';
import { defineStore } from 'pinia';
import { staticEndpoints } from '@/api/endpoints';
import type { UsersQuery, IFilters } from '@/types';
import type { ApiResponse, ApiResponsePaginated } from '@/types/axiosResponce';
import type { IProductInStock, ReplaceProduct, IProductInStockAction } from '@/types/product/product';
import type { IActionData, IPaginatorData } from '@/types/index';
import { assertNever } from '@/helpers/assetNevetType';
import { defaultPaginatedData } from '@/helpers/defaultResponses';

export const useStocksStore = defineStore('stoksStore', () => {
  // state
  const stockAction = ref<IActionData>({} as IActionData);
  const stockActionList = ref<IActionData[]>([]);
  const productList = ref<IProductInStock[]>([]);
  const productListForCreateAction = ref<IProductInStock[]>([]);
  const filtersProduct = <Pick<IFilters, 'name' | 'warehouse' | 'quantity' | 'category' | 'price'>>reactive({
    name: null,
    warehouse: null,
    quantity: null,
    category: null,
    price: null,
  });
  const filtersStockAction = <Pick<IFilters, 'typeAction' | 'warehouse' | 'description'>>reactive({
    typeAction: null,
    warehouse: null,
    description: null,
  });
  const sortByForProduct = ref<{ name: string; code: string } | null>(null);
  const filtersProductLoading = ref<boolean>(false);

  const currentPageActions = ref(1);
  const totalActions = ref(0);
  const perPageActions = ref(10);

  const currentPageProducts = ref(1);
  const totalProducts = ref(0);
  const perPageProducts = ref(10);

  // actions
  const resetFiltersStockAction = () => {
    for (const key in filtersStockAction) {
      filtersStockAction[key as keyof typeof filtersStockAction] = null;
    }
  };

  const resetFiltersProduct = () => {
    for (const key in filtersProduct) {
      filtersProduct[key as keyof typeof filtersProduct] = null;
    }
  };

  const setProductsPagination = (data: IPaginatorData<IProductInStock[]>) => {
    currentPageProducts.value = data.page;
    totalProducts.value = data.total;
    perPageProducts.value = data.perPage;
  };

  const setActionsPagination = (data: IPaginatorData<IActionData[]>) => {
    currentPageActions.value = data.page;
    totalActions.value = data.total;
    perPageActions.value = data.perPage;
  };

  const deleteLocalItem = (id: string | number): void => {
    productListForCreateAction.value = productListForCreateAction.value.filter(item => item._id !== id);
  };

  const addProductInList = (dataItem: IProductInStockAction) => {
    const alreadyExists = productListForCreateAction.value.some(item => item._id === dataItem._id);

    if (!alreadyExists && dataItem._id) {
      productListForCreateAction.value.unshift(dataItem);
    }
  };

  const getStockActionList = async (params?: UsersQuery): Promise<ApiResponsePaginated<IActionData[]>> => {
    const url = staticEndpoints.stoks.actionList;

    try {
      const response: ApiResponsePaginated<IActionData[]> = await axiosInstance.get(url, {
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
        data: defaultPaginatedData<IActionData>(),
      };
    }
  };

  const getStockAction = async (id: string | number, params?: UsersQuery): Promise<ApiResponse<IActionData>> => {
    const url = staticEndpoints.stoks.getById(id);

    try {
      const response: ApiResponse<IActionData> = await axiosInstance.get(url, {
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
        data: {} as IActionData,
      };
    }
  };

  const getProductsInStockList = async (params?: UsersQuery): Promise<ApiResponsePaginated<IProductInStock[]>> => {
    const url = staticEndpoints.stoks.getAll;
    try {
      const response: ApiResponsePaginated<IProductInStock[]> = await axiosInstance.get(url, {
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
        data: defaultPaginatedData<IProductInStock>(),
      };
    }
  };

  const replaceProducts = async (id: string, dataItem: ReplaceProduct): Promise<ApiResponse<[]>> => {
    const url = staticEndpoints.stoks.replaceProduct(id);

    try {
      console.log(dataItem);
      const response: ApiResponse<[]> = await axiosInstance.post(url, {
        ...dataItem,
      });

      if (response.success === false) {
        return {
          success: false,
          message: response.message,
          data: [],
        };
      } else {
        return {
          success: true,
          message: response.message,
          data: [],
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || 'Unknown error',
        data: [],
      };
    }
  };

  const stockskActions = async (dataItem: IActionData): Promise<ApiResponse<[]>> => {
    let url = '';
    switch (dataItem.typeAction) {
      case 'RETURN':
        url = staticEndpoints.stoks.return;
        break;
      case 'SHIPMENT':
        url = staticEndpoints.stoks.shipment;
        break;
      case 'WRITEOFF':
        url = staticEndpoints.stoks.writeoff;
        break;
      case 'CANCEL':
        url = staticEndpoints.stoks.cancel;
        break;
      default:
        assertNever(dataItem.typeAction);
    }

    try {
      const response: ApiResponse<IProductInStock[]> = await axiosInstance.post(url, {
        ...dataItem,
      });

      if (response.success === false) {
        return {
          success: false,
          message: response.message,
          data: [],
        };
      } else {
        return {
          success: true,
          message: response.message,
          data: [],
        };
      }
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || 'Unknown error',
        data: [],
      };
    }
  };

  // getters

  const getFiltersActions = computed((): UsersQuery => {
    return {
      page: currentPageActions.value,
      perPage: perPageActions.value,
      warehouse: filtersStockAction.warehouse || null,
      description: filtersStockAction.description || null,
      typeAction: filtersStockAction.typeAction || null,
    };
  });

  const getfiltersProducts = computed((): UsersQuery => {
    return {
      page: currentPageProducts.value,
      perPage: perPageProducts.value,
      sortBy: sortByForProduct.value?.code || null,
      name: filtersProduct.name || null,
      warehouse: filtersProduct.warehouse || null,
      category: filtersProduct.category || null,
      price: filtersProduct.price || null,
      quantity: filtersProduct.quantity || null,
    };
  });

  const isFiltersProductEmpty = computed(() => {
    return Object.values(filtersProduct).every(value => value === null || value === '' || value === undefined);
  });

  const isFiltersStockActionEmpty = computed(() => {
    return Object.values(filtersStockAction).every(value => value === null || value === '' || value === undefined);
  });


  return {
    getStockActionList,
    stockActionList,
    productList,
    addProductInList,
    productListForCreateAction,
    getProductsInStockList,
    replaceProducts,
    stockskActions,
    stockAction,
    getStockAction,
    deleteLocalItem,
    setActionsPagination,
    currentPageActions,
    totalActions,
    perPageActions,
    getFiltersActions,
    currentPageProducts,
    totalProducts,
    perPageProducts,
    filtersProduct,
    getfiltersProducts,
    setProductsPagination,
    sortByForProduct,
    filtersProductLoading,
    isFiltersProductEmpty,
    resetFiltersProduct,
    resetFiltersStockAction,
    filtersStockAction,
    isFiltersStockActionEmpty
  };
});
