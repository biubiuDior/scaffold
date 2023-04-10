/*
 * @Description: 抽屉表单
 * @Author: admin
 * @Date: 2020-03-17 16:50:09
 * @LastEditors: admin
 * @LastEditTime: 2020-03-17 17:41:48
 */
import React from 'react';
import Drawer from '../../LyDrawer';
import PropTypes from 'prop-types';
import BaseForm, { onSubmit } from '../BaseForm';

class DrawerForm extends React.Component {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    visible: PropTypes.bool,
    formProps: PropTypes.bool,
  };

  static defaultProps = {
    width: 800,
    visible: false,
    formProps: {}, // 表单配置
  };

  // 渲染表单
  renderForm = () => {
    const { formProps = {} } = this.props;
    return (
      <BaseForm
        {...formProps}
        ref={node => {
          this.baseFormRef = node;
        }}
      />
    );
  };

  // 取消
  onClose = () => {
    const { onClose } = this.props;
    onClose && onClose();
  };

  // 保存
  onOk = () => {
    const { onOk, formProps } = this.props;
    if (onOk) {
      onSubmit(this.baseFormRef.getForm(), formProps.initialValues || {}, onOk);
      this.onClose();
    }
  };

  render() {
    const { children, title, width, visible, onOk, onClose, formProps, ...restProps } = this.props;

    return visible ? (
      <Drawer
        title={title}
        width={width}
        visible={visible}
        onClose={this.onClose}
        onOk={this.onOk}
        {...restProps}
      >
        {children || this.renderForm()}
      </Drawer>
    ) : null;
  }
}

export default DrawerForm;
