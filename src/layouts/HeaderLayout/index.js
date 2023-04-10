/*
 * @Description: 基础布局
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-13 18:19:05
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
import Header from '../Header';
import SiderMenu from '../SiderMenu';
import Context from '../MenuContext';
import SetColor from '../SetColor';
import { query } from '@/config/global';
import { Scrollbars } from '@/components';
import styles from './index.less';
import Footer from '@/layouts/Footer';
const { Content } = Layout;

class HeaderLayout extends React.PureComponent {
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
      type: 'menu/getNavMenuData',
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
      location: { pathname },
      route: { routes },
      menu: { breadcrumbNameMap },
      setting: { fixedHeader, fixSiderbar, showChangeThemeBtn, layout: settingLayout },
      windowH,
    } = this.props;
    const isTop = settingLayout === 'topmenu'; // false; //settingLayout === 'topmenu';
    const routerConfig = getRouterAuthority(pathname, routes);
    const page = <Authorized authority={routerConfig}>{children}</Authorized>;
    const layout = (
      <Layout className="ly-layout" style={{ height: '100%' }}>
        {/* 头部导航栏 */}
        <Header {...this.props} />
        {/* 页面区域 */}
        <Layout
          className={classNames('ly-layout-content-center', {
            'ly-layout-content-fixed': fixedHeader,
          })}
        >
          <Scrollbars> {page}</Scrollbars>
        </Layout>
        {/* 页脚 */}
        {/* <Footer /> */}
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
  windowH: global.windowH,
  menu,
  setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <HeaderLayout {...props} isMobile={isMobile} />}
  </Media>
));
