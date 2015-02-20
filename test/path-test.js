const
  CachePath = require('../'),
  ass = require('chai').assert,
  eq = ass.equal
;

describe( '#pathToCache', function () {
  it('should transform paths using relative dir', function () {
    const
      cache = CachePath( {
        cacheDir: '.cache'
      }),
      pathToCache = cache.pathToCache
    ;

    eq( pathToCache( '/foo/bar' ), '/foo/.cache/bar' );
    eq( pathToCache( '/foo/bar/baz' ), '/foo/bar/.cache/baz' );
    eq( pathToCache( '/baz' ), '/.cache/baz' );
    eq( pathToCache( '/foo/bar/.cache' ), undefined );
    eq( pathToCache( '/foo/bar/.cache/baz' ), undefined );
  });

  it('should transform paths using multi-level relative dir', function () {
    const
      cache = CachePath( {
        cacheDir: '.cache/mp3'
      }),
      pathToCache = cache.pathToCache
    ;

    eq( pathToCache( '/foo/bar' ), '/foo/.cache/mp3/bar' );
    eq( pathToCache( '/foo/bar/baz' ), '/foo/bar/.cache/mp3/baz' );
    eq( pathToCache( '/baz' ), '/.cache/mp3/baz' );

    eq( pathToCache( '/foo/bar/.cache' ), undefined );
    eq( pathToCache( '/foo/bar/.cache/mp3' ), undefined );
  });

  it('should transform paths using absolute dir', function () {
    const
      cache = CachePath( {
        cacheDir: '/cache'
      }),
      pathToCache = cache.pathToCache
    ;

    eq( pathToCache( '/foo/bar' ), '/cache/foo/bar' );
    eq( pathToCache( '/foo/bar/baz' ), '/cache/foo/bar/baz' );
  });

  xit('should avoid translating file that are within the cache zone ', function () {
    const
      cache = CachePath( {
        cacheDir: '/cache'
      }),
      pathToCache = cache.pathToCache
    ;
    eq( pathToCache( '/cache' ), undefined );
    eq( pathToCache( '/' ), undefined );
    eq( pathToCache( '/cache/' ), undefined );
    eq( pathToCache( '/cache/foo' ), undefined );
  });


  it('should transform paths using absolute dir and extension', function () {
    const
      cache = CachePath( {
        cacheDir: '/cache',
        cacheExt: '.jpg'
      }),
      pathToCache = cache.pathToCache
    ;

    eq( pathToCache( '/foo/bar.mp4' ), '/cache/foo/bar.mp4.jpg' );
    eq( pathToCache( '/foo/bar/baz' ), '/cache/foo/bar/baz.jpg' );

    // I know this next one looks a little weird, but it's important to
    // stay predictable.
    eq( pathToCache( '/foo/bar/baz.jpg' ), '/cache/foo/bar/baz.jpg.jpg' );
  });

});

describe( '#cacheToPath', function () {
  it('should transform paths using relative dir', function () {
    const cacheToPath = CachePath( { cacheDir: '.cache' } ).cacheToPath;

    eq( cacheToPath( '/foo/.cache/bar' ),  '/foo/bar' );
    eq( cacheToPath( '/foo/bar/.cache/baz' ), '/foo/bar/baz' );
    eq( cacheToPath( '/.cache/baz' ), '/baz' );
  });

  it('should transform paths using multi-level relative dir', function () {
    const cacheToPath = CachePath( { cacheDir: '.cache/mp3' } ).cacheToPath;

    eq( cacheToPath( '/foo/.cache/mp3/bar' ), '/foo/bar' );
    eq( cacheToPath( '/foo/bar/.cache/mp3/baz' ), '/foo/bar/baz' );
    eq( cacheToPath( '/.cache/mp3/baz' ), '/baz' );

    eq( cacheToPath( '/foo/bar/.cache' ), undefined );
    eq( cacheToPath( '/foo/bar/.cache/mp3' ), undefined );
  });

  it('should transform paths using absolute dir', function () {
    const cacheToPath = CachePath( { cacheDir: '/cache' } ).cacheToPath;

    eq( cacheToPath( '/cache/foo/bar' ), '/foo/bar' );
    eq( cacheToPath( '/cache/foo/bar/baz' ), '/foo/bar/baz' );
  });

  it('should transform paths using absolute dir and extension', function () {
    const
      cache = CachePath( {
        cacheDir: '/cache',
        cacheExt: '.jpg'
      }),
      cacheToPath = cache.cacheToPath
    ;

    eq( cacheToPath( '/cache/foo/bar.mp4.jpg' ), '/foo/bar.mp4' );
    eq( cacheToPath( '/cache/foo/bar/baz.jpg' ), '/foo/bar/baz' );

    // I know this next one looks a little weird, but it's important to
    // stay predictable.
    eq( cacheToPath( '/cache/foo/bar/baz.jpg.jpg' ), '/foo/bar/baz.jpg' );
  });

});
