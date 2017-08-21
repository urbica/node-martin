const Router = require('koa-router');

const checkTileset = require('./middlewares/check-tileset');
const checkURI = require('./middlewares/check-uri');
const checkSource = require('./middlewares/check-source');
const checkMetadata = require('./middlewares/check-metadata');
const getTileJSON = require('./middlewares/get-tilejson');
const getTile = require('./middlewares/get-tile');

const tilePath = '/:tilesetId/{z}/{x}/{y}.{format}';
const tilePattern = tilePath
  .replace('{z}', ':z(\\d+)')
  .replace('{x}', ':x(\\d+)')
  .replace('{y}', ':y(\\d+)')
  .replace('{format}', ':format([\\w\\.]+)');

module.exports = (db) => {
  const router = Router();

  router.get(
    '/:tilesetId.json',
    checkTileset(db),
    checkURI(db),
    checkSource(),
    checkMetadata(tilePath),
    getTileJSON()
  );

  router.get(
    tilePattern,
    checkTileset(db),
    checkURI(db),
    checkSource(),
    getTile()
  );

  return router;
};
