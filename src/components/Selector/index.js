import { Component } from 'react';
import PropTypes from 'prop-types';
import { BaseTree, BaseResult } from '../SelectorBase';
import styles from './style.less';
import { Input, Button, Form, Icon } from 'antd';
import { DragModal } from '@/components';
import classNames from 'classnames';

@Form.create()
export default class Selector extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['single', 'multiple']).isRequired, // 选择器类型
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 弹窗宽度
    onSelect: Function.prototype, // tree 选中
    selectedKeys: PropTypes.array, // 默认选中的key
    hideSearch: PropTypes.bool, // 隐藏搜索
    appIds: PropTypes.string, // 应用id
  };

  static defaultProps = {
    width: 300,
    modalWidth: 700,
    title: '选择器',
    type: 'single', // 默认用户选择器
    hideSearch: false,
    placeholder: '请选择',
    treeData: [],
    selectedKeys: [],
    appIds: '',
    treeLoading: false,
  };
  state = {
    visible: false,
    singleValue: [], //单选默认值
    singleValueName: '',
    multipleInitval: [], //多选默认值
  };
  componentDidMount() {
    let { selectedKeys, treeData, type } = this.props;
    let dataList = flattenTreeAllData(treeData);
    if (type == 'single') {
      document.addEventListener('click', this.domClickEvent, false);
      let data = dataList.find(item => {
        if (item.children && item.children.length > 0) {
          return false;
        }
        return item.id == selectedKeys;
      });
      if (data) {
        this.setState({
          singleValueName: data.name,
        });
      }
      this.setState({
        singleValue: this.props.selectedKeys,
      });
    } else {
      let list = [];
      selectedKeys.map(item => {
        let data = dataList.find(item2 => {
          if (item2.children && item2.children.length > 0) {
            return false;
          }
          return item2.id == item;
        });
        if (data) {
          list.push(data);
        }
      });
      this.setState({
        multipleInitval: list,
      });
    }
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.domClickEvent);
  }
  domClickEvent = e => {
    var select = this.singleSelector;
    var target = e.target;
    while (target.parentNode) {
      if (select == target) return;
      target = target.parentNode;
    }
    this.setState({
      visible: false,
    });
  };
  onSelect = data => {
    if (this.props.type == 'single') {
      let result = {};
      let id = '',
        name = '';
      if (data.length > 0) {
        result = data[0].props.dataRef;
        id = result.id;
        name = result.name;
      }
      this.props.onSelect(result);
      this.setState({
        singleValue: [id + ''],
        visible: false,
      });
      this.props.form.setFieldsValue({ singleValue: name });
    }
  };
  // 单选-点击输入框
  onClick = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  // 多选-选择
  onCheck = (listId, list) => {
    this.baseResult.setList(listId, list);
  };
  setCheckValue = value => {
    this.baseTree.setCheckValue(value);
  };
  handleOk = () => {
    this.props.onOk(this.baseResult.state.selectOptions);
  };

  render() {
    const {
      title,
      type,
      width,
      modalWidth,
      hideSearch,
      treeData,
      selectedKeys,
      treeLoading,
      placeholder,
      onCancel: handleCancel,
    } = this.props;
    // let _treeData = formatData(treeData);
    const { visible, singleValue, singleValueName, multipleInitval } = this.state;
    const { getFieldDecorator } = this.props.form;
    // 处理数据便于搜索

    return (
      <div className="ly-Selector" ref={el => (this.singleSelector = el)}>
        {type == 'single' && (
          <div style={{ width: width }}>
            <Form.Item onClick={this.onClick} className="ly-selector-singleInput">
              {getFieldDecorator('singleValue', {
                initialValue: singleValueName,
              })(<Input disabled placeholder={placeholder} />)}
              <Icon
                className={`ly-selector-singleInput-icon ${visible ? 'rote' : ''}`}
                type={'down'}
              />
            </Form.Item>
            {visible && (
              <div className="ly-selector-singleBox">
                <BaseTree
                  ref={el => (this.BaseTree = el)}
                  type={type}
                  title={title}
                  width={width}
                  hideSearch={hideSearch}
                  treeLoading={treeLoading}
                  treeData={treeData}
                  onSelect={this.onSelect}
                  selectedKeys={singleValue}
                />
              </div>
            )}
          </div>
        )}
        {type == 'multiple' && (
          <DragModal
            wrapClassName={'selectorBaseModal'}
            title={title}
            width={modalWidth}
            visible
            onCancel={handleCancel}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleOk}>
                确定
              </Button>,
              <Button key="back" type="primary" ghost onClick={handleCancel}>
                取消
              </Button>,
            ]}
          >
            <div className={classNames('ly-selector-multipleBox', 'clearfix')}>
              <BaseTree
                ref={el => (this.baseTree = el)}
                type={type}
                title={title}
                width={width}
                hideSearch={hideSearch}
                treeLoading={treeLoading}
                treeData={treeData}
                onSelect={this.onSelect}
                onCheck={this.onCheck}
                selectedKeys={selectedKeys}
              />
              <BaseResult
                ref={el => (this.baseResult = el)}
                leftWidth={width}
                multipleInitval={multipleInitval}
                selectedKeys={selectedKeys}
                setCheckValue={this.setCheckValue}
              />
            </div>
          </DragModal>
        )}
      </div>
    );
  }
}

//参数data:要格式化的数据,child为要格式化数据的子数组值名
const formatData = (
  data = [],
  id = 'departmentId',
  name = 'departmentName',
  child = 'childrens'
) => {
  let trees = [];
  data.forEach(item => {
    let newData = {
      id: item[id],
      name: item[name],
      ...item,
    };
    if (item[child] && item[child][0]) {
      newData.children = formatData(item[child], id, name, child);
    } else {
      newData.children = null;
    }
    delete newData[child];
    trees.push(newData);
  });
  return trees;
};

// 扁平化树数据
const flattenTreeAllData = arr => {
  let res = [];
  const getList = data => {
    data.forEach(node => {
      res.push({ ...node });
      if (node.children) {
        getList(node.children);
      }
    });
  };
  getList(arr);
  return res;
};
