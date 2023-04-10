/*
 * @Description: TextArea--字数检测和限制
 * @Author: admin
 * @Date: 2020-04-21 15:25:07
 * @LastEditors: admin
 * @LastEditTime: 2020-04-21 15:36:20
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import './index.less';

const { TextArea } = Input;

export default class _TextArea extends React.Component {
  static propTypes = {
    maxLength: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    maxLength: 200,
    onChange: Function.prototype,
  };

  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      num: value ? value.length : 0,
    };
  }

  componentDidMount() {
    const { defaultValue } = this.props;
    if (defaultValue) {
      this.setState({
        num: defaultValue.length,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value && value.length > 0) {
      this.setState({
        num: value.length,
      });
    }
  }

  // 设置值的长度
  textAreaChange = e => {
    const value = e.target.value || '';
    this.setState({
      num: value.length || 0,
    });
  };

  render() {
    const { className, maxLength, onChange, ...otherProps } = this.props;
    return (
      <div className={classNames('yui-textarea', className)}>
        <TextArea
          {...otherProps}
          onChange={e => {
            this.textAreaChange(e);
            onChange(e);
          }}
          maxLength={maxLength}
        />
        <span className="yui-textarea-info">
          <span className="yui-textarea-count">{this.state.num}</span>/
          {maxLength}
        </span>
      </div>
    );
  }
}
