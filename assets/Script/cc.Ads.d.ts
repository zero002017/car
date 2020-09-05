declare namespace cc.Ads {

	export class BANNER_POSITION {
		public static ALIGN_PARENT_BOTTOM: string;
	}

	export class RewardedVideo {
		public constructor(adId: string);
		public on(type: string, callback: (error: any) => void): void;
		public loadAd(): Promise<any>;
		public show(): Promise<any>;
	}

	export class Banner {
		public constructor(adId: string, pos: string);
		public on(type: string, callback: (error: any) => void): void;
		public loadAd(): Promise<any>;
		public show(): Promise<any>;
	}

	export class Interstitial {
		public constructor(adId: string);
		public on(type: string, callback: (error: any) => void): void;
		public loadAd(): Promise<any>;
		public show(): Promise<any>;
	}

}
