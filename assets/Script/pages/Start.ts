import Page from "./Page";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Start extends Page {

    private go: cc.Node;

    public init(): void {
        super.init();

        this.go = this.node.getChildByName("go");
        this.go.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            main._go();
        });
        this.go.getChildByName("点击屏幕继续").runAction(cc.repeatForever(cc.sequence(
            cc.fadeTo(1, 100),
            cc.fadeTo(1, 255)
        )));
    }

    public show(): void {
        super.show();
        
        main.startCPB.active(this.node);
    }

    public showComplete(): void {
        super.showComplete();
    }

    public hide(): void {
        super.hide();
    }

    public hideComplete(): void {
        super.hideComplete();

        main.startCPB.deactive();
    }

}
