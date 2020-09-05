import { UserStorage } from "../zero/UserStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class 试玩领奖 extends cc.Component {

    private dot: cc.Node;

    public init(): void {
        this.dot = this.node.getChildByName("dot");
        this.refresh();
    }

    public refresh(): void {
        this.dot.active = !UserStorage.clickedHutuiqiang;
    }

}
