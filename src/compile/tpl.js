define(function(require) {
  var Velocity = function(asts){
    this.asts = asts;
    this.init();
  };
  Velocity.Helper = {};
  Velocity.prototype = {
    constructor: Velocity
  };

  var _ = require(underscore);

  function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  function guid() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  //api map
  var utils = {
    forEach : _.each,
    some    : _.some,
    mixin   : _.mixin,
    guid    : guid,
    isArray : _.isArray,
    indexOf : _.indexOf,
    keys    : _.keys,
    now     : +new Date()
  };

  {helper}
  {velocity}
  return Velocity;
});
