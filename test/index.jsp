<% if (!isTest) { %>
    <script type="text/javascript" id="file_config">
        var g_config = {
            //onlineJsmapStart
jsmap: {
    "jqmobi": "/base.js",
    "pm_v2": "/base.js",
    "iScroll": "/base.js",
    "data": "/base.js",
    "footer": "/base.js",
    "login": "/base.js",
    "mTpl": "/base.js",
    "mTips": "/base.js",
    "addressBar": "/base.js",
    "infiniteScrollPage": "/base.js",
    "swipe": "/pages/home.js",
    "dialog": "/base.js",
    "util": "/base.js",
    "app_comment": "/base.js",
    "log": "/base.js",
    "imgFull": "/base.js",
    "slide": "/base.js",
    "init": "/base.js",
    "toolbar": "/plugin/toolbar.js",
    "lightapp": "/pages/home.js",
    "swipe_1": "/pages/bigimg.js",
    "about": "/pages/about.js",
    "article": "/pages/article.js",
    "comment": "/pages/comment.js",
    "detail": "/pages/detail.js",
    "groupInfo": "/pages/groupInfo.js",
    "home": "/pages/home.js",
    "list": "/pages/list.js",
    "order": "/pages/order.js",
    "raidersList": "/pages/raidersList.js",
    "todaySpecials": "/pages/todaySpecials.js"
},
//onlineJsmapEnd
            testEnv: false,
            staticPath: '/infocdn/wap30/info_app/travel',
            serverDomain: 'http://infocdn.3g.qq.com/g/storeinc',
            buildType: 'project',
            ver: '<%=jspVer%>',
            storeInc: {
                'store': true,
                'inc': true,
                'debug': false
            }
        };
    </script>
<% } else { %>
    <script>
        var g_config = {
            //envJsmapStart
jsmap: {
    "init": "/pages/init.js",
    "addressBar": "/pages/addressBar.js",
    "app_comment": "/pages/app_comment.js",
    "core": "/pages/core.js",
    "data": "/pages/data.js",
    "dialog": "/pages/dialog.js",
    "footer": "/pages/footer.js",
    "imgFull": "/pages/imgFull.js",
    "infiniteScrollPage": "/pages/infiniteScrollPage.js",
    "iScroll": "/pages/iScroll.js",
    "jqmobi": "/pages/jqmobi.js",
    "log": "/pages/log.js",
    "login": "/pages/login.js",
    "mTips": "/pages/mTips.js",
    "mTpl": "/pages/mTpl.js",
    "pm_v2": "/pages/pm_v2.js",
    "slide": "/pages/slide.js",
    "storeIncLoad": "/pages/storeIncLoad.js",
    "swipe": "/pages/swipe.js",
    "util": "/pages/util.js",
    "about": "/pages/about.js",
    "article": "/pages/article.js",
    "comment": "/pages/comment.js",
    "detail": "/pages/detail.js",
    "groupInfo": "/pages/groupInfo.js",
    "home": "/pages/home.js",
    "list": "/pages/list.js",
    "order": "/pages/order.js",
    "raidersList": "/pages/raidersList.js",
    "todaySpecials": "/pages/todaySpecials.js"
},
//envJsmapEnd
            testEnv: true,
            staticPath: '/infoapp/travel/touch',
            buildType: 'project',
            storeInc: {
                'store': false,
                'inc': false,
                'debug': true
            }
        };
    </script>
<% } %>