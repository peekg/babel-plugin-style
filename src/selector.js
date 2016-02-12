import {types as t} from 'babel';

export default class Selector {
  
  constructor ( selectors ) {
    this._format( selectors );
  }
  
  static isMedia (str) {
    if( typeof( str ) === "string" ) {
      if(str.indexOf('@media')===0) {
        return true;
      }
    }
    return false;
  }
  
  hasMedia () {
    return this.media.length > 0;
  }
  
  _format(list) {
    var _this = this;
    _this.media = [];
    _this.selector = [];
    list.forEach( function ( str, j, a ) {
      if( Selector.isMedia(str) ) {
        _this.media.push( str );
      } else {
        _this.selector.push( str );
      }
    })
  }
}