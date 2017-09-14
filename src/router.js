const url = require('url');
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

  const { pathname } = url.parse(config.tilesURL);
  const [basePath, tilePath] = decodeURIComponent(pathname).split('{tilesetId}');

  const tilePattern = tilePath
    .replace('{z}', ':z(\\d+)')
    .replace('{x}', ':x(\\d+)')
    .replace('{y}', ':y(\\d+)')
    .replace('{format}', ':format([\\w\\.]+)');

  const getTileJSONMiddlewares = [
    checkTileset(tilesets),
    checkURI(postgresql),
    checkSource(),
    checkMetadata(config.tilesURL),
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

  const indexRoute = path.join(basePath, '/index.json');
  router.get(indexRoute, getTilesets(tilesets));

  const tilesetRoute = path.join(basePath, '/:tilesetId.json');
  router.get(tilesetRoute, ...getTileJSONMiddlewares);

  const tileRoute = path.join(basePath, '/:tilesetId', tilePattern);
  router.get(tileRoute, ...getTileMiddlewares);

  return router;
};
