# ly-ui-scaffold 

## 更新
[更新日志](./update.md)
## 配置说明
1.项目配置可查看umi[文档](https://v2.umijs.org/zh/)

2.在umi使用dva数据流[umi文档](https://v2.umijs.org/zh/guide/with-dva.html#%E7%89%B9%E6%80%A7)、[dva官网](https://dvajs.com/)

3.使用mock模拟请求[文档](http://mockjs.com/)

## 文件目录
<pre><code>
├── node_modules:                   模块文件夹
|   └── ...             
├── dist:                           打包生成目录
├── config:                         配置文件
├── e2e:                            自动化测试
├── mock:                           接口模拟
├── public:                         静态文件
├── script:                         脚本文件
├── tests:                          测试文件
├── src:                            开发目录
|   ├── assets:                     静态文件
|   ├── components:                 组件
|   ├── layout:                     布局
|   |   ├── BasicLayout:            基础布局
|   |   ├── BlankLayout:            空白布局
|   |   ├── Footer:                 底部信息
|   |   ├── Header:                 头部信息
|   |   ├── UserLayout:             用户布局
|   ├── locales:                    国际化配置
|   |   ├── en-US.js:               英文
|   |   ├── zh-CN.js:               中文
|   ├── models:                     dva全局model
|   |   ├── base.js:                微前端model(暂未使用)
|   |   ├── global.js:              公共model
|   |   ├── login.js:               登录model
|   |   ├── menu.js:                菜单model
|   |   ├── setting.js:             设置model
|   ├── pages:                      页面
|   |   ├── login:                  登录页
|   |   ├── document.ejs:           html页面
|   ├── services:                   请求服务
|   ├── utils:                      工具类
|   |   ├── authority.js:           权限控制
|   |   ├── AxiosUtil.js:           axios封装
|   |   ├── createSocket.js:        websocket
|   |   ├── store.js:               本地缓存封装
|   |   ├── user.js:                用户缓存操作
|   |   ├── utils.js:               工具方法
|   └── defaultSettings.js:         默认配置
|   └── index.less:                 全局样式
|   └── index.js:                   入口文件
├── .editorconfig                   编辑器配置
├── .env                            本地运行配置(host、port)
├── .eslintrc.js                    eslint
├── .gitignore                      git忽略文件
├── .prettierrc                     代码美化配置
├── package.json                    项目依赖 npm
├── README.MD                       项目信息
├── tsconfig                        ts配置
└── webpack.config.js               webpack配置文件
</code></pre>


## 使用

### 使用命令行
```bash
$ npm install
$ npm start
```
