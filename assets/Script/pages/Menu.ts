import Page from "./Page";
import { main, yaoqingData } from "../Main";
import { popups } from "../popups/Popups";
import { Settings } from "../popups/Settings";
import { Sounds } from "../zero/Sounds";
import { UserStorage } from "../zero/UserStorage";
import { guideAllComplete, platformCtrl, 未领取邀请奖励数量 } from "../zero/global";
import LeftTop from "../ui/LeftTop";
import { Zhuanpan } from "../popups/Zhuanpan";
import { Sign } from "../popups/Sign";
import 好友助力 from "../ui/好友助力";
import 签到 from "../ui/签到";
import 抽奖 from "../ui/抽奖";
import 客服签到 from "../ui/客服签到";
import 试玩领奖 from "../ui/试玩领奖";
import { DayGem } from "../popups/DayGem";
import { Hutuiqiang } from "../popups/Hutuiqiang";
import { FriendHelp } from "../popups/FriendHelp";
import { MeiriGems } from "../popups/MeiriGems";
import { MeiriCoins } from "../popups/MeiriCoins";
import 百度交叉推荐 from "../ui/百度交叉推荐";
import NativeAd from "../popups/NativeAd";
import Game from "./Game";
import { Help } from "../popups/Help";

const { ccclass, property } = cc._decorator;

let 首次弹出好友助力: boolean = true;
let 首次弹出签到: boolean = true;

@ccclass
export default class Menu extends Page {

    public left: cc.Node;
    public gameLeft: cc.Node;
    public gameRight: cc.Node;
    private leftTop: LeftTop;

    private 设置: cc.Node;
    private 帮助: cc.Node;
    private 抽奖: 抽奖;
    public 好友助力: 好友助力;
    private 试玩领奖: 试玩领奖;
    private 客服签到: 客服签到;
    public 签到: 签到;
    private 盒子广告: cc.Node;
    private 更多游戏: cc.Node;
    public 每日钻石: cc.Node;
    public 每日金币: cc.Node;

    public 百度交叉推荐: 百度交叉推荐;
    private nativeAd: NativeAd;

    private game: Game;

    public init(): void {
        super.init();

        this.left = this.node.getChildByName("left");
        this.gameLeft = this.node.getChildByName("gameLeft");
        this.gameRight = this.node.getChildByName("gameRight");
        this.leftTop = this.left.getChildByName("leftTop").getComponent(LeftTop);

        this.设置 = this.leftTop.node.getChildByName("设置");
        this.设置.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            popups.show(Settings);
        });

        this.帮助 = this.leftTop.node.getChildByName("帮助");
        this.帮助.on(cc.Node.EventType.TOUCH_START, () => {
            //Sounds.playFX("点击");
            popups.show(Help);
        });

        this.抽奖 = this.leftTop.node.getChildByName("抽奖").getComponent(抽奖);
        this.抽奖.init();
        this.抽奖.node.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            popups.show(Zhuanpan);
        });

        this.好友助力 = this.leftTop.node.getChildByName("好友助力").getComponent(好友助力);
        this.好友助力.init();
        this.好友助力.node.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            if (yaoqingData) {
                popups.show(FriendHelp);
            }
        });

        this.试玩领奖 = this.leftTop.node.getChildByName("试玩领奖").getComponent(试玩领奖);
        this.试玩领奖.init();
        this.试玩领奖.node.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            UserStorage.clickedHutuiqiang = true;
            UserStorage.flush();
            this.试玩领奖.refresh();
            popups.show(Hutuiqiang);
        });

        this.客服签到 = this.leftTop.node.getChildByName("客服签到").getComponent(客服签到);
        this.客服签到.init();
        this.客服签到.node.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            popups.show(DayGem);
        });

        this.签到 = this.leftTop.node.getChildByName("签到").getComponent(签到);
        this.签到.init();
        this.签到.node.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            popups.show(Sign);
        });

        this.盒子广告 = this.leftTop.node.getChildByName("盒子广告");
        this.盒子广告.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            platformCtrl.showAppBox();
        });

        this.更多游戏 = this.leftTop.node.getChildByName("更多游戏");
        this.更多游戏.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            platformCtrl.showMoreGames();
        });

        this.每日钻石 = this.leftTop.node.getChildByName("每日钻石");
        this.每日钻石.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            popups.show(MeiriGems);
        });

        this.每日金币 = this.leftTop.node.getChildByName("每日金币");
        this.每日金币.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            popups.show(MeiriCoins);
        });

        this.百度交叉推荐 = this.left.getChildByName("百度交叉推荐").getComponent(百度交叉推荐);
        this.nativeAd = this.left.getChildByName("nativeAd").getComponent(NativeAd);
        this.nativeAd.init("主界面");

        this.game = this.node.getChildByName("game").getComponent(Game);
        this.game.init();

    }

    private 首次要干的各种事(): void {
        if (yaoqingData) {
            if (首次弹出好友助力) {
                首次弹出好友助力 = false;
                if (未领取邀请奖励数量() > 0) {
                    popups.show(FriendHelp).onHide = () => {
                        this.首次要干的各种事();
                    };
                    return;
                }
            }
        }
        if (首次弹出签到) {
            首次弹出签到 = false;
            if (this.签到.dot.active) {
                popups.show(Sign).onHide = () => {
                    this.首次要干的各种事();
                };
                return;
            }
        }
    }

    public show(): void {
        super.show();

        if (platformCtrl.显示充值商店) { } else {
            //this.left.leftTop.shop.active = false;
        }

        if (platformCtrl.cpbConfig) {
            this.试玩领奖.node.active = true;
        } else {
            this.试玩领奖.node.active = false;
        }

        if (platformCtrl.显示客服签到) {
            this.客服签到.node.active = true;
        } else {
            this.客服签到.node.active = false;
        }

        if (platformCtrl.显示好友助力) {
            this.好友助力.node.active = true;
        } else {
            this.好友助力.node.active = false;
        }

        if (platformCtrl.显示QQ盒子广告) {
            this.盒子广告.active = true;
        } else {
            this.盒子广告.active = false;
        }

        if (platformCtrl.显示抖音更多游戏) {
            if (platformCtrl.isIOS) {
                console.log("ios关闭功能");
                this.更多游戏.active = false;
            }
        } else {
            this.更多游戏.active = false;
        }

        platformCtrl.setStore();

        this.抽奖.node.active = false;
        this.好友助力.node.active = false;
        this.试玩领奖.node.active = false;
        this.客服签到.node.active = false;
        this.签到.node.active = false;
        this.盒子广告.active = false;
        this.更多游戏.active = false;
        this.每日钻石.active = false;
        this.每日金币.active = false;

        this.leftTop.adjust();

        this.抽奖.refresh();
        this.好友助力.refresh(false);
        this.试玩领奖.refresh();
        this.客服签到.refresh();
        this.签到.refresh();

        this.nativeAd.show();

        this.game.show();
    }

    public showComplete(): void {
        super.showComplete();

        main.moneys.node.active = true;

        if (UserStorage.首次弹帮助) { } else {
            UserStorage.首次弹帮助 = true;
            UserStorage.flush();
            popups.show(Help);
        }

        // if (guideAllComplete()) {
        //     platformCtrl.显示一键添加到我的小程序();
        //     this.首次要干的各种事();
        // }
    }

    public hide(): void {
        super.hide();

        platformCtrl.destroyUserInfoButtons();

        this.百度交叉推荐.hide();
    }

    public hideComplete(): void {
        super.hideComplete();

        this.nativeAd.hide();

        this.game.hideComplete();
    }
}
