import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Table, message, Input, Tooltip, Checkbox } from 'antd';
import { createUuid, isSearchKeyReg, arrayMove, findValueFormObject } from '@/utils/utils';
import { post, get } from '@/utils/AxiosUtil';
import Tip from './tip';
import moment from 'moment';
import CommonSearch from './commonSearch';
import { LySearch, DragModal } from '@/components';
import {
  getPagination,
  getRowSelection,
  handleTableColumns,
  refreshHeight,
  getColumns,
  getActions,
  getTableDivHeigh,
} from './data.js';
import './index.less';
import { connect } from 'dva';
import { SortableContainer, SortableElement } from 'react-sortable-hoc'; // 拖拽排序

const Search = Input.Search;
@connect(
  ({ table }) => {
    return { renderFlag: table.renderFlag };
  },
  null,
  null,
  { forwardRef: true }
)
class LyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      className: createUuid(),
      sorter: {
        //排序字段参数
        columnKey: undefined,
        order: undefined,
      },
      pageData: {
        //分页设置的是三个参数
        total: 0,
        pageSize: 15, //当前页默认多少条数据 =>改15条
        page: 1,
      },
      selectedRows: [], //选中的数据
      selectedRowKeys: [], //选中的数据的主键
      loading: false,
      data: [],
      columns: [], //处理好之后的参数列,显示数据也是使用该列，只有在传进来的columns参数有改变的时候才会中心计算该配置
      actionColumnsCfg: undefined, //操作列的配置，只有在数据有改变的时候，才需要重新计算该配置
      // height: props.autoHeightFlag === true ? undefined : props.height, //列表的高度
      tableDivHeight: props.autoHeightFlag === true ? '100%' : props.height, //列表最外层DIV的高度
      tableSearchParams: {
        //列表的查询条件，该参数中存放的是通用设置的
        commonSearchValue: undefined, //通用搜索条件
      },
      showOperationBtn: false, //是否显示需要选中数据的按钮
      tableHideFlag: false, //列表是否隐藏
      searchFormParams: {}, //searchForm表单的查询参数
      exportModel: false,
      exportTitle: '', //导出excel文件的标题
      exportArray: [], //导出excel文件的表头
      exportKeyArray: [], //导出excel文件的json数据中的key
    };
  }

  //第一次渲染完成的时候会触发该方法
  componentDidMount() {
    this.refreshTable();
    window.addEventListener('resize', this.refreshTable, false);
    //加载数据
    if (this.props.isDefaultLoadData !== false) {
      this.filterTableData();
    }
  }

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    if (nextProps.height && nextProps.height !== this.props.height) {
      this.setState({ tableDivHeight: nextProps.height });
    }
  }

  componentDidUpdate() {
    //重新计算列表内容区域的高度
    // && this.isDefaultLoadData
    if (this.state.tableDivHeight !== undefined) {
      setTimeout(() => {
        if (!this.props.autoHeightFlag && !this.props.height && this.yuiTable) {
          const tableDivHeight =
            window.innerHeight -
            this.yuiTable.getBoundingClientRect().top -
            this.props.bottomHeight;
          if (tableDivHeight !== this.state.tableDivHeight) {
            this.setState({ tableDivHeight });
          }
        }
      }, 0);
      // this.refreshTable();
      refreshHeight(this.props, this.state, height => {
        this.setTableContentHeight(height);
        this.setState({ height: height });
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.refreshTable, false);
  }

  // 设置表格内容高度
  setTableContentHeight = height => {
    if (!height) return;
    var boxDom = document.getElementsByClassName(this.state.className)[0];
    if (boxDom) {
      var tableDom = boxDom.querySelector('.ant-table .ant-table-body');
      var placeholderDom = boxDom.querySelector('.ant-table .ant-table-placeholder');
      if (tableDom) {
        tableDom.style.minHeight = height + 'px';
      }
    }
  };
  // 重置table
  refreshTable = () => {
    let columns = handleTableColumns(this.props.columns); //第一次进来处理一下列的信息
    let tableDivHeight = getTableDivHeigh(
      this.props.height,
      this.props.autoHeightFlag,
      this.state.className,
      this.yuiTable,
      this.props.bottomHeight
    ); //第一次进来先获取
    this.setState({
      columns: columns,
      tableDivHeight: tableDivHeight,
    });
    refreshHeight(this.props, this.state, height => {
      this.setTableContentHeight(height);
      this.setState({ height: height });
    });
  };

  /**
   * 行被选中的回调事件
   */
  rowSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
      showOperationBtn: selectedRowKeys.length > 0 ? true : false,
    });
    this.props.rowSelectionChange && this.props.rowSelectionChange(selectedRowKeys, selectedRows);
    // this.props.onSelect && this.props.onSelect(selectedRowKeys, selectedRows);
  };
  /**button里面的搜索框改变 */
  handleChange = e => {
    let queryValue = e.target.value.trim();
    this.setCommonSearchValue(queryValue);
  };
  /**
   * 设置通用搜索条件的值
   */
  setCommonSearchValue = value => {
    let tableSearchParams = this.state.tableSearchParams;
    tableSearchParams.commonSearchValue = value;
    this.setState({
      tableSearchParams: tableSearchParams,
    });
  };

  /**
   * 当Table有变动的时候会触发此方法
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      (prevState, props) => ({
        sorter: {
          columnKey: sorter.columnKey,
          order: sorter.order,
        },
        pageData: {
          total: this.state.pageData.total,
          pageSize: pagination.pageSize,
          page: pagination.current,
        },
      }),
      function() {
        this.readTableData();
      }
    );
    this.props.onChange && this.props.onChange(pagination, filters, sorter);
  };

  //重新加载数据数据的方法（从第一页开始）
  filterTableData = (params = {}) => {
    this.setState(
      (prevState, props) => ({
        pageData: {
          total: this.state.pageData.total,
          pageSize: this.state.pageData.pageSize,
          page: 1,
        },
      }),
      () => this.readTableData(params)
    );
  };

  //在当前页刷新数据
  readTableData = params => {
    const { getSearchValues } = this.props;
    const getData = (params = {}) => {
      let filterParams = this.getFilterParams(); //查询的参数
      // if (filterParams.searchKey && !isSearchKeyReg(filterParams.searchKey)) {
      //   message.warning('不可输入特殊字符');
      //   return false;
      // }
      const _params = {
        ...filterParams,
        ...params,
      };
      this.setState({ loading: true });
      const baseUrl = this.props.baseUrl;
      let url = this.props.url;
      get(url, _params)
        .then(res => {
          if (res) {
            this.setState(
              {
                data: res.data.list ? res.data.list : [],
                selectedRowKeys: [],
                selectedRows: [],
                showOperationBtn: false, //不显示危险按钮
                pageData: {
                  total: Number(res.data.total),
                  pageSize: this.state.pageData.pageSize,
                  page: this.state.pageData.page,
                },
              },
              () => {
                this.setState({
                  actionColumnsCfg: getActions(
                    this.props.actions,
                    res.data.list ? res.data.list : [],
                    this.props.actionLength
                  ),
                });
              }
            );
          }
          this.setState({ loading: false });
        })
        .catch(res => {
          this.setState({ loading: false });
          return res;
        });
    };
    if (getSearchValues) {
      getSearchValues((params = {}) => {
        getData(params);
      });
    } else {
      getData(params);
    }
  };

  /**
   * 获取查询时候的参数
   */
  getFilterParams = () => {
    let pagination = this.state.pageData; //分页的参数
    let sorter = this.state.sorter; //过滤的数据
    let searchParams = this.props.searchParams; //传递过来的查询参数
    let commonSearchValue = this.state.tableSearchParams.commonSearchValue; //通用查询条件的值
    let searchFormParams = this.state.searchFormParams;
    if (!searchParams) {
      searchParams = {};
    }
    let params = {
      pageSize: this.state.pageData.pageSize,
      page: this.state.pageData.page,
      //   sorter: sorter,
      ...searchFormParams,
      ...searchParams,
      ...sorter,
      // searchKey: commonSearchValue,
    };
    params[this.props.searchKey] = commonSearchValue;

    return params;
  };

  //搜索操作
  onSearch = () => {
    this.filterTableData();
  };
  //重置操作
  onRest = () => {
    this.setState(
      (prevState, props) => ({
        tableSearchParams: {}, //列表的搜索条件
        selectedRows: [], //选中的数据
        selectedRowKeys: [], //选中的数据的主键
        showOperationBtn: false, //不显示危险按钮
      }),
      () => {
        this.filterTableData();
      }
    );
  };

  /**
   * 危险按钮点击事件
   */
  handleDangerBtn = (onClick, e, type) => {
    const { selectedRowKeys, selectedRows } = this.state;
    if (type === false) {
      onClick && onClick(selectedRowKeys, selectedRows, e);
    } else {
      if (selectedRows && selectedRows.length > 0) {
        onClick && onClick(selectedRowKeys, selectedRows);
      } else {
        message.warn('请先选择需要操作的数据！');
      }
    }
  };

  /**
   * 导出Excel文件
   */
  handleExportBtnClick = title => {
    console.log('title', title);
    title = title ? title : '批量导出Excel数据';
    let { columns, exportKeyArray, exportArray } = this.state;
    columns.map(item => {
      if (item.exportCheck) {
        exportArray.push(item.title);
        exportKeyArray.push(item.exportValue || item.dataIndex);
      }
    });
    this.setState(
      {
        exportModel: true,
        exportTitle: title, //表名称
        exportArray: exportArray,
        exportKeyArray: exportKeyArray,
      },
      () => {
        console.log('--------', this.state.exportTitle);
      }
    );
  };
  handleCheckBoxChange = e => {
    const { exportArray, exportKeyArray } = this.state;
    let checkbox = e.target.checked;
    let value = e.target.value;
    let dataKey = e.target.exportValue || e.target.dataKey;
    if (checkbox) {
      this.setState({
        exportArray: exportArray.concat(value),
        exportKeyArray: exportKeyArray.concat(dataKey),
      });
    } else {
      exportArray.splice(exportArray.indexOf(value), 1);
      exportKeyArray.splice(exportKeyArray.indexOf(dataKey), 1);
      this.setState({
        exportArray: exportArray,
      });
    }
  };
  handleSortEnd = value => {
    const { exportKeyArray } = this.state;
    let oldIndex = value.oldIndex;
    let newIndex = value.newIndex;
    let exportArray = [...this.state.exportArray];
    this.setState({
      exportArray: arrayMove(exportArray, oldIndex, newIndex),
      exportKeyArray: arrayMove(exportKeyArray, oldIndex, newIndex),
    });
  };
  // 关闭导出excel弹窗
  handleCloseExportExcle = () => {
    this.setState({
      exportModel: false,
      exportArray: [],
      exportKeyArray: [],
    });
  };
  // 确定导出excel
  handleExportExcle = () => {
    var explorer = window.navigator.userAgent;

    var isIE = explorer.indexOf('MSIE') > -1; //判断是否IE
    var isEdge = explorer.indexOf('Edge') > -1; //判断是否IE的Edge浏览器
    if (isIE) {
      this.exportExcelForIE(true);
    } else if (isEdge) {
      this.exportExcelForIE();
    } else {
      this.exportExcle();
    }
    this.handleCloseExportExcle();
  };
  // IE/Edge
  exportExcelForIE = isIE => {
    const { exportArray, exportKeyArray, exportTitle, data } = this.state;
    let str = exportArray.join('</td><td>'); //表头
    str = '<tr><td>' + str + '</td></tr>';

    for (let i = 0; i < data.length; i++) {
      str += '<tr>';
      for (let j = 0; j < exportKeyArray.length; j++) {
        let td;
        if (typeof exportKeyArray[j] == 'function') {
          td = exportKeyArray[j](data[i]);
        } else {
          td = findValueFormObject(data[i], exportKeyArray[j], '');
        }
        if (typeof td === 'object') {
          td = JSON.stringify(td);
        }
        str += `<td>${td}\t</td>`;
      }
      str += '</tr>';
    }
    //下载的表格模板数据
    let template = `<html><head><meta charset="UTF-8"></head><body><table align="left" border="1">${str}</table></body></html>`;
    var excelBlob = new Blob([template], { type: 'application/vnd.ms-excel' });
    //ie没有反应？？
    console.log(55, isIE);
    if (isIE) {
      excelBlob = new Blob(['\ufeff' + '标题,列表,列表2\n'], { type: 'text/csv,charset=UTF-8' });
      console.log(99, excelBlob);
      // excelBlob = new Blob([template], { type: 'text/csv' });
      window.navigator.msSaveOrOpenBlob(excelBlob, `${exportTitle}.csv`);
    } else {
      var oa = document.createElement('a');
      oa.href = URL.createObjectURL(excelBlob);
      oa.download = `${exportTitle}.xls`;
      document.body.appendChild(oa);
      oa.click();
    }
  };
  // 导出excel
  exportExcle = () => {
    const { exportArray, exportKeyArray, exportTitle, data } = this.state;
    let str = exportArray.join(',') + '\n'; //表头
    // 先判断
    let sexIndex = exportKeyArray.findIndex(item =>item === 'sex')
    let stateIndex = exportKeyArray.findIndex(item =>item === 'state')
    let expirationDateIndex = exportKeyArray.findIndex(item =>item === 'expirationDate')
    if(sexIndex !==-1){
      let newData = data.map((item)=>{
        if(item.sex === '1'){
          item.sex = '男'
          return item
        }else if(item.sex === '2'){
          item.sex = '女'
          return item
        }
      })
    }
    if(stateIndex !==-1){
      let newStateData = data.map((item)=>{
        if(item.state === '0'){
          item.state = '禁用'
          return item
        }else if(item.state === '1'){
          item.state = '启用'
          return item
        }
      })
    }
    if(expirationDateIndex !==-1){
      let newStateData = data.map((item)=>{
        if(item.expirationDate){
          item.expirationDate = moment(item.expirationDate).format("YYYY-MM-DD")
          return item
        }
      })
    }
    //增加\t为了不让表格显示科学计数法或者其他格式
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < exportKeyArray.length; j++) {
        let td;
        if (typeof exportKeyArray[j] == 'function') {
          td = exportKeyArray[j](data[i]);
        } else {
          td = findValueFormObject(data[i], exportKeyArray[j], '');
          console.log('td',td)
        }
        if (typeof td === 'object') {
          td = JSON.stringify(td);
        }
        if (typeof td === 'string') {
          td = td.replace(/,/g, '，');
        }
        str += `${td}\t,`;
      }
      str += '\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement('a');
    link.href = uri;
    //对下载的文件命名
    if(this.props.downloadFormat === 'excel'){
      link.download = `${exportTitle}.xlsx`;
    }else {
      link.download = `${exportTitle}.csv`;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  /**
   * 获取弹窗
   */
  getModal = item => {
    const { exportArray, exportKeyArray, columns } = this.state;
    //
    const SortableItem = SortableElement(({ item }) => {
      return (
        <Checkbox
          style={{ marginRight: '16px', marginTop: '5px', marginLeft: 0 }}
          defaultChecked
          disabled
        >
          {item}
        </Checkbox>
      );
    });

    const SortableList = SortableContainer(({ items }) => {
      return (
        <div className={'yui-expCheckBoxTop'}>
          {items.length > 0 &&
            items.map((item, index) => {
              return (
                <SortableItem
                  key={index}
                  item={item}
                  index={index}
                  itemIndex={index}
                  sortableHelperWithOverride="sortable-helper"
                />
              );
            })}
        </div>
      );
    });

    return (
      <DragModal
        key={'exportExcle'}
        visible={this.state.exportModel}
        // title={'配置表头'}
        title={this.state.exportTitle}
        onCancel={this.handleCloseExportExcle}
        onOk={this.handleExportExcle}
      >
        <div>
          <p>显示字段（拖动可自定义排序）</p>
          <SortableList
            items={exportArray}
            onSortEnd={this.handleSortEnd}
            axis="xy"
            helperClass="yui-table-sortable-item"
          />
        </div>
        <div>
          <p>可配置字段</p>
          <Checkbox.Group style={{ width: '100%' }} defaultValue={exportArray}>
            {columns.map((item, index) => {
              return (
                <Checkbox
                  key={index}
                  style={{ marginRight: '16px', marginTop: '5px', marginLeft: 0 }}
                  dataKey={item.dataIndex}
                  exportValue={item.exportValue}
                  disabled={item.exportDisable}
                  value={item.title}
                  onChange={this.handleCheckBoxChange}
                >
                  {item.title}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </div>
      </DragModal>
    );
  };
  /**
   * 获取按钮渲染代码
   */
  getButtonsHtml = () => {
    const { selectedRowKeys } = this.state;
    let buttonsParamsList = this.props.buttons;
    if (buttonsParamsList && buttonsParamsList.length > 0) {
      let buttons = [];
      for (let i = 0; i < buttonsParamsList.length; i++) {
        let ele = buttonsParamsList[i];
        if (ele.type === 'danger') {
          ele.isShouldSelect = true;
        }
        const disabled = ele.isShouldSelect && !selectedRowKeys.length > 0;
        const tooltipTitle = ele.isShouldSelect && disabled ? '请先选择需要操作的数据' : '';
        //如果该按钮没有权限，则直接跳过该按钮
        // if(ele.auth && !hasAuth(ele.auth)){
        //   continue;
        // }
        if (ele.type === 'primary') {
          //主按钮
          buttons.push(
            <Tooltip title={tooltipTitle} key={i}>
              <Button
                style={{ marginRight: 10 }}
                type="primary"
                disabled={disabled}
                onClick={e => this.handleDangerBtn(ele.onClick, e, ele.isShouldSelect || false)}
              >
                {ele.title}
              </Button>
            </Tooltip>
          );
        } else if (ele.type === 'default') {
          //次级按钮
          buttons.push(
            <Tooltip title={tooltipTitle} key={i}>
              <Button
                style={{ marginRight: 10 }}
                type="primary"
                ghost
                disabled={disabled}
                onClick={e => this.handleDangerBtn(ele.onClick, e, ele.isShouldSelect || false)}
              >
                {ele.title}
              </Button>
            </Tooltip>
          );
        } else if (ele.type === 'danger') {
          //危险按钮
          buttons.push(
            <Tooltip title={tooltipTitle} key={i}>
              <Button
                style={{ marginRight: 10 }}
                type="danger"
                ghost
                disabled={disabled}
                onClick={() => this.handleDangerBtn(ele.onClick)}
              >
                {ele.title}
              </Button>
            </Tooltip>
          );
        } else if (ele.type === 'export') {
          //导出按钮
          buttons.push(
            <Button
              key={i}
              type="primary"
              ghost
              onClick={() => {
                this.handleExportBtnClick(ele.exportTitle);
              }}
              style={{
                marginRight: 10,
                ...(ele.isShouldSelect
                  ? {
                      display: this.state.showOperationBtn ? undefined : 'none',
                    }
                  : {}),
              }}
            >
              {ele.title ? ele.title : '导出Excel'}
            </Button>
          );
        } else if (ele.type === 'search') {
          buttons.push(
            <Search
              key={i}
              placeholder={ele.placeholder || '请输入搜索关键字'}
              onSearch={this.onSearch}
              value={this.state.tableSearchParams.commonSearchValue}
              onChange={this.handleChange}
              style={{ width: ele.searchWidth || 195, float: 'right' }}
              allowClear
            />
          );
        }
      }
      return (
        <div className="clearfix ly-table-buttonBox" style={{ marginBottom: '10px' }}>
          {buttons}
        </div>
      );
    }
    return null;
  };

  /**
   * 切换列表隐藏的状态
   */
  changeTableHideFlag = () => {
    let { tableHideFlag } = this.state;
    this.setState({
      tableHideFlag: tableHideFlag === true ? false : true,
    });
  };
  onSearchFormSearch = () => {
    this.lySearch.lyform.validateFields((error, values) => {
      if (!error) {
        this.setState({
          searchFormParams: values,
        });
        this.filterTableData(values);
      }
    });
    const { onSearch } = this.props.searchForm;
    onSearch ? onSearch() : false;
  };
  onSearchFormChange = (value, allValues) => {
    this.setState({
      searchFormParams: allValues,
    });
    const { onValuesChange } = this.props.searchForm;
    onValuesChange ? onValuesChange() : false;
  };
  getSearchForm = () => {
    const { searchForm } = this.props;
    if (!searchForm) return;
    const { onSearch, onValuesChange, ...other } = searchForm;
    return (
      <LySearch
        defalutSearchFlag={true}
        ref={el => (this.lySearch = el)}
        onSearch={this.onSearchFormSearch}
        onValuesChange={this.onSearchFormChange}
        {...other}
      />
    );
  };
  render() {
    let {
      size = 'small',
      bordered = false,
      columns,
      pagination,
      footerFlag,
      checkbox,
      rowSelection,
      tip,
      searchDivFlag,
      searchPlaceholder,
      searchWidth,
      dataSource,
      className: outClassName,
      noDataMinHeight,
      ...restProps
    } = this.props;
    let {
      loading,
      selectedRowKeys,
      data,
      className,
      tableDivHeight,
      tableSearchParams,
      tableHideFlag,
      paginationCfg,
      exportModel,
    } = this.state;
    let columnsCfg = getColumns(
      this.state.columns,
      this.state.actionColumnsCfg,
      className,
      this.props,
      paginationCfg
    );

    if (dataSource) {
      data = dataSource;
    }
    return (
      <div
        className={classNames('yui-table', outClassName)}
        style={{
          height: data == '' && noDataMinHeight ? noDataMinHeight : tableDivHeight,
          width: '100%',
          display: tableHideFlag === true ? 'none' : 'block',
        }}
        ref={el => (this.yuiTable = el)}
      >
        <CommonSearch
          onSearch={this.onSearch}
          onRest={this.onRest}
          searchDivFlag={searchDivFlag}
          searchPlaceholder={searchPlaceholder}
          searchWidth={searchWidth}
          setCommonSearchValue={this.setCommonSearchValue}
          commonSearchValue={tableSearchParams.commonSearchValue}
        />
        {exportModel && this.getModal()}
        {this.getSearchForm()}
        {this.getButtonsHtml()}
        {this.props.children ? (
          <div style={{ marginBottom: '10px' }}>{this.props.children}</div>
        ) : null}
        <Tip tip={tip} />
        <Table
          {...restProps}
          className={className}
          size={size}
          rowSelection={getRowSelection(
            rowSelection,
            checkbox,
            this.rowSelectionChange,
            selectedRowKeys
          )}
          dataSource={data}
          columns={columnsCfg.columns}
          pagination={getPagination(pagination, this.state.pageData, footerFlag)}
          loading={loading}
          bordered={bordered}
          onChange={this.handleTableChange}
          scroll={{
            x: columnsCfg.width,
            y: data == '' && noDataMinHeight ? noDataMinHeight : this.state.height,
          }}
        />
      </div>
    );
  }
}

LyTable.defaultProps = {
  columns: [],
  footerFlag: true,
  checkbox: true,
  autoHeightFlag: false,
  showHeader: true,
  isDefaultLoadData: true,
  searchDivFlag: false,
  searchKey: 'searchKey',
  bottomHeight: 28, //距离视窗底部距离
  actionLength: 3,
};

LyTable.propTypes = {
  url: PropTypes.string, //远程加载数据接口
  height: PropTypes.number, //设置列表最外层DIV的高度
  columns: PropTypes.array, //列参数
  footerFlag: PropTypes.bool, //是否需要尾部，如果不需要则说明此时不需要进行分页操作，一页就显示所有的数据
  checkbox: PropTypes.bool, //是否checkbox选中框
  rowSelectionChange: PropTypes.func, //行被选中的回调事件
  autoHeightFlag: PropTypes.bool, //是否列表高度和内容等高
  titleHeight: PropTypes.number, //标题头的高度
  isDefaultLoadData: PropTypes.bool, //是否默认加载数据，如果此参数为false,则默认不会加载数据,且此时显示加载中，这个主要是为了在当前模块还需要去后台查询初始化参数时，会出现开始就查询两次的情况
  tip: PropTypes.node, //列表的提示信息
  buttons: PropTypes.array, //列表的按钮
  searchDivFlag: PropTypes.bool, //是否需要通用搜索
  searchPlaceholder: PropTypes.string, //通用搜索提示信息
  searchWidth: PropTypes.number, //通用搜索框的宽度
  searchParams: PropTypes.any, //查询参数
  actionLength: PropTypes.number, //操作列做多显示列数，剩下的收起。
  searchForm: PropTypes.object, //搜索，传入参数同LySearch
};

export default LyTable;
