import { history } from 'umi';
import { Button } from 'antd';
import './index.less';

// 默认类型配置
const config = {
  noData: {
    image: require('./images/noData.png'),
    subTitle: <span style={{ marginLeft: 32 }}>无数据</span>,
  },
  '403': {
    image: require('./images/403.png'),
    subTitle: '抱歉，您无权访问该页面。',
  },
  '404': {
    image: require('./images/404.png'),
    subTitle: '抱歉，您访问的界面不存在。',
  },
  '500': {
    image: require('./images/500.png'),
    subTitle: '抱歉，这个页面打不开了, 无法执行您的请求，请稍后重试。',
  },
};

function LyResult(props) {
  const { status, title, subTitle, extra, image } = props;
  const pageType = status in config ? status : 'noData';
  return (
    <div className="ly-result">
      <div className={'pictureBox'}>
        {typeof image === 'string' ? <img src={image || config[pageType].image} /> : image}
        <h4>{title}</h4>
        <span>{subTitle || config[pageType].subTitle}</span>
      </div>
      {extra ? (
        extra
      ) : pageType == 'noData' ? (
        ''
      ) : (
        <Button
          type="primary"
          onClick={() => {
            history.push('/');
          }}
        >
          返回首页
        </Button>
      )}
    </div>
  );
}

LyResult.defaultProps = {
  status: '403',
  image: '',
};
export default LyResult;
