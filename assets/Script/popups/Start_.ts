import { Popup } from "./Popup";
import { main, stageWid } from "../Main";
import { UserStorage } from "../zero/UserStorage";
import { hei0 } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export class Start_ extends Popup {

	public title: cc.Label;

	public onHide: () => void;

	public init(): void {

		this.node.width = stageWid;
		this.node.height = hei0;
		this.node.on(cc.Node.EventType.TOUCH_START, () => {
			this.hide();
		});

		this.title = this.node.getChildByName("title").getComponent(cc.Label);

	}

	public show(): void {
		super.show();

		main.moneysDown();

		this.title.string = "第" + (UserStorage.fubenId + 1) + "天";

		main.delays.delay({
			time: 2,
			action: () => {
				this.hide();
			},
			group: "隐藏开始面板"
		});
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();

		main.delays.clear("隐藏开始面板");

		if (this.onHide) {
			this.onHide();
			this.onHide = null;
		}
	}

	public hideComplete(): void {
		super.hideComplete();
	}

}
