<% if (!isTest) { %>
<script type="text/javascript" id="file_config">
    var g_config = {
        jsmap: {
            'jqmobi'                : '/base.js',
            'pm'                    : '/base.js',
            'iScroll'               : '/base.js',
            'data'                  : '/base.js',
            'footer'                : '/base.js',
            'login'                 : '/base.js',
            'mTpl'                  : '/base.js',
            'mTips'                 : '/base.js',
            'addressBar'            : '/base.js',
            'infiniteScrollPage'    : '/base.js',
            'swipe'                 : '/base.js',
            'dialog'                : '/base.js',
            'util'                  : '/base.js',
            'app_comment'           : '/base.js',
            'log'                   : '/base.js',
            'imgFull'               : '/base.js',
            'slide'                 : '/base.js',
            'init'                  : '/base.js',

            'home'                  : '/pages/home.js',
            'detail'                : '/pages/detail.js',
            'list'                  : '/pages/list.js',
            'groupInfo'             : '/pages/groupInfo.js',
            'order'                 : '/pages/order.js',
            'comment'               : '/pages/comment.js',
            'raidersList'           : '/pages/raidersList.js',
            'todaySpecials'         : '/pages/todaySpecials.js',
            'about'                 : '/pages/about.js',
            'article'               : '/pages/article.js'
        },
        testEnv     : false,
        staticPath  : '/infocdn/wap30/info_app/travel',
        serverDomain: 'http://infocdn.3g.qq.com/g/storeinc',
        buildType   : 'project',
        ver         : '<%=jspVer%>',
        storeInc    : { 'store':true, 'inc':true, 'debug':false }
    };
</script>
<% } else { %>
<script>
    var g_config = {
        jsmap: {
            'jqmobi'                : '/js/mod/jqmobi.js',
            'pm'                    : '/js/mod/pm_v2.js',
            'iScroll'               : '/js/mod/iScroll.js',
            'data'                  : '/js/mod/data.js',
            'footer'                : '/js/mod/footer.js',
            'login'                 : '/js/mod/login.js',
            'mTpl'                  : '/js/mod/mTpl.js',
            'mTips'                 : '/js/mod/mTips.js',
            'addressBar'            : '/js/mod/addressBar.js',
            'infiniteScrollPage'    : '/js/mod/infiniteScrollPage.js',
            'swipe'                 : '/js/mod/swipe.js',
            'dialog'                : '/js/mod/dialog.js',
            'util'                  : '/js/mod/util.js',
            'app_comment'           : '/js/mod/app_comment.js',
            'log'                   : '/js/mod/log.js',
            'imgFull'               : '/js/mod/imgFull.js',
            'slide'                 : '/js/mod/slide.js',
            'init'                  : '/init.js',
            
            'home'                  : '/js/pages/home.js',
            'detail'                : '/js/pages/detail.js',
            'list'                  : '/js/pages/list.js',
            'groupInfo'             : '/js/pages/groupInfo.js',
            'order'                 : '/js/pages/order.js',
            'comment'               : '/js/pages/comment.js',
            'raidersList'           : '/js/pages/raidersList.js',
            'todaySpecials'         : '/js/pages/todaySpecials.js',
            'about'                 : '/js/pages/about.js',
            'article'               : '/js/pages/article.js'
        },
        testEnv     : true,
        staticPath  : '/infoapp/travel/touch',
        buildType   : 'project',
        storeInc    : { 'store':false, 'inc':false, 'debug':true }
    };
</script>
<% } %>