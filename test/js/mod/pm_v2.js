/**
 * Created by .
 * 依赖core.js
 * User: nazhao
 * Date: 14-7-3
 * Version：2.0
 * 增加定向页面通知接口，和post到指定page的功能，优化回退判断，更准确的描述回退和点击的区别
 * To change this template use File | Settings | File Templates.
 */

define('pm', ['jqmobi'], function ($) {
      console.log('pm init ');
        var extend = $.extend;
        var PM={version:"2.0",name:"pagemanager"};

	    var hashControl = function () {
	        var preSearch="";
	        var prevHash = "";
	        var curHash = "";
	        var curPage = "";
	        var prevPage = "";
	        var curMod=null;
	        var homePage = "";
	        var pageList = {},postData={};

			// 记录所有用户访问记录
			var _traces = [];

			// 只记录 pageenter 事件访问的记录
			var visiteLog = [];

			var jsmap = {};

	        //外部接口，初始化
	        function init(opt) {
	            var hashParas;
	            homePage = opt.home;
	            obj = opt.obj;
	            jsmap = opt.jsMap || {};
	            if ("onhashchange" in window) {
	                window.addEventListener("hashchange",_onHashChange, false);
	            } else {
	                console.log('not support onhashchange');
	            }
		
	            hashParas = getHashParams();
	            _loadPage();
				
				if ("onpopstate" in window) {
	                   window.addEventListener("popstate",_onPopState, false);
	            }
	            else{
	                console.log('not support onpopstate');
	            }
	             $(document).delegate('a', 'click', function(event) {//劫持所有的a 的href
	             	var curHref = $(this).attr('href');
	             	if(curHref && curHref.indexOf('javascript:')==-1){
	             		event.preventDefault();
	             		if(startWith(curHref,'#')){
	             			go(curHref);
	             		}
	             		else{
	             			window.location.href = curHref;
	             		}
	             		return false;
	             	}
	            	//console.log($(this).attr('href')); 	
	 			  });
	            
	        }
			//对外接口，跳转到page
			function  go(page) {
				var current = pageList[getHashParams(page).__vpageid];
				if(current){
					current.now = new Date().getTime();
				}

				window.location.hash = page;
			}
			function strToObj(str, type) {
				var paramArray = [];
				var paramObj = {};
				var i,a,len;
				paramArray = str.split("&");
				len = paramArray.length;
				for (i = 0; i < len; i++) {
					if (paramArray[i].indexOf("=") < 0) {
						paramObj[paramArray[i]] = undefined;
						continue
					}
					a = paramArray[i].split("=");
					paramObj[a[0]] = type ? decodeURIComponent(a[1]) : a[1];
				}
				return paramObj;
			}
			function getHashParams(str){
				var hash = str ? str : decodeURIComponent(location.hash),
				hashArr = [],
				obj = {};
				//过滤非法字符
				hash.replace(/[\.\?'"><:;,\[\]\{\}]/ig, '');
				hashArr = hash.split("\/");
				if (hashArr.length > 0) {
					obj["__vpageid"] = hashArr.splice(0,1)[0].substring(1);
					obj["urlParams"] = (hashArr.length > 0) ? strToObj(hashArr.join('/'), true) : {};
				}
				return obj;
			}
	        //设置当前参数
	        function _setCurPage() {
	            var hashObj = getHashParams();
	            prevPage = curPage;
	            curPage = hashObj.__vpageid || homePage;
	            //curPage = hashObj.__vpageid;
	            console.log('set '+prevHash+' to '+curHash);
	            prevHash = curHash;
	            curHash = location.hash;
	        }
	        function _onHashChange(){
	        	if(curHash == location.hash) return;
	            _loadPage();
	        }
	        function _onPopState(){
	        	if(curHash == location.hash) return;
	            _loadPage();
	        }
	        function startWith(str, substring) { // 给字符串对象添加一个startsWith()方法
				return substring.length > 0 && str.substring(0, substring.length) === substring;
			}
			//加载页面
	        function _loadPage() {
	        	// if(curHash == location.hash && location.hash!="") return;
	            _pageLeave(); //离开前一页的调用

	            var curr = location.hash.split('/')[0].slice(1);

	            // 当前还无 404 ui  js逻辑暂时注释
             	// if(curr && !core.exists('page.' + curr)){ // 当前页面不存在
					// console.log('404 not found');
					// history.replaceState(null, '未找到', '#unfound');
             		// return;
             	// }

	            _setCurPage(); //设置当前页面
	            // console.log(prevHash+"-->"+curHash);
				// visiteLog.push(prevHash+"-->"+curHash); 
	            _pageEnter(); //进入当前页面
	        };
			function getVisitetrace(){
				return visiteLog;
			}
			function __switchPages(){
				$('.virtualPage').removeAttr('selected');
				$('.virtualPage[page=' + curPage + ']').attr('selected', 'true');
			}
	        //首次进入，初始化
	        function _pageInit(vpageId){
	            console.log(vpageId + ' is first load');
	            curMod = pageList[vpageId];
	            var paras = getHashParams();
	            obj.append('<div class="virtualPage" page="' + curPage + '"></div>');
	            $.trigger(curMod,'vpageAdd',[{
	                pageId : vpageId
	            }]);
	            // __switchPages();
	            curMod.vpageId = vpageId;
	            $.trigger(window, 'vpageInit');
				$.trigger(curMod, 'vpageInit');
				curMod.__inited = true;
	        }
	        
	        /**
	         * 进入这个页面
	         */
	        function _pageEnter() {
	            var paras = getHashParams();
	            curMod = pageList[curPage];
	            if (!(curMod && curMod.__inited)) {

					$.trigger(window, 'beforeVpageInit', [{
						curPage : curPage,
						prevPage : prevPage
					}]);
	                //使用core的require来载入js,并实现模块化管理
	                require(curPage, function(){
						$.trigger(window, 'afterVpageInit', [{
							curPage : curPage,
							prevPage : prevPage
						}]);
						
	                    _pageInit(curPage);
	                    curMod.now = new Date().getTime();
	                    _pageEnter();
	                },function(){console.log('404 not found');go("#unfound");/*history.replaceState(null, '未找到', '#unfound');*/});
	            } else {
	            	__switchPages();
					// console.log('curMod.now : "' + curMod.now + '", curMod.last: "' + curMod.last + '", "' + (curMod.now === curMod.last) + '" , ' + 'curMod.prevParas:  "' + curMod.prevParas + '"');

					var event = 'vpageEnter';
					if(curMod.now === curMod.last){
						event = 'vpageBack';
					}

		            console.log(prevHash+"-->"+curHash);
		            // 只有 enter 才 push 用户访问路径
					event === 'vpageEnter' && visiteLog.push(prevHash+"-->"+curHash);

					_traces.push(curPage);
					curMod.last = curMod.now;
					$.trigger(curMod, event, [{curPage:curPage,prevPage:prevPage}]);
					extend(curMod ,{"prevParas":$.param(paras.urlParams)});
					$.trigger(window, event,[{curPage:curPage,prevPage:prevPage}]);
	            }
	        };
			//注册
	        function register(pageInstance,key){
	        	if(key){
	        		pageList[key] = pageInstance;
	        	}
	        	else{
	        		pageList[curPage] = pageInstance;
	        	}
			};
	        //离开前一页
	        function _pageLeave() {
	            if (!curMod) {
	                return;
	            }
				curMod.pos = {"x":0,"y":document.body.scrollTop};
				$.trigger(window, 'vpageLeave', [{
	                prevPage : prevPage,
	                currentPage : curPage
	            }]);
	            $.trigger(curMod, 'vpageLeave', [{
	                prevPage : prevPage,
	                currentPage : curPage
	            }]);
	            curMod = null;
	            postData[curPage] = null;
	        };
			function getCurHash(){
				return curHash;
			}
			function getPrevHash(){
				return prevHash;
			}

			function getAllTrace () {
				
				return _traces;
			}
	        return {
	            init : init,
	            go : go,
				register:register,
				getCurHash:getCurHash,
				getAllTrace: getAllTrace,
				getTrace:getVisitetrace,
				getPrevHash:getPrevHash,
				notify:function(evtName,params){//当前虚拟页通知接口
						if(curMod){
							$.trigger(curMod, evtName,params);
						}
				},
				listen:function(evtName, fn){//当前虚拟页监听接口
					if(curMod){
						$.bind(curMod,evtName,fn)
					}
				},
				triggerByPageId:function(pageid,evtName,params){//通知指定pageid
					var curModule = pageList[pageid];
					if(curModule){
						$.trigger(curModule, evtName,params);
					}
				},
				post:function(opt){
					var url = opt.url;
					var hashObj = getHashParams(url);
					var pageid = hashObj.__vpageid || homePage;
					var param = opt.data;
					postData[pageid] = param;
					go(url);
				},
				getPostData:function(){
					var curData = postData[curPage] || {};
					return curData;
				}
	        };
	 }
    extend(PM, hashControl());
   return PM;
});