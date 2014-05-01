var assert = require("assert"),
    sprintfjs = require("../src/sprintf.js"),
    sprintf = sprintfjs.sprintf,
    vsprintf = sprintfjs.vsprintf

describe("sprintfjs", function() {
    it("should return formated strings for simple placeholders", function() {
        assert.equal("%", sprintf("%%"))
        assert.equal("10", sprintf("%b", 2))
        assert.equal("A", sprintf("%c", 65))
        assert.equal("2", sprintf("%d", 2))
        assert.equal("2", sprintf("%d", "2"))
        assert.equal("2e+0", sprintf("%e", 2))
        assert.equal("2", sprintf("%u", 2))
        assert.equal("4294967294", sprintf("%u", -2))
        assert.equal("2.2", sprintf("%f", 2.2))
        assert.equal("10", sprintf("%o", 8))
        assert.equal("%s", sprintf("%s", "%s"))
        assert.equal("ff", sprintf("%x", 255))
        assert.equal("FF", sprintf("%X", 255))
        assert.equal("Polly wants a cracker", sprintf("%2$s %3$s a %1$s", "cracker", "Polly", "wants"))
        assert.equal("Hello world!", sprintf("Hello %(who)s!", {"who": "world"}))
    })

    it("should return formated strings for complex placeholders", function() {
        // sign
        assert.equal("2", sprintf("%d", 2))
        assert.equal("-2", sprintf("%d", -2))
        assert.equal("+2", sprintf("%+d", 2))
        assert.equal("-2", sprintf("%+d", -2))
        assert.equal("2.2", sprintf("%f", 2.2))
        assert.equal("-2.2", sprintf("%f", -2.2))
        assert.equal("+2.2", sprintf("%+f", 2.2))
        assert.equal("-2.2", sprintf("%+f", -2.2))
        assert.equal("-2.3", sprintf("%+.1f", -2.34))
        assert.equal("-0.0", sprintf("%+.1f", -0.01))

        // padding
        assert.equal("000-2", sprintf("%05d", -2))
        assert.equal("    <", sprintf("%5s", "<"))
        assert.equal("0000<", sprintf("%05s", "<"))
        assert.equal("____<", sprintf("%'_5s", "<"))
        assert.equal(">    ", sprintf("%-5s", ">"))
        assert.equal(">0000", sprintf("%0-5s", ">"))
        assert.equal(">____", sprintf("%'_-5s", ">"))
        assert.equal("xxxxxx", sprintf("%5s", "xxxxxx"))

        // precision
        assert.equal("2.3", sprintf("%.1f", 2.345))
        assert.equal("xxxxx", sprintf("%5.5s", "xxxxxx"))
        assert.equal("    x", sprintf("%5.1s", "xxxxxx"))
    })
})