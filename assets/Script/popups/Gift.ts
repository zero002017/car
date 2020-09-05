import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import WatchVideo from "../ui/WatchVideo";
import { Atlas } from "../zero/Atlas";
import { DatasManager } from "../datas/DatasManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class Gift extends Popup {

	private title: cc.Label;
	private icon: cc.Sprite;
	private txt: cc.Label;
	private watchVideo: WatchVideo;
	private close: cc.Node;
	private callback: (success: boolean) => void;

	public init(): void {

		this.title = this.node.getChildByName("title").getComponent(cc.Label);

		this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);

		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);

		this.watchVideo = this.node.getChildByName("watchVideo").getComponent(WatchVideo);
		this.watchVideo.init();

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
			if (this.callback) {
				this.callback(false);
			}
		});

	}

	public set(pos: string, 耗尽视频再分享: boolean, titleLabel: string, itemName: string, 数量: number, 图标: string, callback: (success: boolean) => void) {
		this.title.string = titleLabel || "礼  包";
		this.txt.string = "x" + 数量;

		const spriteFrame = Atlas.spss["goods"][图标];
		const rect = spriteFrame.getRect();
		this.icon.spriteFrame = spriteFrame;
		this.icon.node.width = rect.width;
		this.icon.node.height = rect.height;

		this.callback = callback;
		this.watchVideo.set("观看视频", pos, 耗尽视频再分享, null, () => {
			this.hide();
			switch (itemName) {
				case "视频":
				case "钻石":
				case "金币":
					main.moneys.addMoney(itemName, 数量, this.icon.node, null);
					break;
			}
			if (this.callback) {
				this.callback(true);
			}
		});
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
