export interface ICategory {
  name: string;
  _id: string | number;
}

export interface ICategoryTable {
  total: number,
  page: number,
  perPage: number,
  data: ICategory[]
}
