module.exports = PathTranslate;

const
  // bobject = require('bobject'),
  _ = require('underscore'),
  _s = require('underscore.string')
;

_.mixin(_s);

function PathTranslate ( opt ) {

  var
    self = this,
    pathlib = opt.pathlib || require('path'),
    SEP = pathlib.sep,
    relDir,
    srcDir,
    destDir = opt.destDir,
    srcExt  = opt.srcExt,
    destExt = opt.destExt
  ;


  relDir = !_.startsWith( destDir, SEP );

  srcDir = ensureTrailingSlash( srcDir );


  var destDirSegs = destDir.split( SEP ).filter( function(v){return !!v} );


  to.to = to;
  to.from = from;
  to.destParent = destParent;

  return to;



  function to( srcFile ) {
    var
      absFile = pathlib.resolve( srcFile ),
      absDir = pathlib.dirname( absFile ),
      relToBase,
      relToBasSegs,
      dirFromBase,
      name,
      cacheDir,
      cacheFile;
    ;


    relToBase = startsWith( absFile, srcDir );

    if ( !relToBase ) {
      return;
    }

    relToBaseSegs = relToBase.split(SEP);

    name = pathlib.basename( relToBase );
    name = endsWith( name, srcExt );

    if ( !name ) {
      return;
    }

    if ( destExt )
      name += destExt;

    if ( !relDir ) {
      cacheDir = destDir;

      dirFromBase = pathlib.dirname( relToBase );
      dirFromBase = removeLeadingSlash( dirFromBase );

      cacheDir = pathlib.resolve( destDir, dirFromBase );
      cacheFile = pathlib.resolve( cacheDir, name );

    } else {
      if ( _.intersection( relToBaseSegs, destDirSegs ).length ) {
        return;
      }
      cacheDir = pathlib.resolve( absDir, destDir );
      cacheFile = pathlib.resolve( cacheDir, name );
    }

    return cacheFile;
  }


  function from( cachePath ) {
    var
      cacheName,
      cacheDir,
      pathName,
      pathDir,
      pathPath
    ;

    cachePath = pathlib.resolve( cachePath );
    cacheName = pathlib.basename( cachePath );
    cacheDir = pathlib.dirname( cachePath );


    if ( !relDir ) {
      pathDir = startsWith( cacheDir, destDir );
      if ( !pathDir )
        return;

    } else {
      if ( !_.endsWith( cacheDir, destDir ) )
        return;


      pathDir = cacheDir.substr( 0, cacheDir.length - destDir.length );
    }

    pathName = cacheName;
    if ( destExt ) {
      pathName = endsWith( pathName, destExt  );
    }

    if ( !pathName )
     return;

    if ( srcExt )
      pathName += srcExt;

    pathPath = pathlib.resolve( pathDir, pathName );

    return pathPath;
  }

  function destParent( path ) {
    if ( !relDir ) {

    } else {
      var
        name = pathlib.basename( path ),
        search = _.flatten( [ destDirSegs, name ] )
      ;

      for ( var i = search.length; i > 1; i -- ) {
        var begin;
        if ( begin = endsWith( path, search.slice( 0, i ).join( SEP ) ) )
          return begin + search.slice( 0, i - 1 ).join( SEP );
      }

    }
  }

  function removeLeadingSlash( str ) { return _.ltrim(str,SEP) }
  function removeTrailingSlash( str ) { return _.rtrim(str,SEP) }
  function ensureTrailingSlash( str ) {  return str ? _.rtrim(str,SEP)+SEP : undefined; }

}

function endsWith( a, b ) {
  return !b ? a : a.substr( a.length - b.length ) == b ? a.substr( 0, a.length - b.length ) : undefined;
}
function startsWith( a, b ) { return !b ? a : a.substr( 0, b.length ) == b ? a.substr( b.length ) : undefined; }
