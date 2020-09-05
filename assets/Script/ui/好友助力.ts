import { UserStorage } from "../zero/UserStorage";
import { toast, 未领取邀请奖励数量 } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class 好友助力 extends cc.Component {

    private dot: cc.Node;

    public init(): void {
        this.dot = this.node.getChildByName("dot");
        this.refresh(false);
    }

    public refresh(_toast: boolean): void {
        const _未领取邀请奖励数量 = 未领取邀请奖励数量();
        if (_未领取邀请奖励数量 > 0) {
            if (_toast) {
                toast("您已成功邀请" + _未领取邀请奖励数量 + "位新的好友进入游戏，请再接再厉！");
            }
            this.dot.active = true;
        } else {
            this.dot.active = false;
        }
    }

}
