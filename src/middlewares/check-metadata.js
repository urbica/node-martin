const url = require('url');
const path = require('path');
const { info } = require('../utils/tilelive');

const metadatas = {};
module.exports = tilePath => async (ctx, next) => {
  const { tilesetId } = ctx.params;
  const { uri } = ctx.state;

  let metadata = metadatas[tilesetId];
  if (!metadata) {
    try {
      metadata = await info(uri);
      const { format } = metadata;
      const { dir } = path.parse(ctx.path);

      const tilesPath = tilePath
        .replace(':tilesetId', tilesetId)
        .replace('{format}', format);

      const tilesUrl = url.format({
        protocol: ctx.protocol,
        host: ctx.host,
        pathname: path.join(dir, tilesPath)
      });

      metadata.tiles = [tilesUrl];
      metadata.tilejson = '2.2.0';

      metadatas[tilesetId] = metadata;
    } catch (error) {
      throw error;
    }
  }

  ctx.state.metadata = metadata;
  return next();
};
