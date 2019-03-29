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
      { path: '/user/confirm-email', component: './User/ConfirmEmail' },
      { path: '/user/forgot-password', component: './User/ForgotPassword' },
      { path: '/user/reset-password', component: './User/ResetPassword' },
      { path: '/user/add-email', component: './User/AddEmail' }
    ],
  },

  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [

      { path: '/', redirect: '/index' },

      //后台首页
      {
        name: 'index',
        icon: 'home',
        path: '/index',
        component: './Home/Index'
      },

      //结果页
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
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

      //异常页
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
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

      //个人页
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
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
        icon: 'inbox',
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
                component: './Catalog/Product/List',
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
                component: './Catalog/Product/Info',
              },
            ],
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
                component: './Catalog/Category/List',
              },
              {
                path: '/catalog/category/add',
                name: 'add',
                component: './Catalog/Category/Add',
              },
              {
                path: '/catalog/category/edit',
                name: 'edit',
                component: './Catalog/Category/Edit',
              },
            ],
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
              },
            ],
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
              },
            ],
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

      // 销售
      {
        name: 'sale',
        icon: 'shopping',
        path: '/sale',
        routes: [
          {
            path: '/sale/order',
            name: 'order',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/sale/order',
                redirect: '/sale/order/list',
              },
              {
                path: '/sale/order/list',
                name: 'list',
                component: './Sale/Order/List',
              },
              {
                path: '/sale/order/add',
                name: 'add',
                component: './Sale/Order/Add',
              },
              {
                path: '/sale/order/edit',
                name: 'edit',
                component: './Sale/Order/Edit',
              },
              {
                path: '/sale/order/detail',
                name: 'detail',
                component: './Sale/Order/Detail',
              },
              {
                path: '/sale/order/shipment',
                name: 'shipment',
                component: './Sale/Order/Shipment',
              },
            ],
          },
          {
            path: '/sale/shipment',
            name: 'shipment',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/sale/shipment',
                redirect: '/sale/shipment/list',
              },
              {
                path: '/sale/shipment/list',
                name: 'list',
                component: './Sale/Shipment/List'
              },
              // {
              //   path: '/sale/shipment/add',
              //   name: 'add',
              //   component: './Sale/Shipment/Add'
              // },
            ],
          },
        ],
      },

      // 系统
      {
        name: 'system',
        icon: 'setting',
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
                component: './System/Country/List',
              },
              {
                path: '/system/country/add',
                name: 'add',
                component: './System/Country/Add',
              },
              {
                path: '/system/country/edit',
                name: 'edit',
                component: './System/Country/Edit',
              },
              {
                path: '/system/country/province',
                name: 'province',
                component: './System/Country/Province',
              },
            ],
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
                component: './System/User/List',
              },
            ],
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
                component: './System/Warehouse/List',
              },
            ],
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
                component: './System/FreightTemplate/List',
              },
              {
                path: '/system/freight-template/setting',
                name: 'setting',
                component: './System/FreightTemplate/Setting',
              },
            ],
          },
          //高级设置
          {
            path: '/system/setting',
            name: 'setting',
            component: './System/Setting/List',
          }
        ],
      },

      // 所有页面配置要放到404之前，否则会报404
      {
        component: '404',
      },
    ],
  },
];
