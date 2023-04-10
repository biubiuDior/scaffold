/*
 * @Description: LyDrawer 抽屉
 * @Author: admin
 * @Date: 2020-03-16 11:13:24
 * @LastEditors: admin
 * @LastEditTime: 2020-03-16 11:25:17
 */
import React from 'react';
import classNames from 'classnames';
import { Drawer } from 'antd';
import { Scrollbars } from '@/components';
import { useWindowSize } from 'react-use';
import './index.less';

const LyDrawer = props => {
  const { className, title, visible, children, bottom, ...other } = props;
  const { height } = useWindowSize();
  // 去掉其他元素的高度
  let diff = 0;
  if (title) {
    diff += 40;
  }
  if (bottom) {
    diff += 50;
  }
  const scrollHeight = height - diff;

  return (
    <Drawer
      className={classNames(className, 'ly-drawer')}
      title={title}
      visible={visible}
      {...other}
    >
      <Scrollbars
        style={{
          height: scrollHeight,
        }}
      >
        <div className="ly-drawer-content">{children}</div>
      </Scrollbars>
      {bottom ? <div className="ly-drawer-bottom">{bottom}</div> : null}
    </Drawer>
  );
};
export default LyDrawer;
