jest.autoMockOff();

import fs from 'fs';
//import fails with babel
var babel = require( 'babel' );

describe("fixtures", function() {
  
  function run( file ) {
    return babel.transformFileSync(file, {
//      optional: ['runtime'],
      blacklist: ["useStrict"],
      plugins: [ require( '../src/index' ) ]
    }).code;
  }
  
  function expect_js_toEqual ( dir ) {
    var a = run( dir + "/actual.js" ),
    b = fs.readFileSync( dir + "/expected.js", {encoding:"utf-8"} );
    expect( a ).toEqual( b );
  }
  
  function expect_css_js_toEqual ( dir ) {
    expect_js_toEqual(dir);
    var a = fs.readFileSync( dir + "/actual.css", {encoding:"utf-8"} ),
    b = fs.readFileSync( dir + "/expected.css", {encoding:"utf-8"} );
    expect( a ).toEqual( b );
  }
  
//  it("empty-call", function() {
//    expect_js_toEqual( __dirname + "/fixtures/1" );
//  })
//  
//  it( "call-with-object", function (){
//    expect_css_js_toEqual( __dirname + "/fixtures/2" );
//  })
//  
//  it( "property-with-arg", function (){
//    expect_css_js_toEqual( __dirname + "/fixtures/3" );
//  })
//  
//  it("property-media-query-pseudo-class", function () {
//    expect_css_js_toEqual( __dirname + "/fixtures/4" );
//  });
  
//  it("nested-property-media-query-pseudo-class", function () {
//    expect_css_js_toEqual( __dirname + "/fixtures/5" );
//  });
  
//  it("replacement", function () {
//    expect_css_js_toEqual( __dirname + "/fixtures/6" );
//  });
//  
//  it("extend", function () {
//    expect_css_js_toEqual( __dirname + "/fixtures/7" );
//  });
  
//  it("theme", function () {
//  expect_css_js_toEqual( __dirname + "/fixtures/8" );
//  });
  
  it("reference", function () {
    expect_css_js_toEqual( __dirname + "/fixtures/8" );
  });
  
  
});
