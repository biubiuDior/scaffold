/*
 * @Description: 基础组件方法
 * @Author: admin
 * @Date: 2020-03-17 11:32:00
 * @LastEditors: admin
 * @LastEditTime: 2020-04-09 10:25:40
 */
import React from 'react';
import {
  Button,
  Icon,
  Form,
  Input,
  Col,
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  InputNumber,
  Mention,
  Radio,
  Rate,
  Select,
  Switch,
  Slider,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from 'antd';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { createUuid } from '../../../utils/utils';
import TextArea from '../../TextArea';

const FormItem = Form.Item;

/**
 * 表单子项
 *
 * @param form       Form.create创建的表单对象
 * @param item       表单子项的值
 * @param itemCol    表单col
 */
export const renderFormItem = props => {
  const { form, item, itemCol, initialValues = {}, layout, needCol, defalutSearch } = props;
  const {
    type,
    col,
    extra,
    extraRight,
    label,

    labelCol,
    labelAlign,
    wrapperCol,
    name,
    required,
    render,
    config = {},
    initialValue,
    rules,
    isHideRender = false, // 是否隐藏渲染该组件
    isHidden = false, // 是否隐藏该组件
    ...other
  } = item;
  if (isHideRender == true) return null;
  // label布局
  let _labelCol = label ? props.labelCol : {};
  if (labelCol) {
    _labelCol = getCol(labelCol);
  }
  // wrapper布局
  let _wrapperCol = label ? props.wrapperCol : {};
  if (wrapperCol) {
    _wrapperCol = getCol(wrapperCol);
  }
  // col布局
  let _itemCol = itemCol;
  if (col) {
    _itemCol = getCol(col);
  }
  let _col = getCol(_itemCol);
  // 空元素
  if (type === 'Empty' && _itemCol) {
    // col布局
    return <Col {..._col} key={createUuid()} />;
  }
  // 处理默认值
  let _initialValue = initialValue;
  if (_initialValue && typeof _initialValue === 'string' && _initialValue.indexOf('FORM_') === 0) {
    _initialValue = get(initialValues, _initialValue.replace('FORM_', ''));
  }

  // 是否自定义
  const isCustom = typeof render === 'function';
  const Item = isCustom
    ? render(form)
    : renderItem({ type, initialValue: _initialValue, defalutSearch, ...other });

  // 验证输入框不能为空
  const isEmptyInput = () => {
    if (type == undefined) return true;
    const _type = type.toLowerCase();
    return _type == 'input' || _type == 'textarea' || _type == 'search' || _type == 'stringarray';
  };

  let _FormItem = (
    <FormItem
      key={name || label}
      label={label}
      labelCol={layout === 'inline' && needCol === false ? null : _labelCol}
      wrapperCol={layout === 'inline' && needCol === false ? null : _wrapperCol}
      labelAlign={labelAlign}
      extra={extra}
    >
      {name && type !== 'Text'
        ? form.getFieldDecorator(name, {
            rules: rules || [
              { required, message: `${label}不能为空` },
              ...(isEmptyInput()
                ? [
                    {
                      validator: (rule, value, callback) => {
                        const reg = /^\s+$/g;
                        if (value && reg.test(value)) {
                          callback('不能为空字符');
                        }
                        callback();
                      },
                    },
                  ]
                : []),
            ],
            initialValue: get(initialValues, name) || _initialValue,
            ...config,
          })(Item)
        : Item}
      {extraRight && <div className="ly-formItem-extra">{extraRight}</div>}
    </FormItem>
  );
  if (_itemCol) {
    // col布局
    _FormItem = (
      <Col {..._col} key={name || label || createUuid()}>
        {_FormItem}
      </Col>
    );
  }
  if (isHidden == true) {
    _FormItem = (
      <div key={name || label || createUuid()} style={{ display: 'none' }}>
        {_FormItem}
      </div>
    );
  }
  return _FormItem;
};

// 获取真实的col
const getCol = col => {
  let _col = {};
  if (typeof col === 'number' || typeof col === 'string') {
    _col.span = col;
  } else {
    _col = col;
  }
  return _col;
};

/**
 * 表单子项
 *
 * @param type  输入类型
 */
export const renderItem = props => {
  const InputGroup = Input.Group;
  const { type = '', initialValue, defalutSearch, ...others } = props;
  const _type = type.toLowerCase();
  if (_type === 'text') {
    return <span {...others}>{initialValue || props.value}</span>;
  } else if (_type === 'autocomplete') {
    return <AutoComplete {...others} />;
  } else if (_type === 'cascader') {
    return <Cascader {...others} />;
  } else if (_type === 'checkbox') {
    return <Checkbox.Group {...others} />;
  } else if (_type === 'datepicker') {
    return <DatePicker {...others} />;
  } else if (_type === 'weekpicker') {
    return <DatePicker.WeekPicker {...others} />;
  } else if (_type === 'monthpicker') {
    return <DatePicker.MonthPicker {...others} />;
  } else if (_type === 'rangepicker') {
    return <DatePicker.RangePicker {...others} />;
  } else if (_type === 'input') {
    return <Input onPressEnter={props.defalutSearch} {...others} />;
  } else if (_type === 'password') {
    return <Input.Password {...others} />;
  } else if (_type === 'inputmoney') {
    const inputNumberProps = {
      formatter: value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: value => value.replace(/\$\s?|(,*)/g, ''),
    };
    return <InputNumber {...inputNumberProps} {...others} />;
  } else if (_type === 'inputnumber' || _type === 'number') {
    return <InputNumber {...others} />;
  } else if (_type === 'mention') {
    return <Mention {...others} />;
  } else if (_type === 'radio') {
    const { type, options = [], ...others } = props;
    return (
      <Radio.Group {...others}>
        {options.map(({ value, label }, index) => (
          <Radio key={index} value={value}>
            {label}
          </Radio>
        ))}
      </Radio.Group>
    );
  } else if (_type === 'rate') {
    return <Rate {...others} />;
  } else if (_type === 'search') {
    return <Input.Search {...others} />;
  } else if (_type === 'select') {
    const { type, options = [], ...others } = props;
    return (
      <Select allowClear {...others}>
        {options.map(({ value, label, title }, index) => (
          <Select.Option key={index} value={value} title={title || label}>
            {label}
          </Select.Option>
        ))}
      </Select>
    );
  } else if (_type === 'slider') {
    return <Slider {...others} />;
  } else if (_type === 'switch') {
    return <Switch {...others} />;
  } else if (_type === 'textarea') {
    return <Input.TextArea rows={4} {...others} />;
  } else if (_type === 'textareanumber') {
    return <TextArea rows={4} {...others} />;
  } else if (_type === 'timepicker') {
    return <TimePicker {...others} />;
  } else if (_type === 'transfer') {
    return <Transfer {...others} />;
  } else if (_type === 'treeselect') {
    return <TreeSelect {...others} />;
  } else if (_type === 'upload') {
    return (
      <Upload {...others}>
        {props.children ? (
          props.children
        ) : (
          <Button>
            <Icon type="upload" />
            &nbsp;点击上传
          </Button>
        )}
      </Upload>
    );
  } else {
    return <Input {...others} />;
  }
};

/**
 * 提交表单
 *
 * @param form       Form.create创建的表单对象
 * @param formValues 表单初始值
 * @param callback   表单校验成功后回调
 */
export const onSubmit = (form, formValues, callback) => {
  if (form) {
    form.validateFields((err, fieldsValue) => {
      if (!err && isFunction(callback)) {
        callback({ ...formValues, ...fieldsValue }, form);
      }
    });
  } else {
    console.warn('form is not defined');
  }
};
