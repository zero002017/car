import { NativeAdInfo, platformCtrl } from "../zero/global";
import { LoadImgs } from "../zero/LoadImgs";
import { Sounds } from "../zero/Sounds";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NativeAd extends cc.Component {

	private nativeName: string;
	private nativeAdInfo: NativeAdInfo;
	private img: cc.Sprite;
	private nameTxt: cc.Label;

	public init(nativeName: "主界面" | "战斗"): void {

		this.nativeName = nativeName;
		this.img = this.node.getChildByName("img").getComponent(cc.Sprite);
		this.nameTxt = this.node.getChildByName("nameTxt").getComponent(cc.Label);

		this.node.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			platformCtrl.clickNativeAd(this.nativeAdInfo);
		});

	}

	public show(): void {
		this.nativeAdInfo = platformCtrl.getNativeAdInfo(this.nativeName);
		if (this.nativeAdInfo) {

			LoadImgs.load(this.nativeAdInfo.icon, sp => {
				this.img.spriteFrame = sp;
			}, true);

			this.nameTxt.string = this.nativeAdInfo.title;

			platformCtrl.showNativeAd(this.nativeAdInfo);

			this.node.active = true;

		} else {
			this.node.active = false;
		}
	}

	public hide(): void {
		if(this.node.active){
			this.node.active = false;
			platformCtrl.hideNativeAd(this.nativeAdInfo);
		}
	}

}
