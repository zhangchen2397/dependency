define('d', ['log'], function (log) {
	var mod = {name:'D'};
	log.write('module d ok! (require modules: log)');
	// 通过return 返回对外api
	return mod;
});
define('e', ['log'], function (log) {
	var mod = {};
	log.write('module e ok! (require modules: log)');
	// 通过return 返回对外api
	return mod;
});
