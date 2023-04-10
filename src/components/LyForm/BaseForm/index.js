/*
 * @Description: 基础表单
 * @Author: admin
 * @Date: 2020-03-17 10:36:25
 * @LastEditors: admin
 * @LastEditTime: 2020-03-18 15:48:48
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Form, Input, Row, Col, Button } from 'antd';
import { renderFormItem, submitForm } from './extra';
import './index.less';

class BaseForm extends React.Component {
  static propTypes = {
    layout: PropTypes.string,
    labelCol: PropTypes.object,
    wrapperCol: PropTypes.object,
    needCol: PropTypes.bool, // 是否需要col布局
    items: PropTypes.array.isRequired,
    initialValues: PropTypes.object,
    itemCol: PropTypes.number,
    defalutSearch: PropTypes.func, //search类型表单的搜索回调
  };

  static defaultProps = {
    layout: 'horizontal',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    initialValues: {}, // 初始值
    items: [],
    gutter: 0,
    needCol: true,
  };

  render() {
    const {
      className,
      layout,
      needCol,
      labelCol,
      wrapperCol,
      labelAlign,
      items,
      gutter,
      itemCol,
      initialValues,
      form,
      defalutSearch,
    } = this.props;
    const isRow = itemCol || items.some(item => item.col);

    // 表单子项
    const _Item = items.map(item =>
      renderFormItem({
        item,
        form,
        itemCol,
        labelCol,
        wrapperCol,
        needCol,
        initialValues,
        layout,
        defalutSearch,
      })
    );
    return (
      <Form
        className={classNames('ly-form', className)}
        layout={layout}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        labelAlign={labelAlign}
      >
        {isRow ? <Row gutter={gutter}>{_Item}</Row> : _Item}
      </Form>
    );
  }
}

// 监听表单变化
const onValuesChange = (props, changedValues, allValues) => {
  if (props.onValuesChange) {
    props.onValuesChange(changedValues, allValues);
  }
};

export * from './extra';
export default Form.create({ onValuesChange: onValuesChange })(BaseForm);
