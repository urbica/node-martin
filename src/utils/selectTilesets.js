/* eslint-disable camelcase */

function detectGeometryType(client, { table, geometry_field }) {
  const query = `select distinct geometrytype(${geometry_field}) as type from ${table}`;

  return client
    .query(query)
    .then(({ rows }) => rows[0] && { table, type: rows[0].type });
}

async function selectTilesets(client) {
  const query = `
    select
    json_object_agg(
      f_table_schema || '.' || f_table_name,
      json_build_object(
        'table', f_table_schema || '.' || f_table_name,
        'geometry_field', f_geometry_column,
        'srid', srid,
        'type', type
      )
    ) as tilesets
    from geometry_columns`;

  const tilesets = await client
    .query(query)
    .then(({ rows }) => rows[0].tilesets);

  const queries = Object.values(tilesets)
    .filter(tileset => tileset.type === 'GEOMETRY')
    .map(tileset => detectGeometryType(client, tileset));

  const geometryTypes = await Promise.all(queries);

  geometryTypes.filter(geometryType => !!geometryType).forEach((geometryType) => {
    tilesets[geometryType.table].type = geometryType.type;
  });

  return tilesets;
}

module.exports = selectTilesets;
