module.exports = () => async (ctx) => {
  ctx.body = ctx.state.metadata;
};
