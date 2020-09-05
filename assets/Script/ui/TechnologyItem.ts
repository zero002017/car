import { UserStorage } from "../zero/UserStorage";
import { Atlas } from "../zero/Atlas";
import { DatasManager } from "../datas/DatasManager";
import { game } from "../pages/Game";
import { prefabs } from "./Prefabs";
import 等待 from "../game/等待";
import { shake, formatTime } from "../zero/global";
import TechnologyData from "../datas/TechnologyData";
import { Sounds } from "../zero/Sounds";
import { popups } from "../popups/Popups";
import { Costs2 } from "../popups/Costs2";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TechnologyItem extends cc.Component {

    private icon: cc.Sprite;
    private nameTxt: cc.Label;
    private _stars: cc.Node;
    private stars: Array<cc.Node>;
    private lock_: cc.Node;
    private lv: cc.Label;

    private onClick: () => void;

    private technologyData: TechnologyData;
    private upgrade: cc.Node;

    public init(): void {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.nameTxt = this.node.getChildByName("nameTxt").getComponent(cc.Label);
        this._stars = this.node.getChildByName("stars");
        this.stars = this._stars.getChildByName("stars").children.slice();
        this.lock_ = this.node.getChildByName("lock_");
        this.lv = this.lock_.getChildByName("lv").getComponent(cc.Label);

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.onClick) {
                this.onClick();
            }
        });
    }

    public set(stationId: number, index: number, technology: UserStorage.Position): void {
        if (this.upgrade) {
            this.upgrade.destroy();
            this.upgrade = null;
        }
        let techId: number = 112000000 + (stationId % 1000) * 100 + (index + 1) * 10 + technology.level;
        if (technology.level == 0) {
            techId++;
        }
        this.technologyData = DatasManager.TechnologyDatasById[techId];
        this.refresh(technology);
    }

    private refresh(technology: UserStorage.Position): void {
        let techId: number = this.technologyData.ID - 112000000;
        if (technology.level == 0) {
            techId--;
        }
        this.icon.spriteFrame = Atlas.spss["technologys"][techId];
        if (technology.level > 0 || game.heroInfo.level >= this.technologyData.UnlockLevel) {
            this.icon.node.opacity = 255;
            this.nameTxt.string = this.technologyData.Name;
            this._stars.active = true;
            let i: number = -1;
            for (const star of this.stars) {
                i++;
                star.active = i < technology.level;
            }
            this.lock_.active = false;
            if (technology.startTime > 0) {
                this.addUpgrade1("等待", technology);
            } else if (technology.level == 0) {
                this.addUpgrade1("购买", technology);
            } else {
                const nextTechnologyData = DatasManager.TechnologyDatasById[this.technologyData.ID + 1];
                if (nextTechnologyData) {
                    if (game.heroInfo.level >= nextTechnologyData.UnlockLevel) {
                        this.addUpgrade1("升级2", technology);
                    }
                }
            }
        } else {
            this.icon.node.opacity = 150;
            this.nameTxt.string = "";
            this._stars.active = false;
            this.lock_.active = true;
            this.lv.string = this.technologyData.UnlockLevel.toString();
        }
    }

    private addUpgrade1(key: "购买" | "升级2" | "等待" | "完成", technology: UserStorage.Position): void {
        //console.log("addUpgrade1 " + key);
        this.upgrade = prefabs.instantiate("升级1");
        this.node.addChild(this.upgrade);
        this.upgrade.x = 90;
        this.upgrade.y = 70;

        let new_: cc.Node = this.upgrade.getChildByName("new_");
        new_.active = false;
        let newedKey: string = null;
        let _wait: 等待 = null;
        switch (key) {
            case "购买":
            case "升级2":
                newedKey = key + " " + this.technologyData.ID;
                if (UserStorage.showNeweds.indexOf(newedKey) == -1) {
                    new_.active = true;
                    shake(new_);
                } else {
                    newedKey = null;
                }
                break;
            case "等待":
                _wait = this.upgrade.getChildByName("icons").getChildByName("等待").getComponent(等待);
                _wait.init(technology, this.technologyData.LevelUpTime, () => {
                    this.upgrade.destroy();
                    this.upgrade = null;
                    this.addUpgrade1("完成", technology);
                });
                break;
            case "完成":
                this.upgrade.runAction(cc.repeatForever(cc.sequence(
                    cc.moveTo(0.8, this.upgrade.x, this.upgrade.y + 4).easing(cc.easeSineInOut()),
                    cc.moveTo(0.8, this.upgrade.x, this.upgrade.y).easing(cc.easeSineInOut())
                )));
                this.upgrade.getChildByName("icons").getChildByName("完成").runAction(cc.repeatForever(cc.sequence(
                    cc.scaleTo(1, 1.06, 1.06).easing(cc.easeSineInOut()),
                    cc.scaleTo(1, 0.96, 0.96).easing(cc.easeSineInOut())
                )));
                break;
        }

        for (const icon of this.upgrade.getChildByName("icons").children) {
            icon.active = (icon.name == key);
        }

        this.onClick = () => {
            if (newedKey) {
                new_.destroy();
                new_ = null;
                UserStorage.showNeweds.push(newedKey);
                UserStorage.flush();
                newedKey = null;
            }

            const nextTechnologyData = technology.level == 0 ? this.technologyData : DatasManager.TechnologyDatasById[this.technologyData.ID + 1];
            switch (key) {
                case "购买":
                case "升级2":
                    {
                        popups.show(Costs2).set(key, nextTechnologyData, null, (technology.level + 1) + "级" + nextTechnologyData.Name, nextTechnologyData.Description, "", success => {
                            if (success) {
                                technology.startTime = new Date().getTime();
                                UserStorage.flush();
                                this.upgrade.destroy();
                                this.upgrade = null;;
                                this.addUpgrade1("等待", technology);
                            }
                        }, [nextTechnologyData.Coins, 0]);
                    }
                    break;
                case "等待":
                    const cost2 = popups.show(Costs2);
                    cost2.set(key, nextTechnologyData, technology, (technology.level + 1) + "级" + nextTechnologyData.Name, nextTechnologyData.Description, "", success => {
                        if (success) {
                            technology.startTime = 1;
                            UserStorage.flush();
                            this.upgrade.destroy();
                            this.upgrade = null;
                            this.addUpgrade1("等待", technology);
                        }
                        _wait.onUpdate = null;
                    }, [0, 1]);
                    cost2.time.active = true;
                    _wait.onUpdate = restSec => {
                        cost2.updateWait(restSec);
                    };
                    break;
                case "完成":
                    {
                        technology.startTime = 0;
                        technology.level++;
                        UserStorage.flush();
                        this.upgrade.destroy();
                        this.upgrade = null;
                        if (technology.level > 1) {
                            this.technologyData = nextTechnologyData;
                        }
                        this.refresh(technology);
                        Sounds.playFX("结束升级的点击音效");
                    }
                    break;
            }
        };
    }

}
