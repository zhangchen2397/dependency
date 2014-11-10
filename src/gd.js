'use strict';

var fs = require( 'fs' ),
    events = require( 'events' );

var beautify = require( 'js-beautify' ),
    path = require( './path' );

var gd = function( config ) {

    this.defaultConf = {
        basePath: './',
        buildConfPath: './build.conf',
        outputPath: './index.jsp',
        charset: 'utf-8'
    };

    //合并配置文件
    this.config = this.extend( this.defaultConf, config || {} );

    this.envJsMap = {};
    this.onlineJsMap = {};

    //初始化事件系统
    events.EventEmitter.call( this );

    //初始化转化组件
    this.init.call( this );
};

gd.prototype = {
    __proto__: events.EventEmitter.prototype,

    init: function() {
        this._initEvent();
        this.setOnlineJsMap();
        this.setEnvJsMap( this.config.basePath );
        this._writeConfig();

    },

    _initEvent: function() {
        var me = this,
            config = this.config;
    },

    _writeConfig: function() {
        var me = this,
            config = this.config,
            envJsMap = this.envJsMap,
            onlineJsMap = this.onlineJsMap;

        var configFile = fs.readFileSync( config.outputPath, {
            encoding: config.charset
        } );

        var onlineJsmapReg = /\/\/onlineJsmapStart([\s\S]+?)\/\/onlineJsmapEnd/g,
            envJsmapReg = /\/\/envJsmapStart([\s\S]+?)\/\/envJsmapEnd/g;

        envJsMap = beautify( JSON.stringify( envJsMap ) );
        onlineJsMap = beautify( JSON.stringify( onlineJsMap ) );

        var newStr = configFile.replace( onlineJsmapReg, 
            '//onlineJsmapStart\n\r' +
                'jsmap: ' + onlineJsMap + ',\n\r' +
            '//onlineJsmapEnd' );

        newStr = newStr.replace( envJsmapReg,
            '//envJsmapStart\n\r' +
                'jsmap: ' + envJsMap + ',\n\r' +
            '//envJsmapEnd' );

        fs.writeFileSync( config.outputPath, newStr, {
            encoding: config.charset
        } );
    },

    setEnvJsMap: function() {
        var me = this,
            config = this.config;

        var walk = function( dir ) {
            var dirList = fs.readdirSync( dir );

            dirList.forEach( function( item ) {
                if ( fs.statSync( path.join( dir, item ) ).isDirectory()) {
                    walk( path.join( dir, item ) );
                } else if ( me.filterExtname( item ) ) {
                    me.envJsMap[ item.replace( /\.js/, '' ) ] = '/' + path.join( dir, item );
                }
            } );
        };

        walk( config.basePath );
    },

    setOnlineJsMap: function() {
        var me = this,
            config = this.config;

        var conf = fs.readFileSync( config.buildConfPath, {
            encoding: config.charset
        } );

        conf = new Function( 'return (' + conf +')' )();

        for ( var key in conf ) {
            var item = conf[ key ];
            if ( item.files ) {
                for ( var i = 0, len = item.files.length; i < len; i++ ) {
                    var subItem = item.files[ i ],
                        subItemArr = subItem.split( '/' ),
                        modName = subItemArr[ subItemArr.length - 1 ].replace( /\.js/, '' );

                    me.onlineJsMap[ modName ] = '/' + item.fvName;
                }
            }

            if ( key == 'pages' ) {
                if ( item.pageCombo ) {

                }

                var walk = function( dir ) {
                    var dirList = fs.readdirSync( dir );

                    dirList.forEach( function( item ) {
                        if ( fs.statSync( path.join( dir, item ) ).isDirectory()) {
                            walk( path.join( dir, item ) );
                        } else if ( me.filterExtname( item ) ) {
                            me.onlineJsMap[ item.replace( /\.js/, '' ) ] = '/pages/' + item;
                        }
                    } );
                };

                walk( item.dir );
            }
        }
    },

    filterExtname: function( name ) {
        // 支持的后缀名
        var EXTNAME_REG = /\.js$/i;
        return EXTNAME_REG.test( name );
    },







    /**
     * 对象合并，返回合并后的对象
     * 支持深度合并
     */
    extend: function( targetObj, configObj ) {
        for ( var key in configObj ) {
            if ( targetObj[ key ] != configObj[ key ] ) {
                if ( typeof configObj[ key ] == 'object' ) {
                    targetObj[ key ] = extend( targetObj[ key ], configObj[ key ] );
                } else {
                    targetObj[ key ] = configObj[  key ]
                }
            }
        }

        return targetObj;
    }
};

module.exports = gd;






