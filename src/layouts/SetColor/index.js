import { Component } from 'react';
import { connect } from 'umi';
import { Icon } from 'antd';
import { LyIcon } from '@/components';
import DynamicAntdTheme from 'dynamic-antd-theme';
import { primaryColor } from '../../../config/defaultSettings';
import { getThemeCache } from '@/utils/user';
import styles from './index.less';

@connect(({}) => ({}))
export default class index extends Component {
  themeChangeCallback = color => {
    this.props.dispatch({
      type: 'setting/changeTheme',
      payload: { primaryColor: color },
    });
  };
  render() {
    let defalutColor = getThemeCache() || primaryColor;
    return (
      <div className={styles.setColor}>
        <div className={styles.iconBox}>
          <LyIcon type="iconPalette"></LyIcon>
          <DynamicAntdTheme
            primaryColor={defalutColor}
            themeChangeCallback={this.themeChangeCallback}
            placement="bottomLeft"
          />
        </div>
      </div>
    );
  }
}
