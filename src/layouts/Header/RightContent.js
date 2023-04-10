/*
 * @Description: 头部右侧信息
 * @Author: admin
 * @Date: 2020-03-06 09:45:51
 * @LastEditors: admin
 * @LastEditTime: 2020-04-13 15:02:29
 */
import React, { PureComponent } from 'react';
import { Spin, Tag, Menu, Icon, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { HeaderDropdown, SelectLang } from '@/components';
import styles from './index.less';
import classNames from 'classnames';

export default class GlobalHeaderRight extends PureComponent {
	//   getNoticeData() {
	//     const { notices = [] } = this.props;
	//     if (notices.length === 0) {
	//       return {};
	//     }
	//     const newNotices = notices.map(notice => {
	//       const newNotice = { ...notice };
	//       if (newNotice.datetime) {
	//         newNotice.datetime = moment(notice.datetime).fromNow();
	//       }
	//       if (newNotice.id) {
	//         newNotice.key = newNotice.id;
	//       }
	//       if (newNotice.extra && newNotice.status) {
	//         const color = {
	//           todo: '',
	//           processing: 'blue',
	//           urgent: 'red',
	//           doing: 'gold',
	//         }[newNotice.status];
	//         newNotice.extra = (
	//           <Tag color={color} style={{ marginRight: 0 }}>
	//             {newNotice.extra}
	//           </Tag>
	//         );
	//       }
	//       return newNotice;
	//     });
	//     return groupBy(newNotices, 'type');
	//   }

	//   getUnreadData = noticeData => {
	//     const unreadMsg = {};
	//     Object.entries(noticeData).forEach(([key, value]) => {
	//       if (!unreadMsg[key]) {
	//         unreadMsg[key] = 0;
	//       }
	//       if (Array.isArray(value)) {
	//         unreadMsg[key] = value.filter(item => !item.read).length;
	//       }
	//     });
	//     return unreadMsg;
	//   };

	//   changeReadState = clickedItem => {
	//     const { id } = clickedItem;
	//     const { dispatch } = this.props;
	//     dispatch({
	//       type: 'global/changeNoticeReadState',
	//       payload: id,
	//     });
	//   };

	render() {
		const { currentUser, onMenuClick, theme } = this.props;

		const menu = (
			<Menu className="ly-user-menu" selectedKeys={[]} onClick={onMenuClick}>
				{/* <Menu.Item key="userCenter">
          <Icon type="user" />
          <span>个人中心</span>
        </Menu.Item>
        <Menu.Divider /> */}
				<Menu.Item key="logout">
					<Icon type="logout" />
					<span>退出登录</span>
				</Menu.Item>
			</Menu>
		);

		return (
			<div className="ly-layout-header-right">
				{currentUser.userName || currentUser.userId ? (
					<HeaderDropdown placement="bottomRight" overlay={menu}>
            <span className="ly-user">
              {currentUser.headPortrait ? (
								<Avatar
									size="small"
									className="ly-user-avatar"
									src={currentUser.headPortrait}
									alt="avatar"
								/>
							) : (
								<div className="ly-user-char">
									{(currentUser.userName || currentUser.userId).substr(0, 1).toLocaleUpperCase()}
								</div>
							)}
							<span className={classNames({ 'ly-user-name': theme === 'light' })}>
                {currentUser.userName || currentUser.userId}
              </span>
            </span>
					</HeaderDropdown>
				) : (
					<Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
				)}
				{/* <SelectLang /> */}
			</div>
		);
	}
}
