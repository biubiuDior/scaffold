import { query, post, postForm } from '@/utils/AxiosUtil';

let base = 'api';

// 登录
export const reqPostLogin = (params, config) => {
  return postForm(`${base}/login`, params, {}, config);
};
// 退出
export const reqPostLogout = params => {
  return query(`${base}/logout`, params);
};
// 单点登录
export const reqCasLogin = params => {
  return postForm(`cas/login`, params);
};
// 获取验证码
export const getVerificationCode = params => query(`${base}/captchaServlet`, params);

// 刷新token
export const reqrefreshTokenGet = params => {
  return query(`${base}/refreshToken`, params);
};
