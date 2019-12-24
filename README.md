# vue-form-making-more


## 简介

基于 [vue-form-making](https://github.com/GavinZhulei/vue-form-making/)的基础版做了些功能拓展，同时修复基础版中的一些 BUG，优化了部分逻辑及代码格式，并新增大量注释；

更符合实际项目的动态表单生成需求

> 关于 vue-form-making:

> 基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element) 实现的表单设计器，使用了最新的前端技术栈，内置了 i18n 国际化解决方案，可以让表单开发简单而高效。

> - [使用文档](http://docs.form.xiaoyaoji.cn)

## 特性

> 带 new 为新增/优化内容

* 提供自定义组件组，快速搭建表单页（new）
* 支持自定义组件组的保存及拉取（new）
* 提供远程 API 配置，可以设置通过 API 获取表单数据（new）
* 支持表单联动，API 模式下可以根据其他表单联动更新数据（new）
* 可视化配置页面
* 提供栅格布局，并采用flex实现对齐
* 一键预览配置的效果
* 一键生成配置json数据
* 一键生成代码，立即可运行
* 提供自定义组件满足用户自定义需求
* 提供远端数据接口，方便用户需要异步获取数据加载
* 提供功能强大的高级组件
* 支持表单验证
* 快速获取表单数据

## 组件

- MakingForm 表单设计器（基于可视化操作快速设计出表单页面，并获取到表单配置 json 数据）。

- GenerateForm 表单生成器（根据设计器中获取的配置 json 数据，快速渲染出表单页面）。

## 开源协议

[LGPL](https://opensource.org/licenses/LGPL-3.0)

您可以将 vue-form-making 源码用于 LGPL 协议的开源项目中，并保留版权信息。

## 商业许可

商业许可遵循 vue-form-making ，请联系原作者

如果要将 vue-form-making 源码使用在非开源站点，项目和应用程序中，为保障您的合法权益，需购买[商业授权](http://form.xiaoyaoji.cn/pricing)。