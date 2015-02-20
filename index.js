module.exports = NodeCachePath;

const
  // bobject = require('bobject'),
  _ = require('underscore'),
  _s = require('underscore.string'),
  pathlib = require('path'),
  SEP = pathlib.sep
;

_.mixin(_s);

function NodeCachePath ( opt ) {

  const
    self = {}
  ;


  //opt.cacheDir = ensureTrailingSlash( opt.cacheDir );

  opt.cacheAbs = _.startsWith( opt.cacheDir, SEP );

  opt.baseDir = ensureTrailingSlash( opt.baseDir );

  var
    cacheDirSegments = opt.cacheDir.split( SEP ).filter( function(v){return !!v} );
  ;




  self.pathToCache = pathToCache;
  self.cacheToPath = cacheToPath;

  return self;

  function resolve() {
    return pathlib.resolve.apply( this, arguments );
  }


  function pathToCache( file ) {
    var
      absFile = resolve( file ),
      absDir = pathlib.dirname( absFile ),
      relToBase,
      relToBasSegs,
      dirFromBase,
      name,
      cacheDir,
      cacheFile;
    ;


    if ( opt.baseDir ) {
      if ( _.startsWith( absFile, opt.baseDir ) ) {
        relToBase = absFile.substr( opt.baseDir.length )
      } else {
        // Won't bother with files outside our base
        return;
      }
    } else {
      relToBase = absFile;
    }

    relToBaseSegs = relToBase.split(SEP);


    name = pathlib.basename( relToBase );
    if ( !name )
      return;

    if ( opt.cacheExt )
      name += opt.cacheExt;

    if ( opt.cacheAbs ) {
      cacheDir = opt.cacheDir;

      dirFromBase = pathlib.dirname( relToBase );
      dirFromBase = removeLeadingSlash( dirFromBase );

      cacheDir = resolve( opt.cacheDir, dirFromBase );
      cacheFile = resolve( cacheDir, name );

    } else {
      if ( _.intersection( relToBaseSegs, cacheDirSegments ).length ) {
        return;
      }
      cacheDir = resolve( absDir, opt.cacheDir );
      cacheFile = resolve( cacheDir, name );
    }

    return cacheFile;
  }


  function cacheToPath( cachePath ) {
    var
      cacheName,
      cacheDir,
      pathName,
      pathDir,
      pathPath
    ;

    cachePath = resolve( cachePath );
    cacheName = pathlib.basename( cachePath );
    cacheDir = pathlib.dirname( cachePath );


    if ( opt.cacheAbs ) {
      pathDir = startsWith( cacheDir, opt.cacheDir );
      if ( !pathDir )
        return;

    } else {
      if ( !_.endsWith( cacheDir, opt.cacheDir ) )
        return;


      pathDir = cacheDir.substr( 0, cacheDir.length - opt.cacheDir.length );
    }

    pathName = cacheName;
    if ( opt.cacheExt ) {
      pathName = endsWith( pathName, opt.cacheExt  );
    }

    if ( !pathName )
     return;

    pathPath = resolve( pathDir, pathName );

    return pathPath;
  }

}

function endsWith( a, b ) { return a.substr( a.length - b.length ) == b ? a.substr( 0, a.length - b.length ) : undefined; }
function startsWith( a, b ) { return a.substr( 0, b.length ) == b ? a.substr( b.length ) : undefined; }

function removeLeadingSlash( str ) { return _.ltrim(str,SEP) }
function ensureTrailingSlash( str ) {  return str ? _.rtrim(str,SEP)+SEP : undefined; }
