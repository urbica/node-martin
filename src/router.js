const Router = require('koa-router');

const checkCache = require('./middlewares/check-cache');
const checkTileset = require('./middlewares/check-tileset');
const checkURI = require('./middlewares/check-uri');
const checkSource = require('./middlewares/check-source');
const checkMetadata = require('./middlewares/check-metadata');
const getTilesets = require('./middlewares/get-tilesets');
const getTileJSON = require('./middlewares/get-tilejson');
const getTile = require('./middlewares/get-tile');

const tilePath = '/:tilesetId/{z}/{x}/{y}.{format}';
const tilePattern = tilePath
  .replace('{z}', ':z(\\d+)')
  .replace('{x}', ':x(\\d+)')
  .replace('{y}', ':y(\\d+)')
  .replace('{format}', ':format([\\w\\.]+)');

module.exports = ({ tilesets, postgresql }) => {
  const router = Router();

  router.get('/index.json', getTilesets(tilesets));

  router.get(
    '/:tilesetId.json',
    checkTileset(tilesets),
    checkURI(postgresql),
    checkSource(),
    checkMetadata(tilePath),
    getTileJSON()
  );

  router.get(
    tilePattern,
    checkCache(),
    checkTileset(tilesets),
    checkURI(postgresql),
    checkSource(),
    getTile()
  );

  return router;
};
