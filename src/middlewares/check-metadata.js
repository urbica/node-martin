const { info } = require('../utils/tilelive');

const metadatas = {};
module.exports = tilesURL => async (ctx, next) => {
  const { tilesetId } = ctx.params;
  const { uri } = ctx.state;

  let metadata = metadatas[tilesetId];
  if (!metadata) {
    try {
      metadata = await info(uri);
      const { format } = metadata;

      const tiles = tilesURL
        .replace('{tilesetId}', tilesetId)
        .replace('{format}', format);

      metadata.tiles = [tiles];
      metadata.tilejson = '2.2.0';

      metadatas[tilesetId] = metadata;
    } catch (error) {
      throw error;
    }
  }

  ctx.state.metadata = metadata;
  return next();
};
