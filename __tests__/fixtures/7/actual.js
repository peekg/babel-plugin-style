//define
var foo = Style.foo({
  color:"black",
  span:{
    color:"red"
  }
});
//combine
this.foo = Style.foo( { color: "orange" } );
//create and combine
var foobar0 = Style.foobar( Style.foo( { "font-size": "200%" } ) );
//reuse
var foobar1 = Style.foobar();
