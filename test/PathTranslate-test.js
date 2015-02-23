const
  PathTranslate = require('../src/PathTranslate'),
  ass = require('chai').assert,
  eq = ass.equal
;

describe('PathTranslate', function () {
  describe( '#to', function () {
    it('should transform paths using relative dir', function () {
      const
        trans = PathTranslate( {
          destDir: '.cache'
        }).to
      ;

      eq( trans( '/foo/bar' ), '/foo/.cache/bar' );
      eq( trans( '/foo/bar/baz' ), '/foo/bar/.cache/baz' );
      eq( trans( '/baz' ), '/.cache/baz' );
      eq( trans( '/foo/bar/.cache' ), undefined );
      eq( trans( '/foo/bar/.cache/baz' ), undefined );
    });

    it('should transform paths using multi-level relative dir', function () {
      const
        trans = PathTranslate( {
          destDir: '.cache/mp3'
        }).to
      ;

      eq( trans( '/foo/bar' ), '/foo/.cache/mp3/bar' );
      eq( trans( '/foo/bar/baz' ), '/foo/bar/.cache/mp3/baz' );
      eq( trans( '/baz' ), '/.cache/mp3/baz' );

      eq( trans( '/foo/bar/.cache' ), undefined );
      eq( trans( '/foo/bar/.cache/mp3' ), undefined );
    });

    it('should transform paths using absolute dir', function () {
      const
        trans = PathTranslate( {
          destDir: '/cache'
        })
      ;

      eq( trans( '/foo/bar' ), '/cache/foo/bar' );
      eq( trans( '/foo/bar/baz' ), '/cache/foo/bar/baz' );
    });

    it('should strip extension from source', function () {
      const trans = PathTranslate( { srcExt: '.mp3', destDir: '/cache' });

      eq( trans( '/foo/bar.mp3' ), '/cache/foo/bar' );
      eq( trans( '/foo/bar' ), undefined );
    });

    it('should transform paths using absolute dir and extension', function () {
      const
        trans = PathTranslate( {
          destDir: '/cache',
          destExt: '.jpg'
        })
      ;

      eq( trans( '/foo/bar.mp4' ), '/cache/foo/bar.mp4.jpg' );
      eq( trans( '/foo/bar/baz' ), '/cache/foo/bar/baz.jpg' );

      // I know this next one looks a little weird, but it's important to
      // stay predictable.
      eq( trans( '/foo/bar/baz.jpg' ), '/cache/foo/bar/baz.jpg.jpg' );
    });

    xit('should avoid translating file that are within the cache zone ', function () {
      const
        trans = PathTranslate( {
          destDir: '/cache'
        })
      ;
      eq( trans( '/cache' ), undefined );
      eq( trans( '/' ), undefined );
      eq( trans( '/cache/' ), undefined );
      eq( trans( '/cache/foo' ), undefined );
    })
  })

  describe( '#from', function () {
    it('should transform paths using relative dir', function () {
      const trans = PathTranslate( { destDir: '.cache' } ).from;

      eq( trans( '/foo/.cache/bar' ),  '/foo/bar' );
      eq( trans( '/foo/bar/.cache/baz' ), '/foo/bar/baz' );
      eq( trans( '/.cache/baz' ), '/baz' );
    });

    it('should transform paths using multi-level relative dir', function () {
      const trans = PathTranslate( { destDir: '.cache/mp3' } ).from;

      eq( trans( '/foo/.cache/mp3/bar' ), '/foo/bar' );
      eq( trans( '/foo/bar/.cache/mp3/baz' ), '/foo/bar/baz' );
      eq( trans( '/.cache/mp3/baz' ), '/baz' );

      eq( trans( '/foo/bar/.cache' ), undefined );
      eq( trans( '/foo/bar/.cache/mp3' ), undefined );
    });

    it('should transform paths using absolute dir', function () {
      const trans = PathTranslate( { destDir: '/cache' } ).from;

      eq( trans( '/cache/foo/bar' ), '/foo/bar' );
      eq( trans( '/cache/foo/bar/baz' ), '/foo/bar/baz' );
    });

    it('should transform paths using absolute dir and extension', function () {
      const trans = PathTranslate( { destDir: '/cache', destExt: '.jpg' }).from;

      eq( trans( '/cache/foo/bar.mp4.jpg' ), '/foo/bar.mp4' );
      eq( trans( '/cache/foo/bar/baz.jpg' ), '/foo/bar/baz' );
      eq( trans( '/cache/foo/bar/baz.jpg.jpg' ), '/foo/bar/baz.jpg' );
    })

    it('should apply source extension', function() {
      const trans = PathTranslate( { destDir: '/cache', srcExt: '.jpg' }).from;
      eq( trans( '/cache/foo/bar' ), '/foo/bar.jpg' );
    })
  });


  describe('#destParent', function() {
    it('should walk up to directory beyond dest', function () {
      const trans = PathTranslate( { destDir: '.cache/.mp3' } ).destParent;

      eq( trans( '/foo/bar/.cache/.mp3/baz' ), '/foo/bar/.cache/.mp3' );
      eq( trans( '/foo/bar/.cache/.mp3' ), '/foo/bar/.cache' );
      eq( trans( '/foo/bar/.cache' ), undefined );
    });
  });


})
