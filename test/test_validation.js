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

    var numeric = 'b,c,d,i,e,f,g,u,x,X,lx,lX'.split(',')
    numeric.forEach(function(specifier) {
        var fmt = sprintf('%%%s',specifier)
        it(fmt + ' should throw TypeError for invalid numbers', function() {
            should_throw(fmt, [], TypeError)
            should_throw(fmt, ['str'], TypeError)
            should_throw(fmt, [{}], TypeError)
            should_throw(fmt, ['s'], TypeError)
        })

        it(fmt + ' should not throw TypeError for something implicitly castable to number', function() {
            should_not_throw(fmt, [true])
            should_not_throw(fmt, [[1]])
            should_not_throw(fmt, ['200'])
            if ((fmt !== "%lx") && (fmt !== "%lX")) {
                // Cannot convert Infinity to BigInt
                should_not_throw(fmt, [1/0])
                // Cannot convert null to a BigInt
                should_not_throw(fmt, [null])
            }
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
})
