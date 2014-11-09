define('log', [], function () {
	var mod = {};
	mod.write = function (msg) {
		document.getElementById('log').innerHTML += msg + '<br/>';
	}
	mod.write('module modify log ok!');
	// 通过return 返回对外api
	return mod;
});