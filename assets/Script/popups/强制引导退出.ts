import { Popup } from "./Popup";

const { ccclass, property } = cc._decorator;

@ccclass
export class 强制引导退出 extends Popup {

	public txt: cc.Label;

	public init(): void {
		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);
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
