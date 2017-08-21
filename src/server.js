const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const cors = require('kcors');
const etag = require('koa-etag');
const Koa = require('koa');
const logger = require('koa-logger');

const createRouter = require('./router');
const checkError = require('./middlewares/check-error');

module.exports = (config) => {
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

  const router = createRouter(config.db);
  app.use(router.routes(), router.allowedMethods());

  return app;
};
