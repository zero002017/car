import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import WatchVideo from "../ui/WatchVideo";
import { Atlas } from "../zero/Atlas";
import SignData from "../datas/SignData";
import { DatasManager } from "../datas/DatasManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class SignLingqu extends Popup {

	public icon: cc.Sprite;
	private txt: cc.Label;
	private lingqu: cc.Node;
	private watchVideo: WatchVideo;
	private close: cc.Node;

	private sign: (倍数: number) => void;

	public init(): void {

		this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);

		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);

		this.lingqu = this.node.getChildByName("lingqu");
		this.lingqu.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
			this.sign(1);
		});

		this.watchVideo = this.node.getChildByName("watchVideo").getComponent(WatchVideo);
		this.watchVideo.init();

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});

	}

	public set(data: SignData, sign: (倍数: number) => void): void {

		this.sign = sign;

		const spriteFrame = Atlas.spss["goods"][data.Icon];
		const rect = spriteFrame.getRect();
		this.icon.spriteFrame = spriteFrame;
		this.icon.node.width = rect.width;
		this.icon.node.height = rect.height;

		if (data.Gems > 0) {
			this.txt.string = "x" + data.Gems;
		} else {
			this.txt.string = "x" + data.Coins;
		}

		this.watchVideo.set("双倍领取", "签到双倍", DatasManager.签到双倍观看视频, null, () => {
			this.hide();
			this.sign(2);
		});

	}

	public show(): void {
		super.show();
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
