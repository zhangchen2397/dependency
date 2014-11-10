define( 'home', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'swipe', 'JSP', 'G', 'log'
], function ( $, PM, Data, mTpl, Tips, swipe, JSP, G, Log ) {
    var tpl = [
        '<header class="header">',
            '<h1><img src="http://3gimg.qq.com/wap30/infoapp/touch/itravel/images/logo_travel.png?ver=1" width="75" height="23" alt="iTravel"></h1>',
            '<a href="#about" class="iright btn_help"></a>',
        '</header>',
        '<div class="content">',
            '<div class="focus_area" id="slide">',
                '<ul class="list_imgs">',
                '<% var slideImg = top_operating.data.record; %>',
                '<% var slideLen = slideImg.length; %>',
                '<% for ( var i = 0; i < slideLen; i++ ) { %>',
                    '<% var item = slideImg[ i ]; %>',
                    '<li><a href="<%= item.link_url %>" class="u-img"><img src="<%= item.link_image %>" alt="<%= item.title %>" class="img"></a></li>',
                '<% } %>',
                '</ul>',
                '<div class="list_pointer">',
                    '<% for ( var i = 0; i < slideLen; i++ ) { %>',
                        '<% var idx = i + 1; %>',
                        '<% if ( idx == 1 ) { %>',
                            '<span class="selected"><%= idx %></span>',
                        '<% } else { %>',
                            '<span><%= idx %></span>',
                        '<% } %>',
                    '<% } %>',
                '</div>',
            '</div>',
            '<div class="guide_area">',
                '<a href="#list/id=3" class="lk_a lk1">',
                    '<strong>出境 海岛</strong>',
                    '<span>精品海岛线路</span>',
                '</a>',
                '<a href="#raidersList" class="lk_a lk2 log-send" data-sendpara="329">',
                    '<strong>发现 旅程</strong>',
                    '<span>目的地攻略</span>',
                '</a>',
            '</div>',

            '<div class="guide_area">',
                '<a href="#list/id=4" class="lk_a lk3">',
                    '<strong>特供 精选</strong>',
                    '<span>去哪儿网特价</span>',
                '</a>',
                '<a href="#list/id=6" class="lk_a lk4">',
                    '<strong>极致 体验</strong>',
                    '<span>爱旅行精品游</span>',
                '</a>',
            '</div>',
        '</div>',

        '<% var hot_recom = line_recommended.data.record; %>',
        '<% if ( hot_recom ) { %>',
        '<div class="module_area marbtm2">',
            '<div class="tit"><h2><a href="#todaySpecials">爆款推荐</a></h2></div>',
            '<% for ( var i = 0; i < hot_recom.length; i++ ) { %>',
            '<% var item = hot_recom[ i ]; %>',
            '<div class="bd">',
                '<a href="#detail/id=<%= item.id %>" class="u-img log-send" data-sendpara="330"><img src="<%= item.image %>" alt="<%= item.title %>" class="img"></a>',
                '<div class="desc">',
                    '<h3><a class="log-list-com" href="#detail/id=<%= item.id %>"><%= item.title %></a></h3>',
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
            '<a href="#todaySpecials" class="btn_lk">查看更多</a>',
        '</div>',
        '<% } %>',
        
        '<div class="module_area2 marbtm">',
            '<div class="tit"><h2><a href="#raidersList">精选攻略</a></h2></div>',
            '<% var choiceness = raiders.data.record; %>',
            '<% for ( var i = 0; i < choiceness.length; i++ ) { %>',
            '<% var item = choiceness[ i ]; %>',
                '<% if ( item ) { %>',
                '<div class="bd log-send" data-sendpara="331">',
                    '<a class="u-img log-list-gy" href="http://info.3g.qq.com/g/s?g_ut=3&aid=trip_ss&id=<%= item.id %>&sid=<%= this.sid %>">',
                        '<% if(item.image.urls){ %>',                       
                            '<img class="img" src="<%= item.image.urls[0] %>">',
                        '<% } %>',   
                    '</a>',
                    '<div class="desc">',
                        '<h3><a class="log-list-gy" href="http://info.3g.qq.com/g/s?g_ut=3&aid=trip_ss&id=<%= item.id %>&sid=<%= this.sid %>" target="_blank"><%= item.titleS %></a></h3>',
                        '<time>',
                            '<span><%= item.pubtime %></span>',
                            '<span><%= item.source %></span>',
                        '</time>',
                    '</div>',
                '</div>',
                '<% } %>',
            '<% } %>',
            '<a href="#raidersList" class="btn_lk">查看更多</a>',
        '</div>'
    ].join( '' );

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'home'
        },

        init: function() {
            this._registerPm();
            this._initEvent();
            this._initLog();
        },

        _registerPm: function() {
            PM.register( this.module );
        },

        _initLog: function() {
            $( document.body ).delegate( '.log-send', 'touchend', function( event ) {
                JSP.logPara = {
                    para: $( this ).data( 'sendpara' ),
                    hasSend: false
                };
            } );
        },

        _ajaxData: function() {
            var me = this,
                sid = JSP.userInfo.sid;

            $.ajax( {
                url: pathInfo.dataPath + 'sid=' + sid + '&action=top_operating,raiders,line_recommended&limit=6&pn=1&ps=6',
                success: function( data ) {
                    me.homeData = JSON.parse( data );
                    me._renderTpl( me.homeData );
                },
                error: function() {
                    Tips.show( '请求失败' );
                }
            } );
        },

        _renderTpl: function( data ) {
            var me = this,
                otherData = {
                    sid: JSP.userInfo.sid
                };

            if ( data.code == 0 ) {
                this.curPage.html( mTpl.call( otherData, tpl, data ) );
            }

            $.trigger( window, 'afterRender', [ {
                curPage: me.module.id
            } ] );

            $.trigger( this, 'afterRender' );
        },

        _enterPage: function() {
            var me = this;

            me._ajaxData();

            Log.send( {
                page_id: 'travel'
            } );
        },

        _initEvent: function() {
            var me = this,
                module = this.module;

            //首次添加页面时触发
            $.bind( module, 'vpageAdd', function() {
                console.log( 'page add' );
                me.curPage = $( '.virtualPage[page=' + module.id + ']' );
            } );

            //页面初始化事件，只会执行一次
            $.bind( module, 'vpageInit', function() {
                console.log( 'page init' );
            } );

            //进入当前页时事件，不需要最新数据的页面可利用缓存处理
            $.bind( module, 'vpageEnter', function() {
                console.log( 'page enter' );
                me.curPage.show();
                me._enterPage();
            } );

            //前进后退时事件，可添加转场动画
            $.bind( module, 'vpageBack', function() {
                console.log( 'page back' );
                me.curPage.show();
                me._enterPage();
            } );

            //离开当前页面事件时触发
            $.bind( module, 'vpageLeave', function() {
                console.log( 'page leave' );
                me.curPage.hide();
            } );

            //渲染完页面后事件绑定
            $.bind( this, 'afterRender', function( event ) {
                me._initSlide();

                if ( me.module.pos ) {
                    window.scrollTo( 0, me.module.pos.y );
                }
            } );
        },

        _initSlide: function() {
            var me = this,
                slideNav = $( '#slide > .list_pointer > span' );

            this.swipeIns = new swipe( document.getElementById( 'slide' ), {
                speed: 400,
                auto: 3000,
                continuous: true,
                callback: function( index, elem ) {
                    slideNav.removeClass( 'selected' );
                    $( slideNav.get( index ) ).addClass( 'selected' );
                }
            } );
        }
    };

    pageRun.init();
});
