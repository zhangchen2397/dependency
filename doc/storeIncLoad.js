/**
 * Created by .
 * User: waynelu
 * Date: 13-8-30
 * Time: 上午11:27
 * 增量模式的方式加载js
 */
var storeIncLoad= (function () {
    //是否用本地存储，是否增量更新，本次版本号，是否debug状态，如果是debug状态默认走原文方式
    var storeInc={'store':true,'inc':true,'debug':false};
    var statistic = window.StatisticTool; // todo 绑定统计工具
    var init=function(o){
        storeInc = o;
    };
    //根据url获取url的本地存储地址
    var getStoreKey = function (url,jsver){
        var keyArr=new Array();
        var pathArr = url.split('/');
        for(var i=0;i<pathArr.length;i++){
            if(jsver!=pathArr[i]){
                keyArr.push(pathArr[i]);
            }
        }
        return keyArr.join('/');
    };
    //修改新的js 判断本地存储的方法。
    var isLocalStorageNameSupported = function () {
        try {
            var supported = ('localStorage' in window && window['localStorage']);
            if (supported) {
                localStorage.setItem("storage", "");
                localStorage.removeItem("storage");
            }
            return supported;
        }
        catch(err) { return false }
    };
    var loadScript = function (url, ver, buildType, scriptCall, callback) {
        
        if(storeInc.store && isLocalStorageNameSupported() && !storeInc.debug) {

            var storeKey = buildType === 'project' ? getStoreKey(url, ver) : url;

            var lastverStr='999';
            var jsCode=null;
            //对读取本地存储加异常处理
            try{
                jsCode = localStorage.getItem(storeKey);
                lastverStr = localStorage.getItem(storeKey + "?ver") || '999';
            }
            catch(ex){
                var realUrlx=storeInc.debug?url:urlParse(url,ver,-10,false,buildType);
                scriptCall&&scriptCall(realUrlx, callback);
                return true;
            }
            var lastver = lastverStr ? parseInt(lastverStr) : -10;
            var jsver = parseInt(ver);

            var inc = (storeInc.inc && canInc(lastverStr, ver) && jsCode) ? true : false;
            var realUrl = urlParse(url, ver, lastver, inc, buildType);

            if(jsCode && lastver == jsver && !storeInc.debug){
                globalEval(jsCode);
                callback && callback();
                if(statistic) statistic.save('core', 'local', 1);
            } else {
                try{
                    xhr(realUrl,function(data){
                        if(inc){
                            var incData= JSON.parse(data);
                            var checksumcode=incData.data;
                            jsCode=incData.modify?mergejs(jsCode,incData.chunkSize,checksumcode):jsCode;
                            if(statistic) statistic.save('core', 'inc', 1);
                        }else{
                            jsCode=data;
                            if(statistic) statistic.save('core', 'all', 1);
                        }
                        try{
                            globalEval(jsCode);
                            callback && callback();
                            localStorage.setItem(storeKey,jsCode);
                            localStorage.setItem(storeKey+"?ver",ver);
                        }catch(e){
                            localStorage.removeItem(storeKey);
                            localStorage.removeItem(storeKey+"?ver");
                        }
                    });
                }
                catch(ex){
                    scriptCall&&scriptCall( realUrl, callback);
                    return true;
                }
            }
        }else{
            var realUrly=storeInc.debug?url:urlParse(url,ver,-10,false,buildType);
            scriptCall&&scriptCall(realUrly, callback);
            return true;
        }
        return false;
    };
    //版本号码最后3位是不是相差1
    function canInc(lastver,jsver){
        // build 方式转换测试
        var plva = (lastver.toString()).length === 13;
        var pnva = (jsver.toString()).length === 13;
        if(plva !== pnva) return false;

        var incver=parseInt(jsver.substr(jsver.length-3,3));
        var incOldVer=-10;
        if(lastver){
            incOldVer=parseInt(lastver.substr(lastver.length-3,3));
        }
        return incver-incOldVer != 1 ? false : true;
    }
    // 获取js地址js地址
    // 上个版本号，本次版本号,xxx.01-03.js
    function urlParse(url, ver, lastver, inc, buildType){
        if(buildType === 'file') {
            var prefix = '';
            if(lastver < 10) {
                prefix = '00';
            }else if(lastver < 100) {
                prefix = '0';
            }
            lastver = prefix + lastver;
        }

        return inc ? url.replace(".js","-"+lastver+"_"+ver+".js") :
            url.replace(".js","-"+ver+".js");
    }
    //合并成新的js
    function mergejs(source,trunkSize,checksumcode){
        var strResult="";
        for(var i=0;i<checksumcode.length;i++){
            var code=checksumcode[i];
            if(typeof (code)=='string'){
                strResult+=code;
            }
            else{
                var start=code[0]*trunkSize;
                var end=code[1]*trunkSize;
                var oldcode=source.substr(start,end);
                strResult+=oldcode;
            }
        }
        return strResult;
    }

    function xhr(url, callback) {
        var r = window.ActiveXObject ? new window.ActiveXObject('Microsoft.XMLHTTP'): new window.XMLHttpRequest();
        r.open('GET', url, true)
        r.onreadystatechange = function() {
            if (r.readyState === 4) {
                if (r.status === 200) {
                    callback(r.responseText)
                }
                else {
                    throw new Error('Could not load: ' + url + ', status = ' + r.status)
                }
            }
        }
        return r.send(null)
    }
    function globalEval(data) {
        if (data && /\S/.test(data)) {
            (window.execScript || function(data) {
                window['eval'].call(window, data)
            })(data)
        }
    }
    return {
        'loadScript':loadScript,
        'xhr':xhr,
        'init':init
    }
})();