import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { Atlas } from "../zero/Atlas";
import ZhuanpanChestData from "../datas/ZhuanpanChestData";
import { UserStorage } from "../zero/UserStorage";
import { DatasManager } from "../datas/DatasManager";
import { grey, normal, 检测全部转盘宝箱都领完了并重置转盘宝箱 } from "../zero/global";
import { zhuanpan } from "./Zhuanpan";

const { ccclass, property } = cc._decorator;

@ccclass
export class ChestLingqu extends Popup {

	private data: ZhuanpanChestData;

	public icon: cc.Sprite;
	private txt: cc.Label;
	private info: cc.Label;
	private lingqu: cc.Node;
	private close: cc.Node;

	private 可以领取: boolean;

	public init(): void {

		this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);

		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);

		this.info = this.node.getChildByName("info").getComponent(cc.Label);

		this.lingqu = this.node.getChildByName("lingqu");
		this.lingqu.on(cc.Node.EventType.TOUCH_START, () => {
			if (this.可以领取) {
				Sounds.playFX("点击");
				UserStorage.zhuanpanChestLingqus[DatasManager.ZhuanpanChestDatas.indexOf(this.data)] = true;
				let itemName: string;
				let itemNum: number;
				if (this.data.Gems > 0) {
					itemName = "钻石";
					itemNum = this.data.Gems;
				} else {
					itemName = "金币";
					itemNum = this.data.Coins;
				}
				main.moneys.addMoney(itemName, itemNum, this.icon.node, null);

				检测全部转盘宝箱都领完了并重置转盘宝箱();

				UserStorage.flush();
				this.hide();
				zhuanpan.refresh();
			}
		});

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});
	}

	public set(data: ZhuanpanChestData, 可以领取: boolean): void {

		this.data = data;

		const spriteFrame = Atlas.spss["goods"][data.Icon];
		const rect = spriteFrame.getRect();
		this.icon.spriteFrame = spriteFrame;
		this.icon.node.width = rect.width;
		this.icon.node.height = rect.height;

		this.txt.string = "x" + (data.Gems > 0 ? data.Gems : data.Coins);

		this.info.string = "转动转盘累计" + data.Times + "次可领取";

		this.lingqu.getComponent(cc.Button).interactable = this.可以领取 = 可以领取;

	}

	public show(): void {
		super.show();

		main.moneysUp();

		main.showBannerAd("礼包", 0, 1);
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
