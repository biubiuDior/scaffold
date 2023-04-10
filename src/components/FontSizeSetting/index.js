/*
 * @Description: 字体大小控制
 * @Author: wucuiyi
 * @Date: 2023-03-08 11:40:37
 * @LastEditors: wucuiyi
 * @LastEditTime: 2023-03-09 10:45:02
 */
import React, { PureComponent } from 'react';
import { getLocale, setLocale, formatMessage, FormattedMessage } from 'umi';
import { Menu } from 'antd';
import classnames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import LyIcon from '../LyIcon';
import { getFontSize, setFontSize } from '@/utils/user';
import { getPxToRemSize } from '@/utils/utils';

export default class FontSizeSetting extends PureComponent {
  state = {
    cacheFontSize: getFontSize(),
    sizeList: [
      {
        name: formatMessage({ id: 'component.global.fontSize.small' }),
        fontSize: 12,
        rootFontSize: 86,
      },
      {
        name: formatMessage({ id: 'component.global.fontSize.standard' }),
        fontSize: 14,
        rootFontSize: 100,
      },
      {
        name: formatMessage({ id: 'component.global.fontSize.large' }),
        fontSize: 16,
        rootFontSize: 114,
      },
    ],
  };
  changeFontSize = rootFontSize => () => {
    document.documentElement.style.fontSize = rootFontSize + 'px';
    setFontSize(rootFontSize);
    this.setState({
      cacheFontSize: rootFontSize,
    });
  };

  render() {
    const { className } = this.props;
    const { cacheFontSize, sizeList } = this.state;
    const fontMenu = (
      <div className="ly-font-size-setting-menu">
        {sizeList.map(item => {
          return (
            <div
              key={item.name}
              className={classnames(
                'ly-font-size-setting-item',
                cacheFontSize == item.rootFontSize ? 'active' : ''
              )}
              style={{ fontSize: item.fontSize }}
              onClick={this.changeFontSize(item.rootFontSize)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    );

    return (
      <HeaderDropdown overlay={fontMenu} placement="bottomLeft">
        <span className={classnames('ly-selectlang-dropdown', className)}>
          <LyIcon type="iconFontSize" title={formatMessage({ id: 'component.global.fontSize' })} />
        </span>
      </HeaderDropdown>
    );
  }
}
