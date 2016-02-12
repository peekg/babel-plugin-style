import {types as t} from 'babel';

export default class Property {
  
  constructor(node,parent,scope,parentPath) {
    if( !t.isProperty(node) ){ throw new Error("Node is not property!") }
    
    this.name = t.isLiteral( node.key ) ? node.key.value : node.key.name;
    
    if( t.isLiteral( node.value ) ) {
      this.value = node.value.value;
    }
  }
  
  static is( node ) {
    if( !t.isObjectExpression( node ) ) {
      if( !t.isObjectExpression( node.value ) ) {
        return true;
      }
    }
    return false;
  }
  
}