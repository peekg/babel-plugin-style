import {types as t} from 'babel';
import Ruleset from './ruleset'; 

class StyleHelper {
  constructor (node) {
    this.node = node;
  }
  getSelectors (node, parentPath) {
    var l = [];
    while( node != this.node && parentPath.parentPath ) {
      if( t.isProperty( node ) ) {
        l.push( StyleHelper.getName(node.key) )
      }
      parentPath = parentPath.parentPath;
      node = parentPath.node;
    }
    return l.reverse();
  }
  
  static getName ( node ) {
    if( t.isLiteral( node ) ) {
      return node.value;
    }
    if( t.isIdentifier( node ) ) {
      return node.name;
    }
    return null;
  }
  
}

class StyleObject {

  constructor (node) {
    this.helper = new StyleHelper(node);
  }
  
  static is(node) {
    return t.isIdentifier( node.callee, {name:"Style"} );
  }
  
  getSelectors(node,parentPath) {
    return this.helper.getSelectors(node,parentPath)
  }
  
  getReplacement () {
    return null;
  }
}

var StyleMembers = (function () {
  
  var names = {};
  var styles = {};
  
  return { 
    getNames: function ( name, hasArgs ) {
      //init
      if( isNaN( names[ name ] ) ) { 
        names[ name ] = 0;
        return [name + '0'];
      }
      else if( hasArgs ) {//is modifying the original
        names[ name ]++;
      }
      return [name + '0', name + names[ name ]];
    },
    add: function ( name, style ) {
      styles[ name ] = style;
    },
    get: function ( name ) {
      return styles[ name ];
    }
  };
}())

class StyleMember {
  
  constructor ( node, parent ) {
    var name = node.callee.property.name;
    StyleMembers.add( name, this );
    this.names = StyleMembers.getNames( name, (node.arguments.length > 0) );
    this.helper = new StyleHelper(node);
    this.parent = parent;
  }
  
  static is ( node ) {
    return t.isMemberExpression( node.callee ) &&
           t.isIdentifier( node.callee.object, {name:"Style"} )
  }
  
  getSelectors(node, parentPath) {
    var s = this.helper.getSelectors(node, parentPath);
    s.unshift( this.getSelector() );
    return s;
  }
  
  setChild ( child ) {
    this.child = child;
  }
  
  getNames() {
    var c = this.child,
    cn = this.names.join( ' ' );
    //'A B C' === A(B(C()))
    var i = 0;
    while( c ) {
      cn += ' ' + c.names.join( ' ' );
      c = c.child;
    }
    return cn;
  }
  
  getSelector() {
    return "." + this.names[this.names.length-1];
  }
  
  getReplacement () {
//    console.log(this.parent);
    if( t.isVariableDeclaration( this.parent ) ) {
      return t.literal( this.getNames() );
    } else if( t.isAssignmentExpression( this.parent ) ) {
      
    }
    return null;
//    if(t.isExpressionStatement(this.parent)){ return null; }
//    return t.literal( this.getNames() );
    
  }
}

var StyleTheme = (function () {
  var created = false;
  var helper;
  return { 
    is( node ) {
      return t.isIdentifier( node.callee.object, {name:"Style"} ) &&
             t.isIdentifier( node.callee.property, {name:"theme"} );
    },
    create(node){
      if( created ) throw new Error ("Style.theme already defined!");
      created = true;
      helper = new StyleHelper(node);
    },
    getSelectors(node, parentPath) {
      return helper.getSelector();
    },
    getReplacement() { return null; }
  }
}())

var StyleFactory = (function () {
  return {
    create: function ( style, parentStyle, node, parent ) 
    {
      if( StyleTheme.is( node ) ) {
        return StyleTheme.create( node );
      }
      else if( StyleObject.is(node) ) 
      {
        return new StyleObject (node);
      } 
      else if ( StyleMember.is(node) ) 
      {
        if( node.arguments.length > 0 ) { // override or create
          var s = new StyleMember(node,parent);
          if( parentStyle ) {
            parentStyle.style.setChild( s );
          }
          style.push( new Ruleset( [ s.getSelector() ] ) );
          return s;
        } 
        else 
        { //already defined
          return StyleMembers.get( node.callee.property.name );
        } 
      }
      throw new Error( "Node is not a Style!" );
    }
  }
}())

export default class Style {
  
  constructor (parentStyle,node,parent) {
    this.ruleset = new Array ();
    this.stack = new Array();
    this.style = StyleFactory.create( this, parentStyle, node, parent );
  }
  
  static is ( node ) {
    return StyleObject.is( node ) || StyleMember.is( node );
  }
  
  push ( ruleset ) {
    this.stack.push( ruleset );
    return this;
  }
  
  pop () {
    var o = this.stack.pop();
    if( o ) {
      this.ruleset.push( o )
    }
    return this;
  }
  
  peek() {
    return this.stack[ this.stack.length - 1 ]; 
  }
  
  getSelectors (node, parentPath) {
    return this.style.getSelectors( node, parentPath );
  }
  
  getReplacement () {
    return this.style.getReplacement();
  }
  
  toString() {
    var str = "",
    //reverse order, as media queries should go last
    i = this.ruleset.length;
    while(i--){
      str += this.ruleset[i].toString();
    }
    return str;
  }
}
