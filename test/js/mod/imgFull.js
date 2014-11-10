define( 'imgFull', [ 'jqmobi', 'swipe' ], function ( $, swipe ) {
    var tpl = [
        '<div id="img-full-wrap" class="img-full-wrap">',
            '<div id="bigpic-head" class="top-bar">',
                '<a class="back" id="pic-return">返回</a>',
            '</div>',
            '<div class="img-view" id="img_view">',
                '<ul id="imgview" class="img-view-list">',

                '</ul>',
            '</div>',
            '<div id="bigpic-deswrap" class="img-des-wrap">',
                '<span class="pic-total"><em id="nowpicid"></em>/<span id="totalpic"></span></span>',
                '<span id="img_title" jqmoldstyle="inline"></span>',
                '<p id="bigpic-desc" class="img-desc"></p>',
            '</div>',
        '</div>'
    ].join( '' );

    var imgFull = {
        init: function( data ) {
            var me = this;
            this.imgData = [];
            this._dispose();

            this._setData( data, function() {
                me._createImgFullDom();
                me._initEvent();
            } );
        },

        _setData: function( data, cb ) {
            var me = this;
            
            for ( var i = 0, len = data.length; i < len; i++ ) {
                var item = data[ i ],
                    loadIdx = 0,
                    img = new Image();

                img.src = item.cover;
                img.index = i;
                img.placeNames = item.placeNames;

                img.onload = function() {
                    loadIdx++;

                    me.imgData.push( {
                        imgUrl: this.src,
                        title: this.placeNames,
                        width: this.width,
                        height: this.height,
                        index: this.index
                    } );

                    img = null;

                    if ( loadIdx == len ) {
                        //无法保证Load顺序，为了保证查看大图时与小图一致，按照原顺序重新排序
                        me.imgData.sort( function( objA, objB ) {
                            return objA.index - objB.index;
                        } );

                        cb && cb();
                    }
                }
            }
        },

        _createImgFullDom: function( event ) {
            this.status = 'hide';
            this.otherInfoDisplay = 'show';

            this.el = $( '#img-full-wrap' );

            if ( !this.el.length ) {
                var win = $( window );

                $( document.body ).append( tpl );
                this.el = $( '#img-full-wrap' );
            }

            this._setElPos();

            //防止默认情况下执行动画效果
            this.el.css( {
                'webkitTransitionDuration': '0ms',
                'webkitTransform': 'translate3d(' + this.cliW + ', 0, 0 )'
            } );

            this._createImgList();
        },

        _createImgList: function() {
            var me = this,
                data = this.imgData,
                win = $( window ),
                cliRadio = win.height() / win.width(),
                temp = '';

            for ( var i = 0, len = data.length; i < len; i++ ) {
                var item = data[ i ];
                if ( item.height / item.width > cliRadio ) {
                    temp += '<li><img src="' + item.imgUrl + '" height="100%" />';
                } else {
                    temp += '<li><img src="' + item.imgUrl + '" width="100%" />';
                }
            }

            $( '#imgview' ).html( temp );

            this.imgList = $( '#imgview>li' );
        },

        _setOtherInfo: function( idx ) {
            var data = this.imgData,
                idx = parseInt( idx, 10 ),
                index = idx + 1;

            $( '#totalpic' ).html( data.length );
            $( '#nowpicid' ).html( index );
            $( '#img_title' ).html( 'DAY ' + index + '：' + data[ idx ][ 'title' ] );
        },

        _initEvent: function() {
            var me = this;
            this._tempSetPos = $.proxy( this._setElPos, this );

            $( '#pic-return' ).on( 'click', $.proxy( this.hide, this ) );
            $( '#img_view' ).on( 'click', $.proxy( this._switchOntherInfo, this ) );

            $( window ).on( 'resize', this._tempSetPos );
            $( window ).on( 'orientationchange', this._tempSetPos );
        },

        _setElPos: function() {
            var me = this,
                data = this.imgData,
                win = $( window ),
                imgList = $( '#imgview' ).find( 'li' ),
                cliRadio = win.height() / win.width();

            this.cliW = win.width() + 'px';
            this.cliH = win.height() + 2 + 'px';

            this.el.css( {
                width: this.cliW,
                height: this.cliH
            } );

            if ( this.status == 'hide' ) {
                this.el.css( 'webkitTransform', 'translate3d(' + this.cliW + ', 0, 0 )' );
            }

            if ( imgList.length ) {
                imgList.each( function( idx, el ) {
                    var item = $( this ),
                        itemData = data[ idx ],
                        curImg = item.find( 'img' );

                    curImg.removeAttr( 'width' );
                    curImg.removeAttr( 'height' );

                    if ( itemData.height / itemData.width > cliRadio ) {
                        curImg.attr( 'height', '100%' );
                    } else {
                        curImg.attr( 'width', '100%' );
                    }
                } );
            }
        },

        show: function( event ) {
            var me = this,
                idx = parseInt( $( event.target ).data( 'idx' ), 10 );

            this.status = 'show';

            if ( !this.swipeIns ) {
                this.swipeIns = new swipe( document.getElementById( 'img_view' ), {
                    startSlide: idx,
                    callback: function( index, elem ) {
                        me._setOtherInfo( index );
                    },
                    transitionEnd: function( index, elem ) {}
                } );
            } else {
                this.swipeIns.slide( idx, 1 );
            }

            this._setOtherInfo( idx );
            
            this.el.css( {
                webkitTransitionDuration: '200ms',
                webkitTransform: 'translate3d( 0, 0, 0 )'
            } );

            $.trigger( this, 'afterShow' );
            $( document.body ).css( 'overflowY', 'hidden' );
        },

        hide: function() {
            this.status = 'hide';

            this.el.css( {
                webkitTransform: 'translate3d(' + this.cliW + ', 0, 0 )'
            } );

            $( document.body ).css( 'overflowY', 'auto' );
        },

        _switchOntherInfo: function( event ) {
            var bigpicHead = $( '#bigpic-head' ),
                bigpicDeswrap = $( '#bigpic-deswrap' );

            if ( this.otherInfoDisplay == 'show' ) {
                this.otherInfoDisplay = 'hide';
                bigpicHead.css( 'top', '-42px' );
                bigpicDeswrap.css( 'bottom', '-42px' );
            } else {
                this.otherInfoDisplay = 'show';
                bigpicHead.css( 'top', 0 );
                bigpicDeswrap.css( 'bottom', 0 );
            }
        },

        _dispose: function() {
            if ( this.el ) {
                $( '#img-full-wrap' ).remove();
                this.swipeIns = null;

                $( window ).unbind( 'resize', this._tempSetPos );
                $( window ).unbind( 'orientationchange', this._tempSetPos );
            }
        }
    };

    return imgFull;
} );

