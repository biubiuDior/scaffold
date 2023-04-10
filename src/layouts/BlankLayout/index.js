/*
 * @Description: 空白布局
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-19 17:08:08
 */
import React from 'react';
import { Layout } from 'antd';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'umi';
import { matchParamsPath, getRouterAuthority } from '@/utils/utils';
import Context from '../MenuContext';
import { Scrollbars } from '@/components';
const { Content } = Layout;

class BlankLayout extends React.PureComponent {
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
  }

  // 传递props
  getContext() {
    const { location, windowH } = this.props;
    return {
      location,
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
    const pageName = currRouterData;
    const title = `${pageName} - ${appTitle}`;
    setTimeout(() => {
      document.title = title;
    });
  };

  render() {
    const {
      children,
      location: { pathname },
      route: { routes },
      breadcrumbNameMap,
    } = this.props;
    const routerConfig = getRouterAuthority(pathname, routes);
    this.getPageTitle(pathname, breadcrumbNameMap);

    return (
      <React.Fragment>
        <Context.Provider value={this.getContext()}>
          <div className="ly-layout-blank" style={{ height: '100%' }}>
            <Scrollbars>{children}</Scrollbars>
          </div>
        </Context.Provider>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu }) => ({
  windowH: global.windowH,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))(BlankLayout);
