/*
 * @Description: 可拖动Modal
 * @Author: admin
 * @Date: 2020-03-10 13:56:11
 * @LastEditors: admin
 * @LastEditTime: 2020-03-13 15:37:32
 */
import React from 'react';
import PropTypes from 'prop-types';
import DragM from '../DragM';
import { Modal } from 'antd';

class BuildTitle extends React.Component {
    updateTransform = transformStr => {
        this.modalDom.style.transform = transformStr;
    };
    componentDidMount() {
        const modalList = document.getElementsByClassName('ant-modal'); //modal的class是ant-modal
        this.modalDom = modalList[modalList.length - 1];
    }
    render() {
        const { title } = this.props;
        return (
            <DragM updateTransform={this.updateTransform}>
                <div>{title}</div>
            </DragM>
        );
    }
}

export default class DragModal extends React.Component {
    static propTypes = {
        drag: PropTypes.bool,
        destroyOnClose: PropTypes.bool
    };

    static defaultProps = {
        drag: true,
        destroyOnClose: true
    };

    render() {
        const {
            drag,
            visible,
            title,
            destroyOnClose,
            children,
            ...restProps
        } = this.props;

        //是否可拖拽
        const _title = title && drag ? (
            <BuildTitle visible={visible} title={title} />
        ) : (
            title
        );

        return (
            <Modal
                visible={visible}
                title={_title}
                destroyOnClose={destroyOnClose}
                {...restProps}
            >
                {children}
            </Modal>
        );
    }
}
