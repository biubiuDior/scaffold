import { Modal, message } from 'antd';
import { reqPostLogin, reqPostLogout, reqCasLogin } from '@/services/login';
import { history, formatMessage } from 'umi';
import { reloadAuthorized } from '@/utils/Authorized';
import {
  getTokenCache,
  setTokenCache,
  getUserCache,
  setUserCache,
  getAuthCache,
  setAuthCache,
  removeCache,
  getHashParam,
  setLoginErrCount,
  setExpir,
} from '@/utils/user';

const initState = {
  token: getTokenCache() || '',
  currentUser: getUserCache() || {},
  authorization: getAuthCache() || {},
};

export default {
  namespace: 'login',
  state: {
    ...initState,
  },
/*  subscriptions: {
    setupHistory({ history, dispatch }) {
      // 监听 history 变化，没登录就跳到/login
      if (window.casStatus) {
        return history.listen(({ pathname, search }) => {
          const token = getTokenCache();
          if (!token) {
            if (window.gateway_version && window.location.hash.indexOf('ticket') == -1) {
              window.location.href =
                window.cas_url +
                '?service=' +
                encodeURIComponent(window.location.origin + window.location.pathname + '#/index');
            }
            if (window.location.hash.indexOf('ticket') !== -1) {
              const ticket = getHashParam('ticket');
              const serviceUrl = window.location.origin + window.location.pathname + '#/index';
              dispatch({
                type: 'casLogin',
                payload: { ticket, serviceUrl },
              });
            }
          }
        });
      } else {
        return history.listen(({ pathname, search }) => {
          const token = getTokenCache();
          if (!token && pathname !== '/login') {
            history.replace('/login');
          }
        });
      }
    },
  },*/
  effects: {
    *casLogin({ payload, callback }, { put, call, select }) {
      // 发起登录请求
      const res = yield call(reqCasLogin, payload);
      const { meta, data } = res;
      if (meta.success) {
        yield put({
          type: 'setData',
          payload: { currentUser: data, token: data.tokenId, authorization: data.authorization },
        });

        setUserCache(data);
        setAuthCache(data.authorization || {});
        setTokenCache(data.tokenId);
        // 重置权限
        reloadAuthorized();
        // 跳转首页
        // history.push('/mainPage/NeedOverview');
      } else {
        yield put({
          type: 'clearData',
        });
        message.error(meta.message);
      }
    },
    *fetchLogin({ payload: formData, errCallFunc }, { put, call, select }) {
      // 发起登录请求
      const res = yield call(
        reqPostLogin,
        formData,
        formData.captchaId
          ? {
              headers: { captchaId: formData.captchaId },
            }
          : {}
      );
      const { meta, data } = res;
      if (meta.success) {
        setExpir(data.expiresIn); //存过期时间，单位秒（即多少秒后过期）
        yield put({
          type: 'setData',
          payload: { currentUser: data, token: data.tokenId, authorization: data.authorization },
        });
        setUserCache(data);
        setAuthCache(data.authorization || {});
        setTokenCache(data.tokenId);
        // 重置权限
        reloadAuthorized();
        // 跳转首页
        history.push('/index');
        setLoginErrCount(0);
      } else {
        errCallFunc(meta);
        Modal.error({
          title: formatMessage({ id: 'component.global.login.failed' }),
          content: meta.message,
        });
        yield put({
          type: 'clearData',
        });
      }
    },
    *fetchLoginOut({}, { put, call, select }) {
      const res = yield call(reqPostLogout, {});
      const { meta, data } = res;
      if (meta.success) {
        // 清除缓存
        removeCache();
        yield put({
          type: 'clearData',
        });
        // 跳转登录页
        history.push('/login');
      } else {
        message.error(meta.message);
      }
    },
  },
  reducers: {
    setData(state, { payload }) {
      return { ...state, ...payload };
    },
    clearData(state, {}) {
      return { currentUser: {} };
    },
  },
};
