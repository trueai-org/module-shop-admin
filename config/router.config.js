export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },

      // 商品目录
      {
        name: 'catalog',
        icon: 'table',
        path: '/catalog',
        routes: [
          {
            path: '/catalog/product',
            name: 'product',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/catalog/product',
                redirect: '/catalog/product/list',
              },
              {
                path: '/catalog/product/list',
                name: 'list',
                component: './Catalog/Product/List'
              },
              // {
              //   path: '/catalog/product/add',
              //   name: 'add',
              //   component: './Catalog/Product/Add'
              // },
              // {
              //   path: '/catalog/product/edit',
              //   name: 'edit',
              //   component: './Catalog/Product/Edit'
              // },
              {
                path: '/catalog/product/info',
                name: 'info',
                component: './Catalog/Product/Info'
              },
            ]
          },
          {
            path: '/catalog/category',
            name: 'category',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/catalog/category',
                redirect: '/catalog/category/list',
              },
              {
                path: '/catalog/category/list',
                name: 'list',
                component: './Catalog/Category/List'
              },
              {
                path: '/catalog/category/add',
                name: 'add',
                component: './Catalog/Category/Add'
              },
              {
                path: '/catalog/category/edit',
                name: 'edit',
                component: './Catalog/Category/Edit',
              },
            ]
          },
          {
            path: '/catalog/brand',
            name: 'brand',
            component: './Catalog/Brand/List',
          },
          {
            path: '/catalog/product-option',
            name: 'product-option',
            // component: './Catalog/ProductAttribute/List',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/catalog/product-option',
                redirect: '/catalog/product-option/list',
              },
              {
                path: '/catalog/product-option/list',
                name: 'list',
                component: './Catalog/ProductOption/List',
              },
              {
                path: '/catalog/product-option/data',
                name: 'data',
                component: './Catalog/ProductOption/Data',
              }
            ]
          },
          {
            path: '/catalog/product-attribute-group',
            name: 'product-attribute-group',
            component: './Catalog/ProductAttributeGroup/List',
          },
          {
            path: '/catalog/product-attribute',
            name: 'product-attribute',
            // component: './Catalog/ProductAttribute/List',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/catalog/product-attribute',
                redirect: '/catalog/product-attribute/list',
              },
              {
                path: '/catalog/product-attribute/list',
                name: 'list',
                component: './Catalog/ProductAttribute/List',
              },
              {
                path: '/catalog/product-attribute/data',
                name: 'data',
                component: './Catalog/ProductAttribute/Data',
              }
            ]
          },
          {
            path: '/catalog/product-attribute-template',
            name: 'product-attribute-template',
            component: './Catalog/ProductAttributeTemplate/List',
          },
          {
            path: '/catalog/unit',
            name: 'unit',
            component: './Catalog/Unit/List',
          },
        ],
      },


      // 系统
      {
        name: 'system',
        icon: 'table',
        path: '/system',
        routes: [
          {
            path: '/system/country',
            name: 'country',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/system/country',
                redirect: '/system/country/list',
              },
              {
                path: '/system/country/list',
                name: 'list',
                component: './System/Country/List'
              },
              {
                path: '/system/country/add',
                name: 'add',
                component: './System/Country/Add'
              },
              {
                path: '/system/country/edit',
                name: 'edit',
                component: './System/Country/Edit'
              },
              {
                path: '/system/country/province',
                name: 'province',
                component: './System/Country/Province'
              },
            ]
          },

          //用户
          {
            path: '/system/user',
            name: 'user',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/system/user',
                redirect: '/system/user/list',
              },
              {
                path: '/system/user/list',
                name: 'list',
                component: './System/User/List'
              }
            ]
          },

          //仓库
          {
            path: '/system/warehouse',
            name: 'warehouse',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/system/warehouse',
                redirect: '/system/warehouse/list',
              },
              {
                path: '/system/warehouse/list',
                name: 'list',
                component: './System/Warehouse/List'
              }
            ]
          },

          //运费模板
          {
            path: '/system/freight-template',
            name: 'freight-template',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/system/freight-template',
                redirect: '/system/freight-template/list',
              },
              {
                path: '/system/freight-template/list',
                name: 'list',
                component: './System/FreightTemplate/List'
              },
              {
                path: '/system/freight-template/setting',
                name: 'setting',
                component: './System/FreightTemplate/Setting'
              }
            ]
          },
        ],
      },

      // 所有页面配置要放到404之前，否则会报404
      {
        component: '404',
      },
    ],
  },
];
