export interface IEndpoint {
  auth: {
    loginUser: string;
    registerUser: string;
    userProfile: string;
  };
  user: {
    getProfile: string;
    getUsers: string;
    updateProfile: string;
    updateProfileAvatar: string;
    updateProfilePassword: string;
    deleteUser: (id: string) => string;
    updateUser: (id: string) => string;
    updatePass: (id: string) => string;
  };
  categories: {
    addCategory: string;
    getCategories: string;
    getCategory: (id: string) => string;
    deleteCategory: (id: string | number) => string;
    editCategory: (id: string | number) => string;
  };
  statuses: {
    addStatus: string;
    getStatuses: string;
    getdStatus: (id: string) => string;
    deletedStatus: (id: string | number) => string;
    editdStatus: (id: string | number) => string;
  };
  products: {
    getAll: string;
    create: string;
    update: (id: string | number) => string;
    delete: (id: string | number) => string;
  };
  warehouse: {
    getAll: string;
    create: string;
    update: (id: string | number) => string;
    delete: (id: string | number) => string;
  };
  goodsReceipts: {
    create: string;
    getAll: string;
    getById: (id: string | number) => string;
  };
  stoks: {
    getAll: string;
    getById: (id: string | number) => string;
    replaceProduct: (id: string | number) => string;
    return: string;
    shipment: string;
    writeoff: string;
    cancel: string;
    actionList: string;
  };
  uploads: {
    avatar: string;
    file: string;
  };
  dashBoard: {
    getProductsInfo: string;
    getStockActionsSummary: string;
  }
}
