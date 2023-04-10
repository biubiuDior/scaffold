/*
 * @Description: 搜索
 * @Author: admin
 * @Date: 2020-03-31 18:06:40
 * @LastEditors: admin
 * @LastEditTime: 2020-04-14 13:55:40
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { LyForm } from '@/components';
import { isSearchKeyReg } from '@/utils/utils';
import './index.less';

export default class LySearch extends Component {
  static propTypes = {
    defalutSearchFlag: PropTypes.bool, //是否需要输入框回车就执行搜索
  };

  static defaultProps = {
    defalutSearchFlag: false,
  };
  // 搜索
  onSearch = () => {
    const { onSearch } = this.props;
    this.lyform.validateFields((err, values) => {
      if (!err) {
        onSearch && onSearch(values);
      }
    });
  };

  // 获取表单值
  getSearchValues = callback => {
    this.lyform.validateFields((err, values) => {
      if (!err) {
        callback(values);
      } else {
        callback({});
      }
    });
  };

  // 重置
  onReset = () => {
    this.lyform.resetFields();
    const { onSearch } = this.props;
    onSearch && onSearch({});
  };

  render() {
    const { className, items = [], onSearch, defalutSearchFlag, ...rest } = this.props;

    const isInput = type => {
      if (type == undefined) return true;
      const _type = type.toLowerCase();
      return _type == 'input' || _type == 'textarea' || _type == 'search';
    };

    // 添加输入框验证规则
    let _items = items.map(v => {
      const res = { ...v };
      // if (isInput(v.type) && !res.rules) {
      //   res.rules = [
      //     {
      //       validator: (rule, value, callback) => {
      //         if (value && !isSearchKeyReg(value)) {
      //           callback('不能输入特殊字符');
      //         }
      //         callback();
      //       },
      //     },
      //   ];
      // }
      return res;
    });

    return (
      <div className={classNames(className, 'ly-search')}>
        <LyForm
          ref={node => (this.lyform = node)}
          className="ly-search-form"
          layout="inline"
          needCol={false}
          items={_items}
          defalutSearch={defalutSearchFlag ? this.onSearch : undefined}
          {...rest}
        />
        <div className="ly-search-btns">
          <Button type="primary" onClick={this.onSearch}>
            查询
          </Button>
          <Button className="ml-sm" onClick={this.onReset}>
            重置
          </Button>
        </div>
      </div>
    );
  }
}
