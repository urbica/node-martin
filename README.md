# Urbica Martin

[![Build Status](https://travis-ci.org/urbica/martin.svg?branch=master)](https://travis-ci.org/urbica/martin)
[![Greenkeeper badge](https://badges.greenkeeper.io/urbica/martin.svg)](https://greenkeeper.io/)

Martin is a lightweight Node.js [Mapbox Vector Tiles](https://github.com/mapbox/vector-tile-spec) server from a PostGIS database.

![Martin](https://raw.githubusercontent.com/urbica/martin/master/martin.jpg)

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
Usage: martin [--help] [--version] <command> <args>

Commands:
  serve             <uri|config>
  generate-config   <uri>
```

### Examples

```shell
martin serve postgresql://localhost/test
```

```shell
martin generate-config postgresql://localhost/test
martin serve config.json
```

See [API](https://github.com/urbica/martin/blob/master/API.md) for more info.

## Using with Docker

```shell
docker run -d \
  -p 4000:4000 \
  -v $(pwd)/config.json:/config.json \
  urbica/martin serve /config.json
```

```shell
docker run -d \
  -p 4000:4000 \
  -v $(pwd)/config.json:/config.json \
  urbica/martin serve postgresql://user:password@host:port/database
```
