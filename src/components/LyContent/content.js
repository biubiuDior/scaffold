/*
 * @Description: 页面内容布局
 * @Author: admin
 * @Date: 2020-03-18 10:01:06
 * @LastEditors: wucuiyi
 * @LastEditTime: 2021-08-30 15:12:29
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars, LyContainerFrame, LyDrawer, DragModal } from '@/components';
import { getOffset } from '@/utils/utils';
import useWindowSize from 'react-use/lib/useWindowSize'; //用这个有时候会出现滚动条

const Content = React.forwardRef((props, ref) => {
  //是否显示内边框
  let {
    className,
    isScrollbar = true,
    paddingFlag = true,
    marginFlag = true,
    overflowHide = false,
    children,
    html,
    tableFlag,
    maxHeight,
    height, //浏览器高度
    heightToTop,
    heightToBottem,
  } = props;
  const { width: windowW } = useWindowSize();
  let marginSize = 16; //maring大小
  if (windowW >= 1336 && windowW < 1440) {
    marginSize = 12;
  } else if (windowW < 1336) {
    marginSize = 8;
  }

  if (marginFlag) {
    heightToTop += marginSize;
  }

  const contentHeight = maxHeight ? maxHeight : height - heightToTop - heightToBottem;
  let _content = (
    <div
      style={{
        padding: paddingFlag === true ? 16 : 0,
        height: isScrollbar ? contentHeight : 'auto',
        overflow: overflowHide ? 'hidden' : 'initial',
      }}
    >
      {html}
    </div>
  );
  // 是否有滚动条
  if (isScrollbar) {
    _content = (
      <Scrollbars autoHide style={{ height: contentHeight }}>
        {_content}
      </Scrollbars>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        margin: marginFlag === true ? marginSize : '0px',
        background: 'white',
        height: isScrollbar ? contentHeight : 'auto',
      }}
    >
      <div style={{ display: tableFlag === true ? 'block' : 'none' }}>{_content}</div>
      <div style={{ display: tableFlag === false ? 'block' : 'none' }}>{children}</div>
    </div>
  );
});

class LyContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frameVisibleMap: {
        //是否显示内嵌框或抽屉
        tableFlag: true,
      },
      modalsTypeMap: {}, //弹窗的类型
      height: window.innerHeight,
      heightToTop: 218,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      if (this.contentRef) {
        this.setState({
          heightToTop: getOffset(this.contentRef).top,
        });
      }
    }, 0);
  }

  //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
  UNSAFE_componentWillMount() {
    let modals = this.props.modals;
    if (modals && modals.length > 0) {
      let modalsTypeMap = this.state.modalsTypeMap;
      for (let i = 0; i < modals.length; i++) {
        modalsTypeMap[modals[i].key] = modals[i].type;
      }
      this.setState({ modalsTypeMap: modalsTypeMap });
    }
  }

  //设置当前页面显示（内嵌和抽屉）
  setCurrentPageShow = showFlagName => {
    let frameVisibleMap = this.state.frameVisibleMap;
    frameVisibleMap[showFlagName] = true;
    for (let name in frameVisibleMap) {
      if (name !== showFlagName) {
        frameVisibleMap[name] = false;
      }
    }
    this.setState({
      frameVisibleMap: frameVisibleMap,
    });
  };

  //面板关闭按钮点击事件
  handleCloseFrame = () => {
    this.setCurrentPageShow('tableFlag');
  };

  /**
   * 获取表单窗口的渲染代码
   */
  getModalHtml = () => {
    let modals = this.props.modals;
    if (modals && modals.length > 0) {
      let list = [];
      for (let i = 0; i < modals.length; i++) {
        const item = modals[i];
        if (item.type === 'inline') {
          //内嵌
          list.push(this.getContainerFrame(item));
        } else if (item.type === 'modal') {
          //弹窗
          list.push(this.getModal(item));
        } else if (item.type === 'drawer') {
          //抽屉
          list.push(this.getDrawer(item));
        } else {
          list.push(this.getDefaultModals(item));
        }
      }
      return list;
    }
    return null;
  };

  /**
   * 获取内嵌框信息
   */
  getContainerFrame = item => {
    let frameVisible = this.state.frameVisibleMap[item.key] === true ? true : false;
    if (!frameVisible) return null;
    return (
      <LyContainerFrame
        key={item.key + frameVisible}
        hideHeader={item.hideHeader}
        title={item.title}
        visible={frameVisible}
        loading={item.loading}
        onOk={item.onOk ? item.onOk : null}
        onCancel={item.onCancel ? item.onCancel : this.handleCloseFrame}
        okText={item.okText}
        cancelText={item.cancelText}
      >
        {item.render ? item.render() : null}
      </LyContainerFrame>
    );
  };

  /**
   * 获取弹窗
   */
  getModal = item => {
    let frameVisible = this.state.frameVisibleMap[item.key] === true ? true : false;
    if (!frameVisible) return null;
    return (
      <DragModal
        key={item.key + frameVisible}
        title={item.title}
        visible={frameVisible}
        confirmLoading={item.loading}
        onCancel={item.onCancel ? item.onCancel : this.handleCloseFrame}
        onOk={item.onOk ? item.onOk : null}
        footer={item.footer}
        okText={item.okText}
        cancelText={item.cancelText}
        maskClosable={item.maskClosable == undefined ? false : item.maskClosable}
      >
        {item.render ? item.render() : null}
      </DragModal>
    );
  };

  /**
   * 获取抽屉
   */
  getDrawer = item => {
    let frameVisible = this.state.frameVisibleMap[item.key] === true ? true : false;
    if (!frameVisible) return null;
    return (
      <LyDrawer
        key={item.key + frameVisible}
        title={item.title}
        onClose={() => {
          this.handleCloseFrame();
          item.onClose && item.onClose();
        }}
        visible={frameVisible}
        onOk={item.onOk}
        width={item.width}
        loading={item.loading}
        bottom={item.bottom}
        className={item.className}
        destroyOnClose={item.destroyOnClose === false ? false : true}
      >
        {item.render ? item.render() : null}
      </LyDrawer>
    );
  };

  getDefaultModals = item => {
    return <div>{item.render ? item.render() : null}</div>;
  };

  //***********************************************************//
  //*********************对外提供的方法-开始*********************//
  //***********************************************************//
  /**
   * 显示弹窗
   */
  show = id => {
    if (!id) {
      return;
    }
    if (this.state.modalsTypeMap[id] === 'inline') {
      this.setCurrentPageShow(id);
    } else {
      let frameVisibleMap = this.state.frameVisibleMap;
      frameVisibleMap[id] = true;
      this.setState({
        frameVisibleMap: frameVisibleMap,
      });
    }
  };

  /**
   * 关闭弹窗
   */
  close = id => {
    // if(!id){return;}
    this.setCurrentPageShow('tableFlag');
  };
  render() {
    const {
      className,
      isScrollbar,
      marginFlag,
      paddingFlag,
      children,
      refreshTop,
      heightToBottem = 0,
      ...other
    } = this.props;
    let heightToTop = this.state.heightToTop;
    if (this.contentRef && refreshTop) {
      //LyContent距离浏览器顶部的距离会变化时，需要重新获取top
      heightToTop = getOffset(this.contentRef).top;
    }
    return (
      <Content
        ref={el => {
          this.contentRef = el;
        }}
        isScrollbar={isScrollbar}
        html={children}
        tableFlag={this.state.frameVisibleMap.tableFlag}
        paddingFlag={paddingFlag}
        marginFlag={marginFlag}
        className={className}
        height={this.state.height}
        heightToBottem={heightToBottem}
        {...other}
        heightToTop={heightToTop}
      >
        {this.getModalHtml()}
      </Content>
    );
  }
}

export default LyContent;
