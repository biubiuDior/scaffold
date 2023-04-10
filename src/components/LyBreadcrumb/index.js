/*
 * @Description: 面包屑
 * @Author: admin
 * @Date: 2020-03-10 14:00:40
 * @LastEditors: wucuiyi
 * @LastEditTime: 2023-03-02 09:36:38
 */
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Breadcrumb, Icon } from 'antd';
import { FormattedMessage } from 'umi';
import './index.less';

const Item = Breadcrumb.Item;

@withRouter
export default class LyBreadcrumb extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      className,
      showHome = false, // 显示home按钮
      hideLabel = false, // 隐藏label
      location,
      breadcrumbNameMap,
    } = this.props;

    // 处理面包屑
    let newBreadcrumbNameMap = {};
    for (const key in breadcrumbNameMap) {
      if (breadcrumbNameMap.hasOwnProperty(key)) {
        const element = breadcrumbNameMap[key];
        newBreadcrumbNameMap[key] = element.name;
      }
    }

    // 处理pathname获取面包屑
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets
      .map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const name = newBreadcrumbNameMap[url];
        if (name) {
          // 相同的路径不可跳转
          return (
            <Item key={url}>{url === location.pathname ? name : <Link to={url}>{name}</Link>}</Item>
          );
        }
      })
      .filter(item => item);

    const breadcrumbItems = [].concat(extraBreadcrumbItems);

    return (
      <div className={classNames(className, 'ly-Breadcrumb')}>
        {/* 是否需要显示home按钮 */}
        {showHome ? (
          <Link to="/" className="ly-Breadcrumb-home">
            <Icon type="home" />
          </Link>
        ) : null}
        {!hideLabel ? (
          <span className="ly-Breadcrumb-label">
            <FormattedMessage id="component.global.breadcrumb.current" />:
          </span>
        ) : null}
        <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>
      </div>
    );
  }
}
