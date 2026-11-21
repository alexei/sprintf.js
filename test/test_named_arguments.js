/* global describe, it */

'use strict'

var assert = require('assert'),
    sprintfjs = require('../src/sprintf.js'),
    sprintf = sprintfjs.sprintf,
    vsprintf = sprintfjs.vsprintf

describe('named arguments containing spaces', function() {
    it('should look up a top-level property', function() {
        assert.equal('Hello Dolly', sprintf('Hello %(First Name)s', {'First Name': 'Dolly'}))
    })

    it('should look up properties separated by dots', function() {
        assert.equal('Dolly', sprintf('%(User Details.First Name)s', {
            'User Details': {'First Name': 'Dolly'}
        }))
    })

    it('should combine spaced properties with array indexes', function() {
        assert.equal('Molly', sprintf('%(User List[1].First Name)s', {
            'User List': [{'First Name': 'Dolly'}, {'First Name': 'Molly'}]
        }))
    })

    it('should preserve repeated and trailing spaces in each property', function() {
        assert.equal('Dolly', sprintf('%(User  Details .First  Name )s', {
            'User  Details ': {'First  Name ': 'Dolly'}
        }))
    })

    it('should support formatting modifiers', function() {
        assert.equal('0012.50', sprintf('%(Total Price)07.2f', {'Total Price': 12.5}))
    })

    it('should support vsprintf and cached placeholders with new values', function() {
        assert.equal('Hello Molly', vsprintf('Hello %(First Name)s', [{'First Name': 'Molly'}]))
        assert.equal('Hello Polly', vsprintf('Hello %(First Name)s', [{'First Name': 'Polly'}]))
    })

    it('should still reject invalid property names and indexes', function() {
        [' First Name', '1st Name', 'First\tName', 'First\nName', 'User. First Name', 'User[First Name]'].forEach(function(key) {
            assert.throws(function() {
                sprintf('%(' + key + ')s', {})
            }, SyntaxError)
        })
    })
})
