define( 'detail', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'swipe', 'login', 'JSP', 'G', 'iScroll', 'log', 'imgFull', 'slide'
], function ( $, PM, Data, mTpl, Tips, swipe, Login, JSP, G, iScroll, Log, imgFull, slide ) {
    var tpl = [
        '<% var data = line_detail.data; %>',
        '<% var curProvider = providers.data[ providerId ]; %>',
        '<% if ( !curProvider ) { %>',
            '<% curProvider = providers.data.record[0]; %>',
        '<% } %>',
        '<header class="header">',
            '<h1 class="title">详情介绍</h1>',
            '<a href="javascript:;" class="ileft btn_back"></a>',
        '</header>',
        '<div class="content">',
            '<div class="focus_area" id="detail-slide">',
                '<ul class="list_imgs">',
                    '<li>',
                        '<a href="javascript:;" class="u-img"><img src="<%= data.image %>" alt="<%= data.title %>" class="img"></a>',
                        '<span class="price">',
                            '<strong><i>￥</i><%= data.priceLow %><em>起</em></strong>',
                            '<strike><i>￥</i><%= data.priceMarket %></strike>',
                        '</span>',
                    '</li>',
                '</ul>',
                '<div class="list_pointer" style="display:none;">',
                    '<% for ( var i = 0; i < 3; i++ ) { %>',
                        '<% var idx = i + 1; %>',
                        '<% if ( idx == 1 ) { %>',
                            '<span class="selected"><%= idx %></span>',
                        '<% } else { %>',
                            '<span><%= idx %></span>',
                        '<% } %>',
                    '<% } %>',
                '</div>',
                '<a href="javascript:;" class="ico_fav d_ico_fav s-ico-fav" data-id="<%= data.id %>"></a>',
            '</div>',
            '<div class="focus_desc focus_desc_v1">',
                '<h2><%= data.title %></h2>',
                '<p><%= data.subTitle %></p>',
            '</div>',
            '<div class="detail_area">',
                '<section class="itra_bd">',
                    '<div class="fav_area">',
                        '<a href="javascript:;" class="ico_fav d_ico_fav p-ico-fav" data-id="<%= data.id %>">',
                            '<% if ( data.agreeCount == 0 ) { %>',
                                '<em style="display:none;"><%= data.agreeCount %></em>我也想去</a>',
                            '<% } else { %>',
                                '<em><%= data.agreeCount %></em>人想去</a>',
                            '<% } %>',
                        '</a>',
                    '</div>',

                    '<div class="fav_area2">',
                        '<div class="box">',
                            '<p>出发地：<%= data.startPlace %></p>',
                            '<p>产品：<%= data.category %></p>',
                            '<p>编号：<%= data.productId %></p>',
                        '</div>',
                        '<div class="box">',
                            '<% if ( data.destPlace == 0 ) { %>',
                                '<p>目的地：--</p>',
                            '<% } else { %>',
                                '<p>目的地：<%= data.destPlace %></p>',
                            '<% } %>',
                            '<p>时间：<%= data.duration %></p>',
                            '<% if ( data.sold == 0 ) { %>',
                                '<p>已购：--</p>',
                            '<% } else { %>',
                                '<p>已购：<%= data.sold %>人</p>',
                            '<% } %>',
                        '</div>',
                    '</div>',
                '</section>',

                '<section class="itra_bd">',
                    '<div class="tel">',
                        '<div>',
                            '<h2><%= curProvider.name %></h2>',
                            '<span href="tel:<%= curProvider.tel %>"><%= curProvider.tel %></span>',
                        '</div>',
                        '<% if ( data.servicePhone ) { %>',
                            '<a class="btn_tel tel-num-btn" href="tel:<%= data.servicePhone %>"></a>',
                        '<% } else { %>',
                            '<a class="btn_tel tel-num-btn" href="tel:<%= curProvider.tel %>"></a>',
                        '<% } %>',
                    '</div>',
                '</section>',

                '<% if ( data.advantage ) { %>',
                    '<section class="itra_bd">',
                        '<div class="tit_desc detail-tit-desc">',
                            '<h2>产品亮点</h2>',
                        '</div>',
                        '<div class="desc">',
                            '<%= data.advantage %>',
                        '</div>',
                    '</section>',
                '<% } %>',

                '<% if ( data.plans.length ) { %>',
                    '<section class="itra_bd">',
                        '<div class="tour_refer">',
                            '<h2>行程参考</h2>',
                            '<div class="tour_scroll" id="journey">',
                                '<ul class="list_refer">',
                                    '<% for ( var i = 0, len = data.plans.length; i < len; i++ ) { %>',
                                        '<% var item = data.plans[ i ]; %>',
                                        '<li>',
                                            '<h3><strong>DAY <%= item.day %></strong><%= item.placeNames %></h3>',
                                            '<div class="desc_refer">',
                                                '<p style=""><%= item.desc %></p>',
                                                '<p>入住：<%= item.hotel %></p>',
                                                '<p>早餐：<%= item.breakfast %>；中餐：<%= item.lunch %>；晚餐：<%= item.dinner %></p>',
                                                '<p></p>',
                                            '</div>',
                                            '<div class="mask_desc"></div>',

                                            '<a href="javascript:;" data-idx="<%= i %>" class="u-img" style="background-image:url(<%= item.cover %>)"></a>',
                                        '</li>',
                                    '<% } %>',
                                '</ul>',
                            '</div>',
                        '</div>',
                    '</section>',
                '<% } %>',

                '<section class="itra_bd">',
                    '<div class="commt">',
                        '<h2>用户评论</h2>',
                        '<% if ( data.cmt.count == 0 ) { %>',
                            '<p class="no_commt">新大陆等待开拓中</p>',
                        '<% } %>',

                        '<ul class="list_commt" id="detail-cmt-list">',

                        '</ul>',
                    '</div>',

                    '<% if ( data.cmt.count < 4 ) { %>',
                        '<a class="btn_lk btn_commt" href="#comment/id=<%= data.id %>">我要评论</a>',
                    '<% } else { %>',
                        '<a class="btn_lk btn_commt" href="#comment/id=<%= data.id %>">查看全部 <%= data.cmt.count %> 条</a>',
                    '<% } %>',
                '</section>',

                '<% var groupInfo = data.groups[ 0 ]; %>',
                '<% if ( groupInfo ) { %>',
                '<section class="itra_bd">',
                    '<div class="tb2">',
                        '<table>',
                            '<tr>',
                                '<th>发团日期</th>',
                                '<th class="tacen">可购人数</th>',
                                '<th class="targt">单价</th>',
                            '</tr>',
                            '<tr>',
                                '<td><%= groupInfo.startDate %></td>',
                                '<td class="tacen"><%= groupInfo.remaining %></td>',
                                '<td class="targt"><%= groupInfo.price %></td>',
                            '</tr>',
                        '</table>',
                    '</div>',
                    '<a class="btn_lk btn_group" href="#groupInfo/id=<%= data.id %>&providerId=<%= providerId %>">发团信息</a>',
                '</section>',
                '<% } %>',

                '<% if ( data.costInclude ) { %>',
                    '<section class="itra_bd itra_bd_v1">',
                        '<div class="tit_desc detail-tit-desc up">',
                            '<h2>费用信息</h2>',
                            '<span class="btn_arr"></span>',
                        '</div>',
                        '<div class="desc" style="display: none;">',
                            '<%= data.costInclude %>',
                        '</div>',
                    '</section>',
                '<% } %>',

                '<% if ( data.visas ) { %>',
                    '<section class="itra_bd itra_bd_v1">',
                        '<div class="tit_desc detail-tit-desc up">',
                            '<h2>签证说明</h2>',
                            '<span class="btn_arr"></span>',
                        '</div>',
                        '<div class="desc" style="display: none;">',
                            '<%= data.visas %>',
                        '</div>',
                    '</section>',
                '<% } %>',

                '<% if ( data.costExclude ) { %>',
                    '<section class="itra_bd itra_bd_v1">',
                        '<div class="tit_desc detail-tit-desc up">',
                            '<h2>预定信息</h2>',
                            '<span class="btn_arr"></span>',
                        '</div>',
                        '<div class="desc" style="display: none;">',
                            '<%= data.costExclude %>',
                        '</div>',
                    '</section>',
                '<% } %>',
            '</div>',

            '<div class="line_area">',
                '<% if ( data.servicePhone ) { %>',
                    '<a class="tel-num-btn" href="tel:<%= data.servicePhone %>">400专线咨询</a>',
                '<% } else { %>',
                    '<a class="tel-num-btn" href="tel:<%= curProvider.tel %>">400专线咨询</a>',
                '<% } %>',
                
                '<a id="detail-order-now" href="<%= data.url %>">即刻出发</a>',
            '</div>',
        '</div>'
    ].join( '' );

    var cmtTpl = [
        '<% var data = cmtLst.record; %>',
        '<% var len = ( data.length ) > 3 ? 3 : data.length; %>',
        '<% for ( var i = 0; i < len; i++ ) { %>',
            '<% var item = data[ i ]; %>',
            '<li>',
                '<img src="http://q4.qlogo.cn/g?b=qq&nk=<%= item.userid %>&s=40" alt="<%= item.usernick %>">',
                '<span><%= item.usernick %></span>',
                '<p><%= item.shortcontent %></p>',
            '</li>',
        '<% } %>'
    ].join( '' );

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'detail'
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
            } );

            //页面初始化事件，只会执行一次
            $.bind( module, 'vpageInit', function() {
                console.log( 'page init' );
            } );

            //进入当前页时事件，不需要最新数据的页面可利用缓存处理
            $.bind( module, 'vpageEnter', function() {
                console.log( 'page enter' );
                me._renderPage();
            } );

            //前进后退时事件，可添加转场动画
            $.bind( module, 'vpageBack', function() {
                console.log( 'page back' );
                me._renderPage();
            } );

            //离开当前页面事件时触发
            $.bind( module, 'vpageLeave', function() {
                console.log( 'page leave' );
                me.curPage.hide();
            } );

            //渲染完页面后事件绑定
            $.bind( this, 'afterRender', function( event ) {
                me._initSlide();
                me._initComment();

                if ( me.plans.length ) {
                    imgFull.init( me.plans );
                    me._initJourney();
                }
            } );

            //详情展开收起逻辑
            this.wrapper.delegate( '.detail-tit-desc .btn_arr', 'touchend', $.proxy( this._toggleShow, this ) );

            this.wrapper.delegate( '#journey ul>li .u-img', 'click', function( event ) {
                imgFull.show( event );
            } );
        },

        _initSlide: function() {
            var me = this,
                slideNav = $( '#detail-slide > .list_pointer > span' );

            this.swipeIns = new swipe( document.getElementById( 'detail-slide' ), {
                speed: 400,
                auto: 3000,
                continuous: true,
                callback: function( index, elem ) {
                    slideNav.removeClass( 'selected' );
                    $( slideNav.get( index ) ).addClass( 'selected' );
                }
            } );
        },

        _toggleShow: function( event ) {
            var curEl = $( event.currentTarget ).parent(),
                prtEl = curEl.parent(),
                nextEl = curEl.siblings( '.desc' );
            
            if ( curEl.hasClass( 'up' ) ) {
                nextEl.show();
                curEl.removeClass( 'up' );
                prtEl.removeClass( 'itra_bd_v1' );
            } else {
                nextEl.hide();
                curEl.addClass( 'up' );
                prtEl.addClass( 'itra_bd_v1' );
            }
        },

        _renderPage: function() {
            var me = this,
                sid = JSP.userInfo.sid,
                detailList = Data.get( 'detailList' ) || {},
                id = this.getHashParaValue( 'id' ) || 235;

            this.loadingEl.show();
            window.scrollTo( 0, 1 );

            $.ajax( {
                url: pathInfo.dataPath + 'sid=' + sid + '&action=line_detail,providers&id=' + id,
                success: function( data ) {
                    var data = JSON.parse( data ),
                        providerId = data.line_detail.data.providerId || me.getHashParaValue( 'providerId' ) || 1,
                        dataPush = {},
                        costInclude = data.line_detail.data.costInclude,
                        advantage = data.line_detail.data.advantage;

                    me.plans = data.line_detail.data.plans || [];

                    //数据格式兼容处理
                    if ( /<\!--/gi.test( costInclude ) ) {
                        data.line_detail.data.costInclude = '';
                    }
                    if ( /<\!--/gi.test( advantage ) ) {
                        data.line_detail.data.advantage = '';
                    }

                    //临时数据兼容处理
                    data.line_detail.data.costInclude = replaceStr( costInclude );
                    data.line_detail.data.advantage = replaceStr( advantage );
                        
                    data.providerId = providerId;
                    dataPush[ id ] = data;

                    successCb( data );
                    $.extend( detailList, dataPush );
                    Data.set( 'detailList', detailList );
                },
                error: function() {
                    Tips.show( '请求失败' );
                }
            } );

            function replaceStr( str ) {
                if ( /<font/gmi.test( str ) ) {
                    return str
                        .replace( /<font.*?>/gi, '' )
                        .replace( /<\/font>/gi, '' )
                        .replace( /<font.*?$/gi, '' );
                } else {
                    return str;
                }
            }

            function successCb( data ) {
                me.curPage.html( mTpl( tpl, data ) );
                me.curPage.show();

                $.trigger( window, 'afterRender', [ {
                    curPage: me.module.id
                } ] );

                $.trigger( me, 'afterRender' );
            }

            Log.send( {
                page_id: 'travel_detail',
                write_type: 'detail_' + id
            } );
        },

        _initJourney: function() {
            var me = this;
            new slide( {
                el: 'journey'
            } );
        },

        _initComment: function() {
            var me = this,
                sid = JSP.userInfo.sid,
                id = this.getHashParaValue( 'id' ) || 235,
                jsonpUrl = 'http://infoapp.3g.qq.com/g/s?callback=?&';

            var ajaxParaObj = {
                aid: 'cmt_touch_api',
                pn: 1,
                dt: 'cmtLst',
                cmtType: 0,
                cmtId: id,
                pkuName: 'travel',
                sid: sid
            };

            $.jsonP( {
                url: jsonpUrl + $.param( ajaxParaObj ),
                success: function( data ) {
                    $( '#detail-cmt-list' ).html( mTpl( cmtTpl, data ) );
                }
            } );
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
