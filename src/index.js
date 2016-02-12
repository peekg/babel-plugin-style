import 'better-log/install';
import fs from 'fs';
import Ruleset from './ruleset';
import Property from './property';
import Style from './style';

module.exports = function ({ Plugin, parse, traverse }) {

  var styles = new Array(),
  stack = new Array(),
  peek = function () { return stack[stack.length-1]; },
  stacked = function () { return stack.length != 0; };
  
  return new Plugin('style', {
    visitor: {
      Program: {
        exit(node, parent, scope, file) {
          var str = "";
          styles.forEach( function ( s ) {
            str += s.toString();
          });
          fs.writeFileSync( file.opts.sourceFileName.replace().replace( /.jsx?$/, ".css" ), str );
        }
      },
      CallExpression: {
        enter(node, parent) {
          if( Style.is(node) ) {
            stack.push( new Style (peek(),node,parent) );
          }
        },
        exit(node, parent) {
          var s;
          if( stacked() ) {
            if( Style.is(node) ) {
              peek().pop();//clear last ruleset
              s = stack.pop();
              styles.push( s );
              if( stack.length === 0 ) {
                s = s.getReplacement()
                if( s ) { 
                  this.replaceWith( s );
                } else {
                  this.dangerouslyRemove();
                }
              }
            }
          }
        }
      },
      Property: {
        enter(node, parent, scope, file) {
          var s, r, p;
          if( stacked() ) {
            if( Ruleset.is(node) ) {
              peek().push( new Ruleset( peek().getSelectors( node, this.parentPath ) ) );
            }
            else if( Property.is(node) ) {
              peek().peek().push( new Property( node, parent, scope, this.parentPath ) );
            }
          }
        },
        exit(node, parent) {
          if( stacked() ) {
            if( Ruleset.is(node) ) {
              peek().pop();
            }
          }
        }
      }
    }
  });
};

