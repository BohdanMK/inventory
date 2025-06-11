import type { IProductInStock } from '@/types/product/product';
import type { IWarehouse } from '@/types/warehouse/warehouse';

export interface GoodsReceipt {
  name?: string;
  comment: string;
  warehouse: IWarehouse;
  products: IProductInStock[];
}
