// import { qiankunStart } from 'umi';

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// export default {
//   namespace: 'base',

//   state: {
//     name: 'Qiankun',
//     apps: [],
//   },

//   effects: {
//     *getApps(_, { put }) {
//       /*
//        子应用配置信息获取分同步、异步两种方式
//        同步有两种配置方式，1、app.js导出qiankun对象，2、配置写在umi配置文件中，可通过import @tmp/subAppsConfig获取
//       */
//       console.log('waiting for qiankun start');
//       yield sleep(1000);

//       const apps = [
//         {
//           name: 'app1-umi', // hack
//           entry: 'http://localhost:8011',
//           base: '/app1',
//           mountElementId: 'root-slave',
//         },
//         // {
//         //   name: 'app2',
//         //   entry: 'http://localhost:8002/app2',
//         //   base: '/app2',
//         //   mountElementId: 'root-slave',
//         //   props: {
//         //     testProp: 'test'
//         //   }
//         // }
//       ];
//       console.log(apps);
//       yield put({
//         type: 'getAppsSuccess',
//         payload: {
//           apps,
//         },
//       });

//       // 模拟手动控制 qiankun 启动时机的场景, 需要 defer 配置为 true
//       setTimeout(qiankunStart, 1000);
//     },
//   },

//   reducers: {
//     getAppsSuccess(state, { payload }) {
//       state.apps = payload.apps;
//     },
//   },
// };
