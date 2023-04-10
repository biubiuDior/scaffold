import React from 'react';
import {Icon} from "antd";

export default class Tip extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }


	render() {
    if(!this.props.tip){
      return null;
    }
		return(
      <div className={'yui-table-tips-div'} style={{ marginBottom: '10px' }}>
        <Icon type="info-circle" />{this.props.tip}
      </div>
		)
	}
}
