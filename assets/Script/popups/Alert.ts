import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";

const { ccclass, property } = cc._decorator;

@ccclass
export class Alert extends Popup {

	public content: cc.Label;
	public ok: cc.Node;

	public callback: () => void;

	public init(): void {
		this.content = this.node.getChildByName("content").getComponent(cc.Label);
		this.ok = this.node.getChildByName("ok");
		this.ok.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
			this.hide();
			if (this.callback) {
				let callback = this.callback;
				this.callback = null;
				callback();
			}
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
