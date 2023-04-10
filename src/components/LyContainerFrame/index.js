import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars-patched';
import { Row, Col, Button } from 'antd';
import { getSize, createUuid } from '@/utils/utils';

class LyContainerFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  stopLoading = () => {
    this.setState({
      loading: false,
    });
  };

  handleSave = () => {
    this.setState({
      loading: true,
    });
    this.props.onOk && this.props.onOk(this.stopLoading);
  };

  getButtons = () => {
    let list = [];
    let buttons = this.props.buttons;
    if (buttons) {
      list = [...buttons];
    }
    if (this.props.onOk) {
      list.push(
        <Button
          key={createUuid()}
          type="primary"
          onClick={this.handleSave}
          loading={this.props.loading !== undefined ? this.props.loading : this.state.loading}
        >
          {this.props.okText}
        </Button>
      );
    }
    if (this.props.onCancel) {
      list.push(
        <Button style={{ marginLeft: '16px' }} key={createUuid()} onClick={this.props.onCancel}>
          {this.props.cancelText}
        </Button>
      );
    }
    return list;
  };

  render() {
    let { hideHeader, title, visible, height, marginBottom0 } = this.props;
    let contentHeight = height
      ? parseInt(height)
      : getSize().windowH -
        181 -
        (marginBottom0 != undefined ? marginBottom0 : 20) -
        (hideHeader ? 0 : 50);

    if (visible === false) {
      return null;
    }

    return (
      <div style={{ background: 'white' }}>
        {hideHeader ? null : (
          <div
            style={{
              width: '100%',
              padding: '10px 16px',
              borderBottom: '1px solid #F0F0F0',
              marginBottom: marginBottom0 != undefined ? marginBottom0 : '20px',
            }}
          >
            <Row>
              <Col
                span={16}
                style={{
                  fontSize: '16px',
                  color: '#333',
                  lineHeight: '32px',
                  fontWeight: 600,
                }}
              >
                {title}
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                {this.getButtons()}
              </Col>
            </Row>
          </div>
        )}
        <Scrollbars autoHide style={{ width: '100%', height: contentHeight }}>
          <div style={{ height: '100%' }}>{this.props.children}</div>
        </Scrollbars>
      </div>
    );
  }
}

/**
 *  NHContainerFrame默认属性
 */
LyContainerFrame.defaultProps = {
  hideHeader: false,
  title: '标题', //页面标题
  visible: false, //默认不可见
  buttons: [], //自定义按钮组
  okText: '保存',
  cancelText: '返回',
};

/**
 *  NHContainerFrame属性检查
 */
LyContainerFrame.propTypes = {
  hideHeader: PropTypes.bool, //隐藏头部
  title: PropTypes.string.isRequired, //页面标题
  visible: PropTypes.bool, //是否显示,默认为false
  buttons: PropTypes.arrayOf(PropTypes.object), //按钮组,例如:[<Button>自定义按钮</Button>]
  onOk: PropTypes.func, //保存事件回调方法,如果该方法不存在，则没有保存按钮
  onCancel: PropTypes.func.isRequired, //返回事件回调方法,如果该方法不存在，则返回按钮不存在
  height: PropTypes.number, //内嵌框的高度
};

export default LyContainerFrame;
