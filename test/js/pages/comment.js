define( 'comment', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'infiniteScrollPage', 'dialog', 'login', 'app_comment', 'JSP', 'G'
], function ( $, PM, Data, mTpl, Tips, Isp, Dlg, Login, app_comment, JSP, G ) {
    var tpl = [
        '<header class="header">',
            '<h1 class="title">评论</h1>',
            '<a href="javascript:;" class="ileft btn_back cmt-back-btn"></a>',
        '</header>',
        '<div id="trval-cmt-container"></div>'
    ].join( '' );

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'comment'
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
                me.curPage.html( tpl );
                me._initComment();
            } );

            //页面初始化事件，只会执行一次
            $.bind( module, 'vpageInit', function() {
                console.log( 'page init' );
            } );

            //进入当前页时事件，不需要最新数据的页面可利用缓存处理
            $.bind( module, 'vpageEnter', function() {
                console.log( 'page enter' );
                me._enterCb();
            } );

            //前进后退时事件，可添加转场动画
            $.bind( module, 'vpageBack', function() {
                console.log( 'page back' );
                me._enterCb();
            } );

            //离开当前页面事件时触发
            $.bind( module, 'vpageLeave', function() {
                console.log( 'page leave' );
                me.curPage.hide();
                $( "#page_comment" ).hide();
                $( "#page_comment" ).removeClass( "active" );
            } );
        },

        _initComment: function() {
            var me = this;

            this.comment = app_comment.create( {
                obj: $( '#trval-cmt-container' ),
                callbacks: {
                    update: me._updateCb
                },
                pkuName: 'travel'
            } );
        },

        _updateCb: function( data ) {
            $( '#comment-countnum' ).text('评论 ' + data.cmtLst.trc);
        },

        _enterCb: function() {
            var me = this,
                comment = this.comment,
                cmtId = this.getHashParams().urlParams.id;

            me.curPage.show();
            window.scrollTo( 0, 1 );

            comment.clean();
            comment.setId(cmtId);
            comment.update();
            $('#infoComment-list').show();

            $("#page_comment").show();
            $("#page_comment").addClass("active");

            $.trigger( window, 'afterRender', [ {
                curPage: me.module.id
            } ] );

            $.trigger( me, 'afterRender' );
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
        },

        url2obj: function( queryStr ) {
            var paramArr = [];
            var paramObj = {};
            var i,
                item,
                decode = decodeURIComponent,
                tmp;
            paramArr = queryStr.split('&');
            i = paramArr.length;
            while (i--) {
                item = paramArr[i];
                tmp = item.split('=');
                paramObj[decode(tmp[0])] = decode(tmp[1]);
            }
            return paramObj;
        },

        getHashParams: function(str) {
            var hash = str ? str : decodeURIComponent(location.hash),
                hashArr = [],
                obj = {};
            hash.replace(/[\.\?\/'"><:;,\[\]\{\}]/ig, '');
            hashArr = hash.split("\/");
            if (hashArr.length > 0) {
                obj["__vpageid"] = hashArr[0].substring(1);
                obj["urlParams"] = (hashArr.length > 1) ? this.url2obj(hashArr[1], true) : {};
            }
            return obj;
        }
    };

    pageRun.init();
});
