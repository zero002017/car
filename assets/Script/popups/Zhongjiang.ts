import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { Atlas } from "../zero/Atlas";
import ZhuanpanData from "../datas/ZhuanpanData";
import WatchVideo from "../ui/WatchVideo";
import { DatasManager } from "../datas/DatasManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class Zhongjiang extends Popup {

	public icon: cc.Sprite;
	private txt: cc.Label;
	private lingqu: cc.Node;
	private watchVideo: WatchVideo;

	private onComplete: (倍数: number) => void;

	public init(): void {

		this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);

		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);

		this.lingqu = this.node.getChildByName("lingqu");
		this.lingqu.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
			this.onComplete(1);
		});

		this.watchVideo = this.node.getChildByName("watchVideo").getComponent(WatchVideo);
		this.watchVideo.init();

	}

	public set(data: ZhuanpanData, onComplete: (倍数: number) => void): void {

		const spriteFrame = Atlas.spss["goods"][data.icon];
		const rect = spriteFrame.getRect();
		this.icon.spriteFrame = spriteFrame;
		this.icon.node.width = rect.width;
		this.icon.node.height = rect.height;

		this.txt.string = "x" + (data.Gems > 0 ? data.Gems : data.Coins);

		this.onComplete = onComplete;

		this.watchVideo.set("双倍领取", "中奖", DatasManager.中奖观看视频, null, () => {
			this.hide();
			this.onComplete(2);
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
