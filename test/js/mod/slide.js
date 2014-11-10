/**
 * 移动webapp开发滑动组件
 * 可应用于图片轮播、查看大图翻页、tab切换等使用场景
 * @author zhangchen2397@126.com
 * ----------------------------------------------
 *
 * 对外调用接口及自定义事件
 *
 */

( function( root, factory ) {
    if ( typeof define === 'function' ) {
        define( 'slide', [ 'jqmobi' ], function( $ ) {
            return factory( root, $ );
        } );
    } else {
        root.slide = factory( root, root.$ );
    }
} )( window, function( root, $ ) {

    var slide = function( config ) {
        this.defaultConfig = {
            el: 'slide',
            baseWidth: 320,
            speed: 3000,
            autoPlay: true,
            continuous: true
        };

        this.config = $.extend( this.defaultConfig, config || {} );

        this.init.call( this );
    };

    $.extend( slide.prototype, {
        init: function() {
            this._cache();
            this._setWidth();
            this._initEvent();
        },

        _cache: function() {
            var me = this,
                config = this.config;

            this.el = ( typeof config.el === 'string' ) ? $( '#' + config.el ) : config.el;
            this.itemWrap = this.el.children();
            this.itemList = this.itemWrap.children();
            this.totalLen = this.itemList.length;
            this.curIdx = 1;
        },

        _setWidth: function() {
            var me = this,
                win = $( window ),
                cliWidth = win.width(),
                itemWidth = cliWidth;

            this.baseWidth = cliWidth - 12 * 3;

            this.itemList.each( function( idx, el ) {
                if ( idx == 0 || idx == ( me.totalLen - 1 ) ) {
                    itemWidth = cliWidth - 12 * 3;
                } else {
                    itemWidth = cliWidth - 12 * 4;
                }

                $( this ).css( 'width', itemWidth + 'px' );
            } );
        },

        _initEvent: function() {
            var me = this,
                itemList = this.itemList;

            this.tempEndHander = $.proxy( this._endHandler, this );
            this.tempMoveHander = $.proxy( this._moveHandler, this );

            this.el.on( 'touchstart', $.proxy( this._startHandler, this ) );
        },

        _startHandler: function( event ) {
            var me = this,
                config = this.config,
                el = this.el,
                touches = event.touches[ 0 ];

            me.startTime = +new Date();
            me.curTarget = event.currentTarget;

            me.startX = touches.pageX;
            me.startY = touches.pageY;

            el.on( 'touchmove', this.tempMoveHander );
            el.on( 'touchend', this.tempEndHander );
        },

        _moveHandler: function( event ) {
            var me = this,
                config = this.config,
                el = this.el,
                touches = event.touches[ 0 ];

            this.disableScroll = false;
            this.differX = touches.pageX - this.startX;
            this.differY = touches.pageY - this.startY;

            if ( Math.abs( this.differY ) < Math.abs( this.differX ) ) {
                event.preventDefault();
                this.offsetX = this.differX + this.endX || 0;

                this.itemWrap.css( {
                    webkitTransition: '-webkit-transform 0s',
                    webkitTransform: 'translate3d(' + this.offsetX + 'px, 0, 0 )'
                } );
            } else {
                this.disableScroll = true;
                el.unbind( 'touchmove', this.tempMoveHander );
                el.unbind( 'touchend', this.tempEndHander );
            }
        },

        _endHandler: function( event ) {
            var me = this,
                config = this.config,
                el = this.el;

            if ( !this.disableScroll && Math.abs( this.differX ) > 20 ) {
                //滑动方向
                if ( this.differX > 0 ) {
                    this.curIdx--;
                } else {
                    this.curIdx++;
                }

                //第一张和最后一张临界值
                if ( this.curIdx > this.totalLen ) {
                    this.curIdx = this.totalLen;
                }
                if ( this.curIdx < 1 ) {
                    this.curIdx = 1;
                }

                this.endX = -this.baseWidth * ( this.curIdx - 1 );

                $.trigger( this, 'beforeSwitch', [ {
                    el: me.curTarget,
                    index: this.curIdx
                } ] );

                this.itemWrap.css( {
                    webkitTransition: '-webkit-transform 0.3s',
                    webkitTransform: 'translate3d(' + this.endX + 'px, 0, 0 )'
                } );

                $.trigger( this, 'afterSwitch', [ {
                    el: me.curTarget,
                    index: this.curIdx
                } ] );
            }

            this.differX = 0;
            this.differY = 0;

            el.unbind( 'touchmove', this.tempMoveHander );
            el.unbind( 'touchend', this.tempEndHander );
        }
    } );

    return slide;
} );
