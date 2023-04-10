/*
 * @Description:
 * @Author: wucuiyi
 * @Date: 2021-08-30 18:55:34
 * @LastEditors: wucuiyi
 * @LastEditTime: 2021-08-30 18:55:35
 */
import React from 'react';

export default {
  'GET /v1/alerts/records': {
    code: 200,
    data: {
      list: [
        {
          id: 1,
          name: 'cpu使用率',
          severity: 1,
          exprArrFired: [
            { expr: '服务异常>1', value: 2 },
            { expr: 'cpu>90', value: 98 },
          ],
          receiver: '孙运玖',
          fireTime: '2020-11-24 11:20:50',
          channelArr: [
            { channelName: '微信', status: 1 },
            { channelName: '邮箱', status: 0, err: '邮箱地址填写错误，无法正常发送' },
            { channelName: '短信', status: 1 },
          ],
        },
      ],
      total: 168,
    },
  },
};
