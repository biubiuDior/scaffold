// ref: https://umijs.org/config/
import { defineConfig, utils } from 'umi';
import webpackConfig from './webpack.config';
const { winPath } = utils;
import pxtorem from 'postcss-pxtorem';

import { primaryColor } from './defaultSettings';
import routes from './routes';

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
export default defineConfig({
  extraPostCSSPlugins: [
    pxtorem({
      rootValue: 100, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多少px了。
      unitPrecision: 5,
      propList: [
        'font-size',
        'padding',
        'padding-left',
        'padding-right',
        'padding-top',
        'padding-bottom',
        'margin',
        'margin-left',
        'margin-right',
        'margin-top',
        'margin-bottom',
      ],
      exclude: false, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。
      selectorBlackList: ['.ly-selectlang-dropdown'], //要忽略并保留为px的选择器
      replace: true, //（布尔值）替换包含REM的规则，而不是添加回退
      mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
      minPixelValue: 4, //设置要替换的最小像素值(3px会被转rem)。 默认 0
    }),
  ],
  extraBabelPlugins: [IS_PROD ? 'transform-remove-console' : ''],
  plugins: [
    // ['@umijs/plugin-qiankun'],
    //   [
    //     'umi-plugin-pro-block',
    //     {
    //       moveMock: false,
    //       moveService: false,
    //       modifyRequest: true,
    //       autoAddMenu: true,
    //     },
    //   ],
    // './config/blocks',
  ],
  title: '联奕科技',
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default false
    default: 'zh-CN',
    // default zh-CN
    baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  // 分包的模块，不加入umi会导致白屏
  chunks: ['antd', 'lodash', 'echarts', 'vendors', 'rcVendors', 'umi'],
  targets: {
    ie: 9,
  },
  hash: true,
  /**
   * 路由相关配置
   */
  routes: routes,
  history: {
    type: 'hash',
  },
  mountElementId: 'root',
  // base: '/app1',
  // outputPath: `./dist/app1`,
  publicPath: `./`,
  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  externals: {
    // '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  cssLoader: {
    // 这里的 modules 可以接受 getLocalIdent
    modules: {
      getLocalIdent: (context, _, localName) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          let arr = winPath(antdProPath)
            .split('/')
            .map(a => a.replace(/([A-Z])/g, '-$1'))
            .map(a => a.toLowerCase());
          arr = arr.filter(i => i != '');
          return `${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    },
  },
  proxy: {
    '/api': {
      target: 'http://192.168.35.12:380',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  chainWebpack: webpackConfig,
});
