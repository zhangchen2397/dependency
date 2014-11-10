define( 'log', [ 'jqmobi', 'JSP', 'G' ], function ( $, JSP, G ) {
    var hasSend = false;

    function getUrlParaValue( para ) {
        var url = location.href,
            query = url.split( '?' )[ 1 ];

        if ( query ) {
            query = query.replace( /#.*/gi, '' )
        }

        if ( query ) {
            var queryArray = query.split( "&" );
            for ( var i = 0, len = queryArray.length; i < len; i++ ) {
                var item = queryArray[ i ].split( "=" );
                if ( item[ 0 ] == para ) {
                    return encodeURIComponent( item[ 1 ] );
                }
            }
        }
    }

    var send = function( paraObj ) {
        var sid = JSP.userInfo.sid,
            dataPath = G.pathInfo.dataPath,
            logPara = JSP.logPara,
            paraIf = getUrlParaValue( 'i_f' );

        paraObj = $.extend( {}, paraObj, {
            sid: sid,
            action: 'print_pv'
        } );


        //站内
        if ( logPara ) {
            if ( !logPara.hasSend ) {
                paraObj.i_f = logPara.para;
                JSP.logPara.hasSend = true;
            } else {
                paraObj.i_f && delete paraObj.i_f;
            }
        } else {
            //通过url
            if ( paraIf && !hasSend ) {
                paraObj.i_f = paraIf;
                hasSend = true;
            } else {
                paraObj.i_f && delete paraObj.i_f;
            }
        }

        setTimeout( function() {
            $.ajax( {
                url: dataPath.substr( 0, dataPath.length - 1 ),
                data: paraObj,
                success: function() {}
            } );
        }, 100 );

    };

    return {
        send: send
    }
} );
