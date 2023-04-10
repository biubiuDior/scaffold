/*
 * @Description: LyAnchor 锚点
 * @Author: qizc
 * @Date: 2019-07-22 14:45:42
 * @LastEditors: admin
 * @LastEditTime: 2019-11-25 16:53:07
 */
import React from "react";
import { withRouter } from "react-router-dom";

import { Anchor } from "antd";

const { Link } = Anchor;

const LyAnchor = props => {
	const { data = [], location, ...other } = props;
	
    const getLink = item => {
        if (item.children && item.children != "" && item.show) {
            const childLink = item.children.map((itemM, i) => {
                return getLink(itemM);
            });
            return (
                <Link
                    key={item.key}
                    href={`#${location.pathname}#${item.key}`}
                    title={item.title}
                >
                    {childLink}
                </Link>
            );
        } else {
            return (
                <Link
                    key={item.key}
                    href={`#${location.pathname}#${item.key}`}
                    title={item.title}
                />
            );
        }
    };

    return (
        <div className="ly-anchor">
            <Anchor {...other}>
                {data.map((item, index) => getLink(item))}
            </Anchor>
        </div>
    );
};
export default withRouter(LyAnchor);
