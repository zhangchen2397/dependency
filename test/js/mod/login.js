define( 'login', [ 'jqmobi' ], function ( $ ) {
    var config = {
        loginCommonFunc: null,
        logoutCommonFunc: null,
        sid: '000'
    };

    var initSid = config.sid;

    return {
        init: function( cusConfig ) {
            config = $.extend( config, cusConfig || {} );
            initSid = config.sid;

            pt.init( {
                auto        : false,
                bid         : "info",
                mainTitle   : "登录腾讯美游预订专属旅行",
                acctHolder  : "请输入QQ号",
                pwdHolder   : "请输入QQ密码"
            } );
        },

        login: function( callback ) {
            pt.fire( {
                onSuccess : function ( user ) {
                    var s=location.href, url,
                        sid = user.sid;

                    if($.isFunction(history.replaceState)){     
                        if(/[?&]sid=[^&#]*/g.test(s)){
                            url=s.replace(/([?&])sid=[^&#]*/g, '$1sid=' +sid);                     
                        }else if( /\?&*/.test(s) ){
                            url=s.replace(/\?&*/, '?sid='+sid+'&');
                        }else if( s.indexOf('#') > -1 ){
                            url=s.replace(/\/#/, '/?sid='+sid+'#');
                        }
                        history.replaceState('','',url);
                    }

                    config.sid = sid;

                    config.loginCommonFunc && config.loginCommonFunc.call( null, user );
                    callback && callback(user);
                },
                onFailure: function(){},
                onCancel: function(){}
            } );
        },

        logout: function( callback ) {
            var s = location.href,
                noSidUrl = s.replace(/sid=[^&#]*/g, ''),
                iframe = document.createElement('iframe');

            iframe.style.display = "none";
            iframe.src = "http://pt.3g.qq.com/s?aid=nLogout&sid=" + config.sid +'&redir_url=' + noSidUrl;
            document.body.appendChild(iframe);

            if($.isFunction(history.replaceState)){
                history.replaceState('','',noSidUrl);
            }
            
            config.logoutCommonFunc && config.logoutCommonFunc();
            callback && callback(); 

            config.sid = initSid;
            
            setTimeout(function(){iframe.remove();},100);   
        },

        getSid: function() {
            return config.sid;
        }
    };
} );


	