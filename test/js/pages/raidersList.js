define( 'raidersList', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'infiniteScrollPage', 'dialog', 'JSP', 'G', 'log'
], function ( $, PM, Data, mTpl, Tips, Isp, Dlg, JSP, G, Log ) {
    var mainTpl = [
        '<header class="header">',
            '<h1 class="title">发现旅程</h1>',
            '<a href="javascript:;" class="ileft btn_back"></a>',
        '</header>',

        '<div id="raiders-container" style="margin-top:10px;">',
            '<div class="module_area2 marbtm">',
                '<div class="con-list-wrap">',
                    //content list here
                '</div>',
                '<div class="auto-loading btn_lk" style="display:none;">加载中...</div>',
                '<div class="click-loading btn_lk" style="display:none;">点击加载更多</div>',
            '</div>',
        '</div>'
    ].join( '' );

    var listTpl = [
        '<% var choiceness = raiders.data.record; %>',
        '<% for ( var i = 0, len = choiceness.length; i < len; i++ ) { %>',
            '<% var item = choiceness[ i ]; %>',
            '<% if ( item.image.urls ) { %>',
                '<div class="bd">',
                    '<% if ( item.topicUrl ) { %>',
                        '<a class="u-img" href="<%= item.topicUrl %>">',
                    '<% } else { %>',
                        '<a class="u-img" href="http://info.3g.qq.com/g/s?g_ut=3&aid=trip_ss&id=<%= item.id %>&sid=<%= this.sid %>">',
                    '<% } %>',
                        '<img class="img" src="<%= item.image.urls[0] %>">',
                    '</a>',
                    '<div class="desc">',
                        '<h3>',
                            '<% if ( item.topicUrl ) { %>',
                                '<a href="<%= item.topicUrl %>">',
                            '<% } else { %>',
                                '<a href="http://info.3g.qq.com/g/s?g_ut=3&aid=trip_ss&id=<%= item.id %>&sid=<%= this.sid %>">',
                            '<% } %>',
                                '<%= item.titleS %>',
                            '</a>',
                        '</h3>',
                        '<time>',
                            '<span><%= item.pubtime %></span>',
                            '<span><%= item.source %></span>',
                        '</time>',
                    '</div>',
                '</div>',
            '<% } %>',
        '<% } %>'
    ].join( '' );

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'raidersList'
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

                //页面首次加载中渲染主体页面结构
                me.curPage.html( mainTpl );
                me._initInfiniteScroll();
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

            //返回顶部
            $.bind( module, 'scroll', function( event ) {
                var jumphelper = me.jumphelper;
                if ( document.body.scrollTop > 200 ) {
                    jumphelper.show();
                } else {
                    jumphelper.hide();
                }
            } );
        },

        _enterPage: function() {
            window.scrollTo( 0, 1 );
            this.curPage.show();
            
            Log.send( {
                page_id: 'travel_raider_list'
            } );
        },

        _initInfiniteScroll: function() {
            var me = this,
                sid = JSP.userInfo.sid,
                otherData = {
                    sid: JSP.userInfo.sid
                };

            this.infiniteScrollIns = new Isp.infiniteScrollPage( {
                el: '#raiders-container',
                ajaxUrl: pathInfo.dataPath + 'sid=' + sid + '&action=raiders&ps=6',
                curMod: this.module
            } );

            $.bind( this.infiniteScrollIns, 'ajaxSuccess', function( event ) {
                var data = JSON.parse( event.data ),
                    dataList = data.raiders.data;

                if ( data.code == 0 ) {
                    this.conListWrap.append( mTpl.call( otherData, listTpl, data ) );
                    this.autoLoading.text( '加载中...' );

                    //显示自动加载及手动加载逻辑判断
                    if ( this.curPage > this.config.maxAutoPage ) {
                        if ( dataList.hasMore ) {
                            this.clickLoading.show();
                        } else {
                            this.autoLoading.text( '全部数据加载完毕' );
                            this.autoLoading.show();
                        }
                        
                        this.canAutoAjaxData = false;   
                    } else {
                        if ( dataList.record.length < 1 ) {
                            this.autoLoading.text( '暂无数据' );
                            this.canAutoAjaxData = false;
                        } else {
                            if ( dataList.hasMore ) {
                                this.canAutoAjaxData = true;
                            } else {
                                this.autoLoading.text( '全部数据加载完毕' );
                                this.canAutoAjaxData = false;
                            }
                        }

                        this.autoLoading.show();
                    }
                }

                $.trigger( window, 'afterRender', [ {
                    curPage: me.module.id
                } ] );

                $.trigger( me, 'afterRender', [ {
                    curPage: me.module.id
                } ] );

                //如果首次加载，则不发log请求，enter时会发
                if ( me.hasLoaded ) {
                    Log.send( {
                        page_id: 'travel_raider_list'
                    } );
                }
                me.hasLoaded = true;
            } );

            $.bind( this.infiniteScrollIns, 'ajaxError', function() {
                //可用于打错误日志统计
            } );

            $.bind( this.infiniteScrollIns, 'ajaxFinalError', function() {
                //Tips.show( '请求失败' );
            } );
        }
    };

    pageRun.init();
});
