const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var path = require('path');
// var AntDesignThemePlugin = require('antd-theme-webpack-plugin');

// 主题配置
// const themeOptions = {
//   antDir: path.join(__dirname, '../node_modules/antd'),
//   stylesDir: path.join(__dirname, '../src/assets/css'),
//   varFile: path.join(__dirname, '../src/assets/css/var.less'),
//   mainLessFile: path.join(__dirname, '../src/assets/css/empty.less'),
//   themeVariables: ['@primary-color'],
//   indexFileName: false,
//   // outputFilePath: path.join(__dirname, '../public/color.less'),
//   publicPath: '.',
// };

// const themePlugin = new AntDesignThemePlugin(themeOptions);

/**
 * memo，当前 webpack-chain对象
 * env，当前环境，development、production 或 test 等
 * webpack，webpack 实例，用于获取其内部插件
 * createCSSRule，用于扩展其他 CSS 实现，比如 sass, stylus
 * @param {*} memo
 * @param {*} { env, webpack, createCSSRule }
 */
const webpackConfig = (memo, { env, webpack, createCSSRule }) => {
  // 缓存，加快项目启动
  memo.cache(true);

  // 设置 alias
  // memo.resolve.alias.set('foo', '/tmp/a/b/foo');
  memo.plugin('lodash-webpack-plugin').use(LodashModuleReplacementPlugin, [{ paths: true }]);
  // memo.plugin('antd-theme-webpack-plugin').use(AntDesignThemePlugin, [themeOptions]);

  // 分包
  memo.optimization.splitChunks({
    chunks: 'all',
    automaticNameDelimiter: '.', // 文件名分隔符
    name: true,
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 10,
    maxInitialRequests: 5,
    cacheGroups: {
      antd: {
        name: 'antd',
        chunks: 'all',
        test: /(antd|@ant-design|dynamic-antd-theme)/,
        priority: 10,
      },
      lodash: {
        name: 'lodash',
        chunks: 'all',
        test: /(lodash|lodash-decorators)/,
        priority: 10,
      },
      echarts: {
        name: 'echarts',
        chunks: 'all',
        test: /(echarts)/,
        priority: 11,
      },
      vendors: {
        name: 'vendors',
        chunks: 'all',
        test: /(moment|react-dom|axios|zrender|immutable|redux|redux-saga|dva|qs|draft-js|fbjs)/,
        priority: 11,
      },
      rcVendors: {
        name: 'rcVendors',
        chunks: 'all',
        test: /(rc-)/,
        priority: 11,
      },
    },
  });

  // if (env === 'production') {
  //   // 生产模式开启
  //   memo.plugin('compression-webpack-plugin').use(
  //     new CompressionWebpackPlugin({
  //       // filename: 文件名称，这里我们不设置，让它保持和未压缩的文件同一个名称
  //       algorithm: 'gzip', // 指定生成gzip格式
  //       test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'), // 匹配哪些格式文件需要压缩
  //       threshold: 10240, //对超过10k的数据进行压缩
  //       minRatio: 0.6, // 压缩比例，值为0 ~ 1
  //     })
  //   );
  // }
};

export default webpackConfig;
