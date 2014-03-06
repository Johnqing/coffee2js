编译coffee，然后整理js
=====================

## 安装

```
npm install coffee2js
```

## 使用

```
var c2j = require('coffee2js');

c2j.coffee2js(opts);
```

## 可传入参数

```
{
	public_dir:'./src/www/front/resource/',
	coffee_dir: 'other/coffee',
	js_root: 'js',
	encode: 'utf-8'
}

```