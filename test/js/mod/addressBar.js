/**
 * by wangfz
 * 隐藏地址栏、添加、移除转屏事件
 * @param {Object} addressBar object
 */
define('addressBar', [], function(){
	var strKeys=',', queue = {}; 

	var obj = {
		//会把页面高度作为回调参数
		hide : function(fn){			
			var body=document.body;						
			body.style['min-height']='2000px';
			window.scrollTo(0,1);//转屏的时候个别浏览器偶尔会不灵, 这跟手机设备和浏览器有关，目前没有其它办法。
			setTimeout(function(){
				var h=window.innerHeight;
				body.style['min-height']= h + 'px';
				fn && fn(h);
			}, 400); //300ms采用增量时有问题, 但不走增量时300没问题
		},
		
		//会把页面高度作为参数
		addOrientationFunc : function(fn){						
			if(!fn){return}
			
			var key = fn.toString();
			if( !queue[key] && strKeys.indexOf(',' + key + ',') == -1 ){
				strKeys +=key + ',';
				queue[key] = fn;
			}
		},
		
		removeOrientationFunc : function(fn){
			var key = fn.toString();	
			strKeys.replace(',' + key + ',' ,'')
			delete queue[key];
			window.removeEventListener('orientationchange', fn, false);
		}		
	};
		
	setTimeout(function(){
		window.addEventListener('orientationchange', function(){
			var arrKeys = strKeys
				.slice(1, strKeys.length-1)
				.split(',');
					
			obj.hide(function(h){
				for(var i=0, l = arrKeys.length;i<l; i++){
					f=queue[ arrKeys[i] ].call(h);
				}
				//window.scrollTo(0,1);
				//setTimeout(function(){window.scrollTo(0,1);},200);		
				//setTimeout(function(){window.scrollTo(0,1);},1000);				
			});	
		}, false);
	},0);		
		
	window.is_output_mod_log && console.log('addressBar of module is loaded.');
	return obj;
});

