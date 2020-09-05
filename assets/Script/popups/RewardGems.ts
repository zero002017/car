import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { DatasManager } from "../datas/DatasManager";
import { UserStorage } from "../zero/UserStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export class RewardGems extends Popup {

	private evaluate: cc.Label;
	private baodao: cc.Label;
	private gem: cc.Node;
	private gems: cc.Label;
	private lingqu: cc.Node;

	public init(): void {

		this.evaluate = this.node.getChildByName("evaluate").getComponent(cc.Label);
		this.baodao = this.node.getChildByName("baodao").getComponent(cc.Label);
		this.gem = this.node.getChildByName("gem");
		this.gems = this.node.getChildByName("gems").getComponent(cc.Label);

		this.lingqu = this.node.getChildByName("lingqu");
		this.lingqu.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			const evaluateData = DatasManager.EvaluateDatas[UserStorage.lastEvaluate];
			main.moneys.addMoney("钻石", evaluateData.Reward, this.gem, null);
			this.hide();
		});

	}

	public show(): void {
		super.show();

		const evaluateData = DatasManager.EvaluateDatas[UserStorage.lastEvaluate];
		this.evaluate.string = evaluateData.score;
		this.baodao.string = evaluateData.Baodao;
		this.gems.string = "+" + evaluateData.Reward;
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
