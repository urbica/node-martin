const { getTile } = require('../utils/tilelive');

module.exports = () => async (ctx) => {
  const z = parseInt(ctx.params.z, 10);
  const x = parseInt(ctx.params.x, 10);
  const y = parseInt(ctx.params.y, 10);

  try {
    const { tile, headers } = await getTile(ctx.state.source, z, x, y);

    ctx.set(headers);
    ctx.body = tile;
  } catch (error) {
    console.error(error.message);
    ctx.status = 204;
    ctx.body = undefined;
  }
};
