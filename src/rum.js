import { init as initApm } from '@elastic/apm-rum';
const svc = window.apmHost || '192.168.34.136:50081'; //环境变量apmHost控制apm服务ip
const index = svc.lastIndexOf(':');
const svcIp = svc.substr(0, index);
const serverUrl = '//' + svcIp + ':8200';
const apm = initApm({
  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'ly-ui-scaffold-ui', //前端服务名称
  // Set the version of your application
  // Used on the APM Server to find the right sourcemap
  serviceVersion: '0.90',
  // Set custom APM Server URL (default: http://localhost:8200)
  // apm服务地址，环境变量apmEnable控制是否接入运维监控平台
  serverUrl: window.apmEnable == 'true' ? serverUrl : '',
});

export default apm;
