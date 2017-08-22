const formatURI = require('../utils/format-uri');

const uris = {};
module.exports = connection => async (ctx, next) => {
  const { tilesetId } = ctx.params;

  let uri = uris[tilesetId];
  if (!uri) {
    uri = formatURI(connection, ctx.state.tileset);
    uris[tilesetId] = uri;
  }

  ctx.state.uri = uri;
  return next();
};
