import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main, yaoqingData } from "../Main";
import { FriendItem } from "./FriendItem";
import { prefabs } from "../ui/Prefabs";
import { platformCtrl, toast } from "../zero/global";
import { UserStorage } from "../zero/UserStorage";
import { GlobalStorage } from "../zero/GlobalStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export class FriendHelp extends Popup {

	private _items: cc.Node;
	private yaoqing: cc.Node;
	private close: cc.Node;

	public onHide: () => void;

	public init(): void {

		this._items = this.node.getChildByName("scrollView").getChildByName("view").getChildByName("items");

		this.yaoqing = this.node.getChildByName("yaoqing");
		this.yaoqing.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			platformCtrl.share(null);
		});

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});
	}

	public show(): void {
		super.show();

		main.moneysUp();

		for (const openId of yaoqingData.openIds) {
			if (UserStorage.当天统计过的邀请到的openId们.indexOf(openId) == -1) {
				UserStorage.当天统计过的邀请到的openId们.push(openId);
				if (GlobalStorage.邀请次数们[openId] > 0) {
					GlobalStorage.邀请次数们[openId]++;
				} else {
					GlobalStorage.邀请次数们[openId] = 1;
				}
			}
		}
		UserStorage.flush();
		GlobalStorage.flush();

		const L: number = Math.max(yaoqingData.openIds.length, 20);
		for (let i: number = 0; i < L; i++) {
			let friendItem: FriendItem = prefabs.instantiate("FriendItem").getComponent(FriendItem);
			this._items.addChild(friendItem.node);
			friendItem.node.y = -100 * i;
			friendItem.init(i, yaoqingData.openIds[i]);
		}
		this._items.height = 100 * L;

		main.delays.delay({
			time: 0.3,
			action: () => {
				toast("好友通过分享进入，你会获得钻石！");
			}
		});
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();
	}

	public hideComplete(): void {
		super.hideComplete();
		this._items.destroyAllChildren();
		
		if (this.onHide) {
			let _onHide = this.onHide;
			this.onHide = null;
			_onHide();
		}
	}

}
