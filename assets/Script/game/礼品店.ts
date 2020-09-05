import { UserStorage } from "../zero/UserStorage";
import { 礼品店StationId } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class 礼品店 extends cc.Component {

    public stationId: number;
    public pos: number;
    public s: Array<cc.Node>;
    private num: cc.Label;

    public init(): void {
        this.stationId = 礼品店StationId;
        this.pos = 0;
        this.s = this.node.children.slice();
        this.num = this.s[1].getChildByName("num").getComponent(cc.Label);
    }

    public refresh(): void {
        const position = UserStorage.positionss[this.stationId][0];
        if (position && position.level > 0) {
            this.s[0].active = false;
            this.s[1].active = true;
            this.num.string = UserStorage.getItem("礼物").toString();
        } else {
            this.s[0].active = true;
            this.s[1].active = false;
        }
    }

}
