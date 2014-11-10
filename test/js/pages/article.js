define( 'article', [ 
    'jqmobi', 'pm', 'data', 'mTpl', 'mTips', 'infiniteScrollPage', 'dialog', 'JSP', 'G', 'log'
], function ( $, PM, Data, mTpl, Tips, Isp, Dlg, JSP, G, Log ) {
    var tpl = {
        '100': [
            '<header class="header">',
                '<h1 class="title">免责声明</h1>',
                '<a href="javascript:;" class="ileft btn_back"></a>',
            '</header>',
            '<div class="content">',
                '<div class="pact_area">',
                    '<p>美游提醒您：在使用腾讯美游前，请您务必仔细阅读并透彻理解本声明。您可以主动取消或停止使用美游提供的服务，但如果您使用美游服务，您的使用行为将被视为对本声明全部内容的认可。</p>',
        　　        '<p>美游是互联网的新生力量，作为一家互联网信息服务提供商，美游将有资质的酒店、航空公司、机票或酒店代理机构、旅行社等旅游服务商提供的旅游服务信息汇集于互联网平台、供您搜索与浏览，在美游合作供应商页面预定或将您带往相关旅游服务提供商网站，但美游不提供相应的旅游产品服务。</p>',
        　　        '<p>您了解并同意美游网上来自于第三方网站的链接，系由美游根据您的搜索及浏览需求而提供，您可能从该第三方网页上获得资讯及享用服务，美游对其合法性概不负责，亦不承担任何法律责任。美游无法控制交易所涉及的旅游产品和服务的质量、安全或合法性，旅游产品或服务信息的真实性或准确性，以及交易各方履行其在交易协议中各项义务的能力。您应自行谨慎判断确定相关服务及/或信息的真实性、合法性和有效性，并自行承担因此产生的责任与损失，除非美游另有明确规定。若您预订的旅游产品中出现任何瑕疵，您应联系该旅游产品的旅游服务提供商。美游将尽力帮助您获取真实可靠的信息，同时也需要您及时反馈在使用中遇到的问题并对欺诈行为进行举报，以提高美游的网络信息服务质量。</p>',
                    '<p>您完全理解并同意，鉴于美游以非人工检索方式、根据您键入的关键字或点击特定的旅游产品或服务关键字自动生成第三方的网页链接或相关的产品信息描述，例如价格、库存等，上述非人工检索方式，因缓存时间间隔或检索方式非完全智能等原因，有可能造成信息更新不及时或产品服务信息聚合、抽取不精准等瑕疵，您完全理解并豁免上述产品或服务瑕疵给您造成的不便，美游不承担任何责任。</p>',
                    '<p>美游不保证为了向您提供便利而设置的外部链接的准确性和完整性，同时，对于该等外部链接指向的不由美游实际控制的任何网页上的内容，美游不承担任何责任。为方便您的使用，美游基于第三方网站提供的过往价格的可信赖程度而进行的评级、推荐或风险提示仅供您参考，美游不担保该等评级、推荐或风险提示的准确性和完整性，对推荐的网站的内容及服务亦不承担任何责任。</p>',
                    '<p>尽管美游为方便您使用，会根据收到的反馈信息在相关链接下作出提示，但美游无义务审查美游上所列出的搜索结果和链接中所含的旅游产品或服务的信息的真实、准确性，包括不限于机票价格是否包含任何税务信息、机场建设费、保险、政府收费、或行李托运费等机票本身以外的费用，您应根据预定网站的规定和说明自行判断。</p>',
                    '<p>您完全理解并同意，您通过美游购买机票、酒店、旅游度假、装备、火车票等现有旅游产品或服务或此后新的产品和服务，应按照相关网页中展示的说明、规定或政策等履行相关义务，享有相关权利，该等说明、规定或政策等与本服务协议共同构成您和美游的整体协议，您必须严格遵守。</p>',
                    '<p>您了解并理解，任何经由本服务发布的图形、图片或个人言论等，均表示了内容提供者、服务使用者个人的观点、观念和思想，并不代表美游的观点或主张，对于在享受网络服务的过程中可能会接触到令人不快、不适当等内容的，由您个人自行加以判断并承担所有风险，美游不承担任何责任。</p>',
                    '<p>任何网站如果不想被美游收录，应该及时向服务网站或美游反映，否则，美游将视其为可收录网站。</p>',
                '</div>',
            '</div>'
        ].join( '' ),

        '101': [
            '<header class="header">',
                '<h1 class="title">隐私条款</h1>',
                '<a href="javascript:;" class="ileft btn_back"></a>',
            '</header>',
            '<div class="content">',
                '<div class="pact_area">',
                    '<p>美游公司非常重视对您隐私的保护，请您仔细阅读如下声明。当您访问美游网站或使用美游提供的服务前，您需要同意隐私政策中具体解释的收集、使用、公布和以其它形式运用您或您的被代理人的个人信息的政策。如果您不同意隐私政策中的任何内容，请立即停止使用或访问美游网站。</p>',
        　　        '<p>为了给您提供更准确、更有针对性的服务，美游可能会以如下方式，使用您提交的个人信息，但美游会以高度的勤勉义务对待这些信息。</p>',
        　　        '<p>我们从您那里获得的资料</p>',
                    '<p>美游会在您自愿选择服务或提供信息的情况下收集您的个人信息（简称“个人信息”），例如您的姓名、邮件地址、电话号码、订单信息、交易记录及其他身份信息等。我们有可能会保留一些用户的使用习惯信息（旅游相关），用于更好地了解和服务于用户。这些数据将有利于我们开发出更符合用户需求的功能、信息和服务。同时，这些信息将用于显示目标广告。</p>',
        　　        '<p>我们还可能从其他合法来源收到关于您的信息并且将其加入我们的客户信息库。</p>',
        　　        '<p>我们如何使用收集的用户信息</p>',

        　　        '<p>我们利用从所有服务中收集的信息来提供、维护、保护和改进这些服务，同时开发新的服务为您带来更好的用户体验，并提高我们的总体服务品质。经您的许可，我们还会使用此类信息为您提供定制内容，例如向您提供旅游相关产品或服务的预定信息等。</p>',
        　　        '<p>特别授权</p>',
        　　        '<p>您完全理解并不可撤销地、免费地授予美游及其供应商下列权利：</p>',
        　　        '<p>1、允许美游用户登录供应商平台并使用其服务，美游用户在供应商平台的任何行为均需遵守该等平台服务协议的约定、平台公布的规则以及有关正确使用平台服务的说明和操作指引。为了实现上述功能，您同意美游将您在美游的预定信息和数据同步至关联公司或合作公司系统并允许其使用。</p>',
        　　        '<p>2、如您以美游合作供应商用户账号和密码登录美游，为了实现向您提供同等服务的功能，您同意美游将您在美游供应商账号项下的注册信息、交易/支付数据等信息和数据同步至美游系统并进行使用，并且您不会因此追究美游以及美游合作公司及供应商平台的责任。</p>',
        　　        '<p>用户在如下情况下，美游会遵照您的意愿或法律的规定披露您的个人信息，由此引发的问题将由您个人承担：<br/>',
                        '（1）事先获得您的授权；<br/>',
                        '（2）只有透露您的个人资料，才能使美游或其合作商提供您所要求的产品和服务；<br/>',
                        '（3）根据有关的法律法规要求；<br/>',
                        '（4）按照相关政府主管部门的要求；<br/>',
                        '（5）为维护美游的合法权益；<br/>',
                        '（6）您同意让第三方共享资料；<br/>',
                        '（7）我们发现您违反了美游公司服务条款或任何其他产品服务的使用规定。',
                    '</p>',
        　　        '<p>用户对个人信息的控制</p>',
                    '<p>美游相信用户应该对他/她的个人信息拥有绝对的控制权，用户自愿注册个人信息，用户在注册时提供的所有信息，都是基于自愿，用户有权在任何时候拒绝提供这些信息。</p>',
        　　        '<p>合作伙伴</p>',
                    '<p>我们选择有信誉的第三方公司或网站作为我们的合作伙伴为用户提供信息和服务，所有美游网上提供的服务都来自第三方合作伙伴，尽管我们只选择有信誉的公司或网站作为我们的合作伙伴，但是每个合作伙伴都会有与美游不同的隐私条款，一旦您通过点击进入了合作伙伴的网站，美游的隐私条款将不再生效，我们建议您查看该合作伙伴网站的隐私条款，并了解该合作伙伴对于收集、使用、泄露您的个人信息的规定。</p>',
        　　        '<p>关于隐私条款的变更</p>',
                    '<p>本隐私条款自2014年9月1日起生效。美游将根据法律、法规或政策的变更和修改，或美游网站内容的变化和技术的更新，或其他美游认为合理的原因，对本隐私政策进修改并以网站公告、用户通知等合适的形式告知用户，若您不接受修订后的条款的，应立即停止使用本服务，若您继续使用本服务的，视为接受修订后的所有条款。</p>',
                '</div>',
            '</div>'
        ].join( '' ),

        '102': [
            '<header class="header">',
                '<h1 class="title">美游理念</h1>',
                '<a href="javascript:;" class="ileft btn_back"></a>',
            '</header>',
            '<div class="content">',
                '<div class="pact_area">',
                    '<p>美游是手机腾讯网旗下主打精品旅游线路的聚合平台，我们牵手众多战略级小伙伴为消费者提供境内外的高品质旅游线路。我们从旅行攻略出发完成供应商侧的精品旅行线路筛选，最终为您完成省时、省钱、省心的高品质独家旅游产品推荐。</p>',
        　　        '<p>在此基础上，我们不断开拓完善，致力于为您提供更全面可靠的和始终如一的高品质服务。美游相伴，舒心出行。</p>',
                '</div>',
            '</div>'
        ].join( '' )
    };

    var userInfo = JSP.userInfo,
        pathInfo = G.pathInfo;

    var pageRun = {
        module: {
            id: 'article'
        },

        init: function() {
            this._registerPm();
            this._initEvent();
        },

        _registerPm: function() {
            PM.register( this.module );
        },

        _initEvent: function() {
            var me = this,
                module = this.module;

            //首次添加页面时触发
            $.bind( module, 'vpageAdd', function() {
                console.log( 'page add' );
                me.curPage = $( '.virtualPage[page=' + module.id + ']' );
            } );

            //页面初始化事件，只会执行一次
            $.bind( module, 'vpageInit', function() {
                console.log( 'page init' );
            } );

            //进入当前页时事件，不需要最新数据的页面可利用缓存处理
            $.bind( module, 'vpageEnter', function() {
                console.log( 'page enter' );
                me._enterPage();
            } );

            //前进后退时事件，可添加转场动画
            $.bind( module, 'vpageBack', function() {
                console.log( 'page back' );
                me._enterPage();
            } );

            //离开当前页面事件时触发
            $.bind( module, 'vpageLeave', function() {
                console.log( 'page leave' );
                me.curPage.hide();
            } );
        },

        _enterPage: function() {
            var me = this;
            
            me.curPage.show();
            window.scrollTo( 0, 1 );
            me._renderPage();
            Log.send( {
                page_id: 'travel_article'
            } );
        },

        _renderPage: function() {
            var me = this,
                id = this.getHashParaValue( 'id' ) || 100;

            setTimeout( function() {
                me.curPage.html( tpl[ id ] );

                $.trigger( window, 'afterRender', [ {
                    curPage: me.module.id
                } ] );

                $.trigger( me, 'afterRender' );
            }, 100 );
        },

        /** 
         * 获取hash查询字符串对应的值
         * @method getHashParaValue
         * @param para {string} 当前要获取字段名称
         * @private
         */
        getHashParaValue: function( para ) {
            var hash = location.hash.replace( /^#+/, '' ).split( '/' )[ 1 ];
            if ( hash ) {
                var queryArray = hash.split( "&" );
                for ( var i = 0, len = queryArray.length; i < len; i++ ) {
                    var item = queryArray[ i ].split( "=" );
                    if ( item[ 0 ] == para ) {
                        return encodeURIComponent( item[ 1 ] );
                    }
                }
            }
        }
    };

    pageRun.init();
});
