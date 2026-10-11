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

    it('should cap numeric precision at the JavaScript limit without throwing', function() {
        var specifiers = ['e', 'f', 'g']
        specifiers.forEach(function(specifier) {
            var capped = sprintf('%.100' + specifier, 1.25)
            assert.equal(sprintf('%.101' + specifier, 1.25), capped)
            assert.equal(sprintf('%.' + new Array(102).join('9') + specifier, 1.25), capped)
        })
        assert.equal(sprintf('%.0g', 1.25), sprintf('%.1g', 1.25))
    })

    it('should preserve zero precision for non-numeric specifiers', function() {
        assert.equal(sprintf('%.0e', 1.25), '1e+0')
        assert.equal(sprintf('%.0f', 1.25), '1')
        assert.equal(sprintf('%.0s', 'text'), '')
        assert.equal(sprintf('%.0t', true), '')
        assert.equal(sprintf('%.0T', true), '')
    })

})
