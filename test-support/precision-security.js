/* global describe, it */
'use strict'

var assert = require('assert'),
    childProcess = require('child_process'),
    fs = require('fs'),
    path = require('path'),
    vm = require('vm')

module.exports = function(entry) {
    var implementation = require(entry), sprintf = implementation.sprintf
    describe('bounded numeric precision: ' + entry, function() {
        ['e', 'f', 'g'].forEach(function(type) {
            ['101', '999999999999999999999999999999999999', '9'.repeat(10000)].forEach(function(precision) {
                it('caps excessive ' + type + ' precision (' + precision.length + ' digits)', function() {
                    var expected = sprintf('%.100' + type, 1.25)
                    assert.strictEqual(sprintf('%.' + precision + type, 1.25), expected)
                    assert.strictEqual(implementation.vsprintf('%.' + precision + type, [1.25]), expected)
                    // The cached parse tree must behave identically on repeated use.
                    assert.strictEqual(sprintf('%.' + precision + type, 1.25), expected)
                })
            })
        })
        it('preserves omitted, zero, boundary and leading-zero precision semantics', function() {
            assert.strictEqual(sprintf('%.0f', 1.75), '2')
            assert.strictEqual(sprintf('%.0e', 1.75), '2e+0')
            assert.strictEqual(sprintf('%.0g', 1.75), '2')
            assert.strictEqual(sprintf('%.000g', 1.75), '2')
            assert.strictEqual(sprintf('%.2f', 1.25), '1.25')
            assert.strictEqual(sprintf('%.0002f', 1.25), '1.25')
            assert.strictEqual(sprintf('%f', 1.25), '1.25')
            assert.strictEqual(sprintf('%g', 1.25), '1.25')
            assert.strictEqual(sprintf('%e', 1.25), '1.25e+0')
            assert.strictEqual(sprintf('%.100f', 1.25), (1.25).toFixed(100))
            assert.strictEqual(sprintf('%.100e', 1.25), (1.25).toExponential(100))
            assert.strictEqual(sprintf('%.100g', 1.25), String(Number((1.25).toPrecision(100))))
        })
        it('preserves nonnumeric precision, signs, padding, named arguments and error contracts', function() {
            assert.strictEqual(sprintf('%.0s', 'abc'), '')
            assert.strictEqual(sprintf('%.101s', 'x'.repeat(150)), 'x'.repeat(101))
            assert.strictEqual(sprintf('%.0t', true), '')
            assert.strictEqual(sprintf('%+.2f', 1.25), '+1.25')
            assert.strictEqual(sprintf('%08.2f', 1.25), '00001.25')
            assert.strictEqual(sprintf('%(price).101f', {price: 1.25}), sprintf('%.100f', 1.25))
            assert.throws(function() { sprintf('%.2f', 'not-a-number') }, TypeError)
            assert.throws(function() { sprintf('%.f', 1.25) }, SyntaxError)
        })
        it('bounds native calls on older runtimes with 20/21 digit limits', function() {
            var context = {exports: {}}, source = fs.readFileSync(require.resolve(entry), 'utf8')
            vm.runInNewContext([
                "['toFixed','toExponential','toPrecision'].forEach(function(method) {",
                'var original = Number.prototype[method], maximum = method === "toPrecision" ? 21 : 20;',
                'Number.prototype[method] = function(precision) {',
                'if(precision > maximum) throw new RangeError("legacy precision limit");',
                'return original.call(this, precision);',
                '}; });', source
            ].join('\n'), context)
            assert.strictEqual(context.exports.sprintf('%.101f', 1.25), (1.25).toFixed(20))
            assert.strictEqual(context.exports.sprintf('%.101e', 1.25), (1.25).toExponential(20))
            assert.strictEqual(context.exports.sprintf('%.101g', 1.25), '1.25')
            assert.strictEqual(context.exports.sprintf('%.0g', 1.75), '2')
        })
        it('does not terminate an asynchronous caller for excessive or zero g precision', function() {
            var script = 'var sprintf = require(' + JSON.stringify(path.resolve(__dirname, entry)) + ').sprintf; setImmediate(function() {' +
                '["%.101f","%.101e","%.101g","%.0g","%."+"9".repeat(10000)+"f"].forEach(function(format) { sprintf(format, 1.25) });' +
                'process.stdout.write("ok"); });'
            var result = childProcess.spawnSync(process.execPath, ['-e', script], {encoding: 'utf8', timeout: 3000})
            assert.strictEqual(result.status, 0, result.stderr)
            assert.strictEqual(result.stdout, 'ok')
        })
    })
}
