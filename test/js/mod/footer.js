/**
 * by samczhang、wangfz
 * 页脚
 */
define( 'footer', [ 'jqmobi' ], function ( $ ) {

	var styleStr = [
		'.footer{background:#f9f9f9;border-top:1px solid #d8d8d8;background:#f4f4f4;padding:0 12px}',
		'.footer nav{overflow:hidden}',
		'.footer a{font-size:18px;color:#656565;line-height:42px;text-decoration:none}',
		'.footer .ileft{float:left;margin-right:20px}',
		'.footer .iright{float:right;margin-left:20px}'
	].join( '' );

	var dom = [
		'<footer class="footer">',
			'<nav>',
				'<a class="ileft f-index" href="javascript:;">腾讯</a>',
				'<a class="ileft f-channel" href="javascript:;"></a>',
				'<a class="iright f-login" href="javascript:;">登录</a>',
				'<a class="iright f-feedback" href="javascript:;">反馈</a>',
			'</nav>',
		'</footer>'
	].join( '' );	
	
	var config = {}, container = null, home = null, channel = null, login = null, feedback = null;
		
	var footer = {
		defaultConfig : {
			//文案与链接
			homeName: '腾讯',
			homeUrl: 'http://info.3g.qq.com/g/s?aid=index',
			channelName: '新闻',
			channelUrl: 'http://info.3g.qq.com/g/s?aid=infocenter',         
			feedbackName: '反馈',
			feedbackUrl: 'http://infoapp.3g.qq.com/g/s?aid=touchmsg',
			//显示登录/退出、取sid方法、绑定事件           
			getSidFunc: null,
			
			//(以下字段参数为可选)
			container : $('#footer-warp'), 			
			loginState: false, 
			handLoginFunc: null,
			handLogoutFunc: null
		},
		
		createDom : function() {
			$( 'head' ).append( '<style>' + styleStr + '</style>' );
			container.append( dom );
		},

		cacheDom : function() {
			home = container.find( '.f-index' );
			channel = container.find( '.f-channel' );
			login = container.find( '.f-login' );
			feedback = container.find( '.f-feedback' );
		},

		updateDom : function() {
			home.text( config.homeName );
			channel.text( config.channelName );
			feedback.text( config.feedbackName );
			config.loginState ? login.text( '退出' ) : login.text( '登录' );
		},

		getLinkUrl : function( curUrl ) {
			var joinSbl = '?',
				sid = config.getSidFunc();

			if ( curUrl.indexOf( '?' ) > -1 ) {
				joinSbl = '&';
			}

			return curUrl + joinSbl + 'sid=' + sid;
		},

		initEvent : function() {
			var _this=this;
			
			//手机腾讯链接
			home.on( 'click', function() {
				location.href = _this.getLinkUrl( config.homeUrl );
			} );
			
			//频道链接
			channel.on( 'click', function() { 
				location.href = _this.getLinkUrl( config.channelUrl );
			} );
			
			//登录
			login.on( 'click', function() {
				$( this ).text() == '登录' ? config.handLoginFunc() : config.handLogoutFunc();
			} );
			
			//反馈链接
			feedback.on( 'click', function() {
				location.href = _this.getLinkUrl( config.feedbackUrl + '&backurl=' + encodeURIComponent( location.href ) );
			} );
		},
		
		init : function( cusConfig ) {
			config = $.extend( {}, this.defaultConfig, cusConfig || {} );
			container = config.container ? $( config.container ) : config.container;

			this.createDom();
			this.cacheDom();
			this.updateDom();
			this.initEvent();
		}
	};
	
    return {
		init : function(cfg){
			footer.init(cfg);
			return true;
		}
	}
});
