define( 'order', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'infiniteScrollPage', 'dialog', 'JSP', 'G', 'login', 'log'
], function ( $, PM, Data, mTpl, Tips, Isp, Dlg, JSP, G, Login, Log ) {
    var tpl = [
        '<% var data = line_detail.data; %>',
        '<header class="header">',
            '<h1 class="title">预订</h1>',
            '<a href="javascript:;" class="ileft btn_back"></a>',
        '</header>',
        '<div class="content">',
            '<div class="focus_area" style="visibility:visible">',
                '<ul class="list_imgs">',
                    '<li>',
                        '<a href="javascript:;" class="u-img"><img src="<%= data.image %>" alt="<%= data.title %>" class="img"></a>',
                        '<span class="price">',
                            '<strong><i>￥</i><%= data.priceLow %><em>起</em></strong>',
                            '<strike><i>￥</i><%= data.priceMarket %></strike>',
                        '</span>',
                    '</li>',
                '</ul>',
            '</div>',
            '<div class="focus_desc">',
                '<h2><%= data.title %></h2>',
                '<p><%= data.subTitle %></p>',
            '</div>',
            '<div class="order_area">',
                '<section class="itra_bd">',
                    '<div class="tit_desc tit_desc_v1">',
                        '<h2>我要预订</h2>',
                    '</div>',
                    '<div class="fm_order">',
                        '<ul>',
                            '<li>',
                                '<label>产品号</label>',
                                '<div class="input_box"><input style="color:#333;" type="text" id="product-num" class="input_txt" disabled="true" value="<%= data.productId %>" ></div>',
                            '</li>',
                            '<li>',
                                '<label>昵称</label>',
                                '<div class="input_box"><input style="color:#333;" type="text" id="nickname" class="input_txt" disabled="true"></div>',
                            '</li>',
                            '<li>',
                                '<label>手机</label>',
                                '<div class="input_box"><input type="tel" id="phone-num" class="input_txt" value="" ></div>',
                            '</li>',
                        '</ul>',
                        '<button class="btn_submit" id="order-submit-btn">提交信息</button>',
                    '</div>',
                '</section>',
                '<section class="itra_bd">',
                    '<div class="tit_desc order-tit-desc">',
                        '<h2>免责申明</h2>',
                    '</div>',
                    '<div class="desc">  ',
                        '<p style="padding-bottom:18px;">美游提醒您：在使用腾讯美游前，请您务必仔细阅读并透彻理解本声明。您可以主动取消或停止使用美游提供的服务，如果您使用美游服务，您的使用行为将被视为对本声明全部内容的认可。</p>',
                        '<p>美游是互联网的新生力量，作为一家互联网信息服务提供商，美游将有资质的酒店、航空公司、机票或酒店代理机构、旅行社等旅游服务商提供的旅游服务信息汇集于互联网平台、供您搜索与浏览，在美游合作供应商页面预定或将您带往相关旅游服务提供商网站，但美游不提供相应的旅游产品服务。<a href="#article/id=100" style="color:#333;">【查看详细】</a></p>',
                    '</div>',
                '</section>',
                '<a class="btn_lk" href="<%= data.url %>" style="display:none;">直接访问详情页</a>',
            '</div>',
        '</div>',
    ].join( '' );

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'order'
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

            //页面渲染完后事件监听
            $.bind( this, 'afterRender', function() {
                if ( JSP.userInfo.nick ) {
                    $( '#nickname' ).val( JSP.userInfo.nick );
                }
            } );

            //提交订单信息
            this.wrapper.delegate( '#order-submit-btn', 'touchend', $.proxy( this._submitOrder, this ) );

            //点击更换验证码
            this.wrapper.delegate( '#auth-code-img', 'touchend', $.proxy( this._ajaxAuthCode, this ) );
        },

        _submitOrder: function() {
            var me = this,
                trim = this.trim,
                sid = JSP.userInfo.sid,
                id = this.getHashParaValue( 'id' ) || 253;

                ajaxData = {
                    id: id,
                    nickname: decodeURIComponent( trim( $( '#nickname' ).val() ) ),
                    mobile: trim( $( '#phone-num' ).val() )
                };

            if ( this._validate( ajaxData ) ) {
                //提交表单
                $.ajax( {
                    url: pathInfo.dataPath + 'sid=' + sid + '&action=reservation',
                    data: ajaxData,
                    type: 'post',
                    success: function( data ) {
                        var data = JSON.parse( data );
                        if ( data.code == 0 ) {
                            Tips.show( '信息提交成功' );
                            Log.send( {
                                page_id: 'travel_rese_submit'
                            } );

                            setTimeout( function() {
                                location.href = Data.get( 'detailList' )[ id ].line_detail.data.url;
                            }, 1000 );
                        }
                    },
                    error: function() {
                        Tips.show( '提交失败，请重试' );
                    }
                } );
            }

        },

        _validate: function( ajaxData ) {
            var me = this;

            if ( !JSP.userInfo.isLogin ) {
                Login.login( function( user ) {
                    $( '#nickname' ).val( user.nick );
                    me._submitOrder();
                } );

                return false;
            }

            if ( ajaxData.nickname.length > 100 ) {
                Tips.show( '提交失败，昵称长度大于100个字符' );
                return false;
            }

            if ( !ajaxData.nickname ) {
                Tips.show( '昵称不能为空' );
                return false;
            }

            if ( !/^1[3|4|5|7|8](\d){9}/g.test( ajaxData.mobile ) ) {
                Tips.show( '提交失败，填写的手机号格式不对' );
                return false;
            }

            return true;
        },

        trim: function( str ) {
            return str.replace( /(^\s*)|(\s*$)/g, '' );
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
                            dataPush = {};
                            
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
                page_id: 'travel_rese'
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
} );
