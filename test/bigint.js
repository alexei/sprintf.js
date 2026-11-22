/* global describe, it, BigInt */

'use strict'

var assert = require('assert'),
    sprintfjs = require('../src/sprintf.js'),
    sprintf = sprintfjs.sprintf

describe('BigInt signed decimal formatting', function() {
    if (typeof BigInt !== 'function') {
        return
    }

    it('preserves integers beyond Number precision', function() {
        var digits = '9999999999999999999999999999999999999999'
        assert.strictEqual(sprintf('%d', BigInt(digits)), digits)
        assert.strictEqual(sprintf('%i', BigInt('-' + digits)), '-' + digits)
        assert.strictEqual(sprintf('%d', BigInt(0)), '0')
    })

    it('applies signs, padding and alignment', function() {
        assert.strictEqual(sprintf('%+06d', BigInt(42)), '+00042')
        assert.strictEqual(sprintf('%06i', BigInt(-42)), '-00042')
        assert.strictEqual(sprintf('%-6d', BigInt(42)), '42    ')
        assert.strictEqual(sprintf("%'_6d", BigInt(42)), '____42')
    })

    it('supports named, positional, lazy and array arguments', function() {
        var value = BigInt('9007199254740993')
        assert.strictEqual(sprintf('%(value)d', {value: value}), '9007199254740993')
        assert.strictEqual(sprintf('%2$i %1$d', value, BigInt(2)), '2 9007199254740993')
        assert.strictEqual(sprintf('%d', function() { return value }), '9007199254740993')
        assert.strictEqual(sprintfjs.vsprintf('%d', [value]), '9007199254740993')
    })

    it('keeps existing Number conversion and errors', function() {
        assert.strictEqual(sprintf('%d', 42.9), '42')
        assert.strictEqual(sprintf('%i', '-42.9'), '-42')
        assert.throws(function() { sprintf('%d', 'not a number') }, TypeError)
        assert.throws(function() { sprintf('%f', BigInt(42)) }, TypeError)
    })
})
