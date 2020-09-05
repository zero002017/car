import { Atlas } from "../zero/Atlas";

const { ccclass, property } = cc._decorator;

@ccclass
export class FriendRankItem extends cc.Component {

	private key: cc.Sprite;
	private key2: cc.Label;

	public init(index: number): void {

		this.key = this.node.getChildByName("key").getComponent(cc.Sprite);
		this.key2 = this.node.getChildByName("key2").getComponent(cc.Label);

		if (index < 3) {
			this.key.spriteFrame = Atlas.spss["ranks"][(index + 1).toString()];
		} else {
			this.key.spriteFrame = Atlas.spss["ranks"]["n"];
			this.key2.string = (index + 1).toString();
		}

	}

}