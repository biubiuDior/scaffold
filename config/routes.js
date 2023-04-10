/*
 * @Description: 路由配置
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: wucuiyi
 * @LastEditTime: 2023-03-02 09:17:57
 */
export default [
  {
    path: '/login',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/login',
        name: '登录',
        component: './login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/HeaderLayout',
    routes: [
      {
        path: '/',
        redirect: '/Test',
      },
      {
        path: '/Test',
        name: '测试页面',
        component: './Test',
      },
    ],
  },
];
