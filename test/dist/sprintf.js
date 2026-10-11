/* global describe, it */

'use strict'

var assert = require('assert'),
    sprintf = require('../../dist/sprintf.min.js').sprintf,
    excessive = new Array(102).join('9')

describe('minified distribution', function() {
    it('should cap numeric precision without throwing', function() {
        var specifiers = ['e', 'f', 'g']
        specifiers.forEach(function(specifier) {
            var expected = sprintf('%.100' + specifier, 1.25)
            assert.equal(sprintf('%.101' + specifier, 1.25), expected)
            assert.equal(sprintf('%.' + excessive + specifier, 1.25), expected)
        })
        assert.equal(sprintf('%.0g', 1.25), sprintf('%.1g', 1.25))
        assert.equal(sprintf('%.0e', 1.25), '1e+0')
        assert.equal(sprintf('%.0f', 1.25), '1')
    })
})
