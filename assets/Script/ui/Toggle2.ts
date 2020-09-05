import Money from "./Money";
import { Sounds } from "../zero/Sounds";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Toggle2 extends cc.Component {

    private _on: cc.Node;
    private _off: cc.Node;

    public onToggle: () => void;

    public init(): void {
        this._on = this.node.getChildByName("_on");
        this._off = this.node.getChildByName("_off");
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            this.toggle = !this.toggle;
            if (this.onToggle) {
                this.onToggle();
            }
        });
    }

    public get toggle(): boolean {
        return this._on.active;
    }
    public set toggle(value: boolean) {
        this._on.active = value;
        this._off.active = !value;
    }

}
