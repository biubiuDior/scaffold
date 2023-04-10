/*
 * @Description: axios配置
 * @Author: admin
 * @Date: 2020-03-06 09:45:52
 * @LastEditors: wucuiyi
 * @LastEditTime: 2023-03-02 09:28:35
 */
import axios from 'axios';
import { Modal, message } from 'antd';
import qs from 'qs';
import {
  setResponseTime,
  getResponseTime,
  setTokenCache,
  setExpir,
  getExpir,
  removeCache,
} from '@/utils/user';
import { reqrefreshTokenGet } from '@/services/login';
import { formatMessage } from 'umi';
const confirm = Modal.confirm;

window.flag = false; //弹出层标记
var isRefreshing = false; //标记是否在请求刷新token接口
var requests = []; //在请求刷新token接口过程中，把要执行的请求放到数组中

// 请求超时[config]:showTimeout    1.[true]:显示提示 2.["again"]:显示再次提示弹出框
axios.defaults.timeout = 6000;
axios.defaults.withCredentials = true;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';
axios.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'; //Ajax get请求标识
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; //Ajax post请求标识
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; //POST请求参数获取不到的问题
axios.defaults.headers.post['Accept'] = 'application/json'; //POST请求参数获取不到的问题
axios.defaults.headers.put['X-Requested-With'] = 'XMLHttpRequest'; //Ajax put请求标识
axios.defaults.headers.delete['X-Requested-With'] = 'XMLHttpRequest'; //Ajax delete请求标识

axios.interceptors.response.use(
  function(response) {
    setResponseTime(Math.floor(new Date().getTime() / 1000));
    // 用户登录过期，需要刷新token后重新请求接口
    if (
      (response.status == 401 || response.status == 302) &&
      response.data.code == '53000010' &&
      !window.loginWarnflag
    ) {
      return checkRefresh(response);
    }

    // 处理错误信息
    if (
      response.data.code !== 701 &&
      response.data.code != 200 &&
      response.data.code != 1006 &&
      response.data.message
    ) {
      message.destroy();
      message.error(response.data.message);
    }

    return response;
  },
  function(error) {
    // 请求超时[config]:showTimeout    1.[true]:显示提示 2.["again"]:显示再次提示弹出框
    if (
      error.config.showTimeout &&
      error.code == 'ECONNABORTED' &&
      error.message.indexOf('timeout') != -1 &&
      !window.timeoutWarnflag
    ) {
      window.timeoutWarnflag = true; // 标记当前是否有超时提示弹出框
      if (error.config.showTimeout == 'again') {
        const timeoutModal = confirm({
          title: formatMessage({ id: 'component.global.tips' }),
          content: formatMessage({ id: 'component.global.timeout.retry' }),
          onOk: () => {
            timeoutModal.destroy();
            window.timeoutWarnflag = false; // 重置
            return axios.request(error.config);
          },
          onCancel: () => {
            window.timeoutWarnflag = false; // 重置
          },
        });
      } else {
        message.warning(formatMessage({ id: 'component.global.timeout' }), 3, () => {
          window.timeoutWarnflag = false; // 重置
        });
      }
    }
    // 用户登录过期，需要刷新token后重新请求接口
    if (
      error.response &&
      (error.response.status == 401 || error.response.status == 302) &&
      error.response.data &&
      error.response.data.code == '53000010' &&
      !window.loginWarnflag
    ) {
      return checkRefresh(error);
    }

    // 超时
    if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !error.response) {
      error.response = {
        status: 504,
        statusText: 'timeout',
        data: {
          data: false,
          meta: {
            message: formatMessage({ id: 'component.global.timeout' }),
            statusCode: 504,
            success: false,
          },
        },
      };
    }

    return error.response ? error.response : error;
  }
);

axios.interceptors.request.use(function(config) {
  // const user = JSON.parse(Cookies.get("user") || "{}");
  // 没有登录跳到登录页
  // if (!user.userName) {
  //     // 排除路径
  //     let isAuthPath = true; // 是否需认证路径
  //     if (auth.excludePaths && auth.excludePaths.length > 0) {
  //         for (let excludePath of auth.excludePaths) {
  //             let regexp = new RegExp(excludePath);
  //             if (regexp.test(config.url)) {
  //                 isAuthPath = false;
  //             }
  //         }
  //     }

  //     if (isAuthPath) {
  //         if (!window.loginWarnflag) {
  //             window.loginWarnflag = true; // 标记当前是否有登录提示弹出框
  //             const returnUrl = encodeURIComponent(window.location.href); // 登录后需返回的 url
  //             Modal.warning({
  //                 title: "提示",
  //                 key: "1",
  //                 content: "会话已过期！",
  //                 okText: "重新登录",
  //                 onOk() {
  //                     // 清空缓存
  //                     sessionStorage.clear();

  //                     window.loginWarnflag = false; // 重置
  //                     window.location = deployBaseR + `${auth.loginUri}?returnUrl=${returnUrl}`;
  //                 }
  //             });
  //         }
  //         return false;
  //     }
  // }

  let user = JSON.parse(window.sessionStorage.getItem('currentUser'));
  if (user != null) {
    config.headers.post['loginUserOrgId'] = user.orgId;
    config.headers.post['loginUserId'] = user.userId;
    config.headers.get['loginUserId'] = user.userId;
    config.headers.get['loginUserOrgId'] = user.orgId;

    const Authorization = user.tokenId;
    if (Authorization != null && Authorization != '') {
      config.headers.delete['Authorization'] = Authorization;
      config.headers.get['Authorization'] = Authorization;
      config.headers.post['Authorization'] = Authorization;
      config.headers.put['Authorization'] = Authorization;
    }
  }

  //添加请求参数
  config.params = {
    ...(config.params || {}),
    _t: Date.parse(new Date()) / 1000,
  };
  return config;
});
export function checkRefresh(error) {
  var expir = getExpir(); //获取过期时间
  var nowTime = Math.floor(new Date().getTime() / 1000); //当前时间
  var freshTime = getResponseTime(); //最后一次调用接口的时间
  //如果当前时间距离最后一次调用接口的时间小于过期时间则刷新token,否则需要重新登录
  if (nowTime - freshTime < expir) {
    if (!isRefreshing) {
      //刷新token ing
      isRefreshing = true;
      reqrefreshTokenGet()
        .then(res => {
          isRefreshing = false;
          if (res.code == 200) {
            setExpir(res.data.expiration);
            const token = res.data.token || '';
            setTokenCache(token);
            error.config.headers.Authorization = token;
            return token;
          } else {
            expiredTips();
            // console.log('刷新token接口过期');
          }
        })
        .then(token => {
          //刷新token成功，执行队列
          requests.forEach(cb => cb(token));
          // 执行完成后，清空队列
          requests = [];
        })
        .catch(err => {
          console.log(err);
        });
    }
    const retryOriginalRequest = new Promise(resolve => {
      requests.push(token => {
        // 因为config中的token是旧的，所以刷新token后要将新token传进来
        error.config.headers.Authorization = token;
        resolve(axios(error.config));
      });
    });
    return retryOriginalRequest;
  } else {
    expiredTips();
  }
}
export function expiredTips() {
  if (window.loginWarnflag) {
    return;
  }
  window.loginWarnflag = true; // 标记当前是否有登录提示弹出框
  const returnUrl = encodeURIComponent(window.location.href); // 登录后需返回的 url
  var deployBaseR = window.location.protocol;

  Modal.warning({
    title: formatMessage({ id: 'component.global.tips' }),
    key: '1',
    content: formatMessage({ id: 'component.global.session.expired' }),
    okText: formatMessage({ id: 'component.global.re-register' }),
    onOk() {
      // 清空缓存
      removeCache();
      window.loginWarnflag = false; // 重置
      window.location = deployBaseR + `/#/login?returnUrl=${returnUrl}`;
    },
  });
}
export function query(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
/**
 * 频繁调用同一个接口，未返回数据前取消上一个请求（使用方法跟query相似）
 * @param {String} url 接口地址
 * @param {Object | String} params 请求参数
 * @param {Object} config axios配置,设置请求头等
 * @param {Object} axiosCancel 存axios.CancelToken的对象
 * @param {String} cancelVar 取消方法名称
 * @returns Promise
 */
export function queryCancel(url, params, config = {}, axiosCancel, cancelVar) {
  if (typeof axiosCancel[cancelVar] === 'function') {
    axiosCancel[cancelVar]('终止请求');
  }
  config.cancelToken = new axios.CancelToken(function executor(c) {
    axiosCancel[cancelVar] = c;
  });
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params, ...config })
      .then(res => {
        if (res.message == '终止请求') {
          resolve({});
        }
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}
// 导出数据
export function exportDataExcel(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, { ...params }, { responseType: 'blob', ...config })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

// 导出模板
export function exportTemplateExcel(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params, responseType: 'blob', ...config })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
//Excel导入post请求会有post参数也可能有get参数,请求的一些系列配置
export function importExcel(url, datas, config) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

//post请求会有post参数也可能有get参数
export function post(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function postForm(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(datas), { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function get(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function insert(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function update(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function remove(url, datas, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, datas, { params: params, ...config })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function requestAll(...paramsFun) {
  return new Promise((resolve, reject) => {
    axios
      .all(...paramsFun)
      .then(
        axios.spread(function(...response) {
          let responseList = [];
          for (let res of response) {
            if (!res.status && res.response) {
              responseList.push(res.response.data);
            } else {
              responseList.push(res.data);
            }
          }
          return responseList;
        })
      )
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
