/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const test = require('tape');
const pg = require('pg');
const Protobuf = require('pbf');
const request = require('supertest-koa-agent');
const { VectorTile, VectorTileFeature } = require('@mapbox/vector-tile');
const geojsonhint = require('@mapbox/geojsonhint');
const martin = require('../src/server');

const config = {
  port: 4000,
  postgresql: {
    host: 'localhost',
    database: 'test'
  },
  tilesets: {
    test: {
      table: 'public.test',
      geometry_field: 'geom',
      srid: 4326
    }
  }
};

function runTests(app) {
  test('/index.json', (t) => {
    t.plan(2);

    request(app)
      .get('/index.json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, response) => {
        t.error(error, 'no error');

        const tilesets = JSON.parse(response.text);
        t.deepEqual(tilesets, config.tilesets, 'expected tilesets');
      });
  });

  test('/test.json', (t) => {
    t.plan(3);

    request(app)
      .get('/test.json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, response) => {
        t.error(error, 'no error');

        const tilejson = JSON.parse(response.text);

        const expectedId = config.tilesets.test.table;
        t.equal(tilejson.id, expectedId, 'expected id');

        const expectedName = config.tilesets.test.table;
        t.equal(tilejson.name, expectedName, 'expected name');
      });
  });

  test('/test/0/0/0.pbf', (t) => {
    t.plan(9);

    request(app)
      .get('/test/0/0/0.pbf')
      .expect(200)
      .expect('Content-Type', /application\/x-protobuf/)
      .buffer()
      .parse((res, callback) => {
        res.setEncoding('binary');
        res.data = '';
        res.on('data', (chunk) => {
          res.data += chunk;
        });
        res.on('end', () => {
          callback(null, new Buffer(res.data, 'binary'));
        });
      })
      .end((error, response) => {
        t.error(error, 'no error');

        const pbf = new Protobuf(response.body);
        const tile = new VectorTile(pbf);

        const layerName = config.tilesets.test.table;
        const layer = tile.layers[layerName];
        t.ok(layer, 'layer exists');
        t.equal(layer.name, layerName, 'expected name');

        for (let index = 0; index < layer.length; index += 1) {
          const feature = layer.feature(index);
          t.ok(feature.properties.gid, 'property exists');

          const featureType = VectorTileFeature.types[feature.type];
          t.equal(featureType, 'Point', 'expected type');

          const errors = geojsonhint.hint(feature.toGeoJSON(0, 0, 0));
          if (errors.length > 0) {
            errors.forEach(err => t.comment(err.message));
            t.fail('invalid GeoJSON');
          } else {
            t.pass('valid GeoJSON');
          }
        }
      });
  });

  test.onFinish(() => process.exit(0));
}

async function main() {
  const table1 = fs.readFileSync(path.join(__dirname, 'table1.sql'), 'utf8');

  const client = new pg.Client(config.postgresql);
  await client.connect();
  try {
    await client.query(table1);
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
  await client.end();

  const app = martin(config);
  runTests(app);
}

main();
