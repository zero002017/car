import { DatasManager } from "../datas/DatasManager";
import { UserStorage } from "../zero/UserStorage";
import { Sounds } from "../zero/Sounds";
import { normal, grey, platformCtrl, toast } from "../zero/global";
import { yaoqingData } from "../Main";
import { locales } from "./locales";

const { ccclass, property } = cc._decorator;

let 剩余视频获取失败走分享次数: number = -1;

@ccclass
export default class WatchVideo extends cc.Component {

    private bg: cc.Sprite;
    private pos: string;
    private 耗尽视频再分享: boolean;
    private isNormal: boolean;
    public 可点击: boolean;
    private onClick: () => void;
    private onSuccess: () => void;

    public init(): void {
        if (剩余视频获取失败走分享次数 == -1) {
            剩余视频获取失败走分享次数 = DatasManager.视频获取失败走分享次数上限;
        }
        this.可点击 = false;
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.可点击) { } else {
                return;
            }
            Sounds.playFX("点击");
            if (this.isNormal) {
                if (this.onClick) {
                    this.onClick();
                }
                this.可点击 = false;
                platformCtrl.aldSend("点看视频按钮", this.pos);
                let action: number;
                if (DatasManager.a) {
                    action = 1;
                    console.log("a");
                } else if (platformCtrl.强制显示视频) {
                    action = 1;
                    console.log("f");
                } else {
                    action = this.getAction();
                }
                platformCtrl.showRewardAd(action, this.pos, success => {
                    if (success) {
                        if (this.onSuccess) {
                            this.onSuccess();
                        }
                    } else {
                        this.可点击 = true;
                    }
                });
                this.addIndex();
            } else {
                toast(locales.getText([DatasManager.视频已用尽CN, DatasManager.视频已用尽EN]));
            }
        });
    }

    public set(label: string, pos: string, 耗尽视频再分享: boolean, onClick: () => void, onSuccess: () => void): void {
        this.可点击 = true;
        this.node.getChildByName("label").getComponent(cc.Label).string = label;
        this.bg = this.node.getComponent(cc.Sprite);
        this.pos = pos;
        this.耗尽视频再分享 = 耗尽视频再分享;
        this.onClick = onClick;
        this.onSuccess = onSuccess;

        let free: boolean = false;
        if (DatasManager.a) {
            console.log("a");
        } else if (platformCtrl.强制显示视频) {
            console.log("f");
        } else {
            console.log("fr");
            free = true;
        }

        platformCtrl.onLoadRewardAdSuccess = null;
        this.isNormal = true;
        if (free) {
            if (this.getAction() == 1 && !platformCtrl.loadRewardAdSuccess) {
                //视频获取失败走分享
                if (剩余视频获取失败走分享次数 > 0) {
                    剩余视频获取失败走分享次数--;
                } else {
                    this.isNormal = false;
                }
            }
        } else {
            if (platformCtrl.loadRewardAdSuccess) { } else {
                this.isNormal = false;
            }
        }

        if (this.isNormal) {
            normal(this.bg);
        } else {
            grey(this.bg);
            platformCtrl.onLoadRewardAdSuccess = () => {
                this.isNormal = true;
                normal(this.bg);
            };
        }
    }

    private getAction(): number {
        if (yaoqingData && yaoqingData.openIds.length) {
            for (const openId of yaoqingData.openIds) {
                if (UserStorage.邀请到的openId用于了分享.indexOf(openId) == -1) {
                    UserStorage.邀请到的openId用于了分享.push(openId);
                    UserStorage.flush();
                    console.log("s 邀请到的 " + openId + " 用于了分享");
                    return 0;
                }
            }
        }
        if (this.耗尽视频再分享) {
            console.log("c1");
            return 1;
        }
        let action: number = UserStorage.分享Index < DatasManager.分享机制.length ? DatasManager.分享机制[UserStorage.分享Index] : 1;
        console.log("b" + DatasManager.打分档次 + "=" + DatasManager.分享机制 + "，index=" + UserStorage.分享Index + "，action=" + action);
        return action;
    }

    private addIndex(): void {
        UserStorage.分享Index++;
        UserStorage.flush();
    }

}
