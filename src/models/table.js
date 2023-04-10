export default {
  namespace: 'table',
  state: {
    renderFlag: false,
  },
  reducers: {
    setData(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
