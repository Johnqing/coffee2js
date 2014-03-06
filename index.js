var path = require('path');
var exec = require('child_process').exec
var fTools = require('filetools');

var coffee = path.resolve('./node_modules/.bin/coffee.cmd');

var CoffeeCompile = function(opts, onend){
	this.public_dir = opts.public_dir;
	this.coffee_dir = opts.coffee_dir;
	this.js_root = opts.js_root;
	this.encode = opts.encode;
	this.onEnd = onend;

	this.cache = {};
	this.total = 0;
	this.list = null;

	this.init()
}

CoffeeCompile.prototype = {
	init: function(){
		var that = this;
		fTools.walk(that.public_dir + that.coffee_dir, function(files){
			that.list = files;
			that.total = files.length;
			files.forEach(function(file){
				that.build.call(that, file);
			});
		});
	},
	build: function(file){
		var that = this;
		file = path.dirname(file);
		if(!that.cache[file]){
			that.cache[file] = 1;
			var jsRoot = file.replace(/\\/gi, '/').replace(that.coffee_dir, that.js_root);
			jsRoot = path.normalize(jsRoot);

			file = path.resolve(file);
			jsRoot = path.resolve(jsRoot);
			that.toJs(file, jsRoot);

			return;
		}
		that.total--;

	},
	toJs: function(input, output){
		var that = this,
			cmd = coffee + ' --compile --output '+output+'/ ' + input+'/';
		exec(cmd, {encoding: that.encode}, function(error){
			if(error != null){
				console.log(error);
				return
			}
			that.total--;
			if(!that.total){
				that.onEnd(that.list);
			}
		})
	}
}

var TIMES;
/**
 * 计时
 */
function onStart(){
	TIMES = +new Date;
	console.log('>>Start build');
}

function onEnd(list){
	var timeUse = +new Date - TIMES;
	console.log('编译文件列表:\n', list);
	console.log('>>All done: Time use:', timeUse/1000, '秒');
}

var defConf = {
	public_dir:'./src/www/front/resource/',
	coffee_dir: 'other/coffee',
	js_root: 'js',
	encode: 'utf-8'
}
/**
 * 开始执行
 */
exports.coffee2js = function(conf){
	defConf = fTools.mix(defConf, conf);
    onStart();
	new CoffeeCompile(defConf, onEnd);
}