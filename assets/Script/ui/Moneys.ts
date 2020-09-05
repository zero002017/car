import Money from "./Money";
import { UserStorage } from "../zero/UserStorage";
import { Sounds } from "../zero/Sounds";
import { popups } from "../popups/Popups";
import { Gift } from "../popups/Gift";
import { DatasManager } from "../datas/DatasManager";
import BaseMoneys from "./BaseMoneys";
import { MeiriGems } from "../popups/MeiriGems";
import { MeiriCoins } from "../popups/MeiriCoins";
import { GlobalStorage } from "../zero/GlobalStorage";
import { FriendHelp } from "../popups/FriendHelp";
import { p0n2n, n2n_out, 钻石不足 } from "../zero/global";
import { yaoqingData } from "../Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Moneys extends BaseMoneys {

    private 钻石: Money;
    private 金币: Money;

    public init(): void {

        this.钻石 = this.node.getChildByName("钻石").getComponent(Money);
        this.金币 = this.node.getChildByName("金币").getComponent(Money);

        this.钻石.init();
        this.金币.init();

        this.钻石.add_.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            //popups.show(Gift).set("看视频领钻石", DatasManager.看视频领钻石观看视频, "看视频领钻石", "钻石", DatasManager.看视频领钻石数量, DatasManager.看视频领钻石图标, null);
            钻石不足();
        });
        this.金币.add_.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            //popups.show(Gift).set("看视频领金币", DatasManager.看视频领金币观看视频, "看视频领金币", "金币", DatasManager.看视频领金币数量, DatasManager.看视频领金币图标, null);
            popups.show(MeiriCoins);
        });

    }

    public set(): void {
        this.钻石.set("钻石");
        this.金币.set("金币");
    }

    public addMoney(itemName: string, d: number, from: cc.Node, onComplete: () => void): void {
        if (d > 0) {
            UserStorage.addItem(itemName, d);
            UserStorage.flush();
            const money: Money = this[itemName];
            if (from) {
                p0n2n(from, this.node);
                this.playEffects(itemName, d, n2n_out.x, n2n_out.y, money.node.x + money.icon.x, money.node.y + money.icon.y, null, dd => {
                    money.value += dd;
                    money.refresh();
                }, onComplete);
            } else {
                money.value = UserStorage.getItem(itemName);
                money.refresh();
            }
        }
    }

    public costMoney(itemName: string, d: number, onSuccess: () => void): void {
        if (d > 0) {
            if (UserStorage.getItem(itemName) >= d) {
                UserStorage.addItem(itemName, -d);
                UserStorage.flush();
                const money: Money = this[itemName];
                money.value = UserStorage.getItem(itemName);
                money.refresh();
                if (onSuccess) onSuccess();
                switch (itemName) {
                    case "金币":
                        Sounds.playFX("花费金币音效");
                        break;
                    case "钻石":
                        Sounds.playFX("花费钻石音效");
                        break;
                }
            }
        }
    }

}