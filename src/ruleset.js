import {types as t} from 'babel';
import Selector from './selector';

export default class Ruleset {
  
  constructor(selectors) {
    this.selector = new Selector(selectors);
    this.properties = new Array();
  }
  
  push( prop ) {
    this.properties.push( prop );
  }
  
  static is ( node ) {
    if( t.isObjectExpression( node.value ) ) {
      return true;
    }
    return false;
  }
  
  toString() {
    if( this.properties.length > 0 ) { 
      var str = [],
      m = this.selector.hasMedia();
      if( m ) {
        str.push( this.selector.media.join(" and ") + " {" );
      }
      
      str.push( this.selector.selector.join( " " ) + " {" );
      
      this.properties.forEach( function (p) {
        str.push( p.name + ": " + p.value + ";" );
      });
      
      if( m ) {
        str.push( "}" );
      }
      str.push( "}" );
      return str.join("\n") + "\n";
    }
    return "";
  }
}