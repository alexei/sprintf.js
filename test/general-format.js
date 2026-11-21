/* global describe, it */

'use strict'

var assert = require('assert'),
    sprintf = require('../src/sprintf.js').sprintf

describe('general floating-point notation', function() {
    it('uses scientific notation for exponents below minus four', function() {
        assert.equal('1e-6', sprintf('%.14g', 0.000001))
        assert.equal('1e-5', sprintf('%.14g', 0.00001))
        assert.equal('-1.25e-5', sprintf('%.14g', -0.0000125))
        assert.equal('1e-7', sprintf('%.14g', 0.0000001))
        assert.equal('0.0001', sprintf('%.14g', 0.0001))
    })

    it('uses scientific notation when the exponent reaches the precision', function() {
        assert.equal('1e+3', sprintf('%.3g', 1000))
        assert.equal('999', sprintf('%.3g', 999))
        assert.equal('1e+1', sprintf('%.1g', 10))
        assert.equal('1.2e+5', sprintf('%.4g', 120000))
        assert.equal('1.23457e+6', sprintf('%.6g', 1234567))
    })

    it('chooses notation using the rounded exponent', function() {
        assert.equal('0.0001', sprintf('%.1g', 0.000099))
        assert.equal('1e-5', sprintf('%.1g', 0.0000099))
        assert.equal('1e+3', sprintf('%.3g', 999.9))
        assert.equal('999', sprintf('%.3g', 999.4))
    })

    it('removes fractional trailing zeroes without discarding integer zeroes', function() {
        assert.equal('120', sprintf('%.6g', 120))
        assert.equal('1.25', sprintf('%.6g', 1.25))
        assert.equal('1e-5', sprintf('%.6g', 0.00001))
        assert.equal('1e+6', sprintf('%.6g', 1000000))
        assert.equal('100000000000000000000', sprintf('%.21g', 1e20))
    })

    it('applies signs, padding and alignment to the chosen notation', function() {
        assert.equal('+001.23e-5', sprintf('%+010.3g', 0.00001234))
        assert.equal('     1.23e-5', sprintf('%12.3g', 0.00001234))
        assert.equal('1.23e-5     ', sprintf('%-12.3g', 0.00001234))
    })

    it('preserves zero, infinity and the default precision behavior', function() {
        assert.equal('0', sprintf('%.6g', 0))
        assert.equal('Infinity', sprintf('%.6g', Infinity))
        assert.equal('-Infinity', sprintf('%.6g', -Infinity))
        assert.equal('0.000001', sprintf('%g', 0.000001))
        assert.equal('100000000000000000000', sprintf('%g', 1e20))
    })
})
