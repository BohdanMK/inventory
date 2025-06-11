import type { StoсksActionsType } from '@/constants/constants';

export interface UsersQuery {
  [key: string]: string | number;
}

export interface IPaginatorData<T> {
    total: number;
    page: number;
    perPage: number;
    data: T;
}

interface actionProduct {
  product: string,
  count: number,
  price?: number
}

export interface IActionData {
    typeAction: StoсksActionsType,
    warehouse: string,
    products?: actionProduct[],
    comment: string,
    fileName?: string,
    filePath?: string,
    user?: string,
    createdAt?: string
}
