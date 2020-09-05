import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { UserStorage } from "../zero/UserStorage";
import { popups } from "./Popups";
import { platformCtrl, getHeroInfo } from "../zero/global";
import { AVM1 } from "../zero/AVM1";
import { game } from "../pages/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export class GiftCode extends Popup {

	private txt: cc.EditBox;
	private lingqu: cc.Node;
	private close: cc.Node;

	public init(): void {

		this.txt = this.node.getChildByName("txt").getComponent(cc.EditBox);
		this.txt.string = UserStorage.lastGiftCode;

		this.lingqu = this.node.getChildByName("lingqu");
		this.lingqu.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			let code: string = this.txt.string.replace(/\s+/g, "");
			if (code) {
				UserStorage.lastGiftCode = this.txt.string;
				UserStorage.flush();
				const isAVM1Cmd: boolean = !(/^\d+$/.test(code));
				if (!isAVM1Cmd && UserStorage.giftCodes.indexOf(code) > -1) {
					popups.alert("此礼包码已被使用过！");
				} else {
					main.disable.active = true;
					platformCtrl.getGift(code, (rsp: { info: string, message: string }) => {
						main.disable.active = false;
						if (rsp.info) {
							const matchArr = rsp.info.match(/^\+(金币|钻石|经验)(\d+)([KW])?$/);
							if (matchArr) {
								let money: number = parseInt(matchArr[2]);
								switch (matchArr[3]) {
									case "K":
										money *= 1000;
										break;
									case "M":
										money *= 10000;
										break;
								}
								switch (matchArr[1]) {
									case "金币":
									case "钻石":
										main.moneys.addMoney(matchArr[1], money, this.lingqu, null);
										game.heroInfo = getHeroInfo(UserStorage.exp);
										game.heroInfos.set(game.heroInfo);
										break;
									case "经验":
										UserStorage.exp += money;
										break;
								}
								UserStorage.giftCodes.push(code);
								UserStorage.flush();
								this.hide();
							} else {
								AVM1.run(rsp.info);
							}
							return;
						}
						popups.alert(rsp.message || "领取失败");
					});
				}
			} else {
				popups.alert("礼包码不能为空");
			}
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
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();
	}

	public hideComplete(): void {
		super.hideComplete();
	}

}
