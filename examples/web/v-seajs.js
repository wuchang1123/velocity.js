seajs.config({
    alias: {
        'underscore': 'gallery/underscore/1.4.2/underscore'
    },
    debug: true,
    /*map: [
        ['http://example.com/js/app/', 'http://localhost/js/app/']
    ],*/
    base: 'http://modules.seajs.org/',
    charset: 'utf-8'
});
seajs.use('underscore', function(S, Velocity, asts){
    console.log(arguments);
});