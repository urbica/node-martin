#!/usr/bin/env node

const fs = require('fs');
const pgPromise = require('pg-promise');

const martin = require('./src/server');
const packagejson = require('./package.json');
const parseConfig = require('./parseConfig');

const pgPromiseOptions = { capSQL: true };
const pgp = pgPromise(pgPromiseOptions);

const config = parseConfig(process.argv.slice(2));

if (config.version) {
  process.stdout.write(`${packagejson.version}\n`);
  process.exit(0);
}

function help() {
  const usage = `
    Usage: martin [options] [uri]

    where [uri] is PostgreSQL connection string and [options] is any of:
      --cors - enables CORS (default: ${config.cors})
      --port - port to run on (default: ${config.port})
      --socket - use Unix socket instead of port
      --version - returns running version then exits

    martin@${packagejson.version}
    node@${process.versions.node}
  `;

  process.stdout.write(`${usage}\n`);
  process.exit(0);
}

if (config.help) {
  help();
}

if (!config.connection) {
  process.stdout.write('URI not specified.\n');
  help();
}

const { host, port, database, user, password } = config.connection;
config.db = pgp({ host, port, database, user, password });

delete config.help;
delete config.version;
delete config.connection;

const app = martin(config);
const handler = config.socket || config.port;

const server = app.listen(handler, () => {
  if (config.socket) {
    fs.chmodSync(config.socket, '1766');
    process.stdout.write(`🚀  ON AIR @ ${config.socket}`);
  } else {
    const endpoint = `${server.address().address}:${server.address().port}`;
    process.stdout.write(`🚀  ON AIR @ ${endpoint}`);
  }
});

function shutdown() {
  process.stdout.write('Caught SIGINT, terminating\n');
  pgp.end();
  server.close();
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
