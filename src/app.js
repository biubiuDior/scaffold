import { animationFramePolyfill, setRootFontSize } from '@/utils/utils';
import React from 'react';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import zh_CN from 'antd/es/locale/zh_CN';
import en_US from 'antd/es/locale/en_US';
import { getLocale } from 'umi';
animationFramePolyfill();

moment.locale('zh-cn');
setRootFontSize()

const languages = {
  'zh-CN': zh_CN,
  'en-US': en_US,
};
const ConfigLocale = props => {
  const selectedLang = getLocale();
  return <ConfigProvider locale={languages[selectedLang]}>{props.children}</ConfigProvider>;
};

export function rootContainer(container) {
  return React.createElement(ConfigLocale, null, container);
}

// export const qiankun = {
//   // 应用加载之前
//   async bootstrap(props) {
//     console.log('app1 bootstrap', props);
//   },
//   // 应用 render 之前触发
//   async mount(props) {
//     console.log('app1 mount', props);
//   },
//   // 应用卸载之后触发
//   async unmount(props) {
//     console.log('app1 unmount', props);
//   },
// };
