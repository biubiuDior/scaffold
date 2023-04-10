/*
 * @Description: 国际化按钮
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: wucuiyi
 * @LastEditTime: 2023-03-09 09:59:27
 */
import React, { PureComponent } from 'react';
import { getLocale, setLocale, formatMessage, FormattedMessage } from 'umi';
import { Menu, Icon } from 'antd';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export default class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    setLocale(key);
  };

  render() {
    const { className } = this.props;
    const selectedLang = getLocale();
    const langMenu = (
      <Menu className="ly-selectlang-menu" selectedKeys={[selectedLang]} onClick={this.changeLang}>
        <Menu.Item key="zh-CN">
          <span role="img" aria-label="简体中文">
            🇨🇳
          </span>{' '}
          简体中文
        </Menu.Item>
        <Menu.Item key="en-US">
          <span role="img" aria-label="English">
            🇬🇧
          </span>{' '}
          English
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown overlay={langMenu} placement="bottomLeft">
        <span className={classNames('ly-selectlang-dropdown', className)}>
          <Icon type="global" title={formatMessage({ id: 'navBar.lang' })} />
        </span>
      </HeaderDropdown>
    );
  }
}
