const url = require('url');
const querystring = require('querystring');

const formatURI = (connection = {}, tileset) => {
  const {
    database, host, port, user, password
  } = connection;

  const {
    table, geometry_field, srid, simplify_geometries
  } = tileset;

  const auth = user && password ? `${user}:${password}` : user || false;

  const search = querystring.stringify({
    table,
    geometry_field,
    srid,
    simplify_geometries
  });

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

module.exports = formatURI;
