const { ccclass, property } = cc._decorator;

@ccclass
export default class 引导加油拖车 extends cc.Component {

    private hand: cc.Node;

    public show(): void {
        this.node.active = true;
        if (this.hand) { } else {
            this.hand = this.node.getChildByName("hand");
        }
        this.hand.stopAllActions();
        this.hand.x = 188;
        this.hand.y = 144;
        this.hand.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(1, -270, -54).easing(cc.easeCircleActionInOut()),
            cc.delayTime(1),
            cc.moveTo(0.01, 188, 144).easing(cc.easeCircleActionInOut())
        )));
    }

    public hide(): void {
        this.node.active = false;
    }

}
