module.exports = tilesets => async (ctx, next) => {
  const { tilesetId } = ctx.params;
  const tileset = tilesets[tilesetId];
  if (!tileset) {
    ctx.throw(404, `Tileset "${tilesetId}" does not exists`);
  }

  ctx.state.tileset = tileset;
  return next();
};
