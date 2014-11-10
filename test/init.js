define('init', [
    'jqmobi', 'pm', 'footer', 'login', 'data', 'addressBar', 'mTips', 'JSP', 'G', 'log'
], function ( $, PM, Footer, Login, Data, AddressBar, Tips, JSP, G, Log ) {
    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        init: function() {
            this._cacheDom();
            this._initLogin();
            this._initPm();
            this._initEvent();
        },

        _cacheDom: function() {
            this.wrapper = $( '#wrapper' );
            this.loadingEl = $( '#div_waiting' );
        },

        _initLogin: function() {
            var initUserInfo = $.extend( {}, userInfo );

            Login.init( {
                sid: userInfo.sid,
                loginCommonFunc: function( user ) {
                    JSP.userInfo = {
                        sid: user.sid,
                        isLogin: true,
                        qq: user.uin,
                        nick: user.nick,
                        avatar: user.head
                    };

                    $( '.f-login' ).text( '退出' );
                },

                logoutCommonFunc: function() {
                    pt.remove( JSP.userInfo.qq );
                    JSP.userInfo = initUserInfo;
                    JSP.userInfo.isLogin = false;
                    
                    $( '.f-login' ).text( '登录' );
                }
            } );
        },

        _initPm: function() {
            AddressBar.hide( function() {
                PM.init( {
                    home: 'home',
                    obj: $( '#wrapper' )
                } );

                var bodyMinHeight = parseInt( $( 'body' ).css( 'min-height' ), 10 );
                $( '#wrapper' ).css( 'min-height', bodyMinHeight - 87 + 'px' )
            } );
        },

        _initFooter: function() {
            this.footer = Footer.init( {
                container       : 'body',
                loginState      : userInfo.isLogin,
                homeUrl         : pathInfo.infoUrl + '/g/s?aid=index&g_ut=3',
                channelName     : '',
                channelUrl      : '',
                feedbackUrl     : 'http://infoapp.3g.qq.com/g/s?aid=touchmsg&g_ut=3&pku_name=lm_meiyou',
                handLoginFunc   : Login.login,
                handLogoutFunc  : Login.logout,
                getSidFunc      : Login.getSid
            } );

            this.footerEl = $( '.footer' );
        },

        _switchPageCb: function( event ) {
            var me = this;

            setTimeout( function() {
                me._ctrlFooter( event.curPage );
            }, 1000 );

            //window.scrollTo( 0, 1 );
        },

       //详情页及发团信息页不显示footer
        _ctrlFooter: function( curPage ) {
            if ( curPage == 'detail' || curPage == 'groupInfo' ) {
                this.footerEl && this.footerEl.hide();
            } else {
                this.footerEl && this.footerEl.show();
            }
        },

        _initEvent: function() {
            var me = this;

            //用于组件内通信，将scroll事件绑定在当前模块上
            $( window ).bind( 'scroll', function() {
                PM.notify( 'scroll' );
            } );

            $.bind( window, 'afterRender', function( e ) {
                me.loadingEl.hide();

                if ( !me.footer ) {
                    me._initFooter();
                }

                me._ctrlFooter( e.curPage );
            } );

            $( document.body ).delegate( '.tel-num-btn', 'touchend', function() {
                Log.send( {
                    page_id: 'travel_phone'
                } );
            } );

            //点击想去接口
            $( document.body ).delegate( '.ico_fav', 'touchend', function( event ) {
                if ( $( this ).hasClass( 's-ico-fav' ) ) {
                    var item = $( '.p-ico-fav' );
                } else {
                    var item = $( this );
                }

                var favEl = item.find( 'em' ),
                    favNum = parseInt( favEl.text() || 0, 10 ),
                    sid = JSP.userInfo.sid,
                    id = item.data( 'id' );

                if ( item.hasClass( 'ico_fav_active' ) ) {
                    Tips.show( '您已经赞过！' );
                } else {
                    $.ajax( {
                        url: pathInfo.dataPath + 'sid=' + sid + '&action=vote_agree&id=' + id,
                        success: function( data ) {
                            var data = JSON.parse( data );
                            if ( data.code == 0 ) {
                                item.addClass( 'ico_fav_active' );
                                favNum++;

                                if ( favNum > 9999 ) {
                                    favNum = ( favNum / 1000 ).toFixed( 1 ) + 'k+';
                                }

                                //详情页有两个入口，需要联动处理
                                if ( item.hasClass( 'd_ico_fav' ) ) {
                                    $( '.d_ico_fav' ).each( function( el, idx ) {
                                        $( this ).addClass( 'ico_fav_active' );

                                        if ( $( this ).hasClass( 'p-ico-fav' ) ) {
                                            $( this ).html( '<em>' + favNum + '</em>人想去' );
                                        }
                                    } );
                                } else {
                                    item.html( '<em>' + favNum + '</em>人想去' );
                                }
                            } else {
                                Tips.show( '系统错误，稍后再试' );
                            }

                            Log.send( {
                                page_id: 'travel_detail'
                            } );
                        }
                    } );
                }
            } );

            $( '#gotop' ).bind( 'click', function() {
                window.scrollTo( 0, 1 );
            } );

            $( '#gobot' ).bind( 'click', function() {
                window.scrollTo( 0, 90000 );
            } );

            $( document.body ).delegate( '.btn_back', 'click', function( event ) {
                event.preventDefault();
                history.back();
            } );

            $.bind( window, 'vpageBack', $.proxy( this._switchPageCb, this ) );

            $.bind( window, 'vpageEnter', $.proxy( this._switchPageCb, this ) );

            $.bind( window, 'vpageInit', function( e ) {
                me.loadingEl.show();
            } );

            $.bind( window, 'vpageLeave', function( e ) {
                me.footerEl && me.footerEl.hide();
            } );
        }
    };

    pageRun.init();
} );
