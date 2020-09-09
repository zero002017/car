"use strict";

console.warnCustom = console.warn;
console.warn = function (res) {
    if (typeof res == "string" && res.indexOf("文件路径在真机上可能无法读取") > -1) {
        return;
    }
    console.warnCustom(res)
}
console.groupCustom = console.group;
console.group = function (res) {
    if (typeof res == "string" && res.indexOf("读取文件/文件夹警告") > -1) {
        return;
    }
    console.groupCustom(res)
}

require('adapter-min.js');

__globalAdapter.init();

require('cocos2d-js-min.js');

__globalAdapter.adaptEngine();

let moduleMap = {
	'src/assets/Script/3/jszip.min.js'() { return require('src/assets/Script/3/jszip.min.js') },
	'src/assets/Script/3/pako.min.js'() { return require('src/assets/Script/3/pako.min.js') },
	'assets/internal/index.js'() { return {} },
	'assets/cdn/index.js'() { return {} },
	'assets/resources/index.js'() { return {} },
	'assets/main/index.js'() { return require('assets/main/index.js') }
};

window.__cocos_require__ = function (moduleName) {
	let func = moduleMap[moduleName];
	if (!func) {
		throw new Error(`cannot find module ${moduleName}`);
	}
	return func();
};

require('./src/settings'); // Introduce Cocos Service here


require('./main'); // TODO: move to common
// Adjust devicePixelRatio
window.platformType = "微信小游戏";
window.useZip = true;
window.showCompanyNames = true;
require('utils/ald-game.js');

cc.view._maxPixelRatio = 4;

if (cc.sys.platform !== cc.sys.WECHAT_GAME_SUB) {
  // Release Image objects after uploaded gl texture
  cc.macro.CLEANUP_IMAGE_CACHE = true;
}

//window.boot();
//####

var fs = wx.getFileSystemManager();

var userResPath = wx.env.USER_DATA_PATH + "/res/";
window.mainImportPath = userResPath + "import/";
window.webPath = "";
window.ress = {};

makeDir(wx.env.USER_DATA_PATH, function () {
	makeDir(userResPath, function () {
		makeDir(window.mainImportPath, function () {
			unzipImport();
		});
	});
});

function unzipImport() {
	console.log("解压 /assets/main/import.zip");
	fs.unzip({
		zipFilePath: "/assets/main/import.zip",
		targetPath: window.mainImportPath,
		success: function (args) {
			console.log("解压成功", args);
			window.boot();
		},
		fail: function (args) { console.error("解压失败", args); }
	});
}

function makeDir(dirPath, onComplete) {
	fs.access({
		path: dirPath,
		success: function () {
			console.log("目录已存在：" + dirPath);
			onComplete();
		},
		fail: function () {
			console.log("创建目录：" + dirPath);
			fs.mkdir({
				dirPath: dirPath,
				//recursive: true,
				success: function (args) {
					console.log("创建目录成功", args);
					onComplete();
				},
				fail: function (args) {
					console.error("创建目录失败", args);
				}
			});
		}
	});
}
