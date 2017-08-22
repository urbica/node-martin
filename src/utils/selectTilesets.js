function selectTilesets(client) {
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

  return client.query(query).then(({ rows }) => rows[0] && rows[0].tilesets);
}

module.exports = selectTilesets;
