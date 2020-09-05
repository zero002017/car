import { Sounds } from "../zero/Sounds";
import { Atlas } from "../zero/Atlas";
import SignData from "../datas/SignData";
import { DatasManager } from "../datas/DatasManager";
import { SignLingqu } from "./SignLingqu";
import { popups } from "./Popups";
import { main } from "../Main";
import { UserStorage } from "../zero/UserStorage";
import { getCurrDate, platformCtrl } from "../zero/global";
import { Sign } from "./Sign";
import Menu from "../pages/Menu";

const { ccclass, property } = cc._decorator;

@ccclass
export class SignItem extends cc.Component {

	public light: cc.Node;
	private day: cc.Label;
	public icon: cc.Sprite;
	private txt: cc.Label;
	public lingqu: cc.Node;
	public yilingqu: cc.Node;
	public black: cc.Node;

	public init(i: number): void {

		const data = DatasManager.SignDatas[i];

		this.light = this.node.getChildByName("light");

		this.day = this.node.getChildByName("day").getComponent(cc.Label);
		this.day.string = "第" + (i + 1) + "天";

		this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);

		const spriteFrame = Atlas.spss["goods"][data.Icon];
		const rect = spriteFrame.getRect();
		this.icon.spriteFrame = spriteFrame;
		this.icon.node.width = rect.width;
		this.icon.node.height = rect.height;

		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);
		if (data.Gems > 0) {
			this.txt.string = "x" + data.Gems;
		} else {
			this.txt.string = "x" + data.Coins;
		}

		this.lingqu = this.node.getChildByName("lingqu");
		this.lingqu.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			let popup: SignLingqu = popups.show(SignLingqu);
			popup.set(data, 倍数 => {
				let itemName: string;
				let itemNum: number;
				if (data.Gems > 0) {
					itemName = "钻石";
					itemNum = data.Gems * 倍数;
				} else {
					itemName = "金币";
					itemNum = data.Coins * 倍数;
				}
				main.moneys.addMoney(itemName, itemNum, popup.icon.node, null);
				UserStorage.lastSignDate2 = getCurrDate();
				UserStorage.signCount++;
				UserStorage.flush();
				this.node.parent.parent.getComponent(Sign).refresh();
				if (倍数 > 1) { } else {
					platformCtrl.showInsertAdDelay("签到领取奖励插屏广告");
				}
				(main.currPage as Menu).签到.refresh();
			})

		});

		this.yilingqu = this.node.getChildByName("yilingqu");

		this.black = this.node.getChildByName("black");

	}

}
