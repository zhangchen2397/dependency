/**
 * FileInfo: test - TODO
 * User: rocksun
 * Date: 13-10-25 上午10:24
 * Created with JetBrains WebStorm.
 */
define('test', ['log','c','d'], function (log, modC, modD) {
    log.write('test run!!');
    log.write('module c\'s name is ' + modC.name);
    log.write('module d\'s name is ' + modD.name);
});