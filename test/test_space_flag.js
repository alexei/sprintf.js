/* global describe, it */

'use strict'

var assert = require('assert'),
    sprintfjs = require('../src/sprintf.js'),
    sprintf = sprintfjs.sprintf,
    vsprintf = sprintfjs.vsprintf

describe('space sign flag', function() {
    [
        ['% d', 3, ' 3'],
        ['% i', 3, ' 3'],
        ['% d', 0, ' 0'],
        ['% d', '42', ' 42'],
        ['% d', -3, '-3'],
        ['% .2f', 2.5, ' 2.50'],
        ['% .2f', -2.5, '-2.50'],
        ['% .2e', 2.5, ' 2.50e+0'],
        ['% .3g', 2.5, ' 2.5'],
        ['% 5d', 3, '    3'],
        ['% 05d', 3, ' 0003'],
        ['% 05d', -3, '-0003'],
        ['% -5d', 3, ' 3   '],
        ['% +05d', 3, '+0003'],
        ['%+ 05d', 3, '+0003'],
        ['%+ 05d', -3, '-0003'],
        ['% 2x', 3, ' 3'],
        ['% 03x', 3, '003'],
        ['% x', 3, '3'],
        ['% o', 8, '10'],
        ['% u', 3, '3'],
        ['% s', 'word', 'word']
    ].forEach(function(test) {
        it('should format ' + JSON.stringify(test[1]) + ' with ' + test[0], function() {
            assert.equal(test[2], sprintf(test[0], test[1]))
        })
    })

    it('should support named placeholders', function() {
        assert.equal(' 3', sprintf('%(value) d', {value: 3}))
    })

    it('should support positional placeholders and vsprintf', function() {
        assert.equal(' 2/ 1', vsprintf('%2$ d/%1$ d', [1, 2]))
    })
})
