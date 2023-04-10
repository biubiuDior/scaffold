/*
 * @Description: 基础树形展示-用于表格的筛选
 * @Author: qizc
 * @Date: 2019-07-17 14:09:14
 * @LastEditTime: 2019-09-03 16:42:50
 */
import React, { Component } from 'react';
import { Tree, Input, Icon, Spin, Collapse } from 'antd';
import Scrollbars from '../Scrollbars';
import styles from '../Selector/style.less';

const { Panel } = Collapse;
const Fragment = React.Fragment;
const { TreeNode } = Tree;
let dataList = [];
export default class BaseTree extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    expandedKeys: [],
    autoExpandParent: true,
    searchValue: '',
    selectedKeys: [],
    checkedKeys: [],
  };
  static defaultProps = {
    width: 300,
  };
  componentDidMount() {
    let { type, selectedKeys } = this.props;
    if (type == 'single') {
      this.setState({
        selectedKeys: selectedKeys,
      });
    } else {
      this.setState({
        checkedKeys: selectedKeys,
      });
    }
  }
  onClick = e => {
    e.stopPropagation();
  };
  // 选择人员
  onCheck = (checkedKeys, e) => {
    let list = [],
      listId = [];
    e.checkedNodes.map(item => {
      if (!item.props.children) {
        list.push(item.props.dataRef);
        listId.push(item.props.dataRef.id + '');
      }
    });
    this.props.onCheck(listId, list);
    this.setState({ checkedKeys });
  };
  setCheckValue = checkedKeys => {
    this.setState({ checkedKeys });
  };
  // 展开/收起树节点
  onExpand = (expandedKeys, node, e) => {
    this.setState({ expandedKeys, autoExpandParent: false });
  };

  // 点击树节点
  onSelect = (selectedKeys, e) => {
    if (e.node.isLeaf()) {
      this.setState({ selectedKeys });
      this.props.onSelect(e.selectedNodes);
      return;
    }
  };

  // 树搜索回调
  onChange = e => {
    const { treeData = [] } = this.props;
    const value = e.target.value;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };
  render() {
    const {
      loading = false, // 是否在加载中
      treeData, // 数据
      width,
      hideSearch,
      type,
    } = this.props;
    const { expandedKeys, autoExpandParent, searchValue, checkedKeys, selectedKeys } = this.state;
    const checkable = type == 'multiple';
    dataList = dataList[0] ? dataList : flattenTreeData(treeData);
    // 渲染树节点
    const renderTreeNodes = data => {
      return data.map(item => {
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        let title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
          );

        if (item.children && item.children.length) {
          return (
            <TreeNode
              title={title}
              key={item.id}
              dataRef={item}
              icon={
                expandedKeys.includes(item.id + '') ? (
                  <img
                    style={{ float: 'left', marginTop: 3 }}
                    src={require('@/assets/images/icon/folder-open.png')}
                  />
                ) : (
                  <img
                    style={{ float: 'left', marginTop: 3 }}
                    src={require('@/assets/images/icon/folder.png')}
                  />
                )
              }
            >
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }

        title = (
          <>
            {title}
            <span style={{ float: 'right' }}>{item.phone}</span>
          </>
        );
        return (
          <TreeNode
            title={title}
            key={item.id}
            dataRef={item}
            // <Icon type="file-text" style={{ color: '#999' }} />
            icon={
              <img
                style={{ float: 'left', marginTop: 3 }}
                src={
                  item.sex
                    ? require('@/assets/images/icon/sex-woman.png')
                    : require('@/assets/images/icon/sex-man.png')
                }
              />
            }
          />
        );
      });
    };

    // tree
    const TreeContent = (
      <Scrollbars autoHide>
        <div className="ly-selector-baseContent">
          <Spin spinning={loading}>
            <Tree
              checkable={checkable}
              showIcon
              defaultExpandAll={true}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              onExpand={this.onExpand}
              onSelect={this.onSelect}
              onCheck={this.onCheck}
              checkedKeys={checkedKeys}
              autoExpandParent={autoExpandParent}
              onClick={this.onClick}
            >
              {renderTreeNodes(treeData)}
            </Tree>
          </Spin>
        </div>
      </Scrollbars>
    );

    return (
      <div
        className="ly-selectorBase"
        style={{ width: width }}
        ref={el => (this.BaseTreeNode = el)}
      >
        {!hideSearch && (
          <div className="ly-selector-searchBox">
            <Input
              allowClear
              onChange={this.onChange}
              placeholder="请输入关键字"
              prefix={<Icon type="search" />}
            />
          </div>
        )}
        <div className="ly-selector-leftContent">{TreeContent}</div>
      </div>
    );
  }
}

// 获取tree的parentKey
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id;
      } else {
        const _parentKey = getParentKey(key, node.children);
        if (_parentKey) {
          parentKey = _parentKey;
        }
      }
    }
  }
  return parentKey;
};

// 扁平化树数据
const flattenTreeData = arr => {
  let res = [];
  const getList = data => {
    data.forEach(node => {
      const key = node.id;
      const title = node.name;
      res.push({ key, title });
      if (node.children) {
        getList(node.children);
      }
    });
  };
  getList(arr);
  return res;
};
