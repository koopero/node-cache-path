const
  ass = require('chai').assert,
  File = require('../src/File'),
  fs = require('fs'),
  pathlib = require('path')
;



describe('File', function () {
  describe('#read', function () {
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

  describe('#remove', function () {
    it('should delete a file and remove all empty directories', function ( cb ) {
      var file = testFile( 'scratch/sub/dir/foo' );
      file.touchSync();

      file.remove( function ( err ) {
        ass.notOk( err );
        assertNoFile( 'scratch/sub/dir/foo' );
        assertNoFile( 'scratch/sub/dir' );
        assertNoFile( 'scratch/sub' );
        cb();
      } );
    });

  })

  describe('#removeSync', function () {
    it('should delete a file and remove all empty directories', function () {
      var file = testFile( 'scratch/sub/dir/foo' );
      file.touchSync();

      file.removeSync();
      assertNoFile( 'scratch/sub/dir/foo' );
      assertNoFile( 'scratch/sub/dir' );
      assertNoFile( 'scratch/sub' );
    });

    it('should silently fail if the file does not exist', function () {
      var file = testFile('scratch/does/not/exist');

      file.removeSync();
    });

    it('should use an external parent function', function () {
      var context = 
    });
  })

  after(wipeScratch);

});

//  ----------
//  Test Utils
//  ----------

function localPath( path ) {
  return pathlib.resolve( __dirname, path );
}

function testFile ( path, context ) {
  return new File( localPath( path ), context );
}

function readFile( path, opt ) {
  return fs.readFileSync( localPath( path ), opt );
}

function assertFile( path, contents ) {
  var read = fs.readFileSync( localPath( path ), { encoding: 'utf8' } );
  if ( contents ) {
    ass.equal( read, contents );
  }
}

function assertNoFile( path ) {
  if ( fs.exists( localPath( path ) ) ) {
    throw new Error( 'Expected '+path+" not to exist." );
  }
}

function wipeScratch() {
  require('rimraf').sync( localPath('scratch') );
}
