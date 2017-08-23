-- https://github.com/mapnik/test-data/blob/master/sql/table1.sql

DROP TABLE IF EXISTS test;
CREATE TABLE test(gid serial PRIMARY KEY, geom geometry);
INSERT INTO test(geom) values (GeomFromEWKT('SRID=4326;POINT(0 0)'));
INSERT INTO test(geom) values (GeomFromEWKT('SRID=4326;POINT(-2 2)'));
