/*
 * @Description: 默认配置
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: wucuiyi
 * @LastEditTime: 2023-03-09 09:59:44
 */
const navHeight = 60; // 头部导航栏高度
const breadCrumbHeight = 0; // 面包屑高度
const footerHeight = 0; // 页脚高度
module.exports = {
  navTheme: 'light', // nav 菜单主题
  primaryColor: '#397EF0', // 主题色
  appTitle: 'Ly-ui-scaffold', // 页面标题
  logoTitle: '联奕科技', // 页面标题
  layout: 'topmenu', //sidemenu,topmenu
  contentWidth: 'Fixed', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky header
  autoHideHeader: false, // auto hide header
  fixSiderbar: true, // sticky siderbar
  showChangeThemeBtn: false, //是否显示换肤按钮
  showLanguageBtn: true, //是否显国际化按钮
  showFontSizeBtn: true, //是否显字体设置按钮
  tokenCacheKey: 'token', // 用户token
  userCacheKey: 'currentUser', // 用户信息本地缓存key
  authCacheKey: 'authorization', // 用户权限信息本地缓存key
  themeCacheKey: 'custom-antd-primary-color',
  fontSizeCacheKey: 'root-font-size',
  version: 'V2.0.20170512-31058', // 版本
  userExpir: 'userExpir',
  loginErrCount: 'loginErrCount',
  reflashTime: 'reflashTime',
  navHeight, //头部导航栏高度
  breadCrumbHeight, //面包屑高度
  footerHeight, //页脚高度
  deductHeight: navHeight + breadCrumbHeight + footerHeight, //基本扣除高度
};
