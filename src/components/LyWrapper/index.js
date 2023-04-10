import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getOffset } from '@/utils/utils';
// 此函数接收一个组件，winowHName组件接收props浏览器高度的名字
let domTop;
function withSubscription(WrappedComponent, winowHName) {
  //接收组件的生命周期
  const didMount = WrappedComponent.prototype.componentDidMount;
  const willMount = WrappedComponent.prototype.componentWillUnmount;
  return class extends WrappedComponent {
    componentDidMount() {
      if (didMount) {
        didMount.apply(this);
      }
      setTimeout(() => {
        if (winowHName) {
          this.setState({ [winowHName]: window.innerHeight });
        }
      }, 0);
      window.addEventListener('resize', this.setHeight, false);
    }
    componentWillUnmount() {
      if (willMount) {
        willMount.apply(this);
      }
      window.removeEventListener('resize', this.setHeight);
    }
    setHeight = () => {
      // resize的时候setState触发render函数，更新浏览器高度
      if (winowHName) {
        this.setState({ [winowHName]: window.innerHeight });
      }
    };
    render() {
      return super.render();
    }
  };
}

export default withSubscription;
