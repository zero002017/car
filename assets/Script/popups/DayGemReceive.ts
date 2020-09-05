import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { DatasManager } from "../datas/DatasManager";
import { UserStorage } from "../zero/UserStorage";
import { Atlas } from "../zero/Atlas";

const { ccclass, property } = cc._decorator;

@ccclass
export class DayGemReceive extends Popup {

	private icon: cc.Sprite;
	private txt: cc.Label;
	private lingqu: cc.Node;

	public init(): void {

		this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);

		const spriteFrame = Atlas.spss["goods"][DatasManager.客服签到领钻石图标];
		const rect = spriteFrame.getRect();
		this.icon.spriteFrame = spriteFrame;
		this.icon.node.width = rect.width;
		this.icon.node.height = rect.height;

		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);
		this.txt.string = "x" + DatasManager.客服签到领钻石个数;

		this.lingqu = this.node.getChildByName("lingqu");
		this.lingqu.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
			main.moneys.addMoney("钻石", DatasManager.客服签到领钻石个数, this.icon.node, null);
			UserStorage.flush();
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
