const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = () => {
  let alive;

  const client = redis.createClient(6379, 'localhost', {
    return_buffers: true,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        alive = false;
        return new Error('Redis server refused the connection');
      }

      return Math.min(options.attempt * 100, 3000);
    }
  });

  client.on('connect', () => {
    alive = true;
  });

  client.on('error', (error) => {
    alive = false;
    process.stderr.write(`${error.message}\n`);
  });

  return async (ctx, next) => {
    if (!alive) {
      await next();
      return;
    }

    const cached = await client.hgetallAsync(ctx.url);

    if (!cached) {
      await next();

      const cache = {
        status: ctx.status,
        headers: JSON.stringify(ctx.response.headers)
      };

      if (ctx.body) cache.body = ctx.body;

      client.hmset(ctx.url, cache);
    } else {
      const status = parseInt(cached.status.toString(), 10);
      ctx.status = status;

      const headers = JSON.parse(cached.headers.toString());
      ctx.set(headers);

      if (cached.body) {
        ctx.body = cached.body;
      }
    }
  };
};
