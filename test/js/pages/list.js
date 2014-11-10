define( 'list', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'infiniteScrollPage', 'dialog', 'JSP', 'G', 'log'
], function ( $, PM, Data, mTpl, Tips, Isp, Dlg, JSP, G, Log ) {
    var filterTpl = [
        '<nav class="nav_area">',
            '<% var filterType = query.data; %>',
            '<div class="nav_inner">',
                '<span class="nav_all select-nav-wrap">目的地</span>',
                '<select class="filter-select" data-select="destPlace">',
                    '<option value="">所有目的地</option>',
                    '<% for ( var i = 0; i < filterType.destPlaces.length; i++ ) { %>',
                        '<% var item = filterType.destPlaces[ i ]; %>',
                        '<option value="<%= item %>"><%= item %></option>',
                    '<% } %>',
                '</select>',
            '</div>',
            '<div class="nav_inner">',
                '<span class="nav_city select-nav-wrap">出发地</span>',
                '<select class="filter-select" data-select="startPlace">',
                    '<option value="">所有出发地</option>',
                    '<% for ( var i = 0; i < filterType.startPlaces.length; i++ ) { %>',
                        '<% var item = filterType.startPlaces[ i ]; %>',
                        '<option value="<%= item %>"><%= item %></option>',
                    '<% } %>',
                '</select>',
            '</div>',
        '</nav>'
    ].join( '' );
    
    var mainTpl = [
        '<header class="header">',
            '<h1 class="title" id="provider-name"><%= providerName %></h1>',
            '<a href="javascript:;" class="ileft btn_back"></a>',
        '</header>',
        '<div id="list-filter-wrap">',
            '<% if ( providerId != 1 ) { %>',
                '<div style="padding-top:10px;"></div>',
            '<% } else { %>',
                filterTpl,
            '<% } %>',
        '</div>',
        '<div id="container" style="overflow:hidden;">',
            '<div class="module_area marbtm">',
                '<div class="con-list-wrap">',
                    //content list here
                '</div>',
                '<div class="auto-loading btn_lk" style="display:none;">加载中...</div>',
                '<div class="click-loading btn_lk" style="display:none;">点击加载更多</div>',
            '</div>',
        '</div>'
    ].join( '' );

    var listTpl = [
        '<% var data = line_list.data.lines.record; %>',
        '<% for ( var i = 0, len = data.length; i < len; i++ ) { %>',
            '<% var item = data[ i ]; %>',
            '<div class="bd">',
                '<a href="#detail/id=<%= item.id %>&providerId=<%= providerId %>" class="u-img"><img src="<%= item.image %>" alt="<%= item.title %>" class="img"></a>',
                '<div class="desc">',
                    '<h3><a href="#detail/id=<%= item.id %>&providerId=<%= providerId %>"><%= item.title %></a></h3>',
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
        '<% } %>'
    ].join( '' );

    var providerMap = {
        1: '出境海岛',
        2: '极致体验',
        3: '有特价',
        4: '特供精选',
        6: '爱旅行每日精选'
    };

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'list'
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
            this.providerRenderMap = {};
        },

        _enterPage: function( event ) {
            var me = this;

            setTimeout( function() {
                if ( event.prevPage == 'detail' ) {
                    if ( me.module.pos ) {
                        window.scrollTo( 0, me.module.pos.y );
                    }
                } else {
                    window.scrollTo( 0, 1 );
                }
            }, 100 );
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
            $.bind( module, 'vpageEnter', function( event ) {
                console.log( 'page enter' );
                me._renderMain( event );
                me._enterPage( event );
            } );

            //前进后退时事件，可添加转场动画
            $.bind( module, 'vpageBack', function( event ) {
                console.log( 'page back' );
                me._renderMain( event );
                me._enterPage( event );
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

            this.wrapper.delegate( '.filter-select', 'touchend', function( event ) {
                var showSelect = $( this ).siblings( 'span' );
                //showSelect.addClass( 'up' );
            } );

            //selectchange事件
            this.wrapper.delegate( '.filter-select', 'change', function( event ) {
                var showSelect = $( this ).siblings( 'span' ),
                    curOpts = this.options,
                    curSelect = curOpts[ curOpts.selectedIndex ],
                    selectText = curSelect.text,
                    selectValue = curSelect.value,
                    queryPara = me._getFilterValue().join( '&' ),
                    sid = JSP.userInfo.sid,
                    id = me.getHashParaValue( 'id' ) || 1,
                    infiniteScrollIns = me.infiniteScrollIns;

                //showSelect.removeClass( 'up' );
                showSelect.text( selectText );
                queryPara = queryPara + '&provider=' + id;

                me.loadingEl.show();
                $( '.footer' ).hide();

                infiniteScrollIns.config.ajaxUrl = pathInfo.dataPath + 'sid=' + sid + '&action=line_list&ps=6&' + queryPara;
                infiniteScrollIns.curPage = 1;
                infiniteScrollIns.autoLoading.hide();
                infiniteScrollIns.clickLoading.hide();
                infiniteScrollIns.conListWrap.html( '' );
                infiniteScrollIns.canAutoAjaxData = false;
                infiniteScrollIns.ajaxData();
            } );
        },

        _getFilterValue: function() {
            var queryArr = [];
            $( '.filter-select' ).each( function( el, idx ) {
                var curOpts = this.options,
                    selectValue = curOpts[ curOpts.selectedIndex ].value,
                    queryPara = decodeURIComponent( $( this ).data( 'select' ) );

                queryArr.push( queryPara + '=' + selectValue );
            } );

            return queryArr;
        },

        _initInfiniteScroll: function() {
            var me = this,
                id = this.getHashParaValue( 'id' ) || 1,
                sid = JSP.userInfo.sid;

            this.infiniteScrollIns = new Isp.infiniteScrollPage( {
                ajaxUrl: pathInfo.dataPath + 'sid=' + sid + '&action=line_list&ps=6&provider=' + id,
                curMod: this.module
            } );

            $.bind( this.infiniteScrollIns, 'ajaxSuccess', function( event ) {
                var data = JSON.parse( event.data ),
                    id = me.getHashParaValue( 'id' ) || 1,
                    dataList = null;

                if ( data.code == 0 ) {
                    data.providerId = id;
                    dataList = data.line_list.data.lines;

                    this.conListWrap.append( mTpl( listTpl, data ) );
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

                    Log.send( {
                        page_id: 'travel_list',
                        write_type: 'list_' + id
                    } );

                    me.curPage.show();
                }

                $.trigger( window, 'afterRender', [ {
                    curPage: me.module.id
                } ] );

                $.trigger( me, 'afterRender', [ {
                    curPage: me.module.id
                } ] );
            } );
        },

        _renderMain: function( event ) {
            var me = this,
                id = this.getHashParaValue( 'id' ) || 1,
                sid = JSP.userInfo.sid;

            if ( event.prevPage == 'detail' && this.providerRenderMap[ id ] ) {
                me.curPage.show();
                Log.send( {
                    page_id: 'travel_list',
                    write_type: 'list_' + id
                } );
                return;
            } else {
                //去哪没有筛选条件
                if ( id != 1 ) {
                    var data = {};
                    render( data );
                } else {
                    $.ajax( {
                        url: pathInfo.dataPath + 'sid=' + sid + '&action=query&provider=' + id,
                        success: function( data ) {
                            var data = JSON.parse( data );
                            render( data );
                        },
                        error: function() {
                            Tips.show( '请求失败' );
                        }
                    } );
                }
            }

            function render( data ) {
                me.providerRenderMap[ id ] = true;
                data.providerId = id;
                data.providerName = providerMap[ id ] || '今日推荐';

                if ( !me.hasRenderMain ) {
                    me.curPage.html( mTpl( mainTpl, data ) );
                } else {
                    if ( id == 1 ) {
                        $( '#list-filter-wrap' ).html( mTpl( filterTpl, data ) );
                    } else {
                        $( '#list-filter-wrap' ).html( '<div style="padding-top:10px;"></div>' );
                    }
                    $( '#provider-name' ).text( data.providerName );
                }

                me.hasRenderMain = true;

                if ( me.infiniteScrollIns ) {
                    var infiniteScrollIns = me.infiniteScrollIns;
                    infiniteScrollIns.config.ajaxUrl = pathInfo.dataPath + 'sid=' + sid + '&action=line_list&ps=6&provider=' + id,
                    infiniteScrollIns.curPage = 1;
                    infiniteScrollIns.canAutoAjaxData = true;
                    infiniteScrollIns.autoLoading.hide();
                    infiniteScrollIns.clickLoading.hide();
                    infiniteScrollIns.conListWrap.html( '' );
                    infiniteScrollIns.ajaxData();
                } else {
                    me._initInfiniteScroll();
                }
            }
        },

        /** 
         * 获取hash查询字符串对应的值
         * @method _getHashParaValue
         * @param para {string} 当前要获取字段名称
         * @private
         */
        getHashParaValue: function( para ) {
            var hash = location.hash.replace( /^#+/, '' ).split( '/' )[ 1 ];
            if ( hash ) {
                var queryArray = hash.split( "&" );
                for ( var i = 0, len = queryArray.length; i < len; i++ ) {
                    var item = queryArray[ i ].split( "=" );
                    if ( item[ 0 ] == para ) {
                        return encodeURIComponent( item[ 1 ] );
                    }
                }
            }
        }
    };

    pageRun.init();
});
