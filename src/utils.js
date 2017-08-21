const tilelive = require('@mapbox/tilelive');
require('tilelive-postgis').registerProtocols(tilelive);

const selectTilesets = (db) => {
  const query = `
    select
    json_object_agg(
      f_table_schema || '.' || f_table_name,
      json_build_object(
        'schema_name', f_table_schema,
        'table_name', f_table_name,
        'geometry_column', f_geometry_column,
        'srid', srid,
        'type', type
      )
    ) as tilesets
    from geometry_columns`;

  return db.any(query).then(rows => rows[0] && rows[0].tilesets);
};

const info = uri =>
  new Promise((resolve, reject) =>
    tilelive.info(uri, (error, metadata) => {
      if (error) reject(error);
      resolve(metadata);
    })
  );

const load = uri =>
  new Promise((resolve, reject) =>
    tilelive.load(uri, (error, source) => {
      if (error) reject(error);
      resolve(source);
    })
  );

const getTile = (source, z, x, y) =>
  new Promise((resolve, reject) =>
    source.getTile(z, x, y, (error, tile, headers) => {
      if (error) reject(error);
      resolve({ headers, tile });
    })
  );

module.exports = {
  selectTilesets,
  info,
  load,
  getTile
};
