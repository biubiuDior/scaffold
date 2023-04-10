import { getSize, setRootFontSize } from '@/utils/utils';

export default {
  namespace: 'global',
  state: {
    collapsed: false,
    windowH: getSize().windowH,
    windowW: getSize().windowW,
  },
  subscriptions: {
    // 监听屏幕改变，修改state
    resize({ dispatch }) {
      const getWindowSize = () => {
        const { windowH, windowW } = getSize();
        setRootFontSize(windowW)
        dispatch({
          type: 'changeWindow',
          payload: { windowH, windowW },
        });
      };
      window.addEventListener('resize', getWindowSize, false);
    },
  },
  effects: {},
  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeWindow(state, { payload }) {
      return {
        ...state,
        windowH: payload.windowH,
        windowW: payload.windowW,
      };
    },
  },
};
