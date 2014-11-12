'use strict';

var fs = require( 'fs' ),
    events = require( 'events' );

var beautify = require( 'js-beautify' ),
    path = require( './path' ),
    watch = require('watch');

var gd = function( config ) {

    this.defaultConf = {
        basePath: './',
        buildConfPath: './build.conf',
        mtConfigPath: './index.jsp',
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
        this.gd();
    },

    gd: function() {
        var time = ( new Date ).toLocaleTimeString();

        this.envJsMap = {};
        this.onlineJsMap = {};

        this._checkBuildConfExist();
        this.setOnlineJsMap();
        this.setEnvJsMap();
        this._writeConfig();

        console.log( time + ' generate dependency success!' );
        console.log( '-------------------------------------' );
    },

    _initEvent: function() {
        var me = this,
            config = this.config;

        watch.watchTree( config.basePath, function ( f, curr, prev ) {
            if ( typeof f == "object" && prev === null && curr === null ) {
                //全部遍历完
                //console.log( 'no change' );
            } else if ( prev === null ) {
                //新增文件或文件夹
                if ( me.filter( f ) ) {
                    console.log( 'add new file: ' + path.basename( f ) );
                    me.gd();
                }
            } else if (curr.nlink === 0) {
                //删除文件或文件夹
                if ( me.filterExtname( path.extname( f ) ) ) {
                    console.log( 'delete file: ' + path.basename( f ) );
                    fs.existsSync( f ) && fs.unlinkSync( f );
                    me.gd();
                }
            } else {
                //更新文件
                if ( /build\.conf/.test( f ) ) {
                    console.log( 'update build.conf' );
                    me.gd();
                }
            }
        } );
    },

    _checkBuildConfExist: function() {
        var me = this,
            config = this.config;

        if ( !fs.existsSync( config.buildConfPath ) ) {
            this._writeBuildConf();
        }
    },

    _writeBuildConf: function() {
        var me = this,
            config = this.config;

        var defaultConf = {
            './release/{pv}/base-{fv}.js': {
                'files': [],
                'fvName': 'base.js'
            },

            'pages': {
                'dir': './js/pages',
                'releaseDir': './release/{pv}/pages/'
            }
        };

        var walk = function( dir ) {
            var dirList = fs.readdirSync( dir );

            dirList.forEach( function( item ) {
                var fullPath = path.join( dir, item );

                if ( fs.statSync( path.join( dir, item ) ).isDirectory()) {
                    walk( fullPath );
                } else if ( me.filterExtname( item ) && !/pages/.test( fullPath ) ) {
                    defaultConf[ './release/{pv}/base-{fv}.js' ][ 'files' ].push( fullPath );
                }
            } );
        };

        walk( config.basePath );

        fs.writeFileSync( config.buildConfPath, beautify( JSON.stringify( defaultConf ) ), {
            encoding: config.charset
        } );
    },

    _writeConfig: function() {
        var me = this,
            config = this.config,
            envJsMap = this.envJsMap,
            onlineJsMap = this.onlineJsMap;

        var configFile = fs.readFileSync( config.mtConfigPath, {
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

        fs.writeFileSync( config.mtConfigPath, newStr, {
            encoding: config.charset
        } );
    },

    setEnvJsMap: function() {
        var me = this,
            config = this.config;

        me._setFilesJsMap( config.basePath, 'envJsMap' );
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

            //针对mod文件夹下的模块
            me._setOnlineModJsMap( item, key );

            //针对pages文件夹下的模块
            if ( key == 'pages' ) {

                //如home.js中有其它模块合并进来的情况
                me._setOnlinePagesJsMap( item );

                //pages文件夹下的文件始终都会作为模块引用
                me._setFilesJsMap( item.dir, 'onlineJsMap' );
            }
        }
    },

    /**
     * 设置打包配置中有files数组的jsmap
     */
    _setOnlineModJsMap: function( modObj, key ) {
        var me = this;

        if ( modObj.files ) {
            var modPath = me._getSr( key, '{pv}', '-{fv}' );

            for ( var i = 0, len = modObj.files.length; i < len; i++ ) {
                var modName = me._getSr( modObj.files[ i ], '/', '.js' );
                me.onlineJsMap[ modName ] = modPath;
            }
        }
    },

    /**
     * 设置打包配置中pages下有pageCombo的jsmap
     */
    _setOnlinePagesJsMap: function( confObj ) {
        var me = this;

        if ( confObj.pageCombo ) {
            var modPath = me._getSr( confObj.releaseDir, '{pv}' );

            for ( var key in confObj.pageCombo ) {
                var item = confObj.pageCombo[ key ];

                item.forEach( function( subItem ) {
                    if ( !/pages/.test( subItem ) ) {
                        var modName = me._getSr( subItem, '/', '.js' );
                        me.onlineJsMap[ modName ] = modPath + key;
                    }
                } );
            }
        }
    },

    /**
     * 根据指定目录下的js文件作为独立一个模块
     * 不涉及到多文件合并
     */
    _setFilesJsMap: function( dir, typeJsMap ) {
        var me = this;

        var walk = function( dir ) {
            var dirList = fs.readdirSync( dir );

            dirList.forEach( function( item ) {
                var fullPath = path.join( dir, item ),
                    jsPath = '/' + path.join( dir, item );

                if ( typeJsMap == 'onlineJsMap' ) {
                    jsPath = '/pages/' + item;
                }

                if ( fs.statSync( path.join( dir, item ) ).isDirectory()) {
                    walk( fullPath );
                } else if ( me.filterExtname( item ) ) {
                    me[ typeJsMap ][ item.replace( /\.js/, '' ) ] = jsPath;
                }
            } );
        };

        walk( dir );
    },

    filterExtname: function( name ) {
        // 支持的后缀名
        var EXTNAME_REG = /\.js$/i;
        return EXTNAME_REG.test( name );
    },

    /**
     * 文件与路径筛选器
     * @param   {String}    文件路径
     * @return  {Boolean}
     */
    filter: function( file ) {
        if ( fs.existsSync( file ) ) {
            var stat = fs.statSync( file );

            if ( stat.isDirectory() ) {
                return false;
            } else {
                return this.filterExtname( path.extname( file ) );
            }
        } else {
            return false;
        }
    },

    /**
     * 获取先通过split分割然后通过replace替换后的字符串
     * replaceStr 可选
     */
    _getSr: function( oriStr, splitStr, replaceStr ) {
        var strArr = oriStr.split( splitStr ),
            modPath = strArr[ strArr.length - 1 ];

        if ( replaceStr ) {
            modPath = modPath.replace( replaceStr, '' )
        }

        return modPath;
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
