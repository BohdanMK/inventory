import { createRouter, createWebHistory } from 'vue-router';
import { groups, goodsReceiptList, goodsReceipt, goodsReceiptAdd, productsTemplates, stockList, stockActivityList, stockActivityAdd, stockActivityShow, settings } from '@/router/breadcrumbItem.ts'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { layout: 'default', requireAuth: true },
  },
  {
    path: '/groups',
    name: 'groups',
    component: () => import('@/views/groupsUser/GroupsPage.vue'),
    meta: { layout: 'default', requireAuth: true, breadcrumbs: [...groups] },
  },
  {
    path: '/goods-receipt',
    name: 'GoodsReceipt',
    component: () => import('@/views/goodsReceipt/GoodsReceiptPage.vue'),
    meta: { layout: 'default', requireAuth: true, breadcrumbs: [...goodsReceiptList] },
  },
  {
    path: '/goods-receipt/add',
    name: 'GoodReceiptAdd',
    component: () => import('@/views/goodsReceipt/GoodReceiptCreatePage.vue'),
    meta: { layout: 'default', requireAuth: true, breadcrumbs: [...goodsReceiptAdd] },
  },
  {
    path: '/goods-receipt/:id',
    name: 'GoodReceiptShow',
    component: () => import('@/views/goodsReceipt/GoodReceiptShowPage.vue'),
    meta: { layout: 'default', requireAuth: true, breadcrumbs: [...goodsReceipt] },
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/productTemplate/ProductsPage.vue'),
    meta: { layout: 'default', requireAuth: true, breadcrumbs: [...productsTemplates] },
  },
  {
    path: '/stock-activity',
    name: 'StockActivity',
    component: () => import('@/views/stocks/StockActivityPage.vue'),
    meta: { layout: 'default', requireAuth: true, breadcrumbs: [...stockActivityList] },
  },
  {
    path: '/stock-activity/add',
    name: 'StockActivityAdd',
    component: () => import('@/views/stocks/StockActivityCreatePage.vue'),
    meta: { layout: 'default', requireAuth: true, breadcrumbs: [...stockActivityAdd] },
  },
  {
    path: '/stock-activity/:id',
    name: 'StockActivityShow',
    component: () => import('@/views/stocks/StockActionShowPage.vue'),
    meta: { layout: 'default', requireAuth: true, breadcrumbs: [...stockActivityShow] },
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import('@/views/stocks/StockPage.vue'),
    meta: { layout: 'default', requireAuth: true, breadcrumbs: [...stockList] },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsPage.vue'),
    meta: { layout: 'default', requireAuth: true, requireSA: true, breadcrumbs: [...settings]  },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthPage.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { layout: 'auth' },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role') || '';

  // Якщо користувач уже залогінений і намагається зайти на /auth
  if (to.path === '/auth' && isLoggedIn) {
    console.log('1');
    return next('/');
  }

  // Якщо маршрут вимагає авторизації, а користувач не залогінений
  if (to.meta.requireAuth && !isLoggedIn) {
    return next('/auth');
  }

  // Якщо маршрут вимагає роль super_admin
  if (to.meta.requireSA) {
    if (!userRole || userRole !== 'super_admin') {
      return next('/');
    }
  }
  console.log('3');
  // Всі умови виконані — пускаємо далі
  return next();
});
