/*
 * @Description: 区块插件，暂时无法使用
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: admin
 * @LastEditTime: 2020-03-09 11:41:31
 */
import { fetchBlockList, fetchUmiBlock } from 'umi-build-dev/lib/plugins/commands/block/util.js';

export default (api, opts) => {
  let resources = [
    {
      id: 'Yui',
      name: 'Yui',
      resourceType: 'custom',
      description: 'Yui 基于 antd 的中台模板。',
      blockType: 'template',
      icon: 'https://img.alicdn.com/tfs/TB1e8gomAL0gK0jSZFAXXcA9pXa-64-64.png',
      getData: () => fetchBlockList('ant-design/pro-blocks'),
    },
    {
      id: 'Yui-blocks',
      name: 'Yui Blocks',
      resourceType: 'custom',
      description: 'Yui 来自 antd 的 Demo 区块',
      blockType: 'block',
      icon: 'https://img.alicdn.com/tfs/TB1e8gomAL0gK0jSZFAXXcA9pXa-64-64.png',
      getData: () => fetchBlockList('ant-design/ant-design-blocks'),
    },
    // {
    //   id: 'umi-blocks',
    //   name: 'Umi Community',
    //   resourceType: 'custom',
    //   description: 'Yui 来自 Umi 社区的区块',
    //   blockType: 'block',
    //   icon: 'https://img.alicdn.com/tfs/TB1HMEpmuH2gK0jSZFEXXcqMpXa-64-64.png',
    //   getData: () => fetchUmiBlock('https://blocks.umijs.org/blocks.json'),
    // },
    // {
    //   id: 'umi-blocks-template',
    //   name: 'Umi Community',
    //   resourceType: 'custom',
    //   description: 'Yui 来自 Umi 社区的模板。',
    //   blockType: 'template',
    //   icon: 'https://img.alicdn.com/tfs/TB1HMEpmuH2gK0jSZFEXXcqMpXa-64-64.png',
    //   getData: () => fetchUmiBlock('https://blocks.umijs.org/templates.json'),
    // },
  ];
  api.addBlockUIResource(resources);
};
