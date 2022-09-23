import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    meta: {
      isAuthenticated: true,
    },
    component: () => import('pages/common/AppsMenu.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/common/Login.vue'),
  },
  {
    path: '/demands',
    meta: {
      isAuthenticated: true,
      App4: true,
    },
    component: () => import('layouts/DemandLayout.vue'),
    children: [
      {
        path: '',
        name: 'demands',
        component: () => import('pages/demand/DemandsList.vue'),
      },
      {
        path: 'config',
        name: 'demandConfig',
        component: () => import('pages/demand/DemandConfig.vue'),
      },
    ],
  },
  {
    path: '/property',
    meta: {
      isAuthenticated: true,
      App3: true,
    },
    component: () => import('layouts/PropertyLayout.vue'),
    children: [
      {
        path: '',
        name: 'property',
        component: () => import('pages/property/PropertyList.vue'),
      },
      {
        path: 'config',
        name: 'propertyConfig',
        component: () => import('pages/property/PropertyConfig.vue'),
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    meta: {
      isAuthenticated: true,
      isAdmin: true,
    },
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
