/*
 * @Description: 基础布局
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: wucuiyi
 * @LastEditTime: 2021-10-09 18:04:30
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
import { LyBreadcrumb } from '@/components';
import { Scrollbars } from 'yui2-for-react';
import styles from './index.less';
const { Content } = Layout;

class BasicLayout extends React.PureComponent {
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
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  // 传递props
  getContext() {
    const { location, breadcrumbNameMap, windowH } = this.props;
    return {
      location,
      breadcrumbNameMap,
      windowH,
    };
  }

  // 设置页面标题
  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);
    const { appTitle } = this.props;
    if (!currRouterData) {
      return appTitle;
    }
    // const pageName = formatMessage({
    //   id: currRouterData.locale || currRouterData.name,
    //   defaultMessage: currRouterData.name,
    // });
    const pageName = currRouterData.name;
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
      navTheme,
      children,
      location: { pathname },
      menuData,
      breadcrumbNameMap,
      route: { routes },
      windowH,
      layout: PropsLayout,
      fixedHeader,
      fixSiderbar,
      showChangeThemeBtn,
    } = this.props;
    const isTop = PropsLayout === 'topmenu'; // false; //PropsLayout === 'topmenu';
    const routerConfig = getRouterAuthority(pathname, routes);
    const page = <Authorized authority={routerConfig}>{children}</Authorized>;
    const layout = (
      <Layout className="ly-layout">
        <Header menuData={menuData} logo={logo} {...this.props} />
        {!isTop ? (
          <Layout
            className={classNames({
              'ly-layout-content-fixed': fixedHeader,
            })}
          >
            <SiderMenu
              theme={navTheme}
              onCollapse={this.handleMenuCollapse}
              menuData={menuData}
              {...this.props}
            />
            <Layout>
              <LyBreadcrumb breadcrumbNameMap={breadcrumbNameMap} />
              {fixSiderbar ? (
                <Content className="ly-content">
                  <Scrollbars style={{ height: windowH - 70 }}>{page}</Scrollbars>
                </Content>
              ) : (
                page
              )}
            </Layout>
          </Layout>
        ) : (
          <div
            className={classNames('ly-layout-content-center', {
              'ly-layout-content-fixed': fixedHeader,
            })}
          >
            {page}
          </div>
        )}
      </Layout>
    );
    this.getPageTitle(pathname, breadcrumbNameMap);
    return (
      <React.Fragment>
        <ContainerQuery query={query}>
          {params => (
            <Context.Provider value={this.getContext()}>
              <div className={classNames(params)}>
                {showChangeThemeBtn && <SetColor />}
                {layout}
              </div>
            </Context.Provider>
          )}
        </ContainerQuery>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu }) => ({
  collapsed: global.collapsed,
  windowH: global.windowH,
  windowW: global.windowW,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
