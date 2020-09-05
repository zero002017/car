const { ccclass, property } = cc._decorator;

@ccclass
export default class 手 extends cc.Component {

    protected start(): void {
        this.node.getChildByName("hand").runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.6, -30, 0).easing(cc.easeCircleActionOut()),
            cc.moveTo(0.6, 0, 0).easing(cc.easeCircleActionIn())
        )));
    }

}
