var Parser  = require('./parse/');
var utils   = require('./utils');
var Compile = require('./compile/');
var Helper  = {};

Helper.Structure = require('./helper/structure');
Helper.Jsonify   = require('./helper/jsonify');
Helper.BackStep  = require('./helper/backstep');

var Velocity = {
  Parser  : Parser,
  Compile : Compile,
  Helper  : Helper
};

Velocity.render = function(template, context){

  var t1   = Date.now();
  var asts = Parser.parse(template);
  var t2   = Date.now();
  //var str  = 'parse syntax tree finished, cost time: ' + (t2 - t1)+ 'ms.';

  var compile = new Compile(asts);
  return compile.render(context);
};


module.exports = Velocity;
