import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/common/Login.vue'),
  },
  {
    path: '/login',
    component: () => import('pages/common/Login.vue'),
  },
  {
    path: '/menu',
    component: () => import('pages/common/AppsMenu.vue'),
  },
  {
    path: '/demands',
    component: () => import('layouts/DemandLayout.vue'),
    children: [
      { path: '', component: () => import('pages/demand/DemandsList.vue') },
      {
        path: 'config',
        component: () => import('pages/demand/DemandConfig.vue'),
      },
    ],
  },
  {
    path: '/property',
    component: () => import('layouts/PropertyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/property/PropertyList.vue'),
      },
      {
        path: 'config',
        component: () => import('pages/property/PropertyConfig.vue'),
      },
    ],
  },
  {
    path: '/test',
    component: () => import('pages/Test.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
