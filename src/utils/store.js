/*
 * @Description: 本地缓存
 * @Author: admin
 * @Date: 2020-03-05 15:34:49
 * @LastEditors: admin
 * @LastEditTime: 2020-03-05 15:51:20
 */
import store from 'store2';
import jsCookie from 'js-cookie';

export default store;
export const local = store.local;
export const session = store.session;
export const cookies = jsCookie;
