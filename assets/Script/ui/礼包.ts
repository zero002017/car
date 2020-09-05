import { shareMoneyStartTime, shareMoneyTime, updateShareMoneyTime } from "../zero/global";
import { main } from "../Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class 礼包 extends cc.Component {

    public canClick: boolean;

    public init(): void {
        this.node.scaleX = this.node.scaleY = 0.01;
        this.node.opacity = 0;
        this.hide();
    }

    private step = () => {
        let d: number = shareMoneyTime - (new Date().getTime() - shareMoneyStartTime);
        //console.log("d=" + d);
        if (d <= 0) {
            this.show();
        }
    }

    public hide(): void {
        this.canClick = false;
        this.node.stopAllActions();
        this.node.runAction(cc.fadeOut(0.5));
        this.node.runAction(cc.scaleTo(0.5, 0.01, 0.01));
        updateShareMoneyTime();
        main.enterFrames.add(this.step);
    }

    private show(): void {
        this.canClick = true;
        this.node.stopAllActions();
        this.node.runAction(cc.fadeIn(0.5));
        this.node.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5, 1.2, 1.2).easing(cc.easeSineInOut()),
            cc.scaleTo(0.5, 0.8, 0.8).easing(cc.easeSineInOut())
        )));
        main.enterFrames.clear(this.step);
    }

}
