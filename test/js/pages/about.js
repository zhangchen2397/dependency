define( 'about', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'infiniteScrollPage', 'dialog', 'JSP', 'G', 'log'
], function ( $, PM, Data, mTpl, Tips, Isp, Dlg, JSP, G, Log ) {
    var tpl = [
        '<header class="header">',
            '<h1 class="title">关于美游</h1>',
            '<a href="javascript:;" class="ileft btn_back"></a>',
        '</header>',
        '<div class="content">',
            '<div class="about_area">',
                '<div class="ver_info">',
                    '<img src="http://3gimg.qq.com/wap30/infoapp/touch/itravel/images/img_travel.png" width="60" height="60" alt="美游">',
                    '<strong>美游</strong>',
                    '<span>版本V1.0</span>',
                '</div>',
                '<ul class="ver_list">',
                '<li>',
                    '<a href="http://infoapp.3g.qq.com/g/s?aid=touchmsg&g_ut=3&pku_name=lm_meiyou&backurl=' + encodeURIComponent( location.href ) + '">意见反馈</a>',
                '</li>',
                '<li>',
                    '<span>客服QQ：88881636</span>',
                '</li>',
                '<li>',
                    '<span>客服邮箱：88881636@qq.com</span>',
                '</li>',       
                '</ul>',
                '<ul class="ver_list">',
                '<li>',
                    '<a href="#article/id=102">美游理念</a>',
                '</li>',
                '<li>',
                    '<a href="#article/id=100">免责声明</a>',
                '</li>',
                '<li>',
                    '<a href="#article/id=101">隐私条款</a>',
                '</li>',
                '</ul>',
            '</div>',
        '</div>'
    ].join( '' );

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'about'
        },

        init: function() {
            this._registerPm();
            this._initEvent();
        },

        _registerPm: function() {
            PM.register( this.module );
        },

        _initEvent: function() {
            var me = this,
                module = this.module;

            //首次添加页面时触发
            $.bind( module, 'vpageAdd', function() {
                console.log( 'page add' );
                me.curPage = $( '.virtualPage[page=' + module.id + ']' );

                me._renderPage();
            } );

            //页面初始化事件，只会执行一次
            $.bind( module, 'vpageInit', function() {
                console.log( 'page init' );
            } );

            //进入当前页时事件，不需要最新数据的页面可利用缓存处理
            $.bind( module, 'vpageEnter', function() {
                console.log( 'page enter' );
                me._enterPage();
            } );

            //前进后退时事件，可添加转场动画
            $.bind( module, 'vpageBack', function() {
                console.log( 'page back' );
                me._enterPage();
            } );

            //离开当前页面事件时触发
            $.bind( module, 'vpageLeave', function() {
                console.log( 'page leave' );
                me.curPage.hide();
            } );
        },

        _enterPage: function() {
            var me = this;
            me.curPage.show();
            window.scrollTo( 0, 1 );

            Log.send( {
                page_id: 'travel_about'
            } );
        },

        _renderPage: function() {
            var me = this;

            setTimeout( function() {
                me.curPage.html( tpl );

                $.trigger( window, 'afterRender', [ {
                    curPage: me.module.id
                } ] );

                $.trigger( me, 'afterRender' );
            }, 100 );
        }
    };

    pageRun.init();
});
