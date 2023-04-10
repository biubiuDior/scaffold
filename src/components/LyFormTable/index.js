/*
 * @Description: 自定义表格形式表单
 * @Author: admin
 * @Date: 2020-03-26 15:50:37
 * @LastEditors: admin
 * @LastEditTime: 2020-04-13 15:36:46
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Divider } from 'antd';
import { CommonTable, LyForm, DragModal, LyConfirm } from '@/components';
import { createUuid } from '@/utils/utils';

class LyFormTable extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['Array', 'Object']),
    addPosition: PropTypes.oneOf(['top', 'bottom']),
    formList: PropTypes.array,
    readOnly: PropTypes.bool,
  };
  static defaultProps = {
    type: 'Object', // 表单要生成的值类型
    addPosition: 'top', // 添加按钮位置
    formList: [
      { label: '键', name: 'key', placeholder: '请输入键' },
      { label: '值', name: 'value', placeholder: '请输入值' },
    ], // 表单弹窗列表
    readOnly: false, // 是否只读
  };

  constructor(props) {
    super(props);
    // 默认值
    const defaultValue = props.type === 'Array' ? [] : {};
    let value = props.value || props.defaultValue || defaultValue;
    const defaultColumns = props.formList.map(item => {
      return {
        title: item.label || item.name,
        dataIndex: item.name,
      };
    });

    if (!props.readOnly) {
      // 添加操作按钮
      defaultColumns.push({
        title: '操作',
        key: 'action',
        width: 140,
        render: (text, record, index) => (
          <span>
            <a onClick={() => this.onUpdateBtn(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.onDeleteBtn(record)}>删除</a>
          </span>
        ),
      });
    }

    this.state = {
      modalType: '', // 弹窗类型
      visible: false,
      updateInfo: {},
      value: formatData(value, props),
      columns: defaultColumns,
    };
  }

  componentWillReceiveProps(nextProps) {
    // 当值改变时触发更新
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      this.setState({
        value: formatData(nextProps.value, nextProps),
      });
    }
  }

  // 改变
  onChange = data => {
    this.setState({ value: data });
    const { onChange, type } = this.props;
    if (onChange) {
      let _data = undefined;
      if (type === 'Array') {
        _data = deleteId(data);
      } else {
        // 键值对形式
        _data = {};
        data.map(item => {
          _data[item.key] = item.value;
        });
      }
      onChange(_data);
    }
  };

  // 新增保存
  onAddSave = () => {
    this.lyForm.validateFields((errors, values) => {
      if (!errors) {
        const _value = [...this.state.value];
        _value.push({ _id: createUuid(), ...values });
        this.onChange(_value);
        this.handleCancel();
      }
    });
  };

  // 修改保存
  onUpdateSave = () => {
    this.lyForm.validateFields((errors, values) => {
      if (!errors) {
        let { value, updateInfo } = this.state;
        const _value = value.map(item => {
          if (item._id == updateInfo._id) {
            return {
              ...item,
              ...values,
            };
          } else {
            return item;
          }
        });
        this.onChange(_value);
        this.handleCancel();
      }
    });
  };

  // 删除保存
  onDeleteBtn = record => {
    LyConfirm('是否确定删除？', 'warn', () => {
      const { value } = this.state;
      const _value = value.filter(i => i._id !== record._id);
      this.setState({
        value: value,
      });
      this.onChange(_value);
    });
  };

  //  新增按钮
  onAddBtn = () => {
    this.setState({
      modalType: 'add',
      visible: true,
    });
  };

  //  编辑按钮
  onUpdateBtn = record => {
    this.setState({
      modalType: 'update',
      updateInfo: record,
      visible: true,
    });
  };

  // 点击保存按钮
  handleOk = () => {
    const { modalType } = this.state;
    if (modalType === 'add') {
      this.onAddSave();
    } else {
      this.onUpdateSave();
    }
  };

  // 点击关闭按钮
  handleCancel = () => {
    this.setState({
      modalType: '',
      updateInfo: {},
      visible: false,
    });
  };

  render() {
    const {
      className,
      readOnly,
      type,
      addPosition,
      formList,
      initialValues,
      tableProps = {},
      modalProps = {},
    } = this.props;
    const { visible, updateInfo, modalType, columns, value } = this.state;

    // 表单项
    const items = formList.map(item => {
      return {
        ...item,
        initialValue: updateInfo[item.name] || item.initialValue,
      };
    });

    return (
      <div className={classNames(className, 'ly-form-table ly-table-noEmpty')}>
        {!readOnly && addPosition === 'top' && (
          <Button style={{ marginBottom: 10 }} type="primary" onClick={this.onAddBtn}>
            新增
          </Button>
        )}
        <CommonTable
          size="small"
          rowKey="_id"
          bordered
          columns={columns}
          dataSource={value}
          {...tableProps}
        />
        {!readOnly && addPosition === 'bottom' && (
          <Button style={{ marginTop: 10 }} type="primary" onClick={this.onAddBtn}>
            新增
          </Button>
        )}
        {visible ? (
          <DragModal
            title={modalType === 'add' ? '新增' : '编辑'}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            {...modalProps}
          >
            <LyForm
              ref={node => (this.lyForm = node)}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              initialValues={initialValues}
              items={items}
            />
          </DragModal>
        ) : null}
      </div>
    );
  }
}

export default LyFormTable;

// 像列表插入key
const insertId = (data = []) => {
  const _data = [...data];
  return _data.map(item => {
    return { _id: createUuid(), ...item };
  });
};

// 列表移除key
const deleteId = (data = []) => {
  const _data = [...data];
  return _data.map(item => {
    delete item._id;
    return item;
  });
};

// 格式化数据展示表格
const formatData = (data, props) => {
  const { type } = props;
  if (type === 'Array' && Array.isArray(data)) {
    return insertId(data);
  } else {
    //生成数组
    const arrKeys = Object.keys(data);
    const _data = arrKeys.map(key => {
      return {
        key: key,
        value: data[key],
      };
    });
    return insertId(_data);
  }
};
