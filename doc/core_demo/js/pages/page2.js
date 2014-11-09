define('page2', ['log'], function (log) {
	var mod = {};
	log.write('module b ok!(require modules: log)');
	// 通过return 返回对外api
	return mod;
});