'use strict';

(function(window) {
    var re = {
        notString: /[^s]/,
        number: /[diefg]/,
        json: /[j]/,
        notJson: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        keyAccess: /^\.([a-z_][a-z_\d]*)/i,
        indexAccess: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    };

    function sprintf() {
        var key = arguments[0], cache = sprintf.cache;
        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] = sprintf.parse(key);
        }
        return sprintf.format.call(null, cache[key], arguments);
    }

    sprintf.format = function(parseTree, argv) {
        var cursor = 1, treeLength = parseTree.length, nodeType = '', arg, output = [], i, k, match, pad, padCharacter, padLength, isPositive = true, sign = '';
        for (i = 0; i < treeLength; i++) {
            nodeType = getType(parseTree[i]);
            if (nodeType === 'string') {
                output[output.length] = parseTree[i];
            }
            else if (nodeType === 'array') {
                match = parseTree[i]; // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor];
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
                        }
                        arg = arg[match[2][k]];
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]];
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++];
                }

                if (getType(arg) === 'function') {
                    arg = arg();
                }

                if (re.notString.test(match[8]) && re.notJson.test(match[8]) && (getType(arg) !== 'number' && isNaN(arg))) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %s', getType(arg)));
                }

                if (re.number.test(match[8])) {
                    isPositive = arg >= 0;
                }

                switch (match[8]) {
                    case 'b':
                        arg = arg.toString(2);
                    break;
                    case 'c':
                        arg = String.fromCharCode(arg);
                    break;
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10);
                    break;
                    case 'j':
                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0);
                    break;
                    case 'e':
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
                    break;
                    case 'f':
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                    break;
                    case 'g':
                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg);
                    break;
                    case 'o':
                        arg = arg.toString(8);
                    break;
                    case 's':
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
                    break;
                    case 'u':
                        arg = arg >>> 0;
                    break;
                    case 'x':
                        arg = arg.toString(16);
                    break;
                    case 'X':
                        arg = arg.toString(16).toUpperCase();
                    break;
                }
                if (re.json.test(match[8])) {
                    output[output.length] = arg;
                }
                else {
                    if (re.number.test(match[8]) && (!isPositive || match[3])) {
                        sign = isPositive ? '+' : '-';
                        arg = arg.toString().replace(re.sign, '');
                    }
                    else {
                        sign = '';
                    }
                    padCharacter = match[4] ? match[4] === '0' ? '0' : match[4].charAt(1) : ' ';
                    padLength = match[6] - (sign + arg).length;
                    pad = match[6] ? (padLength > 0 ? strRepeat(padCharacter, padLength) : '') : '';
                    output[output.length] = match[5] ? sign + arg + pad : (padCharacter === '0' ? sign + pad + arg : pad + sign + arg);
                }
            }
        }
        return output.join('');
    };

    sprintf.cache = {};

    sprintf.parse = function(fmt) {
        var _fmt = fmt, match = [], parseTree = [], argNames = 0;
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parseTree[parseTree.length] = match[0];
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parseTree[parseTree.length] = '%';
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    argNames |= 1;
                    var fieldList = [], replacementField = match[2], fieldMatch = [];
                    if ((fieldMatch = re.key.exec(replacementField)) !== null) {
                        fieldList[fieldList.length] = fieldMatch[1];
                        while ((replacementField = replacementField.substring(fieldMatch[0].length)) !== '') {
                            if ((fieldMatch = re.keyAccess.exec(replacementField)) !== null) {
                                fieldList[fieldList.length] = fieldMatch[1];
                            }
                            else if ((fieldMatch = re.indexAccess.exec(replacementField)) !== null) {
                                fieldList[fieldList.length] = fieldMatch[1];
                            }
                            else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key');
                            }
                        }
                    }
                    else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key');
                    }
                    match[2] = fieldList;
                }
                else {
                    argNames |= 2;
                }
                if (argNames === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported');
                }
                parseTree[parseTree.length] = match;
            }
            else {
                throw new SyntaxError('[sprintf] unexpected placeholder');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return parseTree;
    };

    var vsprintf = function(fmt, argv, _argv) {
        _argv = (argv || []).slice(0);
        _argv.splice(0, 0, fmt);
        return sprintf.apply(null, _argv);
    };

    /**
     * helpers
     */
    function getType(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
    }

    function strRepeat(input, multiplier) {
        return new Array(multiplier + 1).join(input);
    }

    /**
     * export to either browser or node.js
     */
    if (typeof exports !== 'undefined') {
        exports.sprintf = sprintf;
        exports.vsprintf = vsprintf;
    }
    else {
        window.sprintf = sprintf
        window.vsprintf = vsprintf

        if (typeof define === 'function' && define.amd) {
            define(function() {
                return {
                    sprintf: sprintf,
                    vsprintf: vsprintf
                };
            });
        }
    }
})(typeof window === 'undefined' ? this : window);
