import { Popup } from "./Popup";

const { ccclass, property } = cc._decorator;

@ccclass
export class 防沉迷 extends Popup {

	public txt: cc.Label;
	public ok: cc.Node;

	public init(): void {
		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);
		this.ok = this.node.getChildByName("ok");
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
