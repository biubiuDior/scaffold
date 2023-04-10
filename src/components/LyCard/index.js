/*
 * @Description: LyCard 卡片
 * @Author: qizc
 * @Date: 2018-10-29 14:33:56
 * @LastEditors: admin
 * @LastEditTime: 2020-04-13 15:22:38
 */
import React from 'react';
import classNames from 'classnames';
import { Card, Icon } from 'antd';
import { Scrollbars } from '@/components';
import './style.less';

const LyCard = props => {
  const {
    className,
    title,
    height = 328, //卡片高度
    bordered = false, // 是否有边框
    isScroll = false, // 是否有滚动条
    children,
    ...other
  } = props;

  // 自适应高度
  let innerHeight = 'auto';
  if (typeof height === 'number') {
    innerHeight = title ? height - 48 : height - 28;
  }

  const cardInner = isScroll ? (
    <Scrollbars style={{ height: innerHeight, width: '100%' }}>
      <div className="ly-card-inner">{children}</div>
    </Scrollbars>
  ) : (
    <div className="ly-card-inner" style={{ height: innerHeight, width: '100%' }}>
      {children}
    </div>
  );

  return (
    <div className={classNames('ly-card', className)} style={{ height: height }}>
      <Card
        title={title}
        extra={<Icon type="ellipsis" style={{ fontSize: 20 }} />}
        bordered={bordered}
        {...other}
      >
        {cardInner}
      </Card>
    </div>
  );
};

export default LyCard;
