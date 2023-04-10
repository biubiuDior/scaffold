import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-patched';

export default class _Scrollbars extends React.Component {
  render() {
    const { children, ...restProps } = this.props;

    return <Scrollbars {...restProps}>{children}</Scrollbars>;
  }
}
