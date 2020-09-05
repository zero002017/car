import { platformCtrl, Req, get_xhr, post_xhr } from "./global";
import PlatformCtrl from "./PlatformCtrl";
import { DatasManager } from "../datas/DatasManager";
import { GlobalStorage } from "./GlobalStorage";
import { Sounds } from "./Sounds";
import { main } from "../Main";
/**
 *不限
 */

class UCBannerAdContainer {

    public bannerAd: uc.BannerAd;
    private isShow: boolean;
    private 剩余展示次数: number;
    private dy: number;

    public constructor() {
        this.dy = 1;
        this.create();
    }
    private create(): void {
        console.log("createBanner");
        this.剩余展示次数 = DatasManager.banner展示超过n次销毁;

        let wid: number;
        let hei: number;
        if (platformCtrl.isIOS) {
            console.log("iOS 600:150");
            wid = Math.round((platformCtrl.screenWidth > platformCtrl.screenHeight ? platformCtrl.screenHeight : platformCtrl.screenWidth) * 0.9);
            hei = Math.round(150 / 600 * wid);
        } else {
            console.log("Android 345:194");
            wid = Math.round((platformCtrl.screenWidth > platformCtrl.screenHeight ? platformCtrl.screenHeight : platformCtrl.screenWidth) * 0.5);
            hei = Math.round(194 / 345 * wid);
        }
        console.log(wid + "x" + hei);
        this.bannerAd = uc.createBannerAd({
            style: {
                width: wid,
                height: hei,
                gravity: this.dy == -1 ? 1 : 7
            }
        });

        this.bannerAd.onError(res => {
            console.error("bannerAd.onError() " + JSON.stringify(res));
            this.bannerAd.destroy();
            this.bannerAd = null;
        });
        this.bannerAd.hide();
    }

    public show(dx: number, dy: number): boolean {
        console.log("showBanner " + dx + " " + dy);
        if (this.dy == dy) { } else {
            this.dy = dy;
            this.bannerAd.destroy();
            this.bannerAd = null;
            this.create();
        }
        if (this.bannerAd) {
            this.isShow = true;
            this.bannerAd.show();
            return true;
        }
        this.create();
        return false;
    }

    public hide(): void {
        if (this.bannerAd) {
            if (this.isShow) {
                this.isShow = false;
                this.bannerAd.hide();
                if (platformCtrl.强制销毁 || --this.剩余展示次数 <= 0) {
                    platformCtrl.强制销毁 = false;
                    this.bannerAd.destroy();
                    this.bannerAd = null;
                    this.create();
                }
            }
        }
    }

}

export default class PlatformCtrlUCH5 extends PlatformCtrl {

    private rewardedVideoAd: uc.RewardedVideoAd;

    private rewardAdCallback: (success: boolean) => void;

    private bannerAdContainer: UCBannerAdContainer;

    public constructor(wid0: number, hei0: number) {
        super();

        document.addEventListener("visibilitychange", function () {
            console.log(document.visibilityState);
            if (document.visibilityState == "hidden") {
                Sounds.pauseMusic();
            } else {
                Sounds.resumeMusic();
            }
        });

        let sysInfo = uc.getSystemInfoSync();
        if (typeof (sysInfo) == "string") {
            sysInfo = JSON.parse(sysInfo) as any;
        }
        console.log("sysInfo=" + JSON.stringify(sysInfo));

        //this.language = sysInfo.language;
        this.language = "zh";
        this.isIOS = sysInfo.platform ? sysInfo.platform.toLowerCase().indexOf("ios") > -1 : false;
        this.粪叉 = false;
        console.log("isIOS=" + this.isIOS);

        if (wid0 > hei0) {
            this.screenWidth = Math.max(sysInfo.screenHeight, sysInfo.screenWidth)
            this.screenHeight = Math.min(sysInfo.screenHeight, sysInfo.screenWidth)
        } else {
            this.screenWidth = Math.min(sysInfo.screenHeight, sysInfo.screenWidth)
            this.screenHeight = Math.max(sysInfo.screenHeight, sysInfo.screenWidth)
        }
        console.log(`this.screenWidth=  ${this.screenWidth} screenHeight= ${this.screenHeight} `)

        // if (this.isIOS) {
        //     this.screenWidth *= sysInfo.pixelRatio;
        //     this.screenHeight *= sysInfo.pixelRatio;
        // }

        this.defaultLanguageKey = "CN";
        this.显示世界榜 = true;
        this.显示好友榜 = false;
        this.显示客服签到 = false;
        this.显示好友助力 = false;
        this.显示充值商店 = false;
        this.显示联系我们 = false;
        this.显示分享 = false;
        this.显示5星好评 = false;
        this.强制显示视频 = true;
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

        this.init_next(onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.微信合成点击完毕出现Banner;

        this.loadRewardAd();

        this.bannerAdContainer = new UCBannerAdContainer();

        this.init2Complete(onComplete);
    }

    public login(onComplete: () => void): void {
        // uc.login({
        //     success: function (res) {
        //         console.log('登录成功', res.code);
        //         /*
        //           {
        //             code: '', // 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 session_key 等信息
        //           }
        //         */
        //     },
        //     fail: function (res) {
        //         console.log('登录失败', res);
        //     },
        // });
        GlobalStorage.openId = "UCGuest" + new Date().getTime();
        GlobalStorage.flush();
        onComplete();
    }

    //logout

    //share

    //rating

    public showBannerAd(bannerName: string, dx: number, dy: number): void {
        super.showBannerAd(bannerName, dx, dy);
        this.hideBannerAd();
        this.showBannerAdSuccess = this.bannerAdContainer.show(dx, dy);
    }

    public hideBannerAd(): void {
        this.showBannerAdSuccess = false;
        this.bannerAdContainer.hide();
    }

    public loadRewardAd(): void {
        this.rewardedVideoAdLoadTimes = 0;
        this.loadRewardAdSuccess = false;
        this._loadRewardAd();
    }

    private _loadRewardAd(): void {
        if (this.rewardedVideoAd) { } else {
            this.rewardedVideoAd = uc.createRewardVideoAd();
            this.rewardedVideoAd.onLoad(this._rewardAdLoad);
            this.rewardedVideoAd.onClose(this._rewardAdClose);
            this.rewardedVideoAd.onError(this._rewardAdError);
        }
        console.log("loadReward");
        this.rewardedVideoAd.load().then(() => {
            //console.log("rewardedVideoAd.load() onfulfilled " + JSON.stringify(res));
            this.loadRewardAdSuccess = true;
        }, (res) => {
            //console.error("rewardedVideoAd.load() onrejected " + JSON.stringify(res));
            this.rewardAdError();
        }).catch(e => {
            //console.error("rewardedVideoAd.load() e=" + JSON.stringify(e));
            this.rewardAdError();
        });
    }

    public showRewardAd(action: number, pos: string, callback: (success: boolean) => void): void {
        if (this.rewardedVideoAd && this.loadRewardAdSuccess) {
            this.rewardAdCallback = callback;
            Sounds.pauseMusic();
            console.log("showReward");
            this.rewardedVideoAd.show();
        }
    }

    //这里不能用this
    private _rewardAdLoad(): void { (platformCtrl as PlatformCtrlUCH5).rewardAdLoad(); }

    //这里不能用this
    private _rewardAdClose(res): void { (platformCtrl as PlatformCtrlUCH5).rewardAdClose(res); }

    //这里不能用this
    private _rewardAdError(): void { (platformCtrl as PlatformCtrlUCH5).rewardAdError(); }

    private rewardAdLoad(): void {
        //console.log("rewardAdLoad " + JSON.stringify(res));
        this.loadRewardAdSuccess = true;
    }

    private rewardAdClose(res: { isEnded: boolean }): void {//{"isEnded":false}
        //console.log("rewardAdClose " + JSON.stringify(res));
        main.delays.delay({ time: 0.5, action: () => { Sounds.resumeMusic(); } });
        this.loadRewardAd();
        if (this.rewardAdCallback) {
            this.rewardAdCallback(res.isEnded);
            this.rewardAdCallback = null;
        }
    }

    private rewardAdError(): void {
        //console.error("rewardAdError");
        this.loadRewardAdSuccess = false;
        if (++this.rewardedVideoAdLoadTimes < 3) {
            //console.log("尝试重新加载 " + this.rewardedVideoAdLoadTimes);
            this._loadRewardAd();
        }
    }

    //pay

    //getSettings

    public getStore(onComplete: () => void): void {
        this.getStoreComplete({ times: 0 }, onComplete);
    }

    public setStore(): void { }

    public deleteStore(onComplete: () => void): void {
        if (onComplete) onComplete();
    }

    public get(req: Req, onComplete: (rsp: any) => void): void {
        get_xhr(req, false, onComplete);
    }

    public post(req: Req, onComplete: (rsp: any) => void): void {
        post_xhr(req, false, onComplete);
    }

}
