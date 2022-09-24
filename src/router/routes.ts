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
  {
    path: '/users', component: () => import('layouts/usersLayout.vue'),
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
    path: '/incomes/expends', component: () => import('layouts/incomesExpdsLayout.vue'),
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
