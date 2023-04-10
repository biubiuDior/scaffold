/*
 * @Description: 基础布局
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-13 18:20:24
 */
import React from 'react';
import { Layout } from 'antd';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'umi';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import Authorized from '@/utils/Authorized';
import { matchParamsPath, getRouterAuthority } from '@/utils/utils';
import logo from '../../assets/images/logo.png';
import Footer from '../Footer';
import Header from '../Header';
import SiderMenu from '../SiderMenu';
import Context from '../MenuContext';
import SetColor from '../SetColor';
import { query } from '@/config/global';
import { LyBreadcrumb, Scrollbars } from '@/components';
import { getFlatMenuKeys } from '../SiderMenu/SiderMenuUtils';
const { Content } = Layout;

class SideLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.matchParamsPath = memoizeOne(matchParamsPath, isEqual);
    this.getPageTitle = memoizeOne(this.getPageTitle);
  }
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'setting/getSetting',
    });

    dispatch({
      type: 'menu/getSideMenuData',
      payload: { routes, authority },
    });
  }

  // 传递props
  getContext() {
    const {
      location,
      menu: { breadcrumbNameMap },
      windowH,
    } = this.props;
    return {
      location,
      breadcrumbNameMap,
      windowH,
    };
  }

  // 设置页面标题
  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);
    const {
      setting: { appTitle },
    } = this.props;
    if (!currRouterData) {
      return appTitle;
    }
    // const pageName = formatMessage({
    //   id: currRouterData.locale || currRouterData.name,
    //   defaultMessage: currRouterData.name,
    // });
    const pageName = currRouterData;
    const title = `${pageName} - ${appTitle}`;
    setTimeout(() => {
      document.title = title;
    });
  };

  // 切换菜单开关
  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      children,
      setting: { layout: PropsLayout, fixedHeader, fixSiderbar, showChangeThemeBtn, deductHeight },
      location: { pathname },
      menu: { sideMenuData, breadcrumbNameMap },
      route: { routes },
      windowH,
      // deductHeight,
    } = this.props;
    const isTop = PropsLayout === 'topmenu'; // false; //PropsLayout === 'topmenu';
    const routerConfig = getRouterAuthority(pathname, routes);
    const page = <Authorized authority={routerConfig}>{children}</Authorized>;
    const flatMenuKeys = getFlatMenuKeys(sideMenuData);
    const layout = (
      <Layout className="ly-side-layout">
        <SiderMenu
          {...this.props}
          flatMenuKeys={flatMenuKeys}
          menuData={sideMenuData}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          {/*<LyBreadcrumb breadcrumbNameMap={breadcrumbNameMap} />*/}
          {fixSiderbar ? (
            <Content className="ly-content">
              <Scrollbars style={{ height: windowH - deductHeight }}>{page}</Scrollbars>
            </Content>
          ) : (
            page
          )}
        </Layout>
      </Layout>
    );
    this.getPageTitle(pathname, breadcrumbNameMap);
    return (
      <React.Fragment>
        <Context.Provider value={this.getContext()}>
          {/* <LyBreadcrumb breadcrumbNameMap={breadcrumbNameMap} /> */}
          {layout}
        </Context.Provider>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu }) => ({
  collapsed: global.collapsed,
  windowH: global.windowH,
  setting,
  menu,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <SideLayout {...props} isMobile={isMobile} />}
  </Media>
));
