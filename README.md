# Urbica Martin

Martin is a lightweight Node.js [Mapbox Vector Tiles](https://github.com/mapbox/vector-tile-spec) server from a PostGIS database.

## Installation

martin requires node v7.6.0 or higher for ES2015 and async function support.

```shell
npm install @urbica/martin -g
```

...or build from source

```shell
git clone https://github.com/urbica/martin.git
cd martin
npm install
```

## Usage

```shell
Usage: martin [options] [uri]

where [uri] is PostgreSQL connection string and [options] is any of:
  --cors - enables CORS (default: true)
  --port - port to run on (default: 4000)
  --socket - use Unix socket instead of port
  --version - returns running version then exits
```

### Examples

```shell
npm install @urbica/martin -g
martin postgresql://localhost/test
```
