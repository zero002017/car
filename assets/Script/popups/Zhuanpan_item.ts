import ZhuanpanData from "../datas/ZhuanpanData";
import { Atlas } from "../zero/Atlas";

const { ccclass, property } = cc._decorator;

@ccclass
export class Zhuanpan_item extends cc.Component {

	private icon: cc.Sprite;
	private txt: cc.Label;

	public init(data: ZhuanpanData): void {

		this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);

		const spriteFrame = Atlas.spss["goods"][data.icon];
		const rect = spriteFrame.getRect();
		this.icon.spriteFrame = spriteFrame;
		this.icon.node.width = rect.width;
		this.icon.node.height = rect.height;

		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);
		this.txt.string = "x" + (data.Gems > 0 ? data.Gems : data.Coins);

	}

}
