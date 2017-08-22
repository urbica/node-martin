#!/usr/bin/env node

const fs = require('fs');
const parse = require('./src/utils/parse');
const martin = require('./src/server');

async function main(argv) {
  const config = await parse(argv);

  const app = martin(config);
  const handler = config.socket || config.port;

  const server = app.listen(handler, () => {
    if (config.socket) {
      fs.chmodSync(config.socket, '1766');
      process.stdout.write(`🚀  ON AIR @ ${config.socket}\n`);
    } else {
      const endpoint = `${server.address().address}:${server.address().port}`;
      process.stdout.write(`🚀  ON AIR @ ${endpoint}\n`);
    }
  });

  function shutdown() {
    process.stdout.write('Caught SIGINT, terminating\n');
    server.close();
    process.exit();
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main(process.argv.slice(2));
