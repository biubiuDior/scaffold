/*
 * @Description: 页面分割标题
 * @Author: admin
 * @Date: 2020-03-18 16:16:39
 * @LastEditors: admin
 * @LastEditTime: 2020-03-19 15:58:43
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import './index.less';

const LyTitle = props => {
  const { className, title, desc, extra } = props;
  return (
    <div className={classNames(className, 'ly-title')}>
      {extra && <div className="ly-title-extra-content">{extra}</div>}
      <div className="ly-title-content">
        {title}
        {desc && <span className="ly-title-content-desc">{desc}</span>}
      </div>
    </div>
  );
};

export default LyTitle;
