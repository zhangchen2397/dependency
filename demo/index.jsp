<% if (!isTest) { %>
    <script type="text/javascript" id="file_config">
        var g_config = {
            //onlineJsmapStart
            jsmap: {},
            //onlineJsmapEnd
            testEnv: false,
            staticPath: '/infocdn/wap30/info_app/travel',
            serverDomain: 'http://infocdn.3g.qq.com/g/storeinc',
            buildType: 'project',
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
            jsmap: {},
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
