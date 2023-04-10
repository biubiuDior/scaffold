import React, { Component } from 'react';
import { Table } from 'antd';

export default class CommonTable extends Component {
  render() {
    return <Table {...this.props} />;
  }
}
