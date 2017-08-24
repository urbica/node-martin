const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const cors = require('kcors');
const etag = require('koa-etag');
const Koa = require('koa');
const logger = require('koa-logger');

const createRouter = require('./router');
const checkError = require('./middlewares/check-error');

/**
 * Configuration
 *
 * @typedef {Object} config
 * @property {boolean} [cors] - enables CORS
 * @property {number} port - port to run on
 * @property {boolean} [proxy] - when true proxy header fields will be trusted
 * @property {postgresql} postgresql - PostgreSQL connection information
 * @property {redis} [redis] - Redis connection information
 * @property {tilesets} tilesets - tilesets description
 */

/**
 * PostgreSQL Connection
 *
 * @typedef {Object} postgresql
 * @property {string} host - name of host to connect to
 * @property {number} port - port number to connect to at the server host
 * @property {string} database - the database name
 * @property {string} user - PostgreSQL user name to connect as
 * @property {string} password - password to be used if the server demands password authentication.
 */

/**
 * Redis Connection
 *
 * @typedef {Object} redis
 * @property {string} host - name of host to connect to
 * @property {number} port - port number to connect to at the server host
 */

/**
 * Tilesets
 *
 * @typedef {Object.<string, tileset>} tilesets
 */

/**
 * Tileset
 *
 * @typedef {Object} tileset
 * @property {string} table - name of table containing data
 * @property {string} [geometry_field] - name of geometry column
 * @property {number} [srid] - geometry column srid
 * @property {boolean} [simplify_geometries] - whether to automatically reduce input vertices
 */

/**
 * Mapbox Vector Tiles Server
 *
 * @name martin
 * @param {config} config
 * @returns {Koa} koa instance
 */
const martin = (config) => {
  const app = new Koa();
  app.proxy = config.proxy;

  if (config.cors) {
    app.use(cors());
  }

  app.use(compress());
  app.use(conditional());
  app.use(etag());
  app.use(logger());

  app.use(checkError());

  const router = createRouter(config);
  app.use(router.routes(), router.allowedMethods());

  return app;
};

module.exports = martin;
