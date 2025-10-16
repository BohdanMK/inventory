interface IBreadcrumb {
  label: string;
  to?: string;
  icon?: string;
}

export const groups: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.groups' },
];

export const goodsReceiptList: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.goodsReceiptList' },
];

export const goodsReceipt: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.goodsReceiptList', to: '/goods-receipt' },
  { label: 'breadcrumbs.goodsReceiptPage' },
];

export const goodsReceiptAdd: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.goodsReceiptList', to: '/goods-receipt' },
  { label: 'breadcrumbs.goodsReceiptAdd' },
];

export const productsTemplates: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.productsTemplates' },
];

export const productsTemplate: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.productsTemplates', to: '/products' },
  { label: 'breadcrumbs.productsTemplatePage' },
];

export const stockList: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.stockList' },
];

export const stockActivityList: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.stockActivityList' },
];

export const stockActivityAdd: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.stockActivityList', to: '/stock-activity' },
  { label: 'breadcrumbs.stockActivityAdd' },
];

export const stockActivityShow: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.stockActivityList', to: '/stock-activity' },
  { label: 'breadcrumbs.stockActivityShow' },
];

export const settings: IBreadcrumb[] = [
  { label: 'breadcrumbs.home', to: '/', icon: 'pi pi-home' },
  { label: 'breadcrumbs.settings' },
];
