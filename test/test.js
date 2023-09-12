/* global describe, it */

'use strict'

const assert = require('assert'),
    sprintfjs = require('../src/sprintf.js'),
    sprintf = sprintfjs.sprintf

describe('sprintfjs', () => {
    const pi = Math.PI

    it('should return formated strings for simple placeholders', () => {
        assert.strictEqual('%', sprintf('%%'))
        assert.strictEqual('10', sprintf('%b', 2))
        assert.strictEqual('A', sprintf('%c', 65))
        assert.strictEqual('2', sprintf('%d', 2))
        assert.strictEqual('2', sprintf('%i', 2))
        assert.strictEqual('2', sprintf('%d', '2'))
        assert.strictEqual('2', sprintf('%i', '2'))
        assert.strictEqual('{"foo":"bar"}', sprintf('%j', {foo: 'bar'}))
        assert.strictEqual('["foo","bar"]', sprintf('%j', ['foo', 'bar']))
        assert.strictEqual('2e+0', sprintf('%e', 2))
        assert.strictEqual('2', sprintf('%u', 2))
        assert.strictEqual('4294967294', sprintf('%u', -2))
        assert.strictEqual('2.2', sprintf('%f', 2.2))
        assert.strictEqual('3.141592653589793', sprintf('%g', pi))
        assert.strictEqual('10', sprintf('%o', 8))
        assert.strictEqual('37777777770', sprintf('%o', -8))
        assert.strictEqual('%s', sprintf('%s', '%s'))
        assert.strictEqual('ff', sprintf('%x', 255))
        assert.strictEqual('ffffff01', sprintf('%x', -255))
        assert.strictEqual('FF', sprintf('%X', 255))
        assert.strictEqual('FFFFFF01', sprintf('%X', -255))
        assert.strictEqual('Polly wants a cracker', sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants'))
        assert.strictEqual('Hello world!', sprintf('Hello %(who)s!', {who: 'world'}))
        assert.strictEqual('true', sprintf('%t', true))
        assert.strictEqual('t', sprintf('%.1t', true))
        assert.strictEqual('true', sprintf('%t', 'true'))
        assert.strictEqual('true', sprintf('%t', 1))
        assert.strictEqual('false', sprintf('%t', false))
        assert.strictEqual('f', sprintf('%.1t', false))
        assert.strictEqual('false', sprintf('%t', ''))
        assert.strictEqual('false', sprintf('%t', 0))

        assert.strictEqual('undefined', sprintf('%T', undefined))
        assert.strictEqual('null', sprintf('%T', null))
        assert.strictEqual('boolean', sprintf('%T', true))
        assert.strictEqual('number', sprintf('%T', 42))
        assert.strictEqual('string', sprintf('%T', 'This is a string'))
        assert.strictEqual('function', sprintf('%T', Math.log))
        assert.strictEqual('array', sprintf('%T', [1, 2, 3]))
        assert.strictEqual('object', sprintf('%T', {foo: 'bar'}))
        assert.strictEqual('regexp', sprintf('%T', /<('[^']*'|'[^']*'|[^''>])*>/))

        assert.strictEqual('true', sprintf('%v', true))
        assert.strictEqual('42', sprintf('%v', 42))
        assert.strictEqual('This is a string', sprintf('%v', 'This is a string'))
        assert.strictEqual('1,2,3', sprintf('%v', [1, 2, 3]))
        assert.strictEqual('[object Object]', sprintf('%v', {foo: 'bar'}))
        assert.strictEqual('/<("[^"]*"|\'[^\']*\'|[^\'">])*>/', sprintf('%v', /<("[^"]*"|'[^']*'|[^'">])*>/))
    })

    it('should return formatted strings for complex placeholders', () => {
        // sign
        assert.strictEqual('2', sprintf('%d', 2))
        assert.strictEqual('-2', sprintf('%d', -2))
        assert.strictEqual('+2', sprintf('%+d', 2))
        assert.strictEqual('-2', sprintf('%+d', -2))
        assert.strictEqual('2', sprintf('%i', 2))
        assert.strictEqual('-2', sprintf('%i', -2))
        assert.strictEqual('+2', sprintf('%+i', 2))
        assert.strictEqual('-2', sprintf('%+i', -2))
        assert.strictEqual('2.2', sprintf('%f', 2.2))
        assert.strictEqual('-2.2', sprintf('%f', -2.2))
        assert.strictEqual('+2.2', sprintf('%+f', 2.2))
        assert.strictEqual('-2.2', sprintf('%+f', -2.2))
        assert.strictEqual('-2.3', sprintf('%+.1f', -2.34))
        assert.strictEqual('-0.0', sprintf('%+.1f', -0.01))
        assert.strictEqual('3.14159', sprintf('%.6g', pi))
        assert.strictEqual('3.14', sprintf('%.3g', pi))
        assert.strictEqual('3', sprintf('%.1g', pi))
        assert.strictEqual('-000000123', sprintf('%+010d', -123))
        assert.strictEqual('______-123', sprintf("%+'_10d", -123))
        assert.strictEqual('-234.34 123.2', sprintf('%f %f', -234.34, 123.2))

        // padding
        assert.strictEqual('-0002', sprintf('%05d', -2))
        assert.strictEqual('-0002', sprintf('%05i', -2))
        assert.strictEqual('    <', sprintf('%5s', '<'))
        assert.strictEqual('0000<', sprintf('%05s', '<'))
        assert.strictEqual('____<', sprintf("%'_5s", '<'))
        assert.strictEqual('>    ', sprintf('%-5s', '>'))
        assert.strictEqual('>0000', sprintf('%0-5s', '>'))
        assert.strictEqual('>____', sprintf("%'_-5s", '>'))
        assert.strictEqual('xxxxxx', sprintf('%5s', 'xxxxxx'))
        assert.strictEqual('1234', sprintf('%02u', 1234))
        assert.strictEqual(' -10.235', sprintf('%8.3f', -10.23456))
        assert.strictEqual('-12.34 xxx', sprintf('%f %s', -12.34, 'xxx'))
        assert.strictEqual('{\n  "foo": "bar"\n}', sprintf('%2j', {foo: 'bar'}))
        assert.strictEqual('[\n  "foo",\n  "bar"\n]', sprintf('%2j', ['foo', 'bar']))

        // precision
        assert.strictEqual('2.3', sprintf('%.1f', 2.345))
        assert.strictEqual('xxxxx', sprintf('%5.5s', 'xxxxxx'))
        assert.strictEqual('    x', sprintf('%5.1s', 'xxxxxx'))

    })

    it('should return formatted strings for callbacks', () => {
        assert.strictEqual('foobar', sprintf('%s', () => 'foobar'))
    })
})
