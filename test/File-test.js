const
  ass = require('chai').assert,
  File = require('../src/File'),
  fs = require('fs'),
  pathlib = require('path')
;

function testFile ( path, context ) {
  return new File( pathlib.resolve( __dirname, path ), context );
}

function readFile( path, opt ) {
  return fs.readFileSync( pathlib.resolve( __dirname, path ), opt );
}

describe('File', function () {
  describe('read', function () {
    it('should load JSON from a file', function ( cb ) {
      var file = testFile('data/json');

      file.read( JSON, function ( err, data ) {
        ass( data.four == 4 );
        cb( err );
      });
    });

    it('should load YAML from a file', function ( cb ) {
      var file = testFile('data/json');

      file.read( 'yaml', function ( err, data ) {
        ass( data.four == 4 );
        cb( err );
      });
    });
  });

  describe('#readSync', function () {
    it('should read a string', function () {
      var file = testFile('data/string');
      ass.equal( file.readSync(String), '123\n' );
    })
  });

  describe('#write', function () {
    it('should write a string', function ( cb ) {
      var
        name = 'scratch/str',
        file = testFile( name )
      ;
      file.write( String,'foo', function ( err ) {
        ass.notOk( err );
        ass.equal( readFile(name), 'foo' );
        cb();
      });
    });
  })

  describe('#writeSync', function () {
    it('should write JSON', function () {
      var
        name = 'scratch/writeSync/json',
        file = testFile( name )
      ;
      file.writeSync( JSON,{one:1});
      ass.equal( readFile(name), '{"one":1}' );
    });
  })

});
