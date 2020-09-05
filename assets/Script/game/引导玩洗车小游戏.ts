const { ccclass, property } = cc._decorator;

@ccclass
export default class 引导玩洗车小游戏 extends cc.Component {

    public hand: cc.Node;

    public show(): void {
        this.node.active = true;
        if (this.hand) { } else {
            this.hand = this.node.getChildByName("hand");
        }
        this.hand.stopAllActions();
    }

    public hide(): void {
        this.node.active = false;
    }

}
