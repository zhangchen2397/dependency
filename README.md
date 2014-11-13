自动生成jsmap表及基础build.conf文件
==========

由于目前模块加载器`core.js`中模块加载方式是通过`key->value`的形式，在开发过程中需要人工单独配置`jsmap`表，包含线上合并文件后的`jsmap`、线下开发的`jsmap`，以及打包配置文件也需要单独编写，整个过程比较繁琐，该工具主要解决以上问题。

##主要功能点

1. 自动生成线上、开发环境的`jsmap`
2. 自动生成基础的`build.conf`打包配置
3. 实时监听项目文件变化，更新`jsmap`
4. 实时监听`build.conf`变化更新`jsmap`

总的来说，不需要单独手动维护`jsmap`表，而且对于大多数项目js打包要求，不需要手动编写`build.conf`配置文件。

##具体使用示例

**a. 安装** 

```
npm install generate-jsmap -g
```

**b. 进入示例项目所有目录**

这里准备了一个demo示例项目，该目录结构和我们项目基本一致

```
git clone https://github.com/zhangchen2397/dependency.git

cd ./dependency/demo
```

进入`demo`目录后，注意此时项目中没有`build.conf`文件，在`index.jsp`文件中，不管是线上还是线下`jsmap`都为空，且前后多我注释，如下：

```javascript

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
```

`jsmap`前后的注释不要删除，是用来自动生成`jsmap`的标记，其余的配置和之前一样写就行。这样后续开发或上线都不需要手动添加`jsmap`了。

**c. 运行命令`gd`**

```
gd [buildConfPath] [jsmapPath]
```

如目录结构和demo示例一致，即`jsmap`所在的`index.jsp`及`build.conf`所在的目录都在项目的根目录下，直接运行`gd`命令即可：

```
//在demo目录下直接运行`gd`命令

gd
```

运行后发现在项目根目录下自动生成了`build.conf`配置文件，合并的基本规则为除`pages`目录下的文件合并为一个包，`pages`下的文件单独打包，线上大部分项目也都是这种合并规则，这种情况下，所有的开发过程无需关心`build.conf`及`jsmap`了。

如项目打包比较复杂，直接修改`build.conf`，`jsmap`会同步自动更新

**d. 更多使用示例**

如`jsmap`不在`index.jsp`中，或`build.conf`不在项目所在目录下，通过`gd`参数也可以单独指定

```
gd ./conf/build.conf ./mt_config.jsp
```

当`build.conf`有修改或有增加删除js文件时，终端实时提示生成jsmap是否成功或失败，如：

![demo]( http://zhangchen2397.github.io/dependency/doc/demo.png "demo" )

注：路径均相对于运行当前命令所在目录。

##更多todo list (YY)

这个需要组内一起讨论，如此前会上所讨论的，将公共模块放在svn独立的`common`路径下，和项目开发路径平级存放，如下：

```html
project
    ├── common .......................  通用模块目录结构
    |     ├── base .................... MT基础库
    |     |     ├── core
    |     |     ├── pm
    |     |     └── storeinc
    |     ├── lib ..................... 底层库
    |     |     ├── zepto
    |     |     ├── fastclick
    |     |     └── iscroll
    |     ├── vendor .................. 第三方开源组件
    |     |     ├── swipe
    |     |     ├── flipsnap
    |     |     └── tab
    |     └── mod ..................... 手腾独立开发组件
    |           ├── comment
    |           ├── dialog
    |           └── tips
    |       
    ├── travel ......................... 旅游项目目录结构
    |     ├── js
    |     |     ├── mod ................ 当前项目通用模块
    |     |     |    ├── fullimg
    |     |     |    ├── lazyload
    |     |     |    └── more
    |     |     └── page ............... 页面级运行时文件
    |     |          ├── home
    |     |          ├── list
    |     |          └── more
    |     ├── index.jsp
    |     └── build.conf
    |
    └── movie
```

有了以上这种规范的目录结构后，借助模块加载器可以非常方便的分析依赖，而且在引用一个通用组件时，不需要关注它所依赖的其他组件，直接引用即可，也无需通过`svn external`将通用模块外链到当前项目中来，如：

```javascript
define( 'page/home', [ 
    'common:lib/zepto',  //引入common模块下的 lib/zepto
    'common:mod/tips',   //引入common模块下的 mod/tips
    'mod/lazyload'       //引入当前模块下的 mod/lazyload
], function( $, tips, lazyload ) {
    console.log( $ );
    console.log( tips );
    console.log( lazyload );
} );
```

以上仅是个人意见和想法，具体还需要组内一起讨论。

