import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { SignItem } from "./SignItem";
import { getCurrDate } from "../zero/global";
import { UserStorage } from "../zero/UserStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export class Sign extends Popup {

	private items: Array<SignItem>;
	private close: cc.Node;

	public onHide: () => void;

	public init(): void {

		this.items = new Array();
		let _items: cc.Node = this.node.getChildByName("items");
		let i: number = -1;
		for (let child of _items.children) {
			i++;
			let item: SignItem = child.getComponent(SignItem);
			this.items.push(item);
			item.init(i);
		}

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});

		this.refresh();

	}

	public refresh(): void {
		let currDate: number = getCurrDate();
		let signCount: number = UserStorage.signCount % 7;
		if (UserStorage.lastSignDate2 < currDate) { } else {
			if (UserStorage.signCount > 0 && signCount == 0) {
				signCount = 7;
			}
		}

		let i: number = -1;
		for (let item of this.items) {
			i++;
			item.light.active = false;
			item.lingqu.active = false;
			item.yilingqu.active = false;
			item.black.active = false;
			if (i < signCount) {//已领取
				item.light.active = true;
				item.yilingqu.active = true;
			} else if (UserStorage.lastSignDate2 < currDate && i == signCount) {//可领取
				item.light.active = true;
				item.lingqu.active = true;
			} else {//未达到
				item.black.active = true;
			}
		}
	}

	public show(): void {
		super.show();

		main.moneysUp();

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

		if (this.onHide) {
			let _onHide = this.onHide;
			this.onHide = null;
			_onHide();
		}
	}

}
