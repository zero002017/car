declare interface LaunchOption {
	scene: number;
	query: {
		id: string;
		openId: string;
		accessInfo: string;
		record: string;
		lt: string;
		ald_link_key: string;
		ald_position_id: string;
		ald_media_id: string;
		wxgamecid: string;
	};
	isSticky: boolean;
	shareTicket: string;
	referrerInfo: {
		appId: string;
		extraData: any;
	};
}

declare interface FriendInfo {
	openid: string;
	nickname: string;
	avatarUrl: string;
	headImg: WxImage;
	headImgIsLoaded: boolean;
	drawHeadX: number;
	drawHeadY: number;
	drawHeadD: number;
}
declare interface FriendData extends FriendInfo {
	KVDataList: Array<KVData>;
	storeData: StoreData;
}

declare interface UserStates {
	最近上线时间?: number,
	房间状态?: number,
	是否准备?: number,
	军衔?: number,
	总场数?: number,
	胜利场数?: number
}
declare interface StoreData extends UserStates {
	chapterIndex?: number;
	fubenIndex?: number;
	maxKillNum?: number;
}

declare let sharedCanvas: HTMLCanvasElement;

/**
* 取消由 requestAnimationFrame 添加到计划中的动画帧请求 
*/
declare function cancelAnimationFrame(requestID: number): void;
/**
* 在下次进行重绘时执行 
*/
declare function requestAnimationFrame(callback: Function): number;
/**
* 取消由 setInterval 设置的定时器 
*/
declare function clearInterval(intervalID: number): void;
/**
* 取消由 setTimeout 设置的定时器 
*/
declare function clearTimeout(timeoutID: number): void;
/**
* 设定一个定时器 
*/
declare function setInterval(callback: Function, delay: number, rest: any): number;
/**
* 设定一个定时器 
*/
declare function setTimeout(callback: Function, delay: number, rest: any): number;
/**
* 托管的 KV 数据 
*/
declare class KVData {
	/**
	* 数据的 key 
	*/
	key: string;
	/**
	* 数据的 value 
	*/
	value: string;
}
/**
*  
*/
declare interface WebSocket {
}
/**
* 用户授权设置信息 
*/
declare class AuthSetting {
	scope: {
		/**
		* 是否授权用户信息，对应接口 wx.getUserInfo 
		*/
		userInfo: boolean;
		/**
		* 是否授权地理位置，对应接口 wx.getLocation wx.chooseLocation 
		*/
		userLocation: boolean;
		/**
		* 是否授权通讯地址，对应接口 wx.chooseAddress 
		*/
		address: boolean;
		/**
		* 是否授权发票抬头，对应接口 wx.chooseInvoiceTitle 
		*/
		invoiceTitle: boolean;
		/**
		* 是否授权微信运动步数，对应接口 wx.getWeRunData 
		*/
		werun: boolean;
		/**
		* 是否授权录音功能，对应接口 wx.startRecord 
		*/
		record: boolean;
		/**
		* 是否授权保存到相册 wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum 
		*/
		writePhotosAlbum: boolean;
		/**
		* 是否授权摄像头 
		*/
		camera: boolean;
	}
}
/**
* 画布对象的绘图上下文 
*/
declare interface WxRenderingContext {
}
/**
* 图片对象 
*/
declare class WxImage extends HTMLImageElement {
}
/**
* 用户信息 
*/
declare class UserInfo {
	/**
	* 用户昵称 
	*/
	nickName: string;
	/**
	* 用户头像图片的 URL。URL 最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640x640 的正方形头像，46 表示 46x46 的正方形头像，剩余数值以此类推。默认132），用户没有头像时该项为空。若用户更换头像，原有头像 URL 将失效。 
	*/
	avatarUrl: string;
	/**
	* 用户性别 
	*/
	gender: 0 | 1 | 2;
	/**
	* 用户所在国家 
	*/
	country: string;
	/**
	* 用户所在省份 
	*/
	province: string;
	/**
	* 用户所在城市 
	*/
	city: string;
	/**
	* 显示 country，province，city 所用的语言 
	*/
	language: string;
}
/**
* 托管数据 
*/
declare class UserGameData {
	/**
	* 用户的微信头像 url 
	*/
	avatarUrl: string;
	/**
	* 用户的微信昵称 
	*/
	nickname: string;
	/**
	* 用户的 openid 
	*/
	openid: string;
	/**
	* 用户的托管 KV 数据列表 
	*/
	KVDataList: Array<KVData>;
}
/**
* 在触控设备上的触摸点 
*/
declare class WxTouch {
	/**
	* WxTouch 对象的唯一标识符，只读属性。一次触摸动作(我们值的是手指的触摸)在平面上移动的整个过程中, 该标识符不变。可以根据它来判断跟踪的是否是同一次触摸过程。 
	*/
	identifier: number;
	/**
	* 触点相对于屏幕左边沿的 X 坐标。 
	*/
	screenX: number;
	/**
	* 触点相对于屏幕上边沿的 Y 坐标。 
	*/
	screenY: number;
}
/**
*  
*/
declare interface Performance {
	/**
	* 可以获取当前时间以微秒为单位的时间戳 
	*/
	now(): number;
}
/**
*  
*/
declare interface LoadSubpackageTask {
	/**
	* 监听分包加载进度变化事件 
	*/
	onProgressUpdate(callback: (res: { progress: number, totalBytesWritten: number, totalBytesExpectedToWrite: number }) => void);
}
/**
*  
*/
declare interface RequestTask {
	/**
	* 中断请求任务 
	*/
	abort();
}
/**
*  
*/
declare class OpenDataContext {
	/**
	* 开放数据域和主域共享的 sharedCanvas 
	*/
	canvas: Canvas;
	/**
	* 向开放数据域发送消息 
	*/
	postMessage(message: Object);
}
/**
*  
*/
declare class Stats {
	/**
	* 文件的类型和存取的权限，对应 POSIX stat.st_mode 
	*/
	mode: string;
	/**
	* 文件大小，单位：B，对应 POSIX stat.st_size 
	*/
	size: number;
	/**
	* 文件最近一次被存取或被执行的时间，UNIX 时间戳，对应 POSIX stat.st_atime 
	*/
	lastAccessedTime: number;
	/**
	* 文件最后一次被修改的时间，UNIX 时间戳，对应 POSIX stat.st_mtime 
	*/
	lastModifiedTime: number;
	/**
	* 判断当前文件是否一个目录 
	*/
	isDirectory(): boolean;
	/**
	* 判断当前文件是否一个普通文件 
	*/
	isFile(): boolean;
}
/**
*  
*/
declare interface UploadTask {
	/**
	* 中断上传任务 
	*/
	abort();
	/**
	* 监听上传进度变化事件 
	*/
	onProgressUpdate(callback: (res: { progress: number, totalBytesSent: number, totalBytesExpectedToSend: number }) => void);
}
/**
*  
*/
declare interface DownloadTask {
	/**
	* 中断下载任务 
	*/
	abort();
	/**
	* 监听下载进度变化事件 
	*/
	onProgressUpdate(callback: (res: { progress: number, totalBytesWritten: number, totalBytesExpectedToWrite: number }) => void);
}
/**
*  
*/
declare interface Worker {
	/**
	* 监听主线程/Worker 线程向当前线程发送的消息的事件 
	*/
	onMessage(callback: (res: { message: Object }) => void);
	/**
	* 向主线程/Worker 线程发送的消息 
	*/
	postMessage(message: Object);
	/**
	* 结束当前 Worker 线程 
	*/
	terminate();
}
/**
*  
*/
declare class Canvas {
	/**
	* 画布的宽度 
	*/
	width: number;
	/**
	* 画布的高度 
	*/
	height: number;
	/**
	* 获取画布对象的绘图上下文 
	*/
	getContext(contextType: string, contextAttributes: Object): WxRenderingContext;
	/**
	* 把画布上的绘制内容以一个 data URI 的格式返回 
	*/
	toDataURL(): string;
	/**
	* 将当前 Canvas 保存为一个临时文件 
	*/
	toTempFilePath(object: Object): string;
	/**
	* Canvas.toTempFilePath 的同步版本 
	*/
	toTempFilePathSync(obj: { x?: number, y?: number, width?: number, height?: number, destWidth?: number, destHeight?: number, fileType?: string, quality?: number });
}
/**
*  
*/
declare interface UpdateManager {
	/**
	* 强制小程序重启并使用新版本 
	*/
	applyUpdate();
	/**
	* 监听向微信后台请求检查更新结果事件 
	*/
	onCheckForUpdate(callback: (res: { hasUpdate: boolean }) => void);
	/**
	* 监听小程序更新失败事件 
	*/
	onUpdateFailed(callback: Function);
	/**
	* 监听小程序有版本更新事件 
	*/
	onUpdateReady(callback: Function);
}
/**
*  
*/
declare class UserInfoButton {
	/**
	* 按钮的类型 
	*/
	type: string;
	/**
	* 按钮上的文本，仅当 type 为 text 时有效 
	*/
	text: string;
	/**
	* 按钮的背景图片，仅当 type 为 image 时有效 
	*/
	image: string;
	/**
	* 按钮的样式 
	*/
	style: Object;
	/**
	* 销毁用户信息按钮 
	*/
	destroy();
	/**
	* 隐藏用户信息按钮 
	*/
	hide();
	/**
	* 取消监听用户信息按钮的点击事件 
	*/
	offTap(callback: Function);
	/**
	* 监听用户信息按钮的点击事件 
	*/
	onTap(callback: (res: { userInfo: UserInfo, rawData: string, signature: string, encryptedData: string, iv: string }) => void);
	/**
	* 显示用户信息按钮 
	*/
	show();
}
/**
*  
*/
declare class OpenSettingButton {
	/**
	* 按钮的类型 
	*/
	type: string;
	/**
	* 按钮上的文本，仅当 type 为 text 时有效 
	*/
	text: string;
	/**
	* 按钮的背景图片，仅当 type 为 image 时有效 
	*/
	image: string;
	/**
	* 按钮的样式 
	*/
	style: Object;
	/**
	* 销毁打开设置页面按钮 
	*/
	destroy();
	/**
	* 隐藏打开设置页面按钮 
	*/
	hide();
	/**
	* 取消监听设置页面按钮的点击事件 
	*/
	offTap(callback: Function);
	/**
	* 监听设置页面按钮的点击事件 
	*/
	onTap(callback: Function);
	/**
	* 显示打开设置页面按钮 
	*/
	show();
}
/**
*  
*/
declare class FeedbackButton {
	/**
	* 按钮的类型 
	*/
	type: string;
	/**
	* 按钮上的文本，仅当 type 为 text 时有效 
	*/
	text: string;
	/**
	* 按钮的背景图片，仅当 type 为 image 时有效 
	*/
	image: string;
	/**
	* 按钮的样式 
	*/
	style: Object;
	/**
	* 销毁意见反馈按钮 
	*/
	destroy();
	/**
	* 隐藏意见反馈按钮 
	*/
	hide();
	/**
	* 取消监听意见反馈按钮的点击事件 
	*/
	offTap(callback: Function);
	/**
	* 监听意见反馈按钮的点击事件 
	*/
	onTap(callback: Function);
	/**
	* 显示意见反馈按钮 
	*/
	show();
}
/**
*  
*/
declare class GameClubButton {
	/**
	* 显示游戏圈按钮 
	*/
	object: Object;
	/**
	* 销毁游戏圈按钮 
	*/
	destroy();
	/**
	* 隐藏游戏圈按钮 
	*/
	hide();
	/**
	* 取消监听游戏圈按钮的点击事件 
	*/
	offTap(callback: Function);
	/**
	* 监听游戏圈按钮的点击事件 
	*/
	onTap(callback: Function);
	/**
	* 显示游戏圈按钮 
	*/
	show();
}
/**
*  
*/
declare interface SocketTask {
	/**
	* 关闭 WebSocket 连接 
	*/
	close(obj: { code?: number, reason?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 监听WebSocket 连接关闭事件 
	*/
	onClose(callback: Function);
	/**
	* 监听WebSocket 错误事件 
	*/
	onError(callback: (res: { errMsg: string }) => void);
	/**
	* 监听WebSocket 接受到服务器的消息事件 
	*/
	onMessage(callback: (res: { data: string | ArrayBuffer }) => void);
	/**
	* 监听WebSocket 连接打开事件 
	*/
	onOpen(callback: (res: { header: Object }) => void);
	/**
	* 通过 WebSocket 连接发送数据 
	*/
	send(obj: { data?: string | ArrayBuffer, success?: Function, fail?: Function, complete?: Function });
}
/**
*  
*/
declare interface console {
	/**
	* 向调试面板中打印 debug 日志 
	*/
	debug();
	/**
	* 向调试面板中打印 error 日志 
	*/
	error();
	/**
	* 在调试面板中创建一个新的分组 
	*/
	group(label: string);
	/**
	* 结束由 console.group 创建的分组 
	*/
	groupEnd();
	/**
	* 向调试面板中打印 info 日志 
	*/
	info();
	/**
	* 向调试面板中打印 log 日志 
	*/
	log();
	/**
	* 向调试面板中打印 warn 日志 
	*/
	warn();
}
/**
*  
*/
declare interface RewardedVideoAd {
	/**
	* 隐藏激励视频广告 
	*/
	load(): Promise<any>;
	/**
	* 取消监听用户点击 关闭广告 按钮的事件 
	*/
	offClose(callback: Function);
	/**
	* 取消监听激励视频错误事件 
	*/
	offError(callback: Function);
	/**
	* 取消监听激励视频广告加载事件 
	*/
	offLoad(callback: Function);
	/**
	* 监听用户点击 关闭广告 按钮的事件 
	*/
	onClose(callback: (res: { isEnded: boolean }) => void);
	/**
	* 监听激励视频错误事件 
	*/
	onError(callback: (res: { errMsg: string, errCode: number }) => void);
	/**
	* 监听激励视频广告加载事件 
	*/
	onLoad(callback: Function);
	/**
	* 显示激励视频广告 
	*/
	show(): Promise<any>;
}
/**
*  
*/
declare class BannerAd {
	/**
	* banner 广告组件的样式。style 上的属性的值仅为开发者设置的值，banner 广告会根据开发者设置的宽度进行等比缩放，缩放后的真实尺寸需要通过 BannerAd.onResize() 事件获得。 
	*/
	style: { left: number, top: number, width: number, height: number };
	/**
	* 销毁 banner 广告 
	*/
	destroy();
	/**
	* 隐藏 banner 广告 
	*/
	hide();
	/**
	* 取消监听banner 广告错误事件 
	*/
	offError(callback: Function);
	/**
	* 取消监听banner 广告加载事件 
	*/
	offLoad(callback: Function);
	/**
	* 取消监听banner 广告尺寸变化事件 
	*/
	offResize(callback: Function);
	/**
	* 监听banner 广告错误事件 
	*/
	onError(callback: (res: { errMsg: string, errCode: number }) => void);
	/**
	* 监听banner 广告加载事件 
	*/
	onLoad(callback: Function);
	/**
	* 监听banner 广告尺寸变化事件 
	*/
	onResize(callback: (res: { width: number, height: number }) => void);
	/**
	* 显示 banner 广告 
	*/
	show(): Promise<any>;
}

declare class GridAd {
	style: {
		left: number,
		top: number,
		width: number,
		opacity: number
	};
	show(): Promise<any>;
	hide(): void;
	onError(callback: (err: any) => void);
	onLoad(callback: () => void);
	onResize(callback: (res: { width: number, height: number }) => void);
	destroy();
}

declare class CustomAd {
	show(): Promise<any>;
	hide(): void;
	onError(callback: (err: any) => void);
	onLoad(callback: () => void);
}

declare class BlockAd {
	style: {
		left: number,
		top: number
	};
	show(): Promise<any>;
	hide(): void;
	onError(callback: (err: any) => void);
	onLoad(callback: () => void);
	destroy();
}

/**
*  
*/
declare class InsertAd {
	offClose(callback: Function);
	offError(callback: Function);
	offLoad(callback: Function);
	onClose(callback: Function);
	onError(callback: (res: { errMsg: string, errCode: number }) => void);
	onLoad(callback: Function);
	show(): Promise<any>;
}

/**
*  
*/
declare class GameBannerAd {
	destroy();
	hide();
	offError(callback: Function);
	offLoad(callback: Function);
	offResize(callback: Function);
	onError(callback: (res: { errMsg: string, errCode: number }) => void);
	onLoad(callback: Function);
	onResize(callback: (res: { width: number, height: number }) => void);
	show(): Promise<any>;
}

/**
*  
*/
declare class GamePortalAd {
	destroy();
	load();
	offClose(callback: Function);
	offError(callback: Function);
	offLoad(callback: Function);
	onClose(callback: Function);
	onError(callback: (res: { errMsg: string, errCode: number }) => void);
	onLoad(callback: Function);
	show(): Promise<any>;
}

declare class AppBox {
	destroy();
	load();
	offClose(callback: Function);
	onClose(callback: Function);
	show(): Promise<any>;
}

/**
*  
*/
declare interface RecorderManager {
	/**
	* 监听录音错误事件 
	*/
	onError(callback: (res: { errMsg: string }) => void);
	/**
	* 监听已录制完指定帧大小的文件事件 
	*/
	onFrameRecorded(callback: (res: { frameBuffer: ArrayBuffer, isLastFrame: boolean }) => void);
	/**
	* 监听录音因为受到系统占用而被中断开始事件 
	*/
	onInterruptionBegin(callback: Function);
	/**
	* 监听录音中断结束事件 
	*/
	onInterruptionEnd(callback: Function);
	/**
	* 监听录音暂停事件 
	*/
	onPause(callback: Function);
	/**
	* 监听录音继续事件 
	*/
	onResume(callback: Function);
	/**
	* 监听录音开始事件 
	*/
	onStart(callback: Function);
	/**
	* 监听录音结束事件 
	*/
	onStop(callback: (res: { tempFilePath: string }) => void);
	/**
	* 暂停录音 
	*/
	pause();
	/**
	* 继续录音 
	*/
	resume();
	/**
	* 开始录音 
	*/
	start(obj: { duration?: number, sampleRate?: number, numberOfChannels?: number, encodeBitRate?: number, format?: string, frameSize?: number, audioSource?: string });
	/**
	* 停止录音 
	*/
	stop();
}
/**
*  
*/
declare class Video {
	/**
	* 视频的左上角横坐标 
	*/
	x: number;
	/**
	* 视频的左上角纵坐标 
	*/
	y: number;
	/**
	* 视频的宽度 
	*/
	width: number;
	/**
	* 视频的高度 
	*/
	height: number;
	/**
	* 视频的资源地址 
	*/
	src: number;
	/**
	* 视频的封面 
	*/
	poster: number;
	/**
	* 视频的初始播放位置，单位为 s 秒 
	*/
	initialTime: number;
	/**
	* 视频的播放速率，有效值有 0.5、0.8、1.0、1.25、1.5 
	*/
	playbackRate: number;
	/**
	* 视频是否为直播 
	*/
	live: number;
	/**
	* 视频的缩放模式 
	*/
	objectFit: number;
	/**
	* 视频是否显示控件 
	*/
	controls: number;
	/**
	* 视频是否自动播放 
	*/
	autoplay: number;
	/**
	* 视频是否是否循环播放 
	*/
	loop: number;
	/**
	* 视频是否禁音播放 
	*/
	muted: number;
	/**
	* 视频开始缓冲时触发的回调函数 
	*/
	onwaiting: Function;
	/**
	* 视频开始播放时触发的回调函数 
	*/
	onplay: Function;
	/**
	* 视频暂停时触发的回调函数 
	*/
	onpause: Function;
	/**
	* 视频播放到末尾时触发的回调函数 
	*/
	onended: Function;
	/**
	* 每当视频播放进度更新时触发的回调函数 
	*/
	ontimeupdate: Function;
	/**
	* 视频发生错误时触发的回调函数 
	*/
	onerror: Function;
	/**
	* 销毁视频 
	*/
	destroy();
	/**
	* 视频退出全屏 
	*/
	exitFullScreen(): Promise<any>;
	/**
	* 取消监听视频播放到末尾事件 
	*/
	offEnded(callback: Function);
	/**
	* 取消监听视频错误事件 
	*/
	offError(callback: Function);
	/**
	* 取消监听视频暂停事件 
	*/
	offPause(callback: Function);
	/**
	* 取消监听视频播放事件 
	*/
	offPlay(callback: Function);
	/**
	* 取消监听视频播放进度更新事件 
	*/
	offTimeUpdate(callback: Function);
	/**
	* 取消监听视频缓冲事件 
	*/
	offWaiting(callback: Function);
	/**
	* 监听视频播放到末尾事件 
	*/
	onEnded(callback: Function);
	/**
	* 监听视频错误事件 
	*/
	onError(callback: (res: { errMsg: string }) => void);
	/**
	* 监听视频暂停事件 
	*/
	onPause(callback: Function);
	/**
	* 监听视频播放事件 
	*/
	onPlay(callback: Function);
	/**
	* 监听视频播放进度更新事件 
	*/
	onTimeUpdate(callback: (res: { position: number, duration: number }) => void);
	/**
	* 监听视频缓冲事件 
	*/
	onWaiting(callback: Function);
	/**
	* 暂停视频 
	*/
	pause(): Promise<any>;
	/**
	* 播放视频 
	*/
	play(): Promise<any>;
	/**
	* 视频全屏 
	*/
	requestFullScreen(): Promise<any>;
	/**
	* 视频跳转 
	*/
	seek(time: number): Promise<any>;
	/**
	* 停止视频 
	*/
	stop(): Promise<any>;
}
/**
*  
*/
declare class InnerAudioContext {
	/**
	* 音频资源的地址，用于直接播放。2.2.3 开始支持云文件ID 
	*/
	src: string;
	/**
	* 开始播放的位置（单位：s），默认为 0 
	*/
	startTime: number;
	/**
	* 是否自动开始播放，默认为 false 
	*/
	autoplay: boolean;
	/**
	* 是否循环播放，默认为 false 
	*/
	loop: boolean;
	/**
	* 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音 
	*/
	obeyMuteSwitch: boolean;
	/**
	* 支持版本 >= 1.9.90 
	*/
	volume: number;
	/**
	* 音量。范围 0~1。默认为 1 
	*/
	duration: number;
	/**
	* 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读） 
	*/
	currentTime: number;
	/**
	* 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位（只读） 
	*/
	paused: boolean;
	/**
	* 当前是是否暂停或停止状态（只读） 
	*/
	buffered: number;
	/**
	* 销毁当前实例 
	*/
	destroy();
	/**
	* 取消监听音频进入可以播放状态的事件 
	*/
	offCanplay(callback: Function);
	/**
	* 取消监听音频自然播放至结束的事件 
	*/
	offEnded(callback: Function);
	/**
	* 取消监听音频播放错误事件 
	*/
	offError(callback: Function);
	/**
	* 取消监听音频暂停事件 
	*/
	offPause(callback: Function);
	/**
	* 取消监听音频播放事件 
	*/
	offPlay(callback: Function);
	/**
	* 取消监听音频完成跳转操作的事件 
	*/
	offSeeked(callback: Function);
	/**
	* 取消监听音频进行跳转操作的事件 
	*/
	offSeeking(callback: Function);
	/**
	* 取消监听音频停止事件 
	*/
	offStop(callback: Function);
	/**
	* 取消监听音频播放进度更新事件 
	*/
	offTimeUpdate(callback: Function);
	/**
	* 取消监听音频加载中事件 
	*/
	offWaiting(callback: Function);
	/**
	* 监听音频进入可以播放状态的事件 
	*/
	onCanplay(callback: Function);
	/**
	* 监听音频自然播放至结束的事件 
	*/
	onEnded(callback: Function);
	/**
	* 监听音频播放错误事件 
	*/
	onError(callback: (res: { errCode: number }) => void);
	/**
	* 监听音频暂停事件 
	*/
	onPause(callback: Function);
	/**
	* 监听音频播放事件 
	*/
	onPlay(callback: Function);
	/**
	* 监听音频完成跳转操作的事件 
	*/
	onSeeked(callback: Function);
	/**
	* 监听音频进行跳转操作的事件 
	*/
	onSeeking(callback: Function);
	/**
	* 监听音频停止事件 
	*/
	onStop(callback: Function);
	/**
	* 监听音频播放进度更新事件 
	*/
	onTimeUpdate(callback: Function);
	/**
	* 监听音频加载中事件 
	*/
	onWaiting(callback: Function);
	/**
	* 暂停 
	*/
	pause();
	/**
	* 播放 
	*/
	play();
	/**
	* 跳转到指定位置 
	*/
	seek(position: number);
	/**
	* 停止 
	*/
	stop();
}
/**
*  
*/
declare interface FileSystemManager {
	/**
	* 判断文件/目录是否存在 
	*/
	access(obj: { path?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.access 的同步版本 
	*/
	accessSync(path: string);
	/**
	* 在文件结尾追加内容 
	*/
	appendFile(obj: { filePath?: string, data?: string | ArrayBuffer, encoding?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.appendFile 的同步版本 
	*/
	appendFileSync(filePath: string, data: string | ArrayBuffer, encoding: string);
	/**
	* 复制文件 
	*/
	copyFile(obj: { srcPath?: string, destPath?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.copyFile 的同步版本 
	*/
	copyFileSync(srcPath: string, destPath: string);
	/**
	* 获取该小程序下的 本地临时文件 或 本地缓存文件 信息 
	*/
	getFileInfo(obj: { filePath?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取该小程序下已保存的本地缓存文件列表 
	*/
	getSavedFileList(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 创建目录 
	*/
	mkdir(obj: { dirPath?: string, recursive?: boolean, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.mkdir 的同步版本 
	*/
	mkdirSync(dirPath: string, recursive: boolean);
	/**
	* 读取目录内文件列表 
	*/
	readdir(obj: { dirPath?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.readdir 的同步版本 
	*/
	readdirSync(dirPath: string): Array<string>;
	/**
	* 读取本地文件内容 
	*/
	readFile(obj: { filePath?: string, encoding?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.readFile 的同步版本 
	*/
	readFileSync(filePath: string, encoding: string): string | ArrayBuffer;
	/**
	* 删除该小程序下已保存的本地缓存文件 
	*/
	removeSavedFile(obj: { filePath?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 重命名文件 
	*/
	rename(obj: { oldPath?: string, newPath?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.rename 的同步版本 
	*/
	renameSync(oldPath: string, newPath: string);
	/**
	* 删除目录 
	*/
	rmdir(obj: { dirPath?: string, recursive?: boolean, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.rmdir 的同步版本 
	*/
	rmdirSync(dirPath: string, recursive: boolean);
	/**
	* 保存临时文件到本地 
	*/
	saveFile(obj: { tempFilePath?: string, filePath?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.saveFile 的同步版本 
	*/
	saveFileSync(tempFilePath: string, filePath: string): number;
	/**
	* 获取文件 Stats 对象 
	*/
	stat(obj: { path?: string, recursive?: boolean, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.stat 的同步版本 
	*/
	statSync(path: string, recursive: boolean): Stats | Object;
	/**
	* 删除文件 
	*/
	unlink(obj: { filePath?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.unlink 的同步版本 
	*/
	unlinkSync(filePath: string);
	/**
	* 解压文件 
	*/
	unzip(obj: { zipFilePath?: string, targetPath?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 写文件 
	*/
	writeFile(obj: { filePath?: string, data?: string | ArrayBuffer, encoding?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* FileSystemManager.writeFile 的同步版本 
	*/
	writeFileSync(filePath: string, data: string | ArrayBuffer, encoding: string);
}
/**
*  
*/
declare namespace wx {

	export function onMoreGamesModalClose(callback): any
	export function onNavigateToMiniProgram(callback): any
	export function showMoreGamesModal(object): any;
	export function getAntiAddiction(): AntiAddiction;
	export function openActivity(object): any;

	export function launchSuccess(): void;//B站

	export function hbVideo(isEnd: boolean): void;//黑白联盟视频广告打点

	class AntiAddiction {
		public onAntiAddiction(callback: (args: { state: number, msg: string }) => void): void;
	}

	/**
	* 创建一个画布对象 
	*/
	export function createCanvas(): Canvas;
	/**
	* 获取一行文本的行高 
	*/
	export function getTextLineHeight(object: Object): number;
	/**
	* 加载自定义字体文件 
	*/
	export function loadFont(path: string): string;
	/**
	* 可以修改渲染帧率 
	*/
	export function setPreferredFramesPerSecond(fps: number);
	/**
	* 创建一个图片对象 
	*/
	export function createImage(): WxImage;
	/**
	* 创建 banner 广告组件 
	*/
	export function createBannerAd(object: Object): BannerAd;

	export function createGridAd(args: {
		adUnitId: string,
		adTheme: string,
		gridCount: number,
		style: {
			left: number,
			top: number,
			width: number,
			opacity: number
		}
	}): GridAd;

	export function createCustomAd(args: {
		adUnitId: string,
		left: number,
		top: number,
		fixed: boolean
	}): CustomAd;

	export function createBlockAd(args: {
		adUnitId: string,
		size: number,
		orientation: string,
		style: {
			left: number,
			top: number
		}
	}): BlockAd;

	/**
	* 创建插屏广告组件 
	*/
	export function createInterstitialAd(object: Object): InsertAd;
	/**
	* 创建激励视频广告组件 
	*/
	export function createRewardedVideoAd(object: Object): RewardedVideoAd;

	export function createGameBanner(object: { adUnitId: string }): GameBannerAd;

	export function createGamePortal(object: { adUnitId: string }): GamePortalAd;

	export function createAppBox(object: { adUnitId: string }): AppBox;

	//抖音录屏
	export function getGameRecorderManager(): any;

	//B站录屏分享
	export function getGameRecorder(): any;
	export function createGameRecorderShareButton(args: any): any;

	export function showFavoriteGuide(object: any): any;

	/**
	* 设置是否打开调试开关 
	*/
	export function setEnableDebug(obj: { enableDebug?: boolean, success?: Function, fail?: Function, complete?: Function });
	/**
	* 监听加速度数据事件 
	*/
	export function onAccelerometerChange(callback: (res: { x: number, y: number, z: number }) => void);
	/**
	* 开始监听加速度数据 
	*/
	export function startAccelerometer(obj: { interval?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 停止监听加速度数据 
	*/
	export function stopAccelerometer(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取设备电量 
	*/
	export function getBatteryInfo(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* wx.getBatteryInfo 的同步版本 
	*/
	export function getBatteryInfoSync(): Object;
	/**
	* 获取系统剪贴板的内容 
	*/
	export function getClipboardData(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 设置系统剪贴板的内容 
	*/
	export function setClipboardData(obj: { data?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 监听罗盘数据变化事件 
	*/
	export function onCompassChange(callback: (res: { direction: number, accuracy: number | string }) => void);
	/**
	* 开始监听罗盘数据 
	*/
	export function startCompass(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 停止监听罗盘数据 
	*/
	export function stopCompass(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 监听陀螺仪数据变化事件 
	*/
	export function onGyroscopeChange(callback: (res: { res: Object, x: number, y: number, z: number }) => void);
	/**
	* 开始监听陀螺仪数据 
	*/
	export function startGyroscope(obj: { interval?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 停止监听陀螺仪数据 
	*/
	export function stopGyroscope(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 监听设备方向变化事件 
	*/
	export function onDeviceMotionChange(callback: (res: { alpha: number, beta: number, gamma: number }) => void);
	/**
	* 开始监听设备方向的变化 
	*/
	export function startDeviceMotionListening(obj: { interval?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 停止监听设备方向的变化 
	*/
	export function stopDeviceMotionListening(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取网络类型 
	*/
	export function getNetworkType(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 监听网络状态变化事件 
	*/
	export function onNetworkStatusChange(callback: (res: { isConnected: boolean, networkType: string }) => void);
	/**
	* 取消监听横竖屏切换事件 
	*/
	export function offDeviceOrientationChange(callback: Function);
	/**
	* 监听横竖屏切换事件 
	*/
	export function onDeviceOrientationChange(callback: (res: { value: string }) => void);
	/**
	* 监听内存不足告警事件 
	*/
	export function onMemoryWarning(callback: (res: { level: number }) => void);
	/**
	* 获取屏幕亮度 
	*/
	export function getScreenBrightness(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 设置是否保持常亮状态 
	*/
	export function setKeepScreenOn(obj: { keepScreenOn?: boolean, success?: Function, fail?: Function, complete?: Function });
	/**
	* 设置屏幕亮度 
	*/
	export function setScreenBrightness(obj: { value?: number, success?: Function, fail?: Function, complete?: Function });
	/**
	* 使手机发生较长时间的振动（400 ms) 
	*/
	export function vibrateLong(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 使手机发生较短时间的振动（15 ms） 
	*/
	export function vibrateShort(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取全局唯一的文件管理器 
	*/
	export function getFileSystemManager(): FileSystemManager;
	/**
	* 获取当前的地理位置、速度 
	*/
	export function getLocation(obj: { type?: string, altitude?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 创建内部 audio 上下文 InnerAudioContext 对象 
	*/
	export function createInnerAudioContext(): InnerAudioContext;
	/**
	* 获取当前支持的音频输入源 
	*/
	export function getAvailableAudioSources(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 设置 InnerAudioContext 的播放选项 
	*/
	export function setInnerAudioOption(obj: { mixWithOther?: boolean, obeyMuteSwitch?: boolean, success?: Function, fail?: Function, complete?: Function });
	/**
	* 从本地相册选择图片或使用相机拍照 
	*/
	export function chooseImage(obj: { count?: number, sizeType?: Array<string>, sourceType?: Array<string>, success?: Function, fail?: Function, complete?: Function });
	/**
	* 在新页面中全屏预览图片 
	*/
	export function previewImage(obj: { urls?: Array<string>, current?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 保存图片到系统相册 
	*/
	export function saveImageToPhotosAlbum(obj: { filePath?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取全局唯一的录音管理器 RecorderManager 
	*/
	export function getRecorderManager(): RecorderManager;
	/**
	* 创建视频 
	*/
	export function createVideo(object: Object): Video;
	/**
	* 发起米大师支付 
	*/
	export function requestMidasPayment(obj: { mode?: string, env?: number, offerId?: string, currencyType?: string, platform?: string, buyQuantity?: number, zoneId?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 下载文件资源到本地 
	*/
	export function downloadFile(object: Object): DownloadTask;
	/**
	* 发起 HTTPS 网络请求 
	*/
	export function request(object: Object): RequestTask;
	/**
	* 将本地资源上传到服务器 
	*/
	export function uploadFile(object: Object): UploadTask;
	/**
	* 关闭 WeSocket 连接 
	*/
	export function closeSocket(obj: { code?: number, reason?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 创建一个 WebSocket 连接 
	*/
	export function connectSocket(object: Object): SocketTask;
	/**
	* 监听WebSocket 连接关闭事件 
	*/
	export function onSocketClose(callback: Function);
	/**
	* 监听WebSocket 错误事件 
	*/
	export function onSocketError(callback: Function);
	/**
	* 监听WebSocket 接受到服务器的消息事件 
	*/
	export function onSocketMessage(callback: (res: { data: string | ArrayBuffer }) => void);
	/**
	* 监听WebSocket 连接打开事件 
	*/
	export function onSocketOpen(callback: (res: { header: Object }) => void);
	/**
	* 通过 WebSocket 连接发送数据 
	*/
	export function sendSocketMessage(obj: { data?: string | ArrayBuffer, success?: Function, fail?: Function, complete?: Function });
	/**
	* 根据用户当天游戏时间判断用户是否需要休息 
	*/
	export function checkIsUserAdvisedToRest(obj: { todayPlayedTime?: number, success?: Function, fail?: Function, complete?: Function });
	/**
	* 提前向用户发起授权请求 
	*/
	export function authorize(obj: { scope?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取开放数据域 
	*/
	export function getOpenDataContext(): OpenDataContext;
	/**
	* 监听主域发送的消息 
	*/
	export function onMessage(callback: Function);
	/**
	* 进入客服会话 
	*/
	export function openCustomerServiceConversation(obj: { sessionFrom?: string, showMessageCard?: boolean, sendMessageTitle?: string, sendMessagePath?: string, sendMessageImg?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 拉取当前用户所有同玩好友的托管数据 
	*/
	export function getFriendCloudStorage(obj: { keyList?: Array<string>, success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取群同玩成员的游戏数据 
	*/
	export function getGroupCloudStorage(obj: { shareTicket?: string, keyList?: Array<string>, success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取主域和开放数据域共享的 sharedCanvas 
	*/
	export function getSharedCanvas(): Canvas;
	/**
	* 获取当前用户托管数据当中对应 key 的数据 
	*/
	export function getUserCloudStorage(obj: { keyList?: Array<string>, success?: Function, fail?: Function, complete?: Function });
	/**
	* 删除用户托管数据当中对应 key 的数据 
	*/
	export function removeUserCloudStorage(obj: { keyList?: Array<string>, success?: Function, fail?: Function, complete?: Function });
	/**
	* 对用户托管数据进行写数据操作 
	*/
	export function setUserCloudStorage(obj: { KVDataList?: Array<KVData>, success?: Function, fail?: Function, complete?: Function });
	/**
	* 创建打开意见反馈页面的按钮 
	*/
	export function createFeedbackButton(obj: { type: string, text?: string, image?: string, style?: Object }): FeedbackButton;
	/**
	* 创建游戏圈按钮 
	*/
	export function createGameClubButton(object: Object): GameClubButton;
	/**
	* 检查登录态是否过期 
	*/
	export function checkSession(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 调用接口获取登录凭证（code） 
	*/
	export function login(obj: { timeout?: number, success?: Function, fail?: Function, complete?: Function });
	/**
	* 打开另一个小程序 
	*/
	export function navigateToMiniProgram(obj: { appId?: string, path?: string, extraData?: Object, envVersion?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 创建打开设置页面的按钮 
	*/
	export function createOpenSettingButton(type: string, text: string, image: string, style: Object): OpenSettingButton;
	/**
	* 获取用户的当前设置 
	*/
	export function getSetting(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 调起客户端小程序设置界面，返回用户设置的操作结果 
	*/
	export function openSetting(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 创建用户信息按钮 
	*/
	export function createUserInfoButton(object: Object): UserInfoButton;
	/**
	* 获取用户信息 
	*/
	export function getUserInfo(obj: { withCredentials?: boolean, lang?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取用户过去三十天微信运动步数 
	*/
	export function getWeRunData(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取性能管理器 
	*/
	export function getPerformance(): Performance;
	/**
	* 加快触发 JavaScriptCore 垃圾回收（Garbage Collection） 
	*/
	export function triggerGC();
	/**
	* 获取转发详细信息 
	*/
	export function getShareInfo(obj: { shareTicket?: string, timeout?: number, success?: Function, fail?: Function, complete?: Function });
	/**
	* 隐藏转发按钮 
	*/
	export function hideShareMenu(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 取消监听用户点击右上角菜单的「转发」按钮时触发的事件 
	*/
	export function offShareAppMessage(callback: Function);

	/**
	* 阿拉丁打点替换
	* 监听用户点击右上角菜单的「转发」按钮时触发的事件 
	*/
	export function aldOnShareAppMessage(callback: (res: { title: string, imageUrl: string, query: string }) => void);

	/**
	* 阿拉丁打点替换
	* 主动拉起转发，进入选择通讯录界面 阿拉丁打点替换
	*/
	export function aldShareAppMessage(obj: { title?: string, imageUrl?: string, query?: string });

	export function aldSendOpenid(openId: string): void;

	export function getPotentialFriendList(args: { success: (res: { errMsg: string, list: Array<FriendInfo> }) => void, fail: (res: any) => void });

	export function shareMessageToFriend(args: { openId: string, title: string, imageUrl: string }): void;

	export function setMessageToFriendQuery(args: { shareMessageToFriendScene: number }): void;

	export function requestSubscribeMessage(args: { tmplIds: Array<string>, success: (res: { errMsg: string }) => void, fail: (res: any) => void }): void;

	/**
	* 阿拉丁打点替换
	* 自定义事件
	*/
	export function aldSendEvent(key: string, { key: value }?: any);

	export const aldStage: {
		onStart: Function,
		onRunning: Function,
		onEnd: Function
	};

	/**
	* 监听用户点击右上角菜单的「转发」按钮时触发的事件 
	*/
	export function onShareAppMessage(callback: (res: { title: string, imageUrl: string, query: string }) => void);
	/**
	* 主动拉起转发，进入选择通讯录界面 
	*/
	export function shareAppMessage(obj: { title?: string, imageUrl?: string, query?: string });
	/**
	* 显示当前页面的转发按钮 
	*/
	export function showShareMenu(obj: { withShareTicket?: boolean, menus?: Array<string>, success?: Function, fail?: Function, complete?: Function });
	/**
	* 更新转发属性 
	*/
	export function updateShareMenu(obj: { withShareTicket?: boolean, isUpdatableMessage?: boolean, activityId?: string, templateInfo?: Object, success?: Function, fail?: Function, complete?: Function });
	/**
	* 清理本地数据缓存 
	*/
	export function clearStorage(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* wx.clearStorage 的同步版本 
	*/
	export function clearStorageSync();
	/**
	* 从本地缓存中异步获取指定 key 的内容 
	*/
	export function getStorage(obj: { key?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 异步获取当前storage的相关信息 
	*/
	export function getStorageInfo(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* wx.getStorageInfo 的同步版本 
	*/
	export function getStorageInfoSync(): Object;
	/**
	* wx.getStorage 的同步版本 
	*/
	export function getStorageSync(key: string): Object | string;
	/**
	* 从本地缓存中移除指定 key 
	*/
	export function removeStorage(obj: { key?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* wx.removeStorage 的同步版本 
	*/
	export function removeStorageSync(key: string);
	/**
	* 将数据存储在本地缓存中指定的 key 中 
	*/
	export function setStorage(obj: { key?: string, data?: Object | string, success?: Function, fail?: Function, complete?: Function });
	/**
	* wx.setStorage 的同步版本 
	*/
	export function setStorageSync(key: string, data: Object | string);
	/**
	* 触发分包加载，详见 分包加载 
	*/
	export function loadSubpackage(object: Object): LoadSubpackageTask;
	/**
	* 退出当前小游戏 
	*/
	export function exitMiniProgram(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 返回小程序启动参数 
	*/
	export function getLaunchOptionsSync(): LaunchOption;
	/**
	* 取消监听小游戏隐藏到后台事件 
	*/
	export function offHide(callback: Function);
	/**
	* 取消监听小游戏回到前台的事件 
	*/
	export function offShow(callback: Function);
	/**
	* 监听小游戏隐藏到后台事件 
	*/
	export function onHide(callback: Function);
	/**
	* 监听小游戏回到前台的事件 
	*/
	export function onShow(callback: (res: LaunchOption) => void);
	/**
	* 取消监听音频因为受到系统占用而被中断开始事件 
	*/
	export function offAudioInterruptionBegin(callback: Function);
	/**
	* 取消监听音频中断结束事件 
	*/
	export function offAudioInterruptionEnd(callback: Function);
	/**
	* 取消监听全局错误事件 
	*/
	export function offError(callback: Function);
	/**
	* 监听音频因为受到系统占用而被中断开始事件 
	*/
	export function onAudioInterruptionBegin(callback: Function);
	/**
	* 监听音频中断结束事件 
	*/
	export function onAudioInterruptionEnd(callback: Function);
	/**
	* 监听全局错误事件 
	*/
	export function onError(callback: (res: { message: string, stack: string }) => void);
	/**
	* 获取系统信息 
	*/
	export function getSystemInfo(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* wx.getSystemInfo 的同步版本 
	*/
	export function getSystemInfoSync(): { screenWidth: number, screenHeight: number, SDKVersion: string, language: string, model: string, system: string, platform: string, version: string };
	/**
	* 取消监听触点失效事件 
	*/
	export function offTouchCancel(callback: Function);
	/**
	* 取消监听触摸结束事件 
	*/
	export function offTouchEnd(callback: Function);
	/**
	* 取消监听触点移动事件 
	*/
	export function offTouchMove(callback: Function);
	/**
	* 取消监听开始触摸事件 
	*/
	export function offTouchStart(callback: Function);
	/**
	* 监听触点失效事件 
	*/
	export function onTouchCancel(callback: (res: { touches: Array<WxTouch>, changedTouches: Array<WxTouch>, timeStamp: number }) => void);
	/**
	* 监听触摸结束事件 
	*/
	export function onTouchEnd(callback: (res: { touches: Array<WxTouch>, changedTouches: Array<WxTouch>, timeStamp: number }) => void);
	/**
	* 监听触点移动事件 
	*/
	export function onTouchMove(callback: (res: { touches: Array<WxTouch>, changedTouches: Array<WxTouch>, timeStamp: number }) => void);
	/**
	* 监听开始触摸事件 
	*/
	export function onTouchStart(callback: (res: { touches: Array<WxTouch>, changedTouches: Array<WxTouch>, timeStamp: number }) => void);
	/**
	* 隐藏 loading 提示框 
	*/
	export function hideLoading(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 隐藏消息提示框 
	*/
	export function hideToast(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* ​显示操作菜单 
	*/
	export function showActionSheet(obj: { itemList?: Array<string>, itemColor?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 显示 loading 提示框 
	*/
	export function showLoading(obj: { title?: string, mask?: boolean, success?: Function, fail?: Function, complete?: Function });
	/**
	* 显示模态对话框 
	*/
	export function showModal(obj: { title?: string, content?: string, showCancel?: boolean, cancelText?: string, cancelColor?: string, confirmText?: string, confirmColor?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 显示消息提示框 
	*/
	export function showToast(obj: { title?: string, icon?: string, image?: string, duration?: number, mask?: boolean, success?: Function, fail?: Function, complete?: Function });
	/**
	* 隐藏键盘 
	*/
	export function hideKeyboard(obj: { success?: Function, fail?: Function, complete?: Function });
	/**
	* 取消监听监听键盘收起的事件 
	*/
	export function offKeyboardComplete(callback: Function);
	/**
	* 取消监听用户点击键盘 Confirm 按钮时的事件 
	*/
	export function offKeyboardConfirm(callback: Function);
	/**
	* 取消监听键盘输入事件 
	*/
	export function offKeyboardInput(callback: Function);
	/**
	* 监听监听键盘收起的事件 
	*/
	export function onKeyboardComplete(callback: (res: { value: string }) => void);
	/**
	* 监听用户点击键盘 Confirm 按钮时的事件 
	*/
	export function onKeyboardConfirm(callback: (res: { value: string }) => void);
	/**
	* 监听键盘输入事件 
	*/
	export function onKeyboardInput(callback: (res: { value: Object }) => void);
	/**
	* 显示键盘 
	*/
	export function showKeyboard(obj: { defaultValue?: string, maxLength?: number, multiple?: boolean, confirmHold?: boolean, confirmType?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 更新键盘输入框内容 
	*/
	export function updateKeyboard(obj: { value?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 获取菜单按钮的布局置信息 
	*/
	export function getMenuButtonBoundingClientRect(): Object;
	/**
	* 动态设置通过右上角按钮拉起的菜单的样式 
	*/
	export function setMenuStyle(obj: { style?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 当在配置中设置 showStatusBarStyle 时，屏幕顶部会显示状态栏 
	*/
	export function setStatusBarStyle(obj: { style?: string, success?: Function, fail?: Function, complete?: Function });
	/**
	* 取消监听窗口尺寸变化事件 
	*/
	export function offWindowResize(callback: Function);
	/**
	* 监听窗口尺寸变化事件 
	*/
	export function onWindowResize(callback: (res: { windowWidth: number, windowHeight: number }) => void);
	/**
	* 获取全局唯一的版本更新管理器，用于管理小程序更新 
	*/
	export function getUpdateManager(): UpdateManager;
	/**
	* 创建一个 Worker 线程 
	*/
	export function createWorker(scriptPath: string): Worker;

	//设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
	//https://developers.weixin.qq.com/minigame/dev/api/ui/window/wx.setWindowSize.html
	export function setWindowSize(obj: { width: number, height: number, success?: Function, fail?: Function, complete?: Function }): void;

	export function getGameServerManager(): GameServerManager;

	interface Rsp {
		errCode: number;
		errMsg: string;
	}

	interface CreateRoomRsp extends Rsp {
		data: {
			accessInfo: string,//房间唯一标识
			clientId: number//用户在房间内的唯一标识
		};
	}

	interface GetFriendsStateDataRsp extends Rsp {
		list: Array<FriendStateData>;//好友状态信息列表
	}

	interface FriendStateData extends FriendInfo {
		userState: string,//该玩家的自定义状态信息，通过 GameServerManager.setState 接口设置 //貌似过一段时间不上线会被清空
		userStates: UserStates,
		sysState: number,//系统状态，0 掉线 1 在线
		openId: string,//好友 openId
		nickName: string,//好友昵称
		avatarUrl: string,//好友头像
		gender: number//好友性别 0未设置 1男 2女
	}

	interface GetLastRoomInfoRsp extends Rsp {
		data: {
			accessInfo: string,//最近参与房间的 accessInfo
			roomInfo: RoomInfo//最近参与房间的详细信息
		};
	}

	interface RoomInfo {
		appId: string;//小游戏 appId
		roomIdStr: string;//房间 ID
		roomState: any;//房间状态
		maxMemberNum: number;//房间最多可容纳人数
		createTimestamp: number;//创建时间
		updateTimestamp: number;//最近更新时间
		gameTick: number;//游戏下发帧的时间间隔，单位 ms
		startPercent: number;//需要满足百分比的玩家都发送了开始指令才能启动游戏。有效范围 0~100，0 表示只要有一个人调用开始就启动，100 表示要求所有人都开始才能启动。
		roomExtInfo: string;//游戏自定义的关于房间的扩展信息
		gameLastTime: number;//游戏对局时长，单位 s
		udpReliabilityStrategy: number;//UDP可靠性策略， 0：全冗余 N：固定冗余N帧
		memberList: Array<Member>;//成员列表
		seed: string;//游戏随机种子
		thirdpartyGameUrl: string;
		protocol: number;
		expectUinList: Array<any>;
		gameVersion: number;
	}

	interface Member {
		isReady: boolean;//玩家准备状态
		role: any;//角色
		posNum: number;//座位号，从 0 开始
		headimg: string;//头像 URL（房间 needUserInfo 为 true 时才会有）
		nickname: string;//用户昵称（房间 needUserInfo 为 true 时才会有）
		clientId: number;//用户在房间内的唯一标识
		enableToStart: boolean;//是否已做好游戏开始准备（调用过 startGame）
		memberExtInfo: string;//游戏自定义的关于成员的扩展信息
		军衔: number;
		总场数: number;
		胜利场数: number;
		gender: number;
		heartBeatTimeStamp: number;
		hasSendTimeOut: boolean;
	}

	interface GetLostFramesRsp extends Rsp {
		data: {
			frameList: Array<Frame>//丢失的帧数组
		};
	}

	interface Frame {

	}

	interface GetRoomInfoRsp extends Rsp {
		data: {
			roomInfo: RoomInfo//最近参与房间的详细信息
		};
	}

	interface JoinRoomRsp extends Rsp {
		data: {
			myPos: number,//加入房间后被分配的座位号
			clientId: number//用户在房间内的唯一标识
		};
	}

	interface StateUpdateRsp {
		openId: string,
		userState: string,
		sysState: number
	}

	class GameServerManager {

		//在房间内广播
		public broadcastInRoom(args: {
			msg: string;//广播内容
			toPosNumList: Array<number>;//给座位号为哪些的玩家发送信息，不填代表给房间所有人发送
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//玩家换座位
		public changeSeat(args: {
			posNum: number;//座位号，从 0 开始
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//创建游戏房间
		public createRoom(args: {
			maxMemberNum: number;//房间最大人数
			startPercent?: number;//需要满足百分比的玩家都发送了开始指令才能启动游戏。有效范围 0~100，0 表示只要有一个人调用开始就启动，100 表示要求所有人都开始才能启动。
			needUserInfo?: boolean;//是否需要用户头像和昵称
			//true 需要用户头像和昵称，则每个加入房间的人必须授权过用户信息，MemberInfo 中会有 headimage 和 nickname
			//false	不需要用户头像和昵称，MemberInfo 中不会有 headimage 和 nickname
			gameLastTime?: number;//游戏对局时长，到达指定时长时游戏会结束，最大值 3600。
			roomExtInfo?: string;//游戏自定义的关于房间扩展信息，其他人可在 RoomInfo 中读取到最多 32 个字节
			memberExtInfo: string;//游戏自定义的关于个人的扩展信息，其他人可在 MemberInfo 中读取到，最多 32 个字节
			needGameSeed?: boolean;//是否需要生成游戏随机种子，设置为 true，房间信息会携带 gameSeed 属性
			success?: (rsp: CreateRoomRsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//结束帧同步
		public endGame(args: {
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//结束游戏状态同步服务
		public endStateService(args: {
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//获取所有好友的在线状态及信息（该接口需要在开放数据域使用）
		public getFriendsStateData(args: {
			success?: (rsp: GetFriendsStateDataRsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): void;

		//获取最近参与房间的 accessInfo
		public getLastRoomInfo(args: {
			success?: (rsp: GetLastRoomInfoRsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//补帧，补帧区间为 [beginFrameId, endFrameId) ，即左闭右合。
		public getLostFrames(args: {
			beginFrameId: number;//起始帧号。不填或非法值默认从第 1 帧开始补
			endFrameId: number;//结尾帧号。不填或非法值默认补到当前最新帧
			success?: (rsp: GetLostFramesRsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//获取房间详情
		public getRoomInfo(args: {
			success?: (rsp: GetRoomInfoRsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//邀请好友，该好友的系统状态必须为在线（该接口需要在开放数据域使用）
		public inviteFriend(args: {
			openId: string;//被邀请玩家的 openId
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//加入游戏房间
		public joinRoom(args: {
			accessInfo: string;//游戏房间访问凭证
			memberExtInfo: string;//游戏自定义的关于个人的扩展信息，其他人可在 MemberInfo 中读取到，最多 32 个字节
			success?: (rsp: JoinRoomRsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//把一名玩家踢出房间（仅房主有权限）
		public kickoutMember(args: {
			kickoutPos: number;//欲踢除的玩家的座位号
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//登录游戏服务
		public login(): Promise<any>;

		//登出游戏服务
		public logout(): Promise<any>;

		//普通成员退出房间
		public memberLeaveRoom(args: {
			accessInfo: string;//游戏房间访问凭证
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//房主退出房间，assign_owner_to_pos_num 参数被优先处理，其次是 assign_to_min_pos_num，如果二者都没有被设置，则房主退出且房间销毁。
		public ownerLeaveRoom(args: {
			accessInfo: string;//游戏房间访问凭证
			assignOwnerToPosNum?: boolean;//指定座位号的玩家接任房主角色，优先级高于 assignToMinPosNum
			assignToMinPosNum?: boolean;//自动指定最小座位号玩家作为新房主
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//重连游戏服务。如果此时连接并未断开或游戏未开始，会直接成功；如果游戏已开始并且连接已断开，会进行重连，并返回此时服务器的最大帧号。
		public reconnect(args: {
			accessInfo: string;//需要重连的对局房间唯一标识
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//重启游戏并进入"组队中"的状态。如果当前房间游戏已结束，调用可进入"组队中"状态并重置所有玩家的准备状态；如果当前房间已经在"组队中"状态，调用不改变状态；如果当前房间游戏进行中，调用失败。
		public restart(args: {
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//设置邀请好友附带的数据
		public setInviteData(data: string): boolean;

		//更新玩家状态信息
		public setState(args: {
			userState: string;//该玩家的自定义状态信息，长度限制为 256 个字符
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//启动帧同步
		public startGame(args: {
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//开启状态管理服务，只有开启状态管理服务，才能获取在线好友列表以及接收好友邀请
		public startStateService(args: {
			userState: string;//该玩家的自定义状态信息，长度限制为 256 个字符
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//更新玩家准备信息
		public updateReadyStatus(args: {
			accessInfo: string;//游戏房间访问凭证
			isReady: boolean;//是否准备完成
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//上传游戏帧
		public uploadFrame(args: {
			actionList: Array<string> | Array<ArrayBuffer>;//指令数组，每一项的类型必须与配置项 lockStepOption.dataType 一致
			success?: (rsp: Rsp) => void;//接口调用成功的回调函数
			fail?: (rsp: Rsp) => void;//接口调用失败的回调函数
			complete?: (rsp: Rsp) => void;//接口调用结束的回调函数（调用成功、失败都会执行）
		}): Promise<any>;

		//监听用户登出游戏服务事件，可能是主动登出也可能是其他原因被动登出
		public onLogout(callback: () => void): void;

		//取消监听用户登出游戏服务事件
		public offLogout(callback: () => void): void;

		//监听自己被踢出当前房间
		public onBeKickedOut(callback: () => void): void;

		//取消监听自己被踢出当前房间
		public offBeKickedOut(callback: () => void): void;

		//监听收到同个房间内的广播消息
		public onBroadcast(callback: (rsp: { senderPosNum: number, msg: string }) => void): void;

		//取消监听收到同个房间内的广播消息
		public offBroadcast(callback: (rsp: { senderPosNum: number, msg: string }) => void): void;

		//监听断开连接，收到此事件后，需要调用 public reconnect 进行重连
		public onDisconnect(callback: () => void): void;

		//取消监听断开连接，收到此事件
		public offDisconnect(callback: () => void): void;

		//监听帧同步游戏开始
		public onGameStart(callback: () => void): void;

		//取消监听帧同步游戏开始
		public offGameStart(callback: () => void): void;

		//监听帧同步游戏结束
		public onGameEnd(callback: (rsp: { gameAccessInfo: string }) => void): void;

		//取消监听帧同步游戏结束
		public offGameEnd(callback: (rsp: { gameAccessInfo: string }) => void): void;

		//监听接收邀请，当用户确认邀请之后会收到此事件
		public onInvite(callback: (rsp: { openId: string, data: string }) => void): void;

		//取消监听接收邀请，当用户确认邀请之后会收到此事件
		public offInvite(callback: (rsp: { openId: string, data: string }) => void): void;

		//监听房间信息更新
		public onRoomInfoChange(callback: (roomInfo: RoomInfo) => void): void;

		//取消监听房间信息更新
		public offRoomInfoChange(callback: (roomInfo: RoomInfo) => void): void;

		//监听好友在线状态变更（该接口需要在开放数据域使用）
		public onStateUpdate(callback: (rsp: StateUpdateRsp) => void): void;

		//取消监听好友在线状态变更（该接口需要在开放数据域使用）
		public offStateUpdate(callback: (rsp: StateUpdateRsp) => void): void;

		//监听收到同个房间的帧同步消息
		public onSyncFrame(callback: (rsp: { actionList: Array<string> | Array<ArrayBuffer>, frameId: number }) => void): void;

		//取消监听收到同个房间的帧同步消息
		public offSyncFrame(callback: (rsp: { actionList: Array<string> | Array<ArrayBuffer>, frameId: number }) => void): void;

	}

}
