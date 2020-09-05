import { p0n2n, n2n_out } from "../zero/global";
import BaseMoneys from "../ui/BaseMoneys";
import Money from "../ui/Money";
import { DatasManager } from "../datas/DatasManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMoneys extends BaseMoneys {

    private time: cc.Label;

    public 金币: Money;

    public init(): void {

        this.time = this.node.getChildByName("time").getChildByName("txt").getComponent(cc.Label);

        this.金币 = this.node.getChildByName("金币").getComponent(Money);

        this.金币.init();

    }

    public set(): void {
        this.金币.itemName = "金币";
        this.金币.value = 0;
        this.金币.refresh();
    }

    public addMoney(itemName: string, d: number, from: cc.Node, onComplete: () => void): void {
        if (d > 0) {
            let money: Money = this[itemName];
            if (from) {
                p0n2n(from, this.node);
                this.playEffects(itemName, d, n2n_out.x, n2n_out.y, money.node.x + money.icon.x, money.node.y + money.icon.y, null, dd => {
                    money.value += dd;
                    money.refresh();
                }, onComplete);
            } else {
                money.value += d;
                money.refresh();
            }
        }
    }

    public updateTime(time: number): void {
        time = DatasManager.时间范围[0] * 2 + time;
        this.time.string = (100 + Math.floor(time / 2)).toString().substr(1) + ":" + (100 + (time % 2) * 30).toString().substr(1);
    }

}