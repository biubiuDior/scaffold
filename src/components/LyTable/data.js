import getSuitHeight from '@/utils/getSuitHeight';
import Action from './action';
import { getStyle, getOffset } from '@/utils/utils';

/**
 * 获取尾部配置信息的参数
 * */
export const getPagination = (pagination, pageData, footerFlag) => {
  //1、此时不需要尾部分页操作
  if (footerFlag === false) {
    return false;
  }
  if (!pagination) {
    pagination = {};
  }
  pagination.total = pageData.total; //数据总数
  pagination.pageSize = pageData.pageSize; //每页的条数
  pagination.current = pageData.page; //当前页数
  if (!pagination.showTotal) {
    pagination.showTotal = (total, range) => `当前${range[0]}-${range[1]}条 总数${total}条`;
  }
  if (pagination.showQuickJumper != false) {
    pagination.showQuickJumper = true;
  }
  if (!pagination.showSizeChanger) {
    pagination.showSizeChanger = true;
  }
  if (!pagination.pageSizeOptions) {
    pagination.pageSizeOptions = ['10', '15', '20', '50', '100', '200', '500'];
  }
  return pagination;
};

/**
 * 获取行选中数据的处理
 */
export const getRowSelection = (rowSelection, checkbox, rowSelectionChange, selectedRowKeys) => {
  if (!checkbox) {
    return undefined;
  }
  if (!rowSelection) {
    rowSelection = {};
  }
  if (!rowSelection.type) {
    rowSelection.type = 'checkbox';
  }
  rowSelection.onChange = (selectedRowKeys, selectedRows) => {
    rowSelectionChange(selectedRowKeys, selectedRows);
  };
  rowSelection.selectedRowKeys = selectedRowKeys;
  return rowSelection;
};

/**
 * 处理成列表可以使用的列
 */
export const handleTableColumns = columns => {
  let newColumns = [];
  //循环处理数据
  for (let i = 0; i < columns.length; i++) {
    const ele = columns[i];
    let item = deepCopy(columns[i]);
    //如果该列是隐藏，则不需要使用该列
    if (item.hiddenFlag === true) {
      continue;
    }
    // if (
    //   item.sorted !== false &&
    //   item.title !== '序号' &&
    //   item.title !== '操作'
    // ) {
    //   item.sorter = true;
    // } else {
    //   item.sorter = false;
    // }
    if (!item.sorted) {
      item.sorter = false;
    } else {
      item.sorter = true;
    }
    //dataIndex不能为空
    if (!item.dataIndex) {
      alert('dataIndex不能为空');
      return item1;
    }
    //如果key不存在就设置dataIndex为key值
    if (!item.key) {
      item.key = item.dataIndex;
    }
    //列width或者minWidth必须至少设置一个
    if (!item.width && !item.minWidth) {
      alert('参数设置有误，width和minWidth必须设置一个！');
      return item1;
    }
    //如果列的最小宽度不存在，则设置width为最小宽度
    if (!item.minWidth) {
      item.minWidth = item.width;
    }
    //项缓存冻结列的数据，因为当列的宽度总和小于列表宽度的时候不需要是使用冻结列的
    if (item.fixed && item.fixed === 'left') {
      item.cacheFixed = 'left';
    } else if (item.fixed && item.fixed === 'right') {
      item.cacheFixed = 'right';
    }
    delete item.fixed;
    newColumns.push(item);
  }
  return newColumns;
};

/**
 * 获取真正展示时候的列的参数
 * @param {*} columns
 * @param {*} actions
 * @param {*} data
 */
export const getColumns = (columns, actionColumnsCfg, className, props, pagination) => {
  let newColumns = [];
  let currentPage = 0;
  let pageSize = 15;
  if (pagination) {
    currentPage = pagination.current - 1 || 0;
    pageSize = pagination.pageSize || 15;
  }
  let xuhao = [
    {
      dataIndex: 'index',
      title: '序号',
      minWidth: 70,
      width: 70,
      render: (text, record, index) => <div>{index + 1 + pageSize * currentPage}</div>,
    },
  ];

  let minWidthCount = 0; //最小宽度列（只有最小宽度这个参数）
  let minAllWidth = 0; //最小宽度列宽度之和
  let fieldAllWidth = 0; //除开序号列和操作列的宽度之和
  columns = xuhao.concat(columns);
  columns.map(item => {
    let newItem = { ...item };
    if (item.title !== '序号') {
      fieldAllWidth += parseInt(item.minWidth, 10);
    }
    if (!item.width) {
      minWidthCount++;
      minAllWidth += parseInt(item.minWidth, 10);
    }
    newColumns.push(newItem);
  });

  if (actionColumnsCfg !== undefined) {
    newColumns.push(actionColumnsCfg);
  }

  //获取对象的宽度，如果当前对象宽度为0，表明此对象是被隐藏了，此时需要获取他父级的宽度
  function getWidth(width, obj) {
    if (width <= 0) {
      const paddintLeft = getStyle(obj.parentNode, 'paddingLeft')
        ? getStyle(obj.parentNode, 'paddingLeft')
        : 0;
      const paddingRight = getStyle(obj.parentNode, 'paddingRight')
        ? getStyle(obj.parentNode, 'paddingRight')
        : 0;
      const borderLeft = getStyle(obj.parentNode, 'borderLeftWidth')
        ? getStyle(obj.parentNode, 'borderLeftWidth')
        : 0;
      const borderRight = getStyle(obj.parentNode, 'borderRightWidth')
        ? getStyle(obj.parentNode, 'borderRightWidth')
        : 0;
      width =
        obj.parentNode.clientWidth -
        parseInt(paddintLeft, 10) -
        parseInt(paddingRight, 10) -
        parseInt(borderLeft, 10) -
        parseInt(borderRight, 10);
      if (obj.className.includes('ant-table-expanded-row')) {
        //如果为二级列表，则需要减去第一个TD的宽度
        width = (width - 50) * 0.98;
      }
      return getWidth(width, obj.parentNode);
    }
    return width;
  }
  let width = undefined; //默认列不需要设置宽度
  if (document.getElementsByClassName(className)[0]) {
    //存在二级列表时候的+号列50
    const expandWidth = props.expandedRowRender === undefined ? 0 : 50;
    //滚动条宽度20
    const scollWidth = props.autoHeightFlag === true ? 0 : 20;
    //选择框列63
    const selectFieldWidth = props.checkbox === true ? 63 : 0;
    //列表的宽度
    let tableWidth = document.getElementsByClassName(className)[0].offsetWidth;
    tableWidth = getWidth(tableWidth, document.getElementsByClassName(className)[0]);
    //列的实际宽度
    let trueWidth = scollWidth + selectFieldWidth + expandWidth;
    newColumns.map((item, index) => {
      trueWidth += parseInt(item.minWidth, 10);
      return item;
    });
    //如果列的宽度大于列表的宽度的时候，需要冻结列
    if (trueWidth > tableWidth) {
      newColumns.map((item, index) => {
        // item.width = parseInt(item.minWidth, 10);
        //此时会出现横向滚动条，设置最小宽度列的字段不设置具体的宽度以适应弹性布局，主要是为了解决会出现白色垂直空隙
        if (item.cacheFixed) {
          item.fixed = item.cacheFixed;
        }
        return item;
      });
      width = trueWidth;
    } else if (trueWidth === tableWidth) {
      //如果列的宽度等于列表的宽度的时候，不需要做任何的处理
      newColumns.map((item, index) => {
        item.width = parseInt(item.minWidth, 10);
        return item;
      });
    } else {
      //如果列的宽度小于列表的宽度的时候，存在最小宽度列，则把剩余宽度平分到最小宽度列，如果没有，则平分到除了序号和操作列的其他列
      const elseWidth = tableWidth - trueWidth;
      if (minWidthCount === 0) {
        //没有扩展列
        newColumns.map((item, index) => {
          if (
            item.dataIndex &&
            item.dataIndex !== 'rowId' &&
            item.title !== '序号' &&
            item.dataIndex !== 'ACTION'
          ) {
            item.width =
              parseInt(item.minWidth, 10) +
              parseInt((elseWidth * parseInt(item.minWidth, 10)) / fieldAllWidth, 10);
          }
          return item;
        });
      } else {
        newColumns.map((item, index) => {
          if (!item.width) {
            //最小宽度列
            // item.width =
            //   parseInt(item.minWidth, 10) +
            //   parseInt((elseWidth * parseInt(item.minWidth, 10)) / minAllWidth, 10);
            item.width =
              parseInt(item.minWidth, 10) +
              parseInt((elseWidth * parseInt(item.minWidth, 10)) / minAllWidth, 10);
          }
          return item;
        });
      }
    }
  }
  return { columns: newColumns, width: width };
};

/**
 * 刷新高度设置
 * @param {*} props
 * @param {*} state
 */
export const refreshHeight = (props, state, func) => {
  //如果需要自适应高度
  if (!props.autoHeightFlag && document.getElementsByClassName(state.className)) {
    let lastHeight = state.height;
    let height = getSuitHeight(document.getElementsByClassName(state.className)[0]);
    let titleHeight = props.titleHeight || props.titleHeight === 0 ? props.titleHeight : 40;
    //如果不显示头部，则头部的高度为0
    if (props.showHeader !== true) {
      titleHeight = 0;
    }
    let reduceHeight = 36 + titleHeight;
    if (props.footerFlag === false) {
      //如果不显示尾部
      reduceHeight = 5 + titleHeight;
    }
    height = height - reduceHeight;
    if (!lastHeight || lastHeight !== height) {
      func && func(height);
    }
  }
};

export const getTableDivHeigh = (height, autoHeightFlag, className, ele, bottomHeight = 28) => {
  if (autoHeightFlag) {
    return '100%';
  }
  if (height) {
    return height;
  }
  let tableDivHeight;
  if (ele) {
    tableDivHeight = window.innerHeight - getOffset(ele).top - bottomHeight;
  } else {
    tableDivHeight = getSuitHeight(document.getElementsByClassName(className)[0].parentNode);
  }
  return tableDivHeight;
};

/**
 * 获取操作列
 */
export const getActions = (actions, data, actionLength) => {
  if (actions === undefined || actions.length <= 0) {
    return undefined;
  }
  //1、过滤掉没有权限的操作列
  let newActions = [...actions];

  if (newActions.length <= 0) {
    return undefined;
  }
  //1、计算操作列的宽度
  let actionWidth = 80;
  if (data || data.length > 0) {
    //如果数据为空，则此时默认操作列的宽度为80px
    data.map(item => {
      let rowActions = [];
      for (let i = 0; i < newActions.length; i++) {
        if (newActions[i].isShow === undefined || newActions[i].isShow(item)) {
          rowActions.push(newActions[i]);
        }
      }
      let tempWidth = 16;
      if (newActions.length <= actionLength) {
        for (var i = 0; i < newActions.length; i++) {
          tempWidth += newActions[i].title.length * 14 + 17;
        }
        tempWidth -= 17;
      } else {
        for (var i = 0; i < actionLength - 1; i++) {
          tempWidth += newActions[i].title.length * 14 + 17;
        }
        tempWidth += 44;
      }

      if (actionWidth < tempWidth) {
        actionWidth = tempWidth;
      }
      return item;
    });
  }

  return {
    title: '操作',
    width: actionWidth + 'px',
    minWidth: actionWidth + 'px',
    cacheFixed: 'right',
    dataIndex: 'ACTION',
    key: 'ACTION',
    render: (text, record, index) => {
      return <Action action={newActions} record={record} key={index} actionLength={actionLength} />;
    },
  };
};

const deepCopy = obj => {
  if (typeof obj !== 'object') {
    return obj;
  }
  var newobj = {};
  for (var attr in obj) {
    newobj[attr] = deepCopy(obj[attr]);
  }
  return newobj;
};
