/* eslint-disable camelcase */
/* eslint-disable no-template-curly-in-string */

const url = require('url');
const pgp = require('pg-promise');

const formatURI = (connection) => {
  const { database, host, port, user, password, search } = connection;
  const auth = user && password ? `${user}:${password}` : user || false;

  return url.format({
    auth,
    protocol: 'postgis:',
    slashes: true,
    port,
    hostname: host,
    search,
    pathname: `/${database}`
  });
};

const uris = {};
module.exports = db => async (ctx, next) => {
  const { tilesetId } = ctx.params;

  let uri = uris[tilesetId];
  if (!uri) {
    const { schema_name, table_name, geometry_column } = ctx.state.tileset;

    const query = pgp.as.format(
      '(select * from ${schema_name~}.${table_name~}) as query',
      { schema_name, table_name }
    );

    const connection = Object.assign({}, db.$cn, {
      search: `?table=${table_name}&geometry_field=${geometry_column}&query=${encodeURI(query)}`
    });

    uri = formatURI(connection);
    uris[tilesetId] = uri;
  }

  ctx.state.uri = uri;
  return next();
};
