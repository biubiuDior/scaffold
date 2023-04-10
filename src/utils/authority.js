/*
 * @Description: 设置、获取权限
 * @Author: admin
 * @Date: 2020-03-06 09:45:52
 * @LastEditors: admin
 * @LastEditTime: 2020-04-13 14:46:12
 */
import { getAuthCache, setAuthCache } from '@/utils/user';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  //   const authorityString = typeof str === 'undefined' ? getAuthCache() : str;
  //   // authorityString could be admin, "admin", ["admin"]
  //   let authority;
  //   try {
  //     authority = JSON.parse(authorityString);
  //   } catch (e) {
  //     authority = authorityString;
  //   }
  //   if (typeof authority === 'string') {
  //     return [authority];
  //   }
  //   return Object.keys(authority) || ['admin'];
  const authority = getAuthCache() || [];
  return authority;
}

export function setAuthority(authority) {
  const _Authority = typeof authority === 'string' ? [authority] : authority;
  return setAuthCache(JSON.stringify(_Authority));
}
