define( 'todaySpecials', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'infiniteScrollPage', 'dialog', 'JSP', 'G', 'log'
], function ( $, PM, Data, mTpl, Tips, Isp, Dlg, JSP, G, Log ) {
    var tpl = [
        '<header class="header">',
            '<h1 class="title">今日特价</h1>',
            '<a href="javascript:;" class="ileft btn_back"></a>',
        '</header>',

        '<div class="content">',
            '<div class="module_area" style="margin-top:10px;">',
                '<% var hot_recom = line_recommended.data.record; %>',
                '<% for ( var i = 0; i < hot_recom.length; i++ ) { %>',
                '<% var item = hot_recom[ i ]; %>',
                '<div class="bd">',
                    '<a href="#detail/id=<%= item.id %>" class="u-img"><img src="<%= item.image %>" alt="<%= item.title %>" class="img"></a>',
                    '<div class="desc">',
                        '<h3><a href="#detail/id=<%= item.id %>"><%= item.title %></a></h3>',
                        '<div class="price">',
                            '<strong><i>￥</i><%= item.priceLow %><em>起</em></strong>',
                            '<strike><i>￥</i><%= item.priceMarket %></strike>',
                        '</div>',
                    '</div>',
                    '<div class="info">',
                        '<% if ( item.agreeCount > 0 ) { %>',
                            '<a href="javascript:;" class="ico_fav" data-id="<%= item.id %>"><em><%= item.agreeCount %></em>人想去</a>',
                        '<% } else { %>',
                            '<a href="javascript:;" class="ico_fav" data-id="<%= item.id %>">想去</a>',
                        '<% } %>',

                        '<% if ( item.cmtCount > 0 ) { %>',
                            '<a href="#comment/id=<%= item.id %>" class="ico_comment"><em><%= item.cmtCount %></em>人评论</a>',
                        '<% } else { %>',
                            '<a href="#comment/id=<%= item.id %>" class="ico_comment">评论</a>',
                        '<% } %>',
                        
                        '<% if ( item.sold > 0 ) { %>',
                            '<span><em><%= item.sold %></em>人已购买</span>',
                        '<% } else { %>',
                            '<span></span>',
                        '<% } %>',
                    '</div>',
                '</div>',
                '<% } %>',
            '</div>',
        '</div>'
    ].join( '' );

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'todaySpecials'
        },

        init: function() {
            this._registerPm();
            this._cacheDom();
            this._initEvent();
        },

        _registerPm: function() {
            PM.register( this.module );
        },

        _cacheDom: function() {
            this.jumphelper = $( '#jumphelper' );
            this.wrapper = $( '#wrapper' );
            this.loadingEl = $( '#div_waiting' );
        },

        _initEvent: function() {
            var me = this,
                module = this.module;

            //首次添加页面时触发
            $.bind( module, 'vpageAdd', function() {
                console.log( 'page add' );
                me.curPage = $( '.virtualPage[page=' + module.id + ']' );
                me._ajaxData();
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
                me.jumphelper.hide();
            } );
        },

        _enterPage: function() {
            window.scrollTo( 0, 1 );
            this.curPage.show();

            Log.send( {
                page_id: 'travel_recommend_list'
            } );
        },

        _ajaxData: function() {
            var me = this,
                sid = JSP.userInfo.sid;

            $.ajax( {
                url: pathInfo.dataPath + 'sid=' + sid + '&action=line_recommended&limit=10',
                success: function( data ) {
                    var data = JSON.parse( data );
                    me._renderTpl( data );
                },
                error: function() {
                    Tips.show( '请求失败' );
                }
            } );
        },

        _renderTpl: function( data ) {
            var me = this;

            if ( data.code == 0 ) {
                this.curPage.html( mTpl( tpl, data ) );
            }

            $.trigger( window, 'afterRender', [ {
                curPage: me.module.id
            } ] );

            $.trigger( this, 'afterRender' );
        }
    };

    pageRun.init();
});
