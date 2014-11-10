define( 'groupInfo', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'infiniteScrollPage', 'dialog', 'login', 'JSP', 'G', 'log'
], function ( $, PM, Data, mTpl, Tips, Isp, Dlg, Login, JSP, G, Log ) {
    var tpl = [
        '<% var groupData = line_detail.data; %>',
        '<% var curProvider = providers.data[ providerId ]; %>',
        '<% if ( !curProvider ) { %>',
            '<% curProvider = providers.data.record[0]; %>',
        '<% } %>',
        '<header class="header">',
            '<h1 class="title">发团信息</h1>',
            '<a href="javascript:;" class="ileft btn_back"></a>',
        '</header>',
        '<div class="content">',
            '<div class="group_area">',
                '<% for ( var i = 0, len = groupData.groups.length; i < len; i++ ) { %>',
                    '<% var item = groupData.groups[ i ]; %>',
                    '<section class="itra_bd">',
                        '<div class="tb2">',
                            '<table>',
                                '<tr>',
                                    '<th>发团日期</th>',
                                    '<th class="tacen">可购人数</th>',
                                    '<th class="targt">单价</th>',
                                '</tr>',
                                '<tr>',
                                    '<td><%= item.startDate %></td>',
                                    '<td class="tacen"><%= item.remaining %></td>',
                                    '<td class="targt"><%= item.price %></td>',
                                '</tr>',
                            '</table>',
                        '</div>',
                    '</section>',
                '<% } %>',
                '<p class="p_notice">以上信息由<%= curProvider.name %>提供，真实有效。</p>',
            '</div>',
            '<div class="line_area">',
                '<% if ( groupData.servicePhone ) { %>',
                    '<a class="tel-num-btn" href="tel:<%= groupData.servicePhone %>">400专线咨询</a>',
                '<% } else { %>',
                    '<a class="tel-num-btn" href="tel:<%= curProvider.tel %>">400专线咨询</a>',
                '<% } %>',

                '<a id="order-now" href="<%= groupData.url %>">即刻出发</a>',
            '</div>',
        '</div>'
    ].join( '' );

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'groupInfo'
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

            //立即预订
            /*
            this.wrapper.delegate( '#order-now', 'touchend', function( event ) {
                event.preventDefault();
                var url = $( this ).attr( 'href' );

                if ( JSP.userInfo.isLogin ) {
                    location.href = url;
                } else {
                    Login.login( function() {
                        location.href = url;
                    } );
                }
            } );
            */
        },

        _renderPage: function() {
            var me = this,
                sid = JSP.userInfo.sid,
                detailList = Data.get( 'detailList' ) || {},
                id = this.getHashParaValue( 'id' ) || 253;

            this.loadingEl.show();
            window.scrollTo( 0, 1 );

            if ( detailList[ id ] ) {
                successCb( detailList[ id ] );
            } else {
                $.ajax( {
                    url: pathInfo.dataPath + 'sid=' + sid + '&action=line_detail,providers&id=' + id,
                    success: function( data ) {
                        var data = JSON.parse( data ),
                            providerId = data.line_detail.data.providerId || me.getHashParaValue( 'providerId' ) || 1,
                            dataPush = {};
                        
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
                page_id: 'travel_group'
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
