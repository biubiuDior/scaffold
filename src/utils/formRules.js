/*
 * @Description: 校验规则
 * @Author: huangzc
 * @Date: 2020-07-21 20:16:06
 * @LastEditors: wucuiyi
 * @LastEditTime: 2021-03-02 09:37:52
 */
const formRules = {
  PHONE_NUMBER: {
    pattern: /^1[3456789]\d{9}$/g,
    message: '请输入正确的手机号',
  },
  EMAIL: {
    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: '请输入正确的邮箱地址',
  },
  NOTCHINESE: {
    pattern: /^[a-zA-Z0-9-_.]+$/,
    message: '只能包含大小写字母、数字、点、中横线及下划线',
  },
  IP_CHECK: {
    pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
    message: '请输入正确的IP地址',
  },
};
export default formRules;
