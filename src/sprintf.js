/* https://github.com/jontra/sprintf-fast.js */
'use strict'; /*jslint node:true, browser:true*/ /*globals window, exports, module*/
/*! sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license */

var define = (function(){
    if (typeof window=='object')
    {
	if (window.define && window.define.amd)
	    return window.define;
	return function(not_used, fn){ window.sprintf = fn(); };
    }
    return function(requirements, setup){
        module.exports = setup.apply(this, requirements.map(require)); };
}());

define([], function(){

var sprintf = function(fmt /* args... */){
    if (!sprintf.cache[fmt])
	sprintf.cache[fmt] = sprintf.parse(fmt);
    return sprintf.cache[fmt](sprintf, arguments);
};

sprintf.cache = {};
sprintf.to_int = function(num){
    return num>=0 ? Math.floor(num) : -Math.floor(-num); };
var chr_repeat_cache = {};
sprintf.chr_repeat = function(chr, n){
    var r = chr_repeat_cache[chr];
    if (r && r.length>=n)
	return r.slice(0, n);
    r = chr;
    for (; r.length<n; r += r);
    chr_repeat_cache[chr] = r;
    return r.slice(0, n);
};

sprintf.parse = function(fmt){
    var _fmt = fmt, match = [], parse_tree = [], arg_names = 0, cursor = 1;
    var pad_chr, pad_chrs, pad_length, arg_padded, f, s = JSON.stringify;
    f = 'var out = "", arg, arg_s;\n';
    for (; _fmt; _fmt = _fmt.substring(match[0].length))
    {
	if ((match = /^[^%]+/.exec(_fmt)))
	    f += 'out += '+s(match[0])+';\n';
	else if ((match = /^%%/.exec(_fmt)))
	    f += 'out += "%";\n';
	else if ((match =
	    /^%(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([bcdefoOsuxX])/
	    .exec(_fmt)))
	{
	    var positional = match[1], keyword = match[2], sign = match[3];
	    var pad_zero = match[4], pad_min = match[5], pad_max = match[6];
	    var precision = match[7], conversion = match[8], keyword_list = [];
	    if (keyword)
	    {
		arg_names |= 1;
		var _keyword = keyword, kmatch;
		if (!(kmatch = /^([a-z_][a-z_\d]*)/i.exec(_keyword)))
		    throw('sprintf: invalid keyword property name '+_keyword);
		keyword_list.push(kmatch[1]);
		while ((_keyword = _keyword.substring(kmatch[0].length)))
		{
		    if ((kmatch = /^\.([a-z_][a-z_\d]*)/i.exec(_keyword)))
			keyword_list.push(kmatch[1]);
		    else if ((kmatch = /^\[(\d+)\]/.exec(_keyword)))
			keyword_list.push(kmatch[1]);
		    else
			throw('sprintf: invalid keyword format '+_keyword);
		}
	    }
	    else
		arg_names |= 2;
	    if (arg_names === 3)
	    {
		throw('sprintf: mixing positional and named placeholders is '
		    +'not (yet) supported');
	    }
	    if (keyword_list.length) /* keyword argument */
	    {
		f += 'arg = argv['+cursor+']';
		for (var k = 0; k < keyword_list.length; k++)
		    f += '['+s(keyword_list[k])+']';
		f += ';\n';
	    }
	    else if (positional) /* positional argument (explicit) */
		f += 'arg = argv['+positional+'];\n';
	    else /* positional argument (implicit) */
		f += 'arg = argv['+(cursor++)+'];\n';
	    if (/[^sO]/.test(conversion))
		f += 'arg = +arg;\n';
	    switch (conversion)
	    {
	    case 'b': f += 'arg_s = arg.toString(2);\n'; break;
	    case 'c': f += 'arg_s = String.fromCharCode(arg);\n'; break;
            case 'd':
                f += 'arg = sprintf.to_int(arg); arg_s = ""+arg;\n';
                break;
	    case 'e':
	        f += 'arg_s = arg.toExponential('
		+(precision ? s(precision) : '')+');\n';
	        break;
	    case 'f':
		if (precision)
		    f += 'arg_s = arg.toFixed('+precision+');\n';
		else
                    f += 'arg_s = ""+arg;\n';
		break;
	    case 'o': f += 'arg_s = arg.toString(8);\n'; break;
	    case 'O': f += 'arg_s = JSON.stringify(arg);\n'; break;
            case 'u': f += 'arg = arg >>> 0; arg_s = ""+arg;\n'; break;
	    case 'x': f += 'arg_s = arg.toString(16);\n'; break;
	    case 'X': f += 'arg_s = arg.toString(16).toUpperCase();\n'; break;
	    case 's':
	        f += 'arg_s = ""+arg;\n';
		if (precision)
                    f += 'arg_s = arg_s.substring(0, '+precision+');\n';
	        break;
	    }
	    if (/[def]/.test(conversion) && sign)
		f += 'if (arg>=0) arg_s = "+"+arg_s;\n';
	    pad_chr = pad_zero ? pad_zero=='0' ? '0' : pad_zero[1] : ' ';
	    pad_chrs = '('+s(sprintf.chr_repeat(pad_chr, +pad_max))
	        +".slice(0, "+(+pad_max)+"-arg_s.length))";
	    arg_padded = !pad_max ? 'arg_s' :
	        pad_min ? 'arg_s + '+pad_chrs : pad_chrs+' + arg_s';
	    f += 'out += '+arg_padded+';\n';
	}
	else
	    throw('sprintf invalid format '+_fmt);
    }
    f += 'return out;\n';
    /* jshint evil: true */
    return new Function(['sprintf', 'argv'], f);
};

sprintf.vsprintf = function(fmt, argv, _argv){
    _argv = argv.slice(0);
    _argv.splice(0, 0, fmt);
    return sprintf.apply(null, _argv);
};

sprintf.sprintf = sprintf;
return sprintf;

});
