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
    path: '/profile',
    name: 'profile',
    meta: {
      isAuthenticated: true,
    },
    component: () => import('pages/common/user-profile.vue'),
  },
  {
    path: '/password',
    name: 'password',
    meta: {
      isAuthenticated: true,
    },
    component: () => import('pages/common/update-password.vue'),
  },
  {
    path: '/demands',
    meta: {
      title: 'Bureau de contrôle',
      isAuthenticated: true,
      App3: true,
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
      App4: true,
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
  {
    path: '/users', 
    meta: {
      title: 'Gestion des utilisateurs',
      isAuthenticated: true,
     isAdmin:true
    },
    component: () => import('layouts/secondLayout.vue'),
    children:[
      {path: '', component: () => import('pages/manage users/create-user.vue')},
      {path: 'update/:id', component: () => import('pages/manage users/update-user.vue')},
      {path: 'list', component: () => import('pages/manage users/list-users.vue')},
      {path: 'functions', component: () => import('pages/manage users/configuration/manage-function.vue')},
      {path: 'departments', component: () => import('pages/manage users/configuration/manage-department.vue')},
      {path: 'password', component: () => import('pages/manage users/update-password.vue')},
      {path: 'profile', component: () => import('pages/manage users/user-profile.vue')},
    ]
  },
  {
    path: '/incomes/expends',
    meta: {
      title: 'Gestion des Revenus et depenses',
      isAuthenticated: true,
      App2:true
    },
    component: () => import('layouts/secondLayout.vue'),
    children:[
      {path: '', component: () => import('pages/manage incomesExpds/incomes/create-income.vue')},
      {path: 'incomes', component: () => import('pages/manage incomesExpds/incomes/list-incomes-v2.vue')},
      {path: 'u-income/:id', component: () => import('pages//manage incomesExpds/incomes/update-income.vue')},
      {path: 'history-i', component: () => import('pages/manage incomesExpds/incomes/history-incomes.vue')},
      {path: 'c-exp', component: () => import('pages/manage incomesExpds/expenditures/create-expenditure.vue')},
      {path: 'expds', component: () => import('pages/manage incomesExpds/expenditures/list-expenditures-v2.vue')},
      {path: 'u-exp/:id', component: () => import('pages/manage incomesExpds/expenditures/update-expenditure.vue')},
      {path: 'history-e', component: () => import('pages/manage incomesExpds/expenditures/history-expenditures.vue')},
      {path: 'types', component: () => import('pages/manage incomesExpds/configuration/manage-type.vue')},
     

    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
