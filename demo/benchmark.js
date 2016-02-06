sprintf = require("../").sprintf
qprintf = require("../../../node/npm/qprintf").sprintf

x = null

tests = [
    {format: "%8d", value: 12345},
    {format: "%08d", value: 12345},
    {format: "%2d", value: 12345},
    {format: "%8s", value: "abcde"},
    {format: "%+010d", value: 12345},
]

for (testIndex in tests) {
    fmt = tests[testIndex].format
    val = tests[testIndex].value
    t1 = Date.now()
    for (i=0; i<100000; i++) x = sprintf(fmt, val)
    ms = Date.now() - t1
    console.log(sprintf("  %5d ms  %8s   ", ms, fmt), x)
}
