/* to run: mocha test.js */
var sprintf = require('../src/sprintf.js');
var assert = require('assert');

describe('sprintf', function(){
    it('basic', function(){
	var t = function(fmt, args, expected){
	    assert.equal(sprintf.vsprintf(fmt, args), expected); };
        t('test', [], 'test');
        t('__proto__', [], '__proto__');
        t('%s %s', ['a', 'b'], 'a b');
	assert.equal(sprintf.sprintf('%s %s', 'a', 'b'), 'a b');
        t('%03d', [1], '001');
        t('%3d', [1], '  1');
        t('%3s', ['x'], '  x');
        t('%5d', [123], '  123');
        t('%+5d', [123], ' +123');
        t('%+.4f', [123.456], '+123.4560');
        t('%+5d', [-123], ' -123');
        t('%+.4f', [-123.456], '-123.4560');
        t('%b', [0xabcd1234], '10101011110011010001001000110100');
        t('%o', [10], '12');
        t('%o', [0xabcd1234], '25363211064');
        t('%o', [-10], '-12');
        t('%u', [123456789], '123456789');
        t('%u', [-123456789], '4171510507');
        t('%x', [0xabcd1234], 'abcd1234');
        t('%X', [0xabcd1234], 'ABCD1234');
        t('%x', [-0xabcd1234], '-abcd1234');
        t('%O', [1], '1');
        t('%O', ["1"], '"1"');
        t('%O', [{a: 1, b: 2}], '{"a":1,"b":2}');
        t('%(aa)s', [{aa: "AA"}], 'AA');
        t('%(aa[1])s', [{aa: [1, 2]}], '2');
        t('%(aa[1].b.c[0][1])s', [{aa: [0, {b: {c: [[4, 5]]}}]}], '5');
        t('%2$s %1$s', ['a', 'b'], 'b a');
    });
});
