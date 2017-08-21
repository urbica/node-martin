const { selectTilesets } = require('../utils');

let tilesets;
module.exports = db => async (ctx, next) => {
  if (!tilesets) {
    tilesets = await selectTilesets(db);
  }

  const { tilesetId } = ctx.params;
  const tileset = tilesets[tilesetId];
  if (!tileset) {
    ctx.throw(404, `Tileset "${tilesetId}" does not exists`);
  }

  ctx.state.tileset = tileset;
  return next();
};
