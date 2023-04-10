/*
 * @Description: 底部信息
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: admin
 * @LastEditTime: 2020-03-13 18:05:44
 */
import React, { Fragment } from 'react';
import { connect } from 'umi';
import classNames from 'classnames';
import { Layout, Icon } from 'antd';
import './index.less';

const { Footer } = Layout;
const FooterView = props => {
  const { className, version, ...rest } = props;
  return (
    <Footer className={classNames('ly-footer', className)}>
      Copyright © 2014-2018 LIANYI TECHNOLOGY CO.,LTD. All Rights Reserved. 联奕科技有限公司（
      {version}）
    </Footer>
  );
};

export default connect(({ setting }) => ({
  ...setting,
}))(FooterView);
