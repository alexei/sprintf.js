/* global describe, it */

'use strict'

const assert = require('assert')
const { sprintf, vsprintf } = require('../src/sprintf.js')

function should_throw(format,args,err) {
    assert.throws(() => { vsprintf(format,args) }, err)
}

function should_not_throw(format,args) {
    assert.doesNotThrow(() => { vsprintf(format,args) })
}

describe('sprintfjs cache', () => {

    it('should not throw Error (cache consistency)', () => {
        // redefine object properties to ensure that is not affect to the cache
        sprintf('hasOwnProperty')
        sprintf('constructor')
        should_not_throw('%s', ['caching...'])
        should_not_throw('%s', ['crash?'])
    })
})

describe('sprintfjs', () => {

    it('should throw SyntaxError for placeholders', () => {
        should_throw('%', [], SyntaxError)
        should_throw('%A', [], SyntaxError)
        should_throw('%s%', [], SyntaxError)
        should_throw('%(s', [], SyntaxError)
        should_throw('%)s', [], SyntaxError)
        should_throw('%$s', [], SyntaxError)
        should_throw('%()s', [], SyntaxError)
        should_throw('%(12)s', [], SyntaxError)
    })

    const numeric = 'bcdiefguxX'.split('')
    numeric.forEach((specifier) => {
        const fmt = sprintf('%%%s',specifier)
        it(fmt + ' should throw TypeError for invalid numbers', () => {
            should_throw(fmt, [], TypeError)
            should_throw(fmt, ['str'], TypeError)
            should_throw(fmt, [{}], TypeError)
            should_throw(fmt, ['s'], TypeError)
        })

        it(fmt + ' should not throw TypeError for something implicitly castable to number', () => {
            should_not_throw(fmt, [1/0])
            should_not_throw(fmt, [true])
            should_not_throw(fmt, [[1]])
            should_not_throw(fmt, ['200'])
            should_not_throw(fmt, [null])
        })
    })

    it('should not throw Error for expression which evaluates to undefined', () => {
        should_not_throw("%(x.y)s", {x : {}})
    })

    it('should throw own Error when expression evaluation would raise TypeError', () => {
        const fmt = "%(x.y)s"
        try {
            sprintf(fmt, {})
        } catch (e) {
            assert(e.message.indexOf('[sprintf]') !== -1)
        }
    })

    it('should not throw when accessing properties on the prototype', () => {
        function C() { }
        C.prototype = {
            get x() { return 2 },
            set y(v) { /*Noop */}
        }
        const c = new C()
        should_not_throw("%(x)s", c)
        should_not_throw("%(y)s", c)
    })
})
