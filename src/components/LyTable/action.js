import React from 'react';
import { Divider, Menu, Dropdown, Icon } from 'antd';
import { createUuid } from '@/utils/utils';

class Action extends React.Component {
  static defaultProps = {
    action: [],
    record: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let initAction = this.props.action;
    let record = this.props.record;
    let actionLength = this.props.actionLength; //需要展示的列数
    let action = [];
    for (let i = 0; i < initAction.length; i++) {
      if (initAction[i].isShow === undefined || initAction[i].isShow(record)) {
        action.push(initAction[i]);
      }
    }
    let actionHtml = [];
    const getActionDiv = (data, length, ...others) => {
      let resDiv = [];
      for (let i = 0; i < length; i++) {
        resDiv.push(
          <a
            key={createUuid()}
            onClick={() => {
              if (action[i].onClick) {
                action[i].onClick(record);
              }
            }}
          >
            {action[i].title}
          </a>
        );
        if (i < length - 1) {
          resDiv.push(<Divider key={createUuid()} type="vertical" />);
        }
      }
      if (others) {
        resDiv.push(...others);
      }
      return resDiv;
    };

    if (action.length <= actionLength) {
      actionHtml.push(<div key={createUuid()}>{getActionDiv(action, action.length)}</div>);
    } else {
      let menuItems = [];
      for (let i = actionLength - 1; i < action.length; i++) {
        menuItems.push(
          <Menu.Item key={i}>
            <a
              onClick={() => {
                if (action[i].onClick) {
                  action[i].onClick(record);
                }
              }}
            >
              {action[i].title}
            </a>
          </Menu.Item>
        );
      }
      const menu = <Menu>{menuItems}</Menu>;
      const MoreBtn = () => (
        <Dropdown overlay={menu}>
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
      actionHtml.push(
        <div key={createUuid()}>
          {getActionDiv(
            action,
            actionLength - 1,
            <Divider key={createUuid()} type="vertical" />,
            <MoreBtn key={createUuid()} />
          )}
        </div>
      );
    }
    return <div>{actionHtml}</div>;

  }
}

export default Action;
