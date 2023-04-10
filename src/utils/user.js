/*
 * @Description: 用户信息、权限本地缓存
 * @Author: admin
 * @Date: 2020-03-06 09:45:52
 * @LastEditors: wucuiyi
 * @LastEditTime: 2023-03-09 09:45:11
 */
import config from '../../config/defaultSettings';
import { local, session } from './store';

// 用户信息缓存key
const {
  tokenCacheKey,
  userCacheKey,
  authCacheKey,
  userExpir,
  loginErrCount,
  reflashTime,
  themeCacheKey,
  fontSizeCacheKey,
} = config;

/**
 * 获取登录token缓存
 * @returns {object}
 */
export function getTokenCache() {
  return session.get(tokenCacheKey) || '';
}

/**
 * 设置登录token缓存
 * @param {*} key
 */
export function setTokenCache(key) {
  session.set(tokenCacheKey, key);
}

/**
 * 清除登录token缓存
 */
export function removeTokenCache() {
  session.remove(tokenCacheKey);
}

/**
 * 获取登录缓存
 * @returns {object}
 */
export function getUserCache() {
  return session.get(userCacheKey) || {};
}

/**
 * 设置登录缓存
 * @param {*} key
 */
export function setUserCache(key) {
  session.set(userCacheKey, key);
}

/**
 * 清除登录缓存
 */
export function removeUserCache() {
  session.remove(userCacheKey);
}

/**
 * 获取权限缓存
 * @returns {object}
 */
export function getAuthCache() {
  return session.get(authCacheKey) || {};
}

/**
 * 设置权限缓存
 * @param {*} key
 */
export function setAuthCache(key) {
  session.set(authCacheKey, key);
}

/**
 * 清除权限缓存
 */
export function removeAuthCache() {
  session.remove(authCacheKey);
}

/**
 *设置最后一次调用接口时间
 */
export function setResponseTime(key) {
  session.set(reflashTime, key);
}

/**
 * 获取最后一次调用接口时间
 * @returns {object}
 */
export function getResponseTime() {
  return session.get(reflashTime) || 0;
}

/**
 * 设置过期时间
 */
export function setExpir(key) {
  session.set(userExpir, key);
}

/**
 * 获取过期时间
 * @returns {object}
 */
export function getExpir() {
  return session.get(userExpir) || 0;
}

/**
 * 设置登录账号密码错误次数
 */
export function setLoginErrCount(key) {
  local.set(loginErrCount, key);
}

/**
 * 获取登录账号密码错误次数
 * @returns {object}
 */
export function getLoginErrCount() {
  return local.get(loginErrCount) || 0;
}

/**
 * 清除缓存
 */
export function removeCache() {
  session.remove();
}
/**
 * 获取主题色
 */
export function getThemeCache() {
  return local.get(themeCacheKey);
}

/**
 * 设置字号缓存
 */
export function setFontSize(key) {
  local.set(fontSizeCacheKey, key);
}

/**
 * 获取字号缓存
 * @returns {object}
 */
export function getFontSize() {
  return local.get(fontSizeCacheKey);
}

/**
 * 获取url参数
 * @param {*} name
 * @returns
 */
export const getHashParam = name => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
    queryString = window.location.href.split('?')[1] || '',
    result = queryString.match(reg);
  return result ? decodeURIComponent(result[2]) : null;
};
