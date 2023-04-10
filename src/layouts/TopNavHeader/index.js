/**
 * 顶部菜单布局
 * @author huangzhichan
 * @created 2019/06/25 12:56:34
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import RightContent from '../Header/RightContent';
import BaseMenu from '../SiderMenu/BaseMenu';
import { getFlatMenuKeys } from '../SiderMenu/SiderMenuUtils';
import styles from './style.less';

class TopNavHeader extends Component {
  render() {
    const { theme, logo, logoTitle, contentWidth, menuData } = this.props;
    const maxWidth =
      (contentWidth === 'Fixed' && window.innerWidth > 1200 ? 1200 : window.innerWidth) -
      280 -
      120 -
      40;
    const flatMenuKeys = getFlatMenuKeys(menuData);
    return (
      <div
        className={classNames(styles.head, {
          [styles.light]: theme === 'light',
        })}
      >
        <div
          ref={ref => {
            this.maim = ref;
          }}
          className={classNames(styles.main, {
            [styles.wide]: contentWidth === 'Fixed',
          })}
        >
          <div className={styles.left}>
            <div className={styles.logo} key="logo" id="logo">
              <Link to="/">
                <img src={logo} alt="logo" />
                <h1>{logoTitle}</h1>
              </Link>
            </div>
            <div
              style={{
                maxWidth,
              }}
            >
              <BaseMenu {...this.props} className={styles.menu} flatMenuKeys={flatMenuKeys} />
            </div>
          </div>
          <RightContent {...this.props} />
        </div>
      </div>
    );
  }
}

export default TopNavHeader;
