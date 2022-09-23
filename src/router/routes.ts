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
      title: 'Bureau de contrôle',
      isAuthenticated: true,
      App4: true,
    },
    component: () => import('layouts/Layout.vue'),
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
      title: 'Les propriétés privé/publique',
      isAuthenticated: true,
      App3: true,
    },
    component: () => import('layouts/Layout.vue'),
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
      title: 'test page',
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
