/*
 * @Description: 数组字符串表单（Select分词改造）
 * @Author: admin
 * @Date: 2020-03-26 18:05:35
 * @LastEditors: admin
 * @LastEditTime: 2020-03-27 12:10:20
 */
import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const { Option } = Select;

export default class LyFormArray extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.array,
    value: PropTypes.array,
  };

  constructor(props) {
    super(props);
    const value = props.value || props.defaultValue || [];
    this.state = {
      value: value[0] ? value.join(',') : undefined,
    };
  }

  // 改变
  onChange = value => {
    this.setState({ value });
    const onChange = this.props.onChange;
    if (onChange) {
      let _value = value;
      if (typeof value === 'string') {
        _value = value.split(',');
      }
      onChange(_value);
    }
  };

  render() {
    const { className, onChange, value, options, ...rest } = this.props;

    return (
      <Select
        className={classNames('ly-form-array', className)}
        mode="tags"
        value={this.state.value}
        onChange={this.onChange}
        tokenSeparators={[',']}
        options={[]}
        {...rest}
      />
    );
  }
}
