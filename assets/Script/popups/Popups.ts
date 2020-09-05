import { Alert } from "./Alert";
import { Confirm } from "./Confirm";
import { Popup } from "./Popup";
import { UserStorage } from "../zero/UserStorage";
import { MeiriCoins } from "./MeiriCoins";
import { main } from "../Main";
import { 钻石不足 } from "../zero/global";
import { Sounds } from "../zero/Sounds";

const { ccclass, property } = cc._decorator;

export namespace popups {

	export let container: cc.Node;
	let bottom: cc.Node;
	let disable: cc.Node;
	export let stackTop: number;

	export let _alert: Alert;
	let _confirm: Confirm;

	let currPopup: Popup;

	@ccclass
	export class Popups extends cc.Component {

		public init(): void {

			window["popups"] = popups;

			container = this.node;
			bottom = container.getChildByName("bottom");
			bottom.getChildByName("black").on(cc.Node.EventType.TOUCH_START, () => { });
			disable = container.getChildByName("disable");
			disable.on(cc.Node.EventType.TOUCH_START, () => { });
			stackTop = -1;

			for (let child of container.children) {
				switch (child) {
					case bottom:
					case disable:
						continue;
				}
				let popup: Popup = child.getComponent(Popup);
				if (popup) {
					popup.init();
				} else {
					console.error("木有 Popup：" + child.name);
				}
			}

			_alert = container.getChildByName("alert").getComponent(Alert);
			_confirm = container.getChildByName("confirm").getComponent(Confirm);

		}

	}

	export function getPopup<TPopup extends Popup>(type: { prototype: TPopup }): TPopup {
		for (let child of container.children) {
			if (child == bottom) {
				continue;
			}
			let popup: TPopup = child.getComponent(type);
			if (popup) {
				return popup;
			}
		}
		console.error("木有 " + type);
		return null;
	}

	export function show<TPopup extends Popup>(type: { prototype: TPopup }): TPopup {
		let popup = getPopup<TPopup>(type);
		if (popup) {
			if (currPopup == popup) { } else {
				currPopup = popup;
				stackTop++;
				//console.log("show stackTop=" + stackTop);
				if (stackTop == 0) {
					main.updateCPBIcons();
					bottom.active = true;
					bottom.opacity = 0;
					bottom.stopAllActions();
					bottom.runAction(cc.fadeIn(0.5));
				} else {
					bottom.setSiblingIndex(stackTop);
				}
				popup.node.stopAllActions();
				popup.node.setSiblingIndex(stackTop + 1);
				popup.node.active = true;
				popup.node.y = -100;
				popup.node.opacity = 0;
				popup.show();
				popup.node.runAction(cc.fadeIn(0.5));
				popup.node.runAction(cc.sequence(
					cc.moveTo(0.5, 0, 0).easing(cc.easeBackOut()),
					cc.callFunc(() => {
						popup.showComplete();
					}, popups)
				));
			}
		}
		return popup;
	}

	export function hide<TPopup extends Popup>(popup: TPopup): void {
		disable.active = true;
		currPopup = null;
		stackTop--;
		//console.log("hide stackTop=" + stackTop);
		if (stackTop > -1) {
			bottom.setSiblingIndex(stackTop);
		} else {
			bottom.stopAllActions();
			bottom.runAction(cc.sequence(
				cc.fadeOut(0.3),
				cc.callFunc(() => {
					main.updateCPBIcons();
					bottom.active = false;
				}, this)
			));
		}
		popup.node.stopAllActions();
		popup.node.runAction(cc.fadeOut(0.3));
		popup.node.runAction(cc.sequence(
			cc.moveTo(0.3, 0, -100).easing(cc.easeBackIn()),
			cc.callFunc(() => {
				popup.node.active = false;
				disable.active = false;
				popup.hideComplete();
			}, this)
		));
	}

	export function alert(msg: string, callback?: () => void): Alert {
		_alert.content.string = msg;
		_alert.callback = callback;
		return show(Alert);
	}

	export function confirm(msg: string, callback?: (flag: boolean) => void): Confirm {
		_confirm.content.string = msg;
		_confirm.callback = callback;
		return show(Confirm);
	}

	export function confirmCost(costName: string, costNum: number, callback: (flag: boolean) => void, giftCallback: (success: boolean) => void): void {
		if (UserStorage.getItem(costName) >= costNum) {
			if (callback) {
				callback(true);
			}
		} else {
			if (callback) {
				callback(false);
			}
			switch (costName) {
				case "钻石":
					//show(Gift).set("看视频领钻石", DatasManager.看视频领钻石观看视频, costName + "不足", costName, DatasManager.看视频领钻石数量, DatasManager.看视频领钻石图标, giftCallback);
					钻石不足();
					break;
				case "金币":
					//show(Gift).set("看视频领金币", DatasManager.看视频领金币观看视频, costName + "不足", costName, DatasManager.看视频领金币数量, DatasManager.看视频领金币图标, giftCallback);
					popups.show(MeiriCoins);
					break;
			}
			Sounds.playFX("金币不足提示");
		}
	}

}
