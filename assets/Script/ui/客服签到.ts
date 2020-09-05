import { getCurrDate, platformCtrl } from "../zero/global";
import { UserStorage } from "../zero/UserStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class 客服签到 extends cc.Component {

    private dot: cc.Node;

    public init(): void {
        this.dot = this.node.getChildByName("dot");
        this.refresh();
    }

    public refresh(): void {
        let date: number = getCurrDate();
        if (platformCtrl.显示客服签到) {
            this.dot.active = UserStorage.signDatenum2 >= date;
        } else {
            this.dot.active = false;
        }
    }

}
