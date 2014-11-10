/**
 * by wangfz
 * 工具库
 * 这个文件还要修改完善 目前只是把代码提出来而已
 */
define('util', ['jqmobi'], function(){	
	var obj = {		
		name : 'util module',
		/**
		 * 获得当前url参数值
		 * @param {String}要取的参数名 		 
		 * @param {Boolean} 是否是标准的url, 默认为true (标准index.jsp?bid=1243260#live 不标准 index.jsp#live/bid=1243260)
		 * @return {String}	参数值		 
		 */			
		getUrlParam : function(key, isStandardUrl){		
			var query, b=isStandardUrl;
			if(b || typeof b == 'undefined' && !b){//url eg: index.jsp?bid=1243260#live
				query = location.search.substr(1, location.search.length);			
			}else{//url eg: index.jsp#live/[?][&]bid=1243260
				var str=location.href;
				if(str.indexOf('#')==-1){return;}
				str=str.slice(str.indexOf('#'));
				if(str.indexOf('/')==-1){return;}
				str=str.slice(str.indexOf('/')+1);	
				if(str.charAt(0)=='?'){str=str.slice(1);}				
				query=str;					
			}
			
			var obj = this.strToObj(decodeURIComponent(query));
			return key? obj[key] : obj;
		},	

		onBeforeScrollStart : function (e) {
			var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase():(e.target ? e.target.nodeName.toLowerCase():''); 
			if(nodeType !='select' && nodeType !='option' && nodeType !='input' && nodeType!='textarea' && nodeType !='video') {e.preventDefault();} 
			//var target = e.target; 
			//while (target.nodeType != 1){
			//	target = target.parentNode; 
			//	if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'){e.preventDefault();} 							
			// }				
		}, 
					
		/**
		 * 获得当前hash值
		 */		
		getHash : function(){
			return (function(str,arr){
				var s=str; 
				for(var i=0;i<arr.length;i++){
					if(s.indexOf(arr[i])!=-1){s=s.slice(0,s.indexOf(arr[i]))}
				}
				return s
			})(location.hash,['/','?','&','<','>','=']);
		},

		/**
		 * @param str
		 * @param type decode or not
		 * @return obj
		 * @exam
		 *
		 * strToObj(abc=1) == {abc:1}
		 */
		strToObj : function(str, type) {
			var paramArray = [];
			var paramObj = {};
			var i,a,len;

			paramArray = str.split('&');
			len = paramArray.length;
			for (i = 0; i < len; i++) {
				if (paramArray[i].indexOf('=') < 0) {
					continue
				}
				a = paramArray[i].split('=');
				paramObj[a[0]] = type ? decodeURIComponent(a[1]) : a[1];
			}
			return paramObj;
		},
	
		/**
		 *
		 * @param obj
		 * @param shouldEncode boolean
		 * @return str
		 * @exam
		 *
		 * objToStr({abc:1,efg:2})    //abc=1&efg=2
		 */
		objToStr : function(obj, shouldEncode) {
			var str = "", key, tempVal;

			for (key in obj) {
				if (typeof obj[key] === "undefined") {
					continue;
				}
				tempVal = shouldEncode ? encodeURIComponent(obj[key]) : obj[key];
				str += key + "=" + tempVal + "&";
			}

			return str.slice(0, (str.length - 1));
		},		
		
		//$().ready 增加了一个条件
		domReady : function(callback){
			if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive"){
				callback();
			}
			document.addEventListener("DOMContentLoaded", callback, false);
		},
		
		randomInt : function (under, over){
			switch(arguments.length){
				case 1: return parseInt(Math.random()*under+1);
				case 2: return parseInt(Math.random()*(over-under+1) + under);
				default: return 0;
			}
		}
	};
			
	console.log( obj.name ); 
	return obj;
});

