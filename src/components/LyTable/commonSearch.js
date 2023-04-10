import { Input , Button } from "antd";
import React from 'react';
const Search = Input.Search;

export default class CommonSearch extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleChange = (e) => {
    let queryValue= e.target.value.trim();
    this.props.setCommonSearchValue(queryValue);
  }


	render() {
    let { searchDivFlag , searchPlaceholder = '请输入查询条件' ,searchWidth = 300 , onSearch , onRest
          ,commonSearchValue} = this.props;
    //如果不需要通用搜索
    if(this.props.searchDivFlag === false){
      return null;
    }

		return(
      <div className={'yui-table-searchDiv'} style={{ marginBottom: '10px' }}>
        <Search
            placeholder={ searchPlaceholder }
            onSearch={onSearch}
            value={commonSearchValue}
            onChange={this.handleChange}
            style={{ width: searchWidth }}
        />
        <Button type="primary" style={{ margin: '0 10px' }} onClick={onSearch}>查询</Button>
        <Button type="Default" style={{ paddingLeft: 15 }} onClick={onRest} >重置</Button>
        {/* <a onClick={()=>this.setState({highSearch:true},this.refreshHeight)} style={{marginLeft:10,display:showAdvancBtn?'inline':'none'}}>[高级搜索]</a> */}
      </div>
		)
	}
}
