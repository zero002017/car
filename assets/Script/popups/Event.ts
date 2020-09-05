import { Popup } from "./Popup";
import { main, stageWid } from "../Main";
import { game } from "../pages/Game";
import { Atlas } from "../zero/Atlas";
import { hei0 } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export class Event extends Popup {

	public icon: cc.Sprite;
	public title: cc.Label;
	public desc: cc.Label;

	public onHide: () => void;

	public init(): void {

		this.node.width = stageWid;
		this.node.height = hei0;
		this.node.on(cc.Node.EventType.TOUCH_START, () => {
			this.hide();
		});

		this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
		this.title = this.node.getChildByName("title").getComponent(cc.Label);
		this.desc = this.node.getChildByName("desc").getComponent(cc.Label);

	}

	public show(): void {
		super.show();

		main.moneysDown();

		main.showBannerAd("礼包", 0, 1);

		this.icon.spriteFrame = Atlas.spss["events"][game.currEventData.Name];
		this.title.string = game.currEventData.Name;
		this.desc.string = game.currEventData.Description;
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();

		main.hideBannerAd();

		if (this.onHide) {
			this.onHide();
			this.onHide = null;
		}
	}

	public hideComplete(): void {
		super.hideComplete();
	}

}
