import { Component } from 'react';
import styles from '../Selector/style.less';
import { Scrollbars } from '@/components';
import { arrayMove } from '@/utils/utils';
import { SortableContainer, SortableElement } from 'react-sortable-hoc'; // 拖拽排序
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

export default class BaseResult extends Component {
  state = {
    checkedList: [],
    indeterminate: false,
    checkAll: false,
    selectOptions: [],
    selectOptionsId: [],
  };
  componentDidMount() {
    const { multipleInitval, selectedKeys } = this.props;
    this.setState({
      selectOptions: multipleInitval,
      selectOptionsId: selectedKeys,
    });
  }
  setList(nowListId, nowList) {
    let { selectOptions, selectOptionsId } = this.state;
    console.log(selectOptionsId, nowListId);
    if (selectOptionsId.length < nowListId.length) {
      nowListId.map((item, index) => {
        if (selectOptionsId.indexOf(item) == -1) {
          selectOptions.push(nowList[index]);
        }
      });
    } else {
      for (var i = selectOptionsId.length - 1; i >= 0; i--) {
        if (nowListId.indexOf(selectOptionsId[i]) == -1) {
          selectOptions.splice(i, 1);
        }
      }
    }
    this.setState({
      selectOptions: selectOptions,
      selectOptionsId: nowListId,
    });
  }
  // 选择
  onChange = checkedList => {
    let { selectOptions } = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < selectOptions.length,
      checkAll: checkedList.length === selectOptions.length,
    });
  };
  delectOptions = () => {
    let { checkedList, selectOptions } = this.state;
    let selectOptionsId = [];
    for (var i = selectOptions.length - 1; i >= 0; i--) {
      let pos = checkedList.indexOf(selectOptions[i]);
      if (pos == -1) {
        selectOptionsId.push(selectOptions[i].id);
      } else {
        selectOptions.splice(i, 1);
      }
    }
    this.setState({
      checkedList: [],
      selectOptionsId: selectOptionsId,
      selectOptions: selectOptions,
      indeterminate: false,
      checkAll: false,
    });
    console.log(checkedList);
    this.props.setCheckValue(selectOptionsId);
  };
  onCheckAllChange = e => {
    let { selectOptions } = this.state;
    this.setState(
      {
        checkedList: e.target.checked ? selectOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      },
      () => {
        console.log(this.state.checkedList);
      }
    );
  };
  handleSortEnd = value => {
    let { selectOptions } = this.state;
    let oldIndex = value.oldIndex;
    let newIndex = value.newIndex;
    selectOptions = [...selectOptions];
    this.setState({
      selectOptions: arrayMove(selectOptions, oldIndex, newIndex),
    });
  };
  render() {
    const { leftWidth } = this.props;
    const { checkedList, checkAll, indeterminate, selectOptions } = this.state;
    const width = `calc(100% - ${leftWidth}px)`;
    const SortableItem = SortableElement(({ item }) => {
      return (
        <div className="ly-selector-dragCheckbox clearfix">
          <Checkbox value={item} />
          <img
            src={
              item.sex
                ? require('@/assets/images/icon/sex-woman.png')
                : require('@/assets/images/icon/sex-man.png')
            }
          />
          <span className="name">{item.name}</span>
          <span className="phone">{item.phone}</span>
        </div>
      );
    });

    const SortableList = SortableContainer(({ items }) => {
      return (
        <div className="ly-selector-dragList">
          {items.length > 0 &&
            items.map((item, index) => {
              return (
                <SortableItem
                  key={index}
                  item={item}
                  index={index}
                  itemIndex={index}
                  helperClass="sortable-helper"
                />
              );
            })}
        </div>
      );
    });
    return (
      <div style={{ width: width }} className="ly-selector-BaseResult">
        <div className="ly-selector-topMenu">
          <div className="ly-selector-checkAll">
            <Checkbox
              indeterminate={indeterminate}
              onChange={this.onCheckAllChange}
              checked={checkAll}
            />
            <a onClick={this.delectOptions}>删除</a>
          </div>
          <span>
            已选人员:<a>{selectOptions.length}</a>个
          </span>
        </div>
        <div className="ly-selector-content">
          <Scrollbars style={{ height: '352px', width: '100%' }}>
            <CheckboxGroup
              onChange={this.onChange}
              defaultValue={checkedList}
              value={checkedList}
              // options={selectOptions}
            >
              <SortableList items={selectOptions} onSortEnd={this.handleSortEnd} axis="xy" />
              {/* {selectOptions.map(item => {
                // let checked = checkedList.indexOf(item) != -1;
                return (
                  <Checkbox key={item} value={item}>
                    {item}
                  </Checkbox>
                );
              })} */}
            </CheckboxGroup>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
