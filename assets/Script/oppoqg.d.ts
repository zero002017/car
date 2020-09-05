//https://cdofs.oppomobile.com/cdo-activity/static/201810/26/quickgame/documentation/ad/ad.html

interface OPPONativeAdArgs {
	adId: string;
	title: string;
	desc: string;
	icon: string;
	imgUrlList: Array<string>;
	logoUrl: string;
	clickBtnTxt: string;
	creativeType: number;
	interactionType: number;
}

declare namespace oppoqg {

	export function getSystemInfoSync(): { screenWidth: number, screenHeight: number, SDKVersion: string, language: string, model: string, system: string, platform: string };

	export function setLoadingProgress(args: { progress: number }): void;

	export function loadingComplete(args: any): void;

	export function initAdService(args: { appId: string, isDebug: boolean, success: (res: any) => void, fail: (res: any) => void }): void;

	export function createRewardedVideoAd(args: { posId: string }): RewardedVideoAd;

	export function createBannerAd(args: { posId: string }): BannerAd;

	export function createInsertAd(args: { adUnitId: string }): InsertAd;

	export function createInterstitialVideoAd(args: { adUnitId: string }): InsertVideoAd;

	export function createNativeAd(args: { adUnitId: string }): NativeAd;

	/**
		* oppo 上报崩溃信息
		*/
	export function reportMonitor(name: string, value: number): any;

	export class RewardedVideoAd {
		public load(): void;
		public show(): void;
		public onLoad(callback: () => void): void;
		public offLoad(callback: () => void): void;
		public onVideoStart(callback: () => void): void;
		public offVideoStart(): void;
		public onClose(callback: (res: { isEnded: boolean }) => void): void;
		public offClose(callback: (res: { isEnded: boolean }) => void): void;
		public onError(callback: (err: any) => void): void;
		public offError(callback: (err: any) => void): void;
		public destroy(): void;
	}

	export class BannerAd {
		public show(): void;
		public hide(): void;
		public onShow(callback: () => void): void;
		public offShow(): void;
		public onHide(callback: () => void): void;
		public offHide(): void;
		public onError(callback: (err: any) => void): void;
		public offError(): void;
		public destroy(): void;
	}

	export class InsertAd {
		public load(): void;
		public show(): void;
		public onLoad(callback: () => void): void;
		public offLoad(callback: () => void): void;
		public onClose(callback: () => void): void;
		public offClose(callback: () => void): void;
		public onError(callback: (err: any) => void): void;
		public offError(callback: () => void): void;
		public destroy(): void;
	}

	export class InsertVideoAd {
		public load(): void;
		public show(): void;
		public onLoad(callback: () => void): void;
		public offLoad(callback: () => void): void;
		public onShow(callback: () => void): void;
		public offShow(callback: () => void): void;
		public onClose(callback: () => void): void;
		public offClose(callback: () => void): void;
		public onError(callback: (err: any) => void): void;
		public offError(callback: () => void): void;
		public destroy(): void;
	}

	export class NativeAd {
		public load(): void;
		public reportAdShow(args: { adId: string }): void;
		public reportAdClick(args: { adId: string }): void;
		public onLoad(callback: (res: { code: number, msg: string, adList: Array<OPPONativeAdArgs> }) => void): void;

		// adId	string	广告标识，用来上报曝光与点击
		// title	string	广告标题
		// desc	string	广告描述
		// icon	string	推广应用的 Icon 图标
		// imgUrlList	Array	广告图片
		// logoUrl	string	“广告”标签图片
		// clickBtnTxt	string	点击按钮文本描述
		// creativeType	number	获取广告类型，取值说明：
		// 0：无 
		// 1：纯文字 
		// 2：图片 
		// 3：图文混合 
		// 4：视频 
		// 6. 640x320 大小图文混合 
		// 7. 320x210 大小图文单图 
		// 8. 320x210 大小图文多图
		// interactionType	number	获取广告点击之后的交互类型，取值说明： 
		// 0：无 
		// 1：浏览类 
		// 2：下载类 
		// 3：浏览器（下载中间页广告） 
		// 4：打开应用首页 
		// 5：打开应用详情页

		public offLoad(callback: () => void): void;
		public onError(callback: (err: any) => void): void;
		public offError(callback: () => void): void;
		public destroy(): void;
	}

	export function login(args: {
		success: (res: { data: any }) => void,
		fail?: (res: any) => void
		complete?: (res: any) => void
	}): void;

}
