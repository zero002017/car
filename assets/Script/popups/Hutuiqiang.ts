import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { UserStorage } from "../zero/UserStorage";
import { getCurrDate, grey, platformCtrl } from "../zero/global";
import { popups } from "./Popups";
import { prefabs } from "../ui/Prefabs";
import CPBIcon from "./CPBIcon";

const { ccclass, property } = cc._decorator;

@ccclass
export class Hutuiqiang extends Popup {

	private icons: cc.Node;

	private close: cc.Node;

	public init(): void {

		this.icons = this.node.getChildByName("scrollView").getChildByName("view").getChildByName("icons");

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});

	}

	public show(): void {
		super.show();

		main.moneysUp();

		let date: number = getCurrDate();
		let cpbIndex: number = -1;
		let x: number = -1;
		let y: number = 0;
		for (const cpbGameInfo of platformCtrl.cpbConfig.cpbs) {
			cpbIndex++;
			if (++x >= 2) {
				x = 0;
				y++;
			}
			const icon = prefabs.instantiate("CPBIcon2").getComponent(CPBIcon);
			this.icons.addChild(icon.node);
			icon.node.x = x * 330;
			icon.node.y = -90 * y;
			icon.init("互推墙", cpbIndex, false, false, (icon: CPBIcon, cpbGameInfo, success) => {
				if (success) {
					platformCtrl.hutuiStartTime = new Date().getTime();
					platformCtrl.onHutuiCallback = success => {
						if (UserStorage.lingquHutuiDates[cpbGameInfo.appId] >= date) {
							popups.alert("您已领取过奖励！");
						} else {
							if (success) {
								grey(icon.node.getChildByName("btn").getComponent(cc.Sprite));
								UserStorage.lingquHutuiDates[cpbGameInfo.appId] = date;
								UserStorage.flush();
								main.delays.delay({
									time: 0.5,
									action: () => {
										main.moneys.addMoney("钻石", 1, icon.node.getChildByName("btn"), null);
									}
								});
							} else {
								popups.alert("未体验15秒，无法领取奖励！");
							}
						}
					};
				}
			});
			if (UserStorage.lingquHutuiDates[cpbGameInfo.appId] >= date) {
				grey(icon.node.getChildByName("btn").getComponent(cc.Sprite));
			}
		}
		this.icons.height = (y + 1) * 90;
		let i: number = this.icons.children.length;
		while (i--) {
			const icon = this.icons.children[i].getComponent(CPBIcon);
			icon.node.removeChild(icon.img.node, false);
			this.icons.addChild(icon.img.node);
			icon.img.node.x += icon.node.x;
			icon.img.node.y += icon.node.y;
			icon.node.removeChild(icon.nameTxt.node, false);
			this.icons.addChild(icon.nameTxt.node);
			icon.nameTxt.node.x += icon.node.x;
			icon.nameTxt.node.y += icon.node.y;
		}
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();
	}

	public hideComplete(): void {
		super.hideComplete();

		this.icons.destroyAllChildren();
	}

}
