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
npm install generate-jsmap
```

**b. 进入示例项目所有目录**

这里准备了一个demo示例项目，该目录结构和我们项目基本一致

```
svn co http://svn.tencent.com/gd.svn/demo

cd ./demo
```

进入`demo`目录后，注意此时项目中没有`build.conf`文件，在index.jsp文件中，不管是线上还是线下jsmap都为空，且前后多我注释，如下：

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

`jsmap`前后的注释不要删除，是用来自动生成jsmap的标记，其余的配置和之前一样写就行。这样后续开发或上线都不需要手动添加`jsmap`了。

**运行**

如目录结构和demo示例一致，即`jsmap`及`build.conf`所在的目录都在项目的根目录下，直接运行`gd`命令即可：

```
gd
```




