/* global describe, it */
'use strict'
var assert = require('assert'),
    spawnSync = require('child_process').spawnSync,
    sprintf = require('../src/sprintf.js').sprintf

describe('bounded numeric precision', function() {
    it('preserves supported numeric formatting', function() {
        assert.equal(sprintf('%.2f', 1.234), '1.23')
        assert.equal(sprintf('%.2e', 1.234), '1.23e+0')
        assert.equal(sprintf('%.3g', 1.234), '1.23')
        assert.equal(sprintf('%+08.2f', 1.25), '+0001.25')
        assert.equal(sprintf('%(name)s', {name: 'hello'}), 'hello')
    })
    it('normalizes excessive precision and zero significant digits', function() {
        assert.equal(sprintf('%.0g', 1.25), sprintf('%.1g', 1.25))
        for (var type of ['e', 'f', 'g']) {
            assert.equal(sprintf('%.101' + type, 1.25), sprintf('%.100' + type, 1.25))
            assert.equal(sprintf('%.' + '9'.repeat(500) + type, 1.25), sprintf('%.100' + type, 1.25))
        }
    })
    it('does not crash an asynchronous formatting callback', function() {
        var source = 'var sprintf = require(' + JSON.stringify(require.resolve('../src/sprintf.js')) + ').sprintf; setImmediate(function() { for (var f of ["%.101e", "%.101f", "%.101g", "%.0g"]) sprintf(f, 1.25); console.log("survived") })'
        var child = spawnSync(process.execPath, ['-e', source], {encoding: 'utf8', timeout: 5000})
        assert.equal(child.status, 0, child.stderr)
        assert.equal(child.stdout.trim(), 'survived')
    })
})
