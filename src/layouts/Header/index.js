/*
 * @Description: 头部信息
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-06 16:08:56
 */
import React, { PureComponent } from 'react';
import { Layout, message, Icon } from 'antd';
import Animate from 'rc-animate';
import { history, connect, Link } from 'umi';
import RightContent from './RightContent';
import styles from './index.less';
import BaseMenu from '../SiderMenu/BaseMenu';
import classNames from 'classnames';
import logo from '../../assets/images/logo.png';
import { getFlatMenuKeys } from '../SiderMenu/SiderMenuUtils';

const { Header } = Layout;

class HeaderView extends PureComponent {
  state = {
    visible: true,
  };
  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }
  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }
  handScroll = () => {
    const { autoHideHeader, fixedHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader || !fixedHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  // 用户下拉菜单
  onMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'logout') {
      dispatch({
        type: 'login/fetchLoginOut',
      });
    }
  };
  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'logout') {
      dispatch({
        type: 'login/fetchLoginOut',
      });
    }
  };
  render() {
    const {
      setting: { contentWidth, logoTitle, layout, navTheme, fixedHeader },
      menu: { navMenuData },
      login: { currentUser },
      handleMenuCollapse,
    } = this.props;

    const { visible } = this.state;
    const isTop = layout === 'topmenu'; // false; //layout === 'topmenu'
    const flatMenuKeys = getFlatMenuKeys(navMenuData);

    return (
      <Animate component="" transitionName="fade">
        {visible ? (
          <div
            className={classNames(
              'ly-layout-header',
              { 'ly-layout-header-side': !isTop },
              { 'ly-layout-header-fixed': fixedHeader }
            )}
          >
            <Header>
              <div className={classNames(styles.head)}>
                <div
                  ref={ref => {
                    this.maim = ref;
                  }}
                  className={`${styles.main}`}
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
                    <div className={styles.nav}>
                      <BaseMenu
                        onCollapse={handleMenuCollapse}
                        mode="horizontal"
                        menuData={navMenuData}
                        className={styles.menu}
                        flatMenuKeys={flatMenuKeys}
                      />
                    </div>
                  </div>
                  <RightContent currentUser={currentUser} onMenuClick={this.handleMenuClick} />
                </div>
              </div>
            </Header>
          </div>
        ) : null}
      </Animate>
    );
  }
}

export default connect(({ login, setting, menu }) => ({
  login,
  setting,
  menu,
}))(HeaderView);
