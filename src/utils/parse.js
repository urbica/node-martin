const fs = require('fs');
const url = require('url');
const pg = require('pg');
const minimist = require('minimist');
const pgConnectionString = require('pg-connection-string');
const selectTilesets = require('./selectTilesets');
const packagejson = require('../../package.json');

function version() {
  process.stdout.write(`${packagejson.version}\n`);
  process.exit(0);
}

function help() {
  const usage = `
    Usage: martin [--help] [--version] <command> <args>

    Commands:
      serve             <uri|config>
      generate-config   <uri>

    martin@${packagejson.version}
    node@${process.versions.node}
  `;

  process.stdout.write(`${usage}\n`);
  process.exit(0);
}

async function generateConfig(uri) {
  const connection = pgConnectionString.parse(uri);
  const client = new pg.Client(connection);
  await client.connect();

  const tilesets = await selectTilesets(client);

  await client.end();

  return {
    cors: true,
    port: 4000,
    proxy: true,
    tilesURL: 'http://localhost:4000/{tilesetId}/{z}/{x}/{y}.{format}',
    postgresql: connection,
    tilesets
  };
}

function readConfig(fileName) {
  const config = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  if (!config.postgresql && process.env.POSTGRES_DB) {
    config.postgresql = {
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT || 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    };
  }

  if (!config.redis && process.env.REDIS_HOST) {
    config.redis = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT || 6379
    };
  }

  return new Promise(resolve => resolve(config));
}

async function writeConfig(uri) {
  const config = await generateConfig(uri);

  const fileName = 'config.json';
  fs.writeFileSync(fileName, JSON.stringify(config, null, 2));
  process.stdout.write(`Config generated to "${fileName}"\n`);
  process.exit(0);
}

async function parse(argv) {
  const args = minimist(argv);

  if (args.version) {
    version();
  }

  if (args.help) {
    help();
  }

  const [command, param] = args._;

  switch (command) {
    case 'serve': {
      const fileNameOrURI = param;
      if (!fileNameOrURI) {
        process.stdout.write('Error: uri or config is not specified.\n');
        help();
      }

      const { protocol } = url.parse(fileNameOrURI);
      const config = protocol === 'postgresql:'
        ? await generateConfig(fileNameOrURI)
        : await readConfig(fileNameOrURI);

      if (!config.postgresql) {
        process.stdout.write('Error: PostgreSQL connection is not specified.\n');
        return help();
      }

      if (!config.tilesURL) {
        process.stdout.write('Error: tilesURL is not specified.\n');
        return help();
      }

      return config;
    }
    case 'generate-config': {
      const uri = param;
      if (!uri) {
        process.stdout.write('Error: uri is not specified.\n');
        help();
      }

      return writeConfig(uri);
    }
    default: {
      process.stdout.write(`Error: Unknown command "${command}"\n`);
      return help();
    }
  }
}

module.exports = parse;
