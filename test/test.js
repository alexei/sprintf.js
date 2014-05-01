test('Basic Behaviors', function(){
	var s = sprintf, v = vsprintf;

	equal(s('%7.3f', 123.456), '123.456');
	equal(s('%7.3f', 12.46000), ' 12.460');
	equal(s('%7.3f', 3.4), '  3.400');

	var n =  43951789;
	var u = -43951789;
	var c = 65;
	var d = 123.45678901234567890123456789;

	equal(s('%b', n), '10100111101010011010101101', 'binary representation');
	equal(s('%c', c), 'A', 'print the ascii character');
	equal(s('%+d', n), '+43951789', 'standard integer representation');
	equal(s('%d', u), '-43951789', 'standard integer representation');
	equal(s('%.10e', d), '1.2345678901e+2', 'scientific notation')
	equal(s('%u', n), '43951789', 'unsigned integer representation of a positive integer');
	equal(s('%u', u), '4251015507', 'unsigned integer representation of a negative integer');
	equal(s('%-10.2f', d), '123.46    ', 'floating point representation1');
	equal(s('%+.4f', -123.456000), '-123.4560');
	equal(s('%010.10f', d), '123.4567890123', 'floating point representation2');
	equal(s('%o', n), '247523255', 'octal representation');
	equal(s('%100.10s', 'Ala-bala-portocala'), '                                                                                          Ala-bala-p', 'string representation');
	equal(s('%x', n), '29ea6ad', 'hexadecimal representation (lower-case)');
	equal(s('%X', n), '29EA6AD', 'hexadecimal representation (upper-case)');
});

test('Argument Swapping', function(){
	var s = sprintf, v = vsprintf;

	equal(s('Hello %1$s', 'Dolly'), 'Hello Dolly');
	equal(s('%4$s, %3$s, %1$s, %2$s', 'c', 'd', 'b', 'a'), 'a, b, c, d');
	equal(v('The first 4 letters of the english alphabet are: %4$s, %3$s, %1$s and %2$s', ['c', 'd', 'b', 'a']), 'The first 4 letters of the english alphabet are: a, b, c and d');
});

test('Replace String', function(){
	var s = sprintf, v = vsprintf;

	equal(s('foo%1dbar', 3), 'foo3bar');
	equal(s('foo%02dbar', 3), 'foo03bar');
	equal(s('foo%02dbar', 42), 'foo42bar');
	equal(s('foo%dbar', 123), 'foo123bar');

	equal(s('%2s', 'a').length, ' a'.length);
	equal(s('%2s', 'aa').length, 'aa'.length);
	equal(s('%4s', 'a').length, '   a'.length);

	equal(s('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants'), 'Polly wants a cracker');
});

test('Plus Zero', function(){
	var s = sprintf, v = vsprintf;

	equal(s('%+d', 0), '+0');
});

test('Padding Specifier', function(){
	var s = sprintf, v = vsprintf;

	equal(s('%07d', -314), '000-314');
	equal(s('%+\'_10d', -123), '______-123');
});


test('Named Arguments', function(){
	var s = sprintf, v = vsprintf;

	equal(s('Hello %(name_1)s, %(name_2)s and %(name_3)s', {name_1: "Molly", name_2: "Dolly", name_3: "Polly"}), 'Hello Molly, Dolly and Polly');

	var foo = {
		users: [
			{
				user: {
					name: [
						null,
						["Dolly"]
					]
				}
			}
		]
	};

	equal(s('Hello %(users[0].user.name[1][0])s', foo), 'Hello Dolly');
	equal(s('Hello %(users[0].user.name[0])s', foo), 'Hello null');

	var user = {
		name: 'Dolly'
	};
	equal(s('Hello %(name)s', user), 'Hello Dolly');
	
	var users = [
		{name: 'Dolly'},
		{name: 'Molly'},
		{name: 'Polly'}
	];
	equal(s('Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s', {users: users}), 'Hello Dolly, Molly and Polly');
});
