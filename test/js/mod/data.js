define( 'data', [], function () {
    var tmp = {},
        data = {};

    data.get = function( key ) {
        return tmp[ key ];
    };

    data.set = function( key, val ) {
        if ( "string" == typeof key ) {
            tmp[ key ] = val;
        } else {
            for ( var item in key ) {
                if ( key.hasOwnProperty( item ) ) {
                    tmp[ item ] = key[ item ];
                }
            }
        }
    };

    return data;
} );

