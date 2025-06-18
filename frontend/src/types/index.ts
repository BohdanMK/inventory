import type { StoсksActionsType } from '@/constants/constants';
import type { IProductInStock } from '@/types/product/product'

export interface UsersQuery {
  [key: string]: string | number | boolean | null;
}

export interface IPaginatorData<T> {
  total: number;
  page: number;
  perPage: number;
  data: T;
}

interface actionProduct {
  product: string;
  count: number;
  price?: number;
}

export interface IActionData {
  typeAction: StoсksActionsType;
  warehouse: string | { name: string; _id?: string };
  products?: IProductInStock[];
  comment: string;
  fileName?: string;
  filePath?: string;
  user?: string;
  createdAt?: string;
}

export interface IFilters {
  name: string | null;
  quantity: string | null;
  price: string | null;
  category: string | null;
  warehouse: string | null;
  typeAction: string | null;
  description: string | null;
  status: string | null;
}


export interface BreadcrumbItem {
  label: string
  icon?: string
  route?: string
  to?: string
  url?: string
  target?: string
}