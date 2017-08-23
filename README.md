# Urbica Martin

[![Build Status](https://travis-ci.org/urbica/martin.svg?branch=master)](https://travis-ci.org/urbica/martin)

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
martin serve config.js
```