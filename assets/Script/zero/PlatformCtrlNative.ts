import PlatformCtrl from "./PlatformCtrl";
import { Req, get_xhr, post_xhr } from "./global";
import { GlobalStorage } from "./GlobalStorage";
import { DatasManager } from "../datas/DatasManager";
import { Sounds } from "./Sounds";
import { main } from "../Main";
/**
 * 不限制
 */

export default class PlatformCtrlNative extends PlatformCtrl {

    private openId: string;
    private onLoginComplete: () => void;
    private rewardAdCallback: (success: boolean) => void;
    private currRewardAdPos: string;
    private payCallback: (success: boolean) => void;

    public constructor() {
        super();

        this.language = navigator.language;
        this.isIOS = (cc.sys.os == cc.sys.OS_IOS);
        this.粪叉 = false;

        this.defaultLanguageKey = "EN";
        this.显示世界榜 = true;
        this.显示好友榜 = false;
        this.显示客服签到 = false;
        this.显示好友助力 = false;
        this.显示充值商店 = true;
        this.显示联系我们 = false;
        this.显示分享 = true;
        this.显示5星好评 = true;
        this.强制显示视频 = false;
        this.显示分享提示 = false;
        this.显示竞技场 = false;
        this.使用炫耀 = false;
        this.显示抖音录屏分享 = false;
        this.显示抖音更多游戏 = false;
        this.显示QQ盒子广告 = false;
    }

    //loadSubpackage

    public init(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        super.init(onLoadSubpackagesComplete, onInitComplete);

        DatasManager.a = false;

        this.openId = null;
        GlobalStorage.openId = "";

        this.ts2native("ready");

        this.init_next(onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.微信合成点击完毕出现Banner;

        this.loadRewardAdSuccess = false;

        const skus: Array<string> = new Array();
        let i: number = -1;
        for (const chargeData of DatasManager.ChargeDatas) {
            i++;
            skus.push((i + 1).toString());
        }
        this.ts2native("initParams", {
            skus: skus,
            bannerId: this.isIOS ? DatasManager.聚合Banner广告ID苹果 : DatasManager.聚合Banner广告ID安卓,
            rewardId: DatasManager.聚合视频广告ID,
            insertId: DatasManager.聚合插屏广告ID
        });

        this.init2Complete(onComplete);
    }

    public login(onComplete: () => void): void {
        if (this.openId) {
            this.loginComplete(onComplete);
        } else {
            this.onLoginComplete = onComplete;
        }
    }
    public loginComplete(onComplete: () => void): void {
        GlobalStorage.openId = this.openId;
        GlobalStorage.flush();
        onComplete();
    }

    //logout

    //share

    //rating

    public showBannerAd(bannerName: string, dx: number, dy: number): void {
        this.showBannerAdSuccess = false;
        if (dx == 0 && dy == 1) { } else {
            return;
        }
        super.showBannerAd(bannerName, dx, dy);
        this.showBannerAdSuccess = true;
        this.ts2native("showBannerAd");
    }

    public hideBannerAd(): void {
        this.showBannerAdSuccess = false;
        this.ts2native("hideBannerAd");
    }

    protected showInsertAd_(): void {
        this.ts2native("showInsertAd");
        this.appsFlyerTrackEvent("Interstitial_video", { Mode: "Start" });
    }

    public showRewardAd(action: number, pos: string, callback: (success: boolean) => void): void {
        this.rewardAdCallback = callback;
        Sounds.pauseMusic();
        this.ts2native("showRewardAd");
        this.currRewardAdPos = pos;
        this.appsFlyerTrackEvent("Reward_video", { Mode: "Start", From: this.currRewardAdPos });
    }

    public appsFlyerTrackEvent(eventType: string, eventValue: any): void {
        this.ts2native("appsFlyerTrackEvent", { eventType: eventType, eventValue: eventValue });
    }

    public pay(sku: string, _callback: (success: boolean) => void): void {
        this.payCallback = _callback;
        this.ts2native("pay", { sku: sku });
    }

    //getSettings

    public getInviteList(onComplete: (rsp: { yaoqingNum: number, openIds: Array<string> }) => void): void { }

    public invite(邀请者的openId: string): void { }

    public get(req: Req, onComplete: (rsp: any) => void): void {
        get_xhr(req, false, onComplete);
    }

    public post(req: Req, onComplete: (rsp: any) => void): void {
        post_xhr(req, false, onComplete);
    }

    private ts2native(op: string, args?: any): void {
        if (args) {
            args.op = op;
        } else {
            args = { op: op };
        }
        const jsonCode = JSON.stringify(args);
        console.log("ts2native 发送：" + jsonCode);
        if (this.isIOS) {
            jsb.reflection.callStaticMethod("NativeTS", "ts2native:", jsonCode);
        } else {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NativeTS", "ts2native", "(Ljava/lang/String;)V", jsonCode);
        }
    }

    private native2ts(jsonCode: string): void {
        console.log("native2ts 接收：" + jsonCode);
        const args = JSON.parse(jsonCode);
        switch (args.op) {
            case "readyCallback":
                this.openId = args.openId;
                if (this.onLoginComplete) {
                    this.loginComplete(this.onLoginComplete);
                    this.onLoginComplete = null;
                }
                break;
            case "setPrices":
                for (const chargeData of DatasManager.ChargeDatas) {
                    chargeData.LocalPrice = "???";
                }
                for (const line of (args.prices as string).split("\n")) {
                    const matchArr = line.match(/(\d+) (\S.*\S)/);
                    if (matchArr) {
                        const chargeData = DatasManager.ChargeDatas[parseInt(matchArr[1]) - 1];
                        if (chargeData) {
                            chargeData.LocalPrice = matchArr[2];
                        }
                    }
                }
                break;
            case "payCallback":
                if (this.payCallback) {
                    this.payCallback(args.success == "true");
                    this.payCallback = null;
                    this.setStore();
                }
                break;
            case "rewardAdLoaded":
                this.loadRewardAdSuccess = true;
                if (this.onLoadRewardAdSuccess) this.onLoadRewardAdSuccess();
                break;
            case "rewardAdClose":
                main.delays.delay({ time: 0.5, action: () => { Sounds.resumeMusic(); } });
                this.loadRewardAdSuccess = false;
                if (this.rewardAdCallback) {
                    this.rewardAdCallback(args.success == "true");
                    this.rewardAdCallback = null;
                }
                this.appsFlyerTrackEvent("Reward_video", { Mode: "End", From: this.currRewardAdPos });
                break;
            case "insertAdClose":
                this.appsFlyerTrackEvent("Interstitial_video", { Mode: "End" });
                break;
            default:
                console.error("未知 op：" + args.op);
                break;
        }
    }

}
