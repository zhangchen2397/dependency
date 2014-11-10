/**
 * by wangfz
 * mTips.show('发布成功','success');
 */
define('mTips', [], function(){
	var tipsDom=false, mTips=null, wTipsInner=null, iTimer;
	
	var createDom=function(){
		var s=''+
		'<div class="w-tips" style="position: fixed;text-align: center; width: 100%;z-index: 999;">'+
			'<div class="w-tips-inner" style="display:inline-block;padding:0 10px;height:36px;line-height:36px;max-width:280px;min-width:100px;color: #fff;background:#000;-webkit-border-radius:0 0 5px 5px;"></div>'+
		'</div>';
		$("body").append(s);
		mTips=$("body .w-tips");
		window.w=mTips;
		wTipsInner=$("body .w-tips-inner");	
		getComputedStyle(mTips[0]).zoom;
		tipsDom=true;
	};
	
	var sHtml=function(str,type){			
		var css={
			success	: 'padding-left: 24px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAWCAYAAADXYyzPAAAAo0lEQVR42mNgGNZg6l9OIK4G4nwgZqanpYeB+D8Ur6a95ZiWwrD3QFj6DYgV6W3pZyC2GbV0ACyFaGoB4nYg5qGXpWxomg6TZDnZwTv1bzgWTcRZjt9SS0Ka5YD4LcmWU2QpwhBjHJYfw2o5VSwl1XKqWkqs5RCMzdIP5FtKnOU0spSw5TS0lHjLaWApYctpaCmq5Z/paynCcksgvg3FZtQwEgDHWPCrRfXUYQAAAABJRU5ErkJggg==) no-repeat 0 4px;-webkit-background-size: 15px 11px;'					
		};
		
		return '<span style="'+(css[type]||'')+'">'+str+'</span>';
	};
	
	window.is_output_mod_log && console.log('mTips of module is loaded.');
	
	return {
		show : function(str,type,time){
			var _this=this;
			!tipsDom && createDom();
			wTipsInner.html(sHtml(str,type));
			clearTimeout(iTimer);
			mTips.css('-webkit-transition','').css('opacity','0.7').css('top','-36px').css('-webkit-transition','top .2s linear,opacity .4s linear 0.15s').css('opacity','1').css('top','0');
			iTimer=setTimeout(function(){_this.hide();},time||1200);
		},
		
		hide : function(){
			mTips.css('-webkit-transition','top .2s linear,opacity .4s').css('opacity','0.2') .css('top','-36px');
		}				
	};
});


