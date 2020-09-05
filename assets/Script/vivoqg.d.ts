//http://minigame.vivo.com.cn/documents/#/lesson/open-ability/ad

declare namespace vivoqg {

	export function getSystemInfoSync(): { screenWidth: number, screenHeight: number, SDKVersion: string, language: string, model: string, system: string, platform: string };

	export function createRewardedVideoAd(args: { posId: string }): RewardedVideoAd;

	export function createBannerAd(args: { posId: string, style?: {} }): BannerAd;

	export function createInterstitialAd(args: { posId: string, style?: {} }): InsertAd;

	export function createNativeAd(args: { posId: string }): NativeAd;

	export function showToast(args: { title?: string, message: string, buttons?: Array<any>, success?: Function, cancel?: Function, complete?: Function, }): NativeAd;

	export class RewardedVideoAd {
		public load(): Promise<any>;
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
		public style: any;
		public onSize(callback: (res?) => void): void;
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
		public show(): Promise<any>;
		public onLoad(callback: () => void): void;
		public offLoad(): void;
		public onShow(callback: () => void): void;
		public offShow(): void;
		public onError(callback: (err: any) => void): void;
		public offError(): void;
		public destroy(): void;
	}

	export class NativeAd {
		public load(): void;
		public reportAdShow(args: { adId: string }): void;
		public reportAdClick(args: { adId: string }): void;
		public onLoad(callback: (res: { code: number, msg: string, adList: Array<OPPONativeAdArgs> }) => void): void;
		public offLoad(callback: () => void): void;
		public onError(callback: (err: any) => void): void;
		public offError(callback: () => void): void;
		//public destroy(): void;
	}

	export function loadSubpackage(obj: any): void;

	// export function login(args: {
	// 	success: (res: { data: any }) => void,
	// 	fail: (res: any) => void
	// }): void;

}
