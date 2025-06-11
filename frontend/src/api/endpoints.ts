// import type { IEndpoint } from '@/interfaces/index'
import type { IEndpoint } from '@/types/api/endpoints';

export const staticEndpoints: IEndpoint = {
  auth: {
    loginUser: '/api/authUser/login-user',
    loginAdmin: '/api/authSA/login-super-admin',
    registerUser: '/api/registerUser/register-user',
    registerAdmin: '/api/registerSA/register-super-admin',
    userProfile: '/api/authUser/profile',
    adminProfile: '/api/authSA/profile',
  },
  user: {
    getProfile: '/api/profile/user',
    getUsers: 'api/users/user-list',
    updateProfile: 'api/profile/user',
    updateProfileAvatar: 'api/profile/avatar',
    updateProfilePassword: 'api/profile/new-password',
    deleteUser: id => `api/user/delete-user/${id}`,
    updateUser: id => `api/user/update-user/${id}`,
    updatePass: id => `api/user/new-password/${id}`,
  },
  categories: {
    addCategory: '/api/categories/add',
    getCategories: '/api/categories',
    getCategory: id => `/api/categories/${id}`,
    deleteCategory: id => `/api/categories/delete/${id}`,
    editCategory: id => `/api/categories/edit/${id}`,
  },
  statuses: {
    addStatus: '/api/statuses/add',
    getStatuses: '/api/statuses',
    getdStatus: id => `/api/statuses/${id}`,
    deletedStatus: id => `/api/statuses/delete/${id}`,
    editdStatus: id => `/api/statuses/edit/${id}`,
  },
  products: {
    getAll: '/api/productTemplate',
    create: '/api/productTemplate',
    update: id => `/api/productTemplate/${id}`,
    delete: id => `/api/productTemplate/${id}`,
  },
  warehouse: {
    getAll: '/api/warehouse',
    create: '/api/warehouse',
    update: id => `/api/warehouse/${id}`,
    delete: id => `/api/warehouse/${id}`,
  },
  goodsReceipts: {
    create: '/api/goods-receipts',
    getAll: '/api/goods-receipts',
    getById: id => `/api/goods-receipts/${id}`,
  },
  stoks: {
    getAll: '/api/products-in-stock',
    replaceProduct: id => `/api/products-in-stock/replace/${id}`,
    return: '/api/stock-actions/return',
    shipment: '/api/stock-actions/shipment',
    writeoff: '/api/stock-actions/writeoff',
    cancel: '/api/stock-actions/cancel',
    actionList: '/api/stock-actions',
    getById: id => `/api/stock-actions/${id}`
  },
  uploads: {
    avatar: '/api/avatar',
    file: '/api/upload',
  },
};
