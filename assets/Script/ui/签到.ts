import { UserStorage } from "../zero/UserStorage";
import { getCurrDate } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class 签到 extends cc.Component {

    public dot: cc.Node;

    public init(): void {
        this.dot = this.node.getChildByName("dot");
        this.refresh();
    }

    public refresh():void{
        this.dot.active = UserStorage.lastSignDate2 < getCurrDate();
    }

}
