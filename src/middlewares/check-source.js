const { load } = require('../utils/tilelive');

const sources = {};
module.exports = () => async (ctx, next) => {
  const { tilesetId } = ctx.params;

  let source = sources[tilesetId];
  if (!source) {
    try {
      source = await load(ctx.state.uri);
    } catch (error) {
      throw error;
    }
  }

  ctx.state.source = source;
  return next();
};
