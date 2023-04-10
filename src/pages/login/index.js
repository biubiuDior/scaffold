import React from 'react';
import { Form, Icon, Modal, Input, Button, Checkbox, Tabs, Row, Col } from 'antd';
import { connect, formatMessage, FormattedMessage } from 'umi';
import Footer from '@/layouts/Footer';
import logo from '@/assets/images/login-logo.png';
import { JSEncrypt } from 'jsencrypt';
import hexSha1 from 'hex-sha1';
import { setLoginErrCount, getLoginErrCount } from '@/utils/user';
import { getVerificationCode } from '@/services/login';
import classnames from 'classnames';
const { TabPane } = Tabs;
const FormItem = Form.Item;
import styles from './index.less';
// 接入监控运维平台
import apm from '@/rum';
import { FontSizeSetting, SelectLang } from '@/components';
apm.setInitialPageLoadName('login');

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      imgVlaue: undefined,
      captchaId: undefined,
      errCount: getLoginErrCount(), //账号密码错误次数统计,本应接口返回次数和做限制,但是接口没做这个功能,所以前端来做控制.
      isNeedCaptcha: true, //是否需要验证码
    };
  }
  componentDidMount() {
    const { isNeedCaptcha, errCount } = this.state;
    if (isNeedCaptcha && errCount > 2) {
      this.getLoginCaptcha();
    }
  }
  handleAccountSubmit = e => {
    const { captchaId, isNeedCaptcha } = this.state;
    e.preventDefault();
    const pubKey =
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ8DUCb0CEFATRWU8BtBL42RvsdFBcpxYNfsg0P1f7Rd1qKLtqLSBBVGrJu148CdCAkxwKOsjvj5D4eMeDQCd18CAwEAAQ==';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubKey);
        const username = values.username.trim();
        const encryptPassword = encrypt.encrypt(values.password); // password为需要加密的字段
        const timestamp = new Date().getTime();
        const arr = [
          `username=${username}`,
          `password=${encryptPassword}`,
          `timestamp=${timestamp}`,
        ];
        const digest = hexSha1(arr.join(','));
        this.props.dispatch({
          type: 'login/fetchLogin',
          payload: {
            grant_type: 'password',
            encryptTransfer: 'true',
            timestamp,
            username,
            password: encryptPassword,
            digest,
            captcha: values.captcha,
            captchaId,
            realm: 'platformRealm',
          },
          errCallFunc: meta => {
            // 账号或密码错误时错误次数加1
            let errCount = getLoginErrCount();
            if (
              isNeedCaptcha &&
              meta.message == formatMessage({ id: 'app.settings.error.password' })
            ) {
              errCount += 1;
              setLoginErrCount(errCount);
              this.setState({
                errCount,
              });
            }
            if (isNeedCaptcha && errCount > 2) {
              this.getLoginCaptcha();
            }
          },
        });
      } else {
        Modal.error({
          title: formatMessage({ id: 'menu.login' }),
          content: formatMessage({ id: 'app.settings.error.empty.login' }),
        });
      }
    });
  };
  // 获取登录验证码
  getLoginCaptcha = () => {
    getVerificationCode().then(res => {
      if (res && res.meta && res.meta.statusCode == 200) {
        this.setState({
          captchaId: res.data.captchaId,
          imgVlaue: res.data.base64,
        });
      }
    });
  };

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  render() {
    const { loading, setting } = this.props;
    const { type, count, imgVlaue, errCount, isNeedCaptcha } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.loginPage}>
        <div className={styles.settingBtn}>
          {setting.showFontSizeBtn && <FontSizeSetting className="text-primary" />}
          {setting.showLanguageBtn && <SelectLang className="text-primary" />}
        </div>

        <div className={styles.main}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
            <span className={styles.logoName}>{setting.logoTitle}</span>
          </div>
          <Form onSubmit={this.handleAccountSubmit}>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'component.global.placeholder' },
                      { key: formatMessage({ id: 'app.settings.basic.account' }) }
                    ),
                  },
                ],
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon
                      type="user"
                      style={{
                        color: 'rgba(0,0,0,.25)',
                      }}
                    />
                  }
                  placeholder={formatMessage({ id: 'app.settings.basic.account' })}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'component.global.placeholder' },
                      { key: formatMessage({ id: 'app.settings.basic.password' }) }
                    ),
                  },
                ],
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon
                      type="lock"
                      style={{
                        color: 'rgba(0,0,0,.25)',
                      }}
                    />
                  }
                  type="password"
                  placeholder={formatMessage({ id: 'app.settings.basic.password' })}
                />
              )}
            </FormItem>
            {isNeedCaptcha && errCount > 2 && (
              <FormItem>
                <Row gutter={8}>
                  <Col span={14}>
                    {getFieldDecorator('captcha', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage(
                            { id: 'component.global.placeholder' },
                            { key: formatMessage({ id: 'app.settings.verification-code' }) }
                          ),
                        },
                      ],
                    })(
                      <Input
                        autoComplete="off"
                        size="large"
                        placeholder={formatMessage({ id: 'app.settings.verification-code' })}
                      />
                    )}
                  </Col>
                  <Col span={10}>
                    <div
                      className={styles.captcha}
                      onClick={() => {
                        this.getLoginCaptcha();
                      }}
                    >
                      <img alt="logo" src={imgVlaue} className={styles.captchaImg} />
                    </div>
                  </Col>
                </Row>
              </FormItem>
            )}
            {/* <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>记住登录</Checkbox>)}
              <a style={{ float: 'right' }}>忘记密码</a>
            </FormItem> */}
            <FormItem>
              <Button
                loading={loading.effects['login/fetchLogin'] || false}
                className={styles.submit}
                type="primary"
                size="large"
                htmlType="submit"
              >
                <FormattedMessage id="menu.login" />
              </Button>
            </FormItem>
          </Form>
        </div>
        <Footer className={styles.footer} />
      </div>
    );
  }
}

const Login = Form.create()(
  connect(({ login, setting, loading }) => {
    return { login, setting, loading };
  })(LoginPage)
);
export default Login;
