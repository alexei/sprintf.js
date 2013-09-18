# sprintf.js
sprintf.js 是个实现于 *浏览器* 和 *node.js* 完全开源的JavaScript sprintf is a complete open source JavaScript sprintf。

其原型很简洁：

	string sprintf(string format , [mixed arg1 [, mixed arg2 [ ,...]]]);

格式字符串中的占位符用"%"标记且按顺序接着一个或多个这样的元素：
* 一个可选的 "+" 符号表明结果被强行处理为添加一个加号或者减号。默认只有 "-"号用在负数上。
* 一个可选的填充符指明该用什么字符用来填充（如果有指定）。可能值有0或任何其它字符，总之跟在‘.'后面。默认则用空格占位。
* 一个可选的"-"符号，将会使得sprintf左对齐占位符结果。默认为右对齐。
* 一个可选的数字，指明结果有多少个字符。如果返回的值比这个数字短，结果会被（填入）空格。
* 一个可选的精度修改器，包含一个"."（点）并接着一个数字，指明浮点数该多少数字将被显示。用在字符串上时，其结果将被截断。
* 一个类型符号，其可为（以下）任何一个：
    * % — 打印 "%" 符号
    * b — 打印整数作为二进制数字
    * c — 打印整数的ASCII码的值
    * d — 打印整数作为有符号十进制数字
    * e — 以科学符号打印浮点数
    * u — 以无符号十进制数字打印整数
    * f —  打印浮点数
    * o — 以八进制打印整数
    * s — 打印字符串
    * x — 以十六进制数打印整数（小写）
    * X — 以十六进制数打印整数（大写）

## JavaScript vsprintf()
vsprintf() 与 sprintf() 是一样的除了其接受一个数组参数，而不是不定数量的参数：

	vsprintf('The first 4 letters of the english alphabet are: %s, %s, %s and %s', ['a', 'b', 'c', 'd']);

## 参数调换（位置）
你也可以调换参数（位置）。 即占位符的顺序不一定要与参数顺序一致。你可以在格式字符串中指定对应的占位符位置即可：

	sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants');

当然，你也可以重复同样的占位符而不用增加参数个数。

## 命名参数
格式字符串可能包含比潜在的占位符更多的替代字段。为了指向特定的参数，你可以引用某个特定的key到对象上。替代字段由圆括号包围且以代表key的关键字开始：

	var user = {
		name: 'Dolly'
	};
	sprintf('Hello %(name)s', user); // Hello Dolly
替代字段的关键字可以是跟随任意数量的关键字或索引：

	var users = [
		{name: 'Dolly'},
		{name: 'Molly'},
		{name: 'Polly'}
	];
	sprintf('Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s', {users: users}); // Hello Dolly, Molly and Polly
注意：（目前）还未支持位置和名字占位符混合使用。

# 作为node.js模块
## 安装

	npm install sprintf-js

## 如何使用

	var sprintf = require("sprintf-js").sprintf,
		vsprintf = require("sprintf-js").vsprintf;

	console.log(sprintf("%2$s %3$s a %1$s", "cracker", "Polly", "wants"));
	console.log(vsprintf("The first 4 letters of the english alphabet are: %s, %s, %s and %s", ["a", "b", "c", "d"]));
