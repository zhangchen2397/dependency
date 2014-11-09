define('c', ['log','b'], function (log) {
	var mod = {name:'C'};
	log.write('module c ok! (require modules: b)');
	// 通过return 返回对外api
	return mod;
});