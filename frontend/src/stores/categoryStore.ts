import axiosInstance from '@/api/axiosInstance';
import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import type { ApiResponse, ApiResponsePaginated } from '@/types/axiosResponce';
import { staticEndpoints } from '@/api/endpoints';
import type { ICategory } from '@/types/categories/categories';
import type { UsersQuery, IFilters } from '@/types';
import type { IPaginatorData } from '@/types/index';
import toSelectOptions from '@/helpers/selectData';
import { defaultPaginatedData } from '@/helpers/defaultResponses';

export const useCategoryStore = defineStore('categoryStore', () => {
  // state
  const categoryList = ref<ICategory[]>([]);
  const filtersCategory = reactive<Pick<IFilters, 'name'>>({
    name: null,
  });

  const currentPageCategories = ref(1);
  const totalCategories = ref(0);
  const perPageCategories = ref(10);

  // actions
  const resetFiltersCategory = () => {
    for (const key in filtersCategory) {
      filtersCategory[key as keyof typeof filtersCategory] = null;
    }
  };

  const setCategoriesPagination = (data: IPaginatorData<ICategory[]>) => {
    currentPageCategories.value = data.page;
    totalCategories.value = data.total;
    perPageCategories.value = data.perPage;
  };

  const getCategoryList = async (params?: UsersQuery): Promise<ApiResponsePaginated<ICategory[]>> => {
    const url = staticEndpoints.categories.getCategories;

    try {
      const response: ApiResponsePaginated<ICategory[]> = await axiosInstance.get(url, {
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
        data: defaultPaginatedData<ICategory>(),
      };
    }
  };

  const createCategory = async (name: string): Promise<ApiResponse<ICategory>> => {
    const url = staticEndpoints.categories.addCategory;
    try {
      const response: ApiResponse<ICategory> = await axiosInstance.post(url, {
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
        data: {} as ICategory,
      };
    }
  };

  const editCategory = async (data: ICategory): Promise<ApiResponse<ICategory>> => {
    const { _id, ...rest } = data;
    const url = staticEndpoints.categories.editCategory(_id);
    try {
      const response: ApiResponse<ICategory> = await axiosInstance.put(url, {
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
        data: {} as ICategory,
      };
    }
  };

  const deleteCategory = async (id: string | number): Promise<ApiResponse<null>> => {
    const url = staticEndpoints.categories.deleteCategory(id);
    try {
      const response: ApiResponse<ICategory> = await axiosInstance.post(url);

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
  const categoryListForSelect = computed(() => {
    return toSelectOptions(categoryList.value, 'name', '_id');
  });

  const getFiltersCategories = computed((): UsersQuery => {
    return {
      page: currentPageCategories.value,
      perPage: perPageCategories.value,
      name: filtersCategory.name || null,
    };
  });

  const isFiltersCategoryEmpty = computed(() => {
    return Object.values(filtersCategory).every(value => value === null || value === '' || value === undefined);
  });

  return {
    createCategory,
    getCategoryList,
    categoryList,
    editCategory,
    deleteCategory,
    categoryListForSelect,
    getFiltersCategories,
    setCategoriesPagination,
    currentPageCategories,
    totalCategories,
    perPageCategories,
    filtersCategory,
    resetFiltersCategory,
    isFiltersCategoryEmpty,
  };
});
