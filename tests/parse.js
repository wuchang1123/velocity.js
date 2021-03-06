var Parser = require('../src/velocity').Parser;
var assert = require("assert");

describe('Parser', function(){

  describe('simple references', function(){

    it('simple references', function(){
      var vm = 'hello world: $foo';
      var ret = Parser.parse(vm);

      assert.ok(ret instanceof Array);
      assert.equal(2               , ret.length);
      assert.equal('hello world: ' , ret[0]);
      assert.equal('foo'           , ret[1].id);

    });

    it('valid variable references', function(){
      var vm = '$mud-Slinger_1';
      assert.equal('mud-Slinger_1', Parser.parse(vm)[0].id);
    });

    it('wraped references', function(){
      var vm = '${mudSlinger}';
      var ast = Parser.parse(vm)[0];
      assert.equal(true         , ast.isWraped);
      assert.equal('mudSlinger' , ast.id);
    });

    it('function call references', function(){
      var ast = Parser.parse('$foo()')[0];
      assert.equal(false, ast.args);
      assert.equal('references', ast.type);
    });

  });

  describe('Properties', function(){

    it('simple property', function(){
      var vm = '$customer.Address';
      var asts = Parser.parse(vm);
      assert.deepEqual(asts[0], {
        id     : "customer",
        type   : "references",
        path   : [{"type": "property","id": "Address"}],
        leader : '$'
      });
    });

  });

  describe('Methods ', function(){

    it('with no arguments', function(){
      var vm  = '$foo.bar()';
      var ast = Parser.parse(vm)[0];

      assert.deepEqual(ast['path'], [{
        type : "method",
        id   : "bar",
        args : false
      }]);
    });

    it('with arguments integer', function(){
      var vm = '$foo.bar(10)';
      var ast = Parser.parse(vm)[0];

      assert.deepEqual(ast['path'], [{
        type : "method",
        id   : "bar",
        args : [{
          type  : "integer",
          value : "10"
        }]
      }]);
    });

    it('with arguments references', function(){
      var vm = '$foo.bar($bar)';
      var ast = Parser.parse(vm)[0];
      assert.deepEqual(ast.path[0].args, [{
        type   : "references",
        leader : "$",
        id     : "bar"
      }]);
    });

  });

  describe('Index', function(){

    it('all kind of indexs', function(){
      var vm = '$foo[0] $foo[$i] $foo["bar"]';
      var asts = Parser.parse(vm);

      assert.equal(5, asts.length);

      //asts[0].path[0] => $foo[0] 
      //{type: 'index', id: {type: 'integer', value: '0'}}
      assert.equal('index'   , asts[0].path[0].type);
      assert.equal('integer' , asts[0].path[0].id.type);
      assert.equal('0'       , asts[0].path[0].id.value);

      //asts[2].path[0] => $foo[$i]
      //{type: 'references', id: {type:'references', id: 'i', leader: '$'}}
      assert.equal('index'      , asts[2].path[0].type);
      assert.equal('references' , asts[2].path[0].id.type);
      assert.equal('i'          , asts[2].path[0].id.id);

      //asts[4].path[0] => $foo["bar"]
      //{type: 'index', id: {type: 'string', value: 'bar', isEval: true}}
      assert.equal('index'  , asts[4].path[0].type);
      assert.equal('string' , asts[4].path[0].id.type);
      assert.equal('bar'    , asts[4].path[0].id.value);

    });

  });

  describe('complex references', function(){

    it('property + index + property', function(){
      var vm = '$foo.bar[1].junk';
      var ast = Parser.parse(vm)[0];

      assert.equal('foo' , ast.id);
      assert.equal(3     , ast.path.length);

      var paths = ast.path;

      assert.equal('property' , paths[0].type);
      assert.equal('index'    , paths[1].type);
      assert.equal('property' , paths[2].type);

    });


    it('method + index', function(){
      var vm = '$foo.callMethod()[1]';
      var ast = Parser.parse(vm)[0];

      assert.equal(2, ast.path.length);

      assert.equal('method'     , ast.path[0].type);
      assert.equal('callMethod' , ast.path[0].id);

      assert.equal('index'   , ast.path[1].type);
      assert.equal('1'       , ast.path[1].id.value);
      assert.equal('integer' , ast.path[1].id.type);

    });

    it('property should not start with alphabet', function(){
      var asts = Parser.parse('$foo.124');
      var ast1 = Parser.parse('$foo._24')[0];
      var ast2 = Parser.parse('$foo.-24')[0];

      assert.equal(2         , asts.length);
      assert.equal('foo'     , asts[0].id);
      assert.equal('.1'      , asts[0].path[0].value);
      assert.equal('content' , asts[0].path[0].type);
      assert.equal('24'      , asts[1]);

      assert.equal('._'      , ast1.path[0].value);
      assert.equal('content' , ast1.path[0].type);
      assert.equal('.-'      , ast2.path[0].value);
      assert.equal('content' , ast2.path[0].type);

    });

    it('index should end with close bracket', function(){
      assert.throws(function(){
        Parser.parse("$foo.bar['a'12]");
      }, /Parse error/);

      assert.throws(function(){
        Parser.parse("$foo.bar[_a'12]");
      }, /Lexical error/);

    });

  });

  describe('comment identify', function(){

    it('one line comment', function(){
      var asts = Parser.parse('#set( $monkey.Number = 123)##number literal');

      assert.equal(2         , asts.length);
      assert.equal('comment' , asts[1].type);
    });

  });

});
