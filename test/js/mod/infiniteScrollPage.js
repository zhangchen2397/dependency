/**
 * 无限下拉分页组件
 * 自定义最大自动加载页
 * 当达到最大自动加载页时，手动点击加载更多
 * 请求数据失败时自动尝试3次重新请求
 * @author samczhang@tencent.com
 * --------------------------------------
 *
 * 基本html结构，为了方便定义UI，所有id及class均可自定义
 *   <div id="container">
 *       <div class="con-list-wrap"></div>
 *       <div class="auto-loading">加载中...</div>
 *       <div class="click-loading">点击加载更多</div>
 *   </div>
 *--------------------------------------------------------
 *
 * 对外调用接口及自定义事件
 * @method ajaxData 请求数据接口
 * @customEvent ajaxSuccess 请求数据成功时派发事件
 * @customEvent ajasError 请求数据失败时派发事件
 * @customEvent ajasFinalError 尝试3次重新请求后依然失败事件
 *
 */

define( 'infiniteScrollPage', [ 'jqmobi' ], function( $ ) {
    var infiniteScrollPage = function( config ) {
        this.defaultConfig = {
            /**
             * el {string|jq object} 外层容器，可为字符串或jq对象
             * conListWrap {string} 内容列表元素class
             * autoLoading {string} 自动加载元素class
             * clickLoading {string} 手动点击加载元素class
             */
            el: '#container',
            conListWrap: '.con-list-wrap',
            autoLoading: '.auto-loading',
            clickLoading: '.click-loading',

            /**
             * ajaxUrl {string} 请求URL，不需要带分页参数
             * pagePara {string} 分页参数名称，具体页数内部自动处理
             */
            ajaxUrl: './api.json',
            pagePara: 'pn',

            /**
             * isAutoAjaxData {string} 初始化时是否自动加载数据
             */
            isAutoAjaxData: true,

            /**
             * maxAutoPage {number} 最大自动加载页数
             *  - 当当前页数超过maxAutoPage时，显示手动加载更多按钮
             *  - 当maxAutoPage为0时，不自动加载分页，显示手动加载更多
             * offsetHeight {number} 自动加载时机，离页底像素距离
             */
            maxAutoPage: 5,
            offsetHeight: 60,

            /**
             * ajax请求参数配置，其它参数按默认值
             * timeout {number}  请求超时时间
             * dataType {string} 请求类型
             *  - 默认值为text/html，为普通的ajax请求，后端返回json格式数据
             *  - 当dataType为jsonp时，为jsonp请求
             */
            timeout: 3000,
            dataType: 'text/html',

            /**
             * dataType {object} 指定将自定义scroll事件绑定在当前事件上
             * 如curMod不为空，则scroll事件绑定在全局scroll事件上
             */
            curMod: null
        };

        this.config = $.extend( this.defaultConfig, config || {} );
        this.el = ( typeof this.config.el === 'string' ) ? $( this.config.el ) : this.config.el;

        this.init.call( this );
    };

    $.extend( infiniteScrollPage.prototype, {
        init: function() {
            /**
             * canAutoAjaxData 用于请求中加锁，上一请求未结束不用进行下一请求
             * curPage 当前页
             * reTryNum 请求失败时重试次数
             */
            this.canAutoAjaxData = true;
            this.curPage = 1;
            this.reTryNum = 0;

            this._cacheDom();
            this._initEvent();

            //如果初始化时不自动请求数据，则下拉自动分页时curPage+1
            if ( this.config.isAutoAjaxData ) {
                this.ajaxData();
            } else {
                this.curPage++;
            }
        },

        _cacheDom: function() {
            var config = this.config,
                el = this.el;

            this.conListWrap = el.find( config.conListWrap );
            this.autoLoading = el.find( config.autoLoading );
            this.clickLoading = el.find( config.clickLoading );
        },

        _initEvent: function() {
            var me = this,
                config = this.config,
                curMod = config.curMod;

            //将scroll事件缓存，主要为了解除绑定
            this.scrollCb = $.proxy( this._scrollCb, this );

            //延时绑定，防止重复加载
            setTimeout( function() {
                if ( curMod ) {
                    $.bind( curMod, 'scroll', me.scrollCb );
                } else {
                    $( window ).bind( 'scroll', me.scrollCb );
                }
            }, 300 );


            this.clickLoading.bind( 'click', $.proxy( this._clickAjaxData, this ) );
        },

        _clickAjaxData: function() {
            this.autoLoading.show();
            this.clickLoading.hide();
            this.ajaxData();
        },

        _scrollCb: function() {
            var me = this,
                config = this.config;

            //当滚到页面底部且上一请求已结束才会自动请求
            if ( document.body.scrollTop + $( window ).height() > 
                $( 'body' ).height() - config.offsetHeight && me.canAutoAjaxData ) {
                me.canAutoAjaxData = false;

                me.ajaxData();
            }
        },

        ajaxData: function() {
            var config = this.config,
                me = this,
                curMod = config.curMod,
                ajaxUrl = config.ajaxUrl,
                joinSbl = '?';

            if ( config.ajaxUrl.indexOf( '?' ) > -1 ) {
                joinSbl = '&';
            }

            ajaxUrl += joinSbl + config.pagePara + '=' + this.curPage;

            if ( config.dataType == 'jsonp' ) {
                ajaxUrl += '&callback=?';
            }

            $.ajax( {
                url: ajaxUrl,
                timeout: config.timeout,
                dataType: config.dataType,
                success: function( data ) {
                    me.autoLoading.hide();
                    me.clickLoading.hide();
                    
                    me.curPage++;
                    me.reTryNum = 0;

                    $.trigger( me, 'ajaxSuccess', [ {
                        data: data,
                        thisObj: me
                    } ] );
                },
                error: function() {
                    me.reTryNum++;
                    if ( me.reTryNum < 3 ) {
                        me.ajaxData();
                    } else {
                        //重试依然加载失败，给出提示信息手动重新加载
                        $.trigger( me, 'ajaxFinalError' );
                    }

                    $.trigger( me, 'ajaxError' );
                }
            } );
        }
    } );

    return {
        //需要通过new关键字实例出一个infiniteScrollPage
        infiniteScrollPage: infiniteScrollPage,

        //直接通过函数调用，内部处理实例过程
        createInfinteScroll: function( config ) {
            return new infiniteScrollPage( config );
        }
    }

} );

