自动生成jsmap表及基础build.conf文件
==========

由于目前模块加载器`core.js`中模块加载方式是通过`key->value`的形式，在开发过程中需要人工单独配置`jsmap`表，包含线上合并文件后的`jsmap`、线下开发的`jsmap`，以及打包配置文件也需要单独编写，整个过程比较繁琐，该工具主要解决以上问题。

##主要功能点

1. 自动生成线上、开发环境的`jsmap`
2. 自动生成基础的`build.conf`打包配置
3. 实时监听项目文件变化，更新`jsmap`
4. 实时监听`build.conf`变化更新`jsmap`

总的来说，不需要单独手动维护`jsmap`表，而且对于大多数项目js打包要求，不需要手动编写`build.conf`配置文件。

##具体使用

a. **部署代码** 

```
//将gd代码部署到E:/project/gd目录下
svn co https://svn.tencent.com/commons/gd.svn gd
```

b. **进入项目所在目录**

```
//如travel项目所有目录为：E:/project/travel

cd ./project/travel
```

整体的目录结构为：




