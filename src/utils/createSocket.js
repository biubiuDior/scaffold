/*
 * @Description: WebSocket 
 * @Author: admin
 * @Date: 2019-12-24 09:10:42
 * @LastEditors: admin
 * @LastEditTime: 2020-03-05 15:46:54
 */
// import Stomp from 'stompjs'; // https://www.npmjs.com/package/stompjs
// import SockJS from 'sockjs-client'; // https://www.npmjs.com/package/sockjs-client

// let _stompClient = {};
// let times = 0; // 重试次数
// const createSocket = params => {
//   const {
//     url, // WebSocket 地址
//     subscribeUrl, // 订阅地址
//     stomp = {}, // stomp
//     start = Function.prototype,
//     userid,
//     success = Function.prototype,
//     end = Function.prototype,
//     error = Function.prototype,
//     debug = Function.prototype,
//     callback = Function.prototype,
//     max = 3, // 最大重试次数
//   } = params;
//   // 如果已经建立先关闭之前的连接
//   if (_stompClient[url]) {
//     _stompClient[url].disconnect();
//   }
//   // 建立连接对象（还未发起连接）
//   let socket = new SockJS(url);
//   // 获取 STOMP 子协议的客户端对象
//   let stompClient = Stomp.over(socket);
//   // 向服务器发起websocket连接并发送CONNECT帧
//   stompClient.connect(
//     {
//       ...stomp, //可添加客户端的认证信息
//     },
//     frame => {
//       times = 0; //重置重连次数
//       // 成功回调 connectCallback
//       _stompClient[url] = stompClient;
//       callback(stompClient);
//       // 订阅频道
//       stompClient.subscribe(subscribeUrl, function(data) {
//         // 将返回的字符串转对象，再push到列表里
//         let msg = JSON.parse(data.body);
//         // 模拟接口弹出消息，需要放到接口请求后
//         if (msg.status == 'START') {
//           start(msg);
//         }
//         if (msg.status != 'END' && msg.status != 'START') {
//           success(msg);
//         }
//         if (msg.status == 'END') {
//           end(msg);
//           stompClient.disconnect();
//           _stompClient[url] = undefined;
//         }
//       });
//     },
//     errorInfo => {
//       //连接失败时再次调用函数
//       times += 1;
//       if (times <= max) {
//         createSocket(params);
//       }
//       // 失败回调 errorCallBack
//       error(errorInfo);
//     }
//   );
//   stompClient.debug = function(message) {
//     // 屏蔽调试信息
//     debug(message);
//   };
//   return stompClient;
// };

// export default createSocket;
