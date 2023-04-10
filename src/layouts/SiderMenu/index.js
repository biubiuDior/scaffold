import React, { PureComponent, Suspense } from 'react';
import { Layout, Icon } from 'antd';
import classNames from 'classnames';
import Debounce from 'lodash-decorators/debounce';
import { Link, withRouter } from 'umi';
import { Scrollbars, PageLoading } from '@/components';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import styles from './index.less';
import { connect } from 'react-redux';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;
class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  render() {
    const {
      collapsed,
      onCollapse,
      windowH,
			windowW,
      fixSiderbar,
      deductHeight,
      setting: { navTheme: theme },
    } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };
    const SiderMenu = (
      <Suspense fallback={<PageLoading />}>
        <BaseMenu
          {...this.props}
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          {...defaultProps}
        />
      </Suspense>
    );
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={windowW > 1336 ? 200 : 180}
        theme={theme}
        //className="ly-sider"
				className={styles.sider}
      >
				<div className="ly-side-btn-right" onClick={this.toggle}>
					<Icon type="left" rotate={collapsed ? 0 : 180} />
				</div>
        {fixSiderbar ? (
          <Scrollbars
            style={{
              height: windowH - deductHeight,
            }}
          >
            {SiderMenu}
          </Scrollbars>
        ) : (
          SiderMenu
        )}
        {/*<div className="ly-sider-btn-fixed">
          <Icon type="menu-unfold" onClick={this.toggle} rotate={collapsed ? 180 : 0} />
        </div>*/}
      </Sider>
    );
  }
}

export default connect(({ setting }) => ({ deductHeight: setting.deductHeight }))(
  withRouter(SiderMenu)
);
