const path = require('path');
const Router = require('koa-router');

const checkCache = require('./middlewares/check-cache');
const checkTileset = require('./middlewares/check-tileset');
const checkURI = require('./middlewares/check-uri');
const checkSource = require('./middlewares/check-source');
const checkMetadata = require('./middlewares/check-metadata');
const getTilesets = require('./middlewares/get-tilesets');
const getTileJSON = require('./middlewares/get-tilejson');
const getTile = require('./middlewares/get-tile');

module.exports = (config) => {
  const { tilesets, postgresql, redis } = config;
  const tilePath = config.tilePath || '/{z}/{x}/{y}.{format}';

  const tilePattern = tilePath
    .replace('{z}', ':z(\\d+)')
    .replace('{x}', ':x(\\d+)')
    .replace('{y}', ':y(\\d+)')
    .replace('{format}', ':format([\\w\\.]+)');

  const getTileJSONMiddlewares = [
    checkTileset(tilesets),
    checkURI(postgresql),
    checkSource(),
    checkMetadata(tilePath),
    getTileJSON()
  ];

  const getTileMiddlewares = [
    checkTileset(tilesets),
    checkURI(postgresql),
    checkSource(),
    getTile()
  ];

  if (redis) {
    getTileMiddlewares.unshift(checkCache());
  }

  const router = Router();

  router.get('/index.json', getTilesets(tilesets));
  router.get('/:tilesetId.json', ...getTileJSONMiddlewares);
  router.get(path.join('/:tilesetId', tilePattern), ...getTileMiddlewares);

  return router;
};
