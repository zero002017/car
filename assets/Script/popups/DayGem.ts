import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { platformCtrl } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export class DayGem extends Popup {

	private btn: cc.Node;
	private close: cc.Node;

	public init(): void {

		this.btn = this.node.getChildByName("btn");
		this.btn.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
			platformCtrl.openDayGem();
		});

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});

	}

	public show(): void {
		super.show();

		main.moneysDown();

		main.showBannerAd("签到转盘客服", 0, 1);
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();
		
		main.hideBannerAd();
	}

	public hideComplete(): void {
		super.hideComplete();
	}

}
