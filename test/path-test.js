const
  CachePath = require('../'),
  ass = require('chai').assert,
  eq = ass.equal
;

describe( '#path', function () {
  it('should transform paths using relative dir', function () {
    const 
      cache = CachePath( {
        dir: '.cache'
      }),
      path = cache.path
    ;

    eq( path( '/foo/bar' ), '/foo/.cache/bar' );
    eq( path( '/foo/bar/baz' ), '/foo/bar/.cache/baz' );
    eq( path( '/baz' ), '/.cache/baz' );
    eq( path( '/foo/bar/.cache' ), undefined );
    eq( path( '/foo/bar/.cache/baz' ), undefined );
  });

  it('should transform paths using multi-level relative dir', function () {
    const 
      cache = CachePath( {
        dir: '.cache/mp3'
      }),
      path = cache.path
    ;

    eq( path( '/foo/bar' ), '/foo/.cache/mp3/bar' );
    eq( path( '/foo/bar/baz' ), '/foo/bar/.cache/mp3/baz' );
    eq( path( '/baz' ), '/.cache/mp3/baz' );

    eq( path( '/foo/bar/.cache' ), undefined );
    eq( path( '/foo/bar/.cache/mp3' ), undefined );
  });

  it('should transform paths using absolute dir', function () {
    const 
      cache = CachePath( {
        dir: '/cache'
      }),
      path = cache.path
    ;

    eq( path( '/foo/bar' ), '/cache/foo/bar' );
    eq( path( '/foo/bar/baz' ), '/cache/foo/bar/baz' );
    eq( path( '/cache' ), undefined );
    eq( path( '/' ), undefined );
    eq( path( '/cache/' ), undefined );
    eq( path( '/cache/foo' ), undefined );
  });

  it('should transform paths using absolute dir and extension', function () {
    const 
      cache = CachePath( {
        dir: '/cache',
        ext: '.jpg'
      }),
      path = cache.path
    ;

    eq( path( '/foo/bar.mp4' ), '/cache/foo/bar.mp4.jpg' );
    eq( path( '/foo/bar/baz' ), '/cache/foo/bar/baz.jpg' );

    // I know this next one looks a little weird, but it's important to
    // stay predictable. 
    eq( path( '/foo/bar/baz.jpg' ), '/cache/foo/bar/baz.jpg.jpg' );
  });

});