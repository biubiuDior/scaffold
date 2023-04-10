import React, { Component } from 'react';
import { Tree, Input, Icon, Tooltip, Button, Divider, Modal, message } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from "./index.less";

const { TreeNode } = Tree;
const { confirm } = Modal;
class LyTree extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      parentKey: null,
      newTitle: null,
      inputValue: null,
      visible: false,
      activeKey: null,
      data: this.props.data
      //  需要的树的数据格式： 必须有parentId，一级parentId为-1
      // data: [
      //   { key: '1', title: '第一部分', parentId: '-1' },
      //   { key: '1-1', title: '一、二级标题', parentId: '1' },
      //   { key: '1-2', title: '二、二级标题', parentId: '1' },
      //   { key: '1-3', title: '三、二级标题', parentId: '1' },
      //   { key: '1-4', title: '四、二级标题', parentId: '1' },
      //   { key: '2', title: '第二部分', parentId: '-1' },
      //   { key: '2-1', title: '一、二级标题', parentId: '2' },
      //   { key: '2-1-1', title: '（一）三级标题', parentId: '2-1' },
      //   { key: '2-1-2', title: '（二）三级标题', parentId: '2-1' },
      //   { key: '2-1-3', title: '（三）三级标题', parentId: '2-1' },
      //   { key: '2-2', title: '二、二级标题', parentId: '2' },
      //   { key: '2-2-1', title: '（一）三级标题', parentId: '2-2' },
      //   { key: '2-2-2', title: '（二）三级标题', parentId: '2-2' }
      // ],
    }
  }



  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // 根据父级找到所有子级节点
  getByParentId(parentId) {
    return this.state.data.filter(item => item.parentId === parentId)
  }

  // 搜索
  handleSearch = e => {
    const { data } = this.state;
    const { value } = e.target
    const expandedKeys = data.map(el => {
      if (el.title.indexOf(value) > -1) {
        return el.parentId
      }
    })
    this.setState({
      expandedKeys,
      autoExpandParent: true,
      searchValue: value
    })
  }

  // 处理搜索的节点
  handleTitleItem = item => {
    const { searchValue } = this.state
    const index = item.title.indexOf(searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + searchValue.length);
    const title = index > -1 ? (
      <span className={styles.hoverBg}> {beforeStr} <span className={styles.redColor}>{searchValue}</span>{afterStr}</span>)
      : (<span className={styles.hoverBg}>{item.title}</span>);
    return title
  }

  // 删除
  showDeleteConfirm= (key) => {
    confirm({
      title: '确认删除?',
      content: '如果有子菜单，也将一并删除',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk:()=>{
        this.handleDelete(key)
      },
      onCancel() {
        message.warning('已取消删除');
      },
    });
  
  }



  // 根据key删除节点
  handleDelete = (key) => {
    const { data } = this.state;
    data.splice(data.findIndex(item => item.key === key), 1)
    this.setState(data);
  }

  // 打开新增
  openAdd = key => {
    this.setState({
      visible: true,
      parentKey: key
    })
  }

  // 关闭新增
  handleCancelAdd = () => {
    this.setState({
      visible: false
    })
  }

  // 添加节点
  handleAdd = () => {
    const { data, newTitle, parentKey } = this.state;
    data.push({ key: newTitle, title: newTitle, parentId: parentKey })
    this.setState({
      data,
      visible: false
    });
  }

  // 打开编辑输入框
  openEdit = (key) => {
    this.setState(() => ({
      activeKey: key
    }))
  }

  // 取消修改
  handleCansal = () => {
    this.setState(() => ({
      activeKey: null
    }))
  }

  // 新增输入标题
  handleChange = e => {
    this.setState({
      newTitle: e.target.value
    })
  }

  // 修改输入标题
  handleChangeUpdata = e => {
    this.setState({
      inputValue: e.target.value
    })
  }

  // 编辑节点
  handleEditSave = (row, key) => {
    const { data, inputValue } = this.state
    const rows = row
    rows.title = inputValue
    data.splice(data.findIndex(item => item.key === key), 1, rows)
    this.setState({
      data,
      activeKey: null
    });

  }


  renderTreeNode = (parentId) => {
    const { activeKey, inputValue } = this.state
    // 先找到子级节点
    const tmp = this.getByParentId(parentId);
    if (tmp.length > 0) {
      // 遍历铺页面，如果数组长度不为0则证明子级不为空
      return tmp.map(item => (
        <TreeNode
          title={
            //  wihteBg: 编辑时不显示背景色
            <div className={classNames(styles.controlBtn, activeKey === item.key ? styles.wihteBg : null)}>
              {/* 编辑时候显示 */}
              <span className={activeKey === item.key ? '' : styles.disNone}>
                <Input
                  placeholder="输入修改"
                  value={inputValue}
                  style={{ width: 200 }}
                  className="mr-sm"
                  onInput={this.handleChangeUpdata.bind(this)}

                />
                <span className={styles.blueColor} onClick={() => { this.handleEditSave(item, item.key) }}>保存</span>
                <Divider type="vertical" />
                <span className={styles.blueColor} onClick={() => { this.handleCansal() }}>取消</span>
              </span>

              <span className={activeKey !== item.key ? '' : styles.disNone}>
                {/* 标题 */}
                {this.handleTitleItem(item)}
                {/* 按钮 */}
                <span className={styles.grayIcon}>
                  <Tooltip placement="top" title="编辑">
                    <Button type="link" onClick={() => { this.openEdit(item.key) }}><Icon type='edit' /></Button>
                  </Tooltip>
                  <Tooltip placement="top" title="添加">
                    <Button type="link" onClick={() => { this.openAdd(item.key) }}><Icon type='plus-circle-o' /></Button>
                  </Tooltip>
                  <Tooltip placement="top" title="删除">
                    <Button type="link" onClick={() => { this.showDeleteConfirm(item.key) }}><Icon type='minus-circle-o' /></Button>
                  </Tooltip>
                </span>
              </span>
            </div>
          }
          key={item.key}
          dataRef={item}
        >
          {this.renderTreeNode(item.key)}
        </TreeNode>
      ))
    }
  }

  render() {
    const { newTitle, searchValue, expandedKeys, autoExpandParent } = this.state
    const { checkable, showSearch } = this.props
    return (
      <div>
        {showSearch ? (
          <Input value={searchValue} suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.45)' }} />} style={{ marginBottom: 8, width: 250 }} placeholder="请输入关键字" onChange={this.handleSearch} />
        ) : null}

        <Tree
          switcherIcon={<Icon type="caret-down" />}
          className={styles.treeSet}
          blockNode
          checkable={checkable}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {/* 先找到所有parentId为-1的顶级节点 */}
          {this.renderTreeNode("-1")}
        </Tree>
        <Modal
          className={styles.treeModa}
          title="添加"
          visible={this.state.visible}
          onOk={this.handleAdd}
          onCancel={this.handleCancelAdd}
        >
          <Input placeholder="输入标题" value={newTitle} onInput={this.handleChange.bind(this)} />
        </Modal>
      </div>

    );
  }
}
LyTree.propTypes = {
  checkable: PropTypes.bool, // 是否有checkbox选中框 默认无
  showSearch: PropTypes.bool, // 是否显示搜索框 默认有
}
LyTree.defaultProps = {
  checkable: false,
  showSearch: true
}
export default LyTree;