(function () {
    var global = this;
    var core = function () {
        var map = {};
        var que = [];
        var cbMap = {};
        var loadingMap = {};
        var jsMap = {};
        var scriptOkMap = {};
        var storeInc={'store': true, 'inc': true, 'debug':false};
        var path = './js/';
        var setPath = function (a) {
            a && (path = a);
        };
        var setStoreInc=function (o) {
            o.debug = !!core.config.testEnv;
            storeInc = o;
            storeIncLoad.init(storeInc);
        };
        var setJsMap = function (map) {
            jsMap = map;
        };
        var each = function (arr, cb) {
            var i,
                n = (arr || []).length;
            for (i = 0; i < n; i++) {
                cb(arr[i]);
            }
        };
        var getMods = function (req) {
            var mods = [];
            each(req, function (name) {
                mods.push(map[name]);
            });
            return mods;
        };
        var reg = function (name, req, fn) {
            var item = {
                name : name,
                req : req,
                fn : fn
            };
            if (map[name]) {
                throw 'module ' + name + ' exists!';
            }
            createMod(item);
        };
        var allexists = function (arr) {
            var flag = true;
            each(arr, function (name) {
                !map[name] && (flag = false);
            });
            return flag;
        };
        var createMod = function (item) {
            var cb;
            if (allexists(item.req)) {
                map[item.name] = item.fn.apply(null, getMods(item.req)) || {};
                map[item.name].__name__ = item.name;
                loadingMap[item.name] = false;

                each(cbMap[item.name], function(curItem) {
                    curItem(map[item.name]);
                });
                delete cbMap[item.name];

                checkque();
            } else {
                que.push(item);
                loadingMap[item.name] = true;
                setTimeout(function () {
                    each(item.req, load)
                }, 0);
            }
        };
        var checkque = function () {
            var item;
            var i = 0,
                n = que.length;
            for (i = 0; i < n; i++) {
                item = que.shift();
                item && createMod(item);
            }
        };
        var load = function (name, cb) {
            if(map[name]) {
                cb && cb(map[name]);
                return map[name];
            }

            if (!cbMap[name]) cbMap[name] = [];
            if(cb && typeof cb == 'function') {
                cbMap[name].push(cb);
            }

            if(loadingMap[name] || scriptok(name)) return;

            loadingMap[name] = true;

            // 区分测试及正式环境加载策略
            if(core.config.testEnv) {
                var testV = jsMap[name] || ('/page/' + name + '.js'),
                    testUrl = core.config.staticPath + testV + '?v=' + new Date().getTime();

                loadScript(testUrl, function() {});
            } else {
                // 判断版本类型 完整加载路径 page可默认
                var filePath = jsMap[name] || ('/page/' + name + '.js'),
                    jsPath = core.config.staticPath,
                    ver = core.config.ver,
                    fs = filePath.split('?'),
                    buildType = core.config.buildType,
                    serverDomain = core.config.serverDomain || 'http://3gimg.qq.com',
                    realPath;

                if(buildType === 'project') {
                    jsPath = jsPath + '/' + ver;
                } else {
                    if(fs.length === 1) {
                        ver = '001';
                        var cs, css;
                        for(cs in jsMap) {
                            if(jsMap[cs].indexOf(fs[0]) === 0) {
                                css = jsMap[cs].split('?');
                                if(css.length === 2) ver = css[1];
                            }
                        }
                    } else {
                        ver = fs[1];
                    }
                }
                realPath = serverDomain + jsPath + fs[0];

                storeIncLoad.loadScript(realPath, ver, buildType, loadScript);
            }
        };
        var scriptok = function (name) {
            var v = jsMap[name];
            if(scriptOkMap[v]) return true;

            scriptOkMap[v] = true;
            return false;
        };
        var loadScript = function (url, cb) {
            var script;
            script = document.createElement('script');
            script.async = true;
            script.onload = cb;
            script.src = url;
            document.head.appendChild(script);
        };
        var unreg = function (name, fn) {
            delete map[name];
        };
        var getMod = function (name) {
            return map[name];
        };
        return {
            define : reg,
            undefine : unreg,
            setPath : setPath,
            setMap : setJsMap,
            require : load,
            loadScript : loadScript,
            setStoreInc : setStoreInc,
            get : getMod,
            config : {}
        }
    }();
    define = core.define;
    require = core.require;
    global.MT = global.MT || {};

    /*
     config 格式
     jspath 用于指定默认js目录用于默认规则 jspath+modname+'.js'
     jsmap 用于指定模块名对应js 优先于默认规则
     {
     jspath: 'js/',
     jsmap:{
     'jqmobi': 'js/jqmobi.js'
     }
     }
     */
    global.MT.config = function (conf) {
        core.setPath(conf.jspath);
        core.setMap(conf.jsmap);
        core.setStoreInc(conf.storeInc);
        core.config = conf;
    };
})();
