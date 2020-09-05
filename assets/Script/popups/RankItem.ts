import { Atlas } from "../zero/Atlas";
import { RankData } from "./Rank";
import { getHeadByOpenId } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export class RankItem extends cc.Component {

	private key: cc.Sprite;
	private key2: cc.Label;
	public head: cc.Sprite;
	public nickname: cc.Label;
	private score: cc.Label;

	public init(index: number, rankData: RankData): void {

		this.key = this.node.getChildByName("key").getComponent(cc.Sprite);
		this.key2 = this.node.getChildByName("key2").getComponent(cc.Label);
		this.head = this.node.getChildByName("head").getComponent(cc.Sprite);
		this.nickname = this.node.getChildByName("nickname").getComponent(cc.Label);
		this.score = this.node.getChildByName("score").getComponent(cc.Label);

		if (index < 3) {
			this.key.spriteFrame = Atlas.spss["ranks"][(index + 1).toString()];
		} else {
			this.key.spriteFrame = Atlas.spss["ranks"]["n"];
			this.key2.string = (index + 1).toString();
		}
		this.nickname.string = rankData.nickname;
		this.score.string = rankData.score.toString();
		this.head.spriteFrame = getHeadByOpenId(rankData.openId);
		// LoadImgs.load(cdn + "heads/" + rankData.openId + ".jpg", sp => {
		// 	if (this.head) {//可能 this 已经被 destroy 了
		// 		this.head.spriteFrame = sp;
		// 	}
		// }, true);
	}

}