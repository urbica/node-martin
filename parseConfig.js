const os = require('os');
const url = require('url');
const path = require('path');
const minimist = require('minimist');

function parseURI(uri) {
  const params = url.parse(uri, true, true);
  const { dir, base } = path.parse(params.pathname);

  const database = base;
  let port = params.port;
  let host = params.hostname;
  if (!host && dir !== '/') {
    [host, port] = dir.split(':');
    port = parseInt(port, 10);
  }

  let user = os.userInfo().username;
  let password;

  if (params.auth) {
    [user, password] = params.auth.split(':');
  }

  return {
    host,
    port: port || 5432,
    database,
    user,
    password
  };
}

function parseConfig(argv) {
  const config = minimist(argv, {
    string: ['port', 'socket'],
    boolean: ['cors'],
    alias: {
      h: 'help',
      v: 'version'
    },
    default: {
      cors: true,
      port: 4000
    }
  });

  config.connection = config._[0] ? parseURI(config._[0]) : undefined;
  delete config._;

  return config;
}

module.exports = parseConfig;
