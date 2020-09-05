declare namespace uc {

	export interface SystemInfo {
		model: string;
		pixelRatio: number;
		windowWidth: number;
		windowHeight: number;
		system: string;
		language: string;
		version: string;
		screenWidth: number;
		screenHeight: number;
		SDKVersion: string;
		brand: string;
		fontSizeSetting: number;
		benchmarkLevel: number;
		batteryLevel: number;
		statusBarHeight: number;
		platform: string;
		devicePixelRatio: number;
	}

	export function requestScreenOrientation(args: { orientaiton: 1 | 2, success: (res) => void, fail: (res) => void }): any;

	export function getSystemInfoSync(): SystemInfo;

	export function login(args: {
		success: (res: { code: string }) => void
		fail: () => void
	}): void;

	export function createBannerAd(opts: {
		style: {
			gravity?: number,// 0:左上 1：顶部居中 2：右上
			// 3：左边垂直居中 4：居中 5：右边垂直居中
			// 6：左下 7：底部居中 8：右下 （默认为0）
			left?: number,// 左边 margin
			top?: number,// 顶部 margin
			right?: number,// 右边 margin
			bottom?: number,// 底部 margin
			width?: number,
			height?: number// 如果不设置高度，会按比例适配
		}
	}): BannerAd;

	export class BannerAd {
		public show(): void;
		public hide(): void;
		public onLoad(callback: () => void);
		public onError(callback: (err: any) => void);
		public destroy();
	}

	export function createRewardVideoAd(): RewardedVideoAd;

	export class RewardedVideoAd {
		public load(): Promise<any>;
		public show(): Promise<any>;
		public onLoad(callback: () => void);
		public onError(callback: (err: any) => void);
		public onClose(callback: (res: { isEnded: boolean }) => void): void;
	}

}
