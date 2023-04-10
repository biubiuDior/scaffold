/*
 * @Description: Split--分割面板(https://github.com/nathancahill/split#documentation)
 * @Author: qizc
 * @Date: 2019-08-15 15:08:51
 * @LastEditors: qizc
 * @LastEditTime: 2019-08-15 17:26:46
 */
import React from "react";
import Split from "react-split";
import classNames from "classnames";
import "./index.less";

class LySplit extends React.Component {
  render() {
    const { className, children, direction = "horizontal", ...restProps } = this.props;

    // 默认均等分割
    let sizes = [];
    if (children.length > 0) {
      const size = Number((100 / children.length).toFixed(4));
      sizes = new Array(children.length).fill(size);
    }

    return (
      <Split
        sizes={sizes}
        className={classNames(className, "ly-split", {
          "ly-split-horizontal": direction === "horizontal",
          "ly-split-vertical": direction === "vertical"
        })}
        minSize={0}
        direction={direction}
        {...restProps}
      >
        {React.Children.map(children, (child) => {
          return <div className="ly-split-item">{child}</div>;
        })}
      </Split>
    );
  }
}

export default LySplit;
