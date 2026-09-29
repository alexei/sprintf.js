/* global describe, it */

'use strict'

var assert = require('assert'),
    sprintfjs = require('../src/sprintf.js'),
    sprintf = sprintfjs.sprintf,
    vsprintf = sprintfjs.vsprintf

function should_throw(format,args,err) {
    assert.throws(function() { vsprintf(format,args) }, err)
}

function should_not_throw(format,args) {
    assert.doesNotThrow(function() { vsprintf(format,args) })
}

describe('sprintfjs cache', function() {

    it('should not throw Error (cache consistency)', function() {
        // redefine object properties to ensure that is not affect to the cache
        sprintf('hasOwnProperty')
        sprintf('constructor')
        should_not_throw('%s', ['caching...'])
        should_not_throw('%s', ['crash?'])
    })
})

describe('sprintfjs', function() {

    it('should throw SyntaxError for placeholders', function() {
        should_throw('%', [], SyntaxError)
        should_throw('%A', [], SyntaxError)
        should_throw('%s%', [], SyntaxError)
        should_throw('%(s', [], SyntaxError)
        should_throw('%)s', [], SyntaxError)
        should_throw('%$s', [], SyntaxError)
        should_throw('%()s', [], SyntaxError)
        should_throw('%(12)s', [], SyntaxError)
    })

    var numeric = 'bcdiefguxX'.split('')
    numeric.forEach(function(specifier) {
        var fmt = sprintf('%%%s',specifier)
        it(fmt + ' should throw TypeError for invalid numbers', function() {
            should_throw(fmt, [], TypeError)
            should_throw(fmt, ['str'], TypeError)
            should_throw(fmt, [{}], TypeError)
            should_throw(fmt, ['s'], TypeError)
        })

        it(fmt + ' should not throw TypeError for something implicitly castable to number', function() {
            should_not_throw(fmt, [1/0])
            should_not_throw(fmt, [true])
            should_not_throw(fmt, [[1]])
            should_not_throw(fmt, ['200'])
            should_not_throw(fmt, [null])
        })
    })

    it('should not throw Error for expression which evaluates to undefined', function() {
        should_not_throw("%(x.y)s", {x : {}})
    })

    it('should throw own Error when expression evaluation would raise TypeError', function() {
        var fmt = "%(x.y)s"
        try {
            sprintf(fmt, {})
        } catch (e) {
            assert(e.message.indexOf('[sprintf]') !== -1)
        }
    })

    it('should not throw when accessing properties on the prototype', function() {
        function C() { }
        C.prototype = {
            get x() { return 2 },
            set y(v) { /*Noop */}
        }
        var c = new C()
        should_not_throw("%(x)s", c)
        should_not_throw("%(y)s", c)
    })

    it('should throw RangeError for out-of-range precision (> 100)', function() {
        should_throw('%.101f', [1], RangeError)
        should_throw('%.101e', [1], RangeError)
        should_throw('%.101g', [1], RangeError)
        should_throw('%.200f', [1], RangeError)
    })

    it('should not throw for in-range precision boundaries', function() {
        should_not_throw('%.0f', [1])
        should_not_throw('%.100f', [1])
        should_not_throw('%.0e', [1])
        should_not_throw('%.100e', [1])
        should_not_throw('%.1g', [1])
        should_not_throw('%.100g', [1])
    })

    it('should not throw for %.0g (precision 0 mapped to toPrecision(1))', function() {
        should_not_throw('%.0g', [1])
    })
})
