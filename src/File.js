module.exports = File;

const
  _ = require('underscore'),
  async = require('async'),
  Format = require('./Format'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  pathlib = require( 'path' )
;

function File ( path, context ) {
  this.path = path;
  this.context = context;

  path = pathlib.resolve( path );

  this.fullname = path;
  this.dirname  = pathlib.dirname ( path );
  this.extname  = pathlib.extname ( path );
  this.basename = pathlib.basename( path, this.extname );
  this.filename = pathlib.basename( path );
}

File.prototype.write = function ( format, data, cb ) {
  var file = this;

  format = Format( format );

  async.series( [
    file.mkdir.bind( file ),
    write
  ], cb );

  function write( cb ) {
    if ( format.convert && format.convert.to ) {
      try {
        data = format.convert.to( data );
      } catch ( exc ) {
        return cb( exc );
      }
    }

    file.writeFile( data, format.options, cb );
  }
}

File.prototype.writeSync = function ( format, data ) {
  format = Format( format );
  this.mkdirSync();

  if ( format.convert && format.convert.to ) {
    data = format.convert.to( data );
  }

  return this.writeFileSync( data, format.options );
}

File.prototype.read = function ( format, cb ) {

  format = Format( format );

  this.readFile( format.options, function ( err, data ) {
    if ( format.convert && format.convert.from ) {
      try {
        data = format.convert.from( data );
      } catch ( exc ) {
        err = err || exc;
      }
    }

    cb( err, data );
  });
}

File.prototype.readSync = function ( format ) {

  format = Format( format );

  var data = this.readFileSync( format.options );

  if ( format.convert && format.convert.from ) {
    data = format.convert.from( data );
  }

  return data;
}

File.prototype.mkdir = function ( opt, cb ) {
  return mkdirp.bind( this, this.dirname ).apply( this, arguments );
}

File.prototype.mkdirSync = function ( opt ) {
  return mkdirp.sync.bind( this, this.dirname ).apply( this, arguments );
}


File.prototype.rmdir = function ( cb ) {

}


File.prototype.unlink = function ( cb ) {

}

File.prototype.unlink = function ( cb ) {

}


_.each( [
  'readFile',
  'readFileSync',
  'writeFile',
  'writeFileSync',
  'createReadStream'
], function bindFsFunc( name ) {
  File.prototype[name] = function () {
    return fs[name].bind( fs, this.fullname ).apply( fs, arguments );
  }
} );
