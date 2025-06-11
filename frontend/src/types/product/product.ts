export interface IProductTemplate {
  name: string;
  _id?: string;
  image: string | null;
  imagePath: string | null;
  category: { _id: string; name: string } | string;
  status: { _id: string; name: string } | string;
}

export interface IProductInStock extends IProductTemplate {
  price: number;
  count: number;
  warehouse?: {name: string , _id: string},
  goodsReceiptName?: string
}

export interface IProductInStockAction extends IProductInStock {
    countNew: number,
    priceNew: number
}


export interface ReplaceProduct {
  count: number;
  comment?: string,
  warehouse?: {name: string , _id: string},
  oldWarehouse?: {name: string , _id: string}
}