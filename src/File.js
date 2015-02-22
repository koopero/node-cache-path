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
  this.context = context || {};

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

  if ( format.isStream ) {
    throw new Error("Not implemented");
  } else {

    if ( format.convert && format.convert.to ) {
      data = format.convert.to( data );
    }

    return this.writeFileSync( data, format.options );
  }
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

File.prototype.touchSync = function () {
  return this.writeSync( String, '' );
}

File.prototype.mkdir = function ( opt, cb ) {
  return mkdirp.bind( this, this.dirname ).apply( this, arguments );
}

File.prototype.mkdirSync = function ( opt ) {
  return mkdirp.sync.bind( this, this.dirname ).apply( this, arguments );
}

File.prototype.remove = function ( cb ) {
  var file = this;

  async.series( [
    file.unlink.bind( file ),
    file.rmdir.bind( file )
  ], cb );
}

File.prototype.removeSync = function ( cb ) {
  if ( this.isFileSync() ) {
    this.unlinkSync( );
    this.rmdirSync( );
  };
}

File.prototype.rmdir = function ( cb ) {
  var
    file = this,
    dir = file.fullname,
    parentFn = file.context.resolveParent || pathlib.dirname
  ;

  async.whilst(
    function () {
      dir = parentFn( dir );
      return !!dir;
    },
    function ( cb ) {
      fs.rmdir( dir, cb );
    },
    function ( err ) {
      cb();
    }
  )

}

File.prototype.rmdirSync = function ( cb ) {
  var
    file = this,
    dir = file.fullname,
    parentFn = file.context.resolveParent || pathlib.dirname
  ;

  while ( dir = parentFn( dir ) ) {
    try {
      fs.rmdirSync( dir );
    } catch ( exc ) {
      return false;
    }
  }

  return true;
}

File.prototype.isFile = function ( cb ) {
  this.stat( function ( err, stat ) {
    if ( err ) {
      cb( null, false );
    } else {
      cb( null, stat.isFile() );
    }
  });
}

File.prototype.isFileSync = function () {
  try {
    var stat = this.statSync();
    return stat.isFile();
  } catch ( exc ) {
    return false;
  }
}


_.each( [
  'readFile',
  'readFileSync',
  'writeFile',
  'writeFileSync',
  'unlink',
  'unlinkSync',
  'createReadStream'
], function bindFsFunc( name ) {
  File.prototype[name] = function () {
    return fs[name].bind( fs, this.fullname ).apply( fs, arguments );
  }
} );
