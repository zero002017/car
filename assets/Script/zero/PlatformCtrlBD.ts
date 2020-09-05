import PlatformCtrl from "./PlatformCtrl";
import { hei0, disorder, platformCtrl, bdAppSid, Req, get_wx, post_wx, bdAppKey } from "../zero/global";
import { DatasManager } from "../datas/DatasManager";
import { GlobalStorage } from "./GlobalStorage";
import { Sounds } from "./Sounds";
import { main } from "../Main";
/**
 * 总包8m
 * 主包4m
 * 分包1：4M
 */

class BDBannerAdContainer {

    private bannerAdId: string;
    public bannerAd: BannerAd;
    private isShow: boolean;
    private dx: number;
    private dy: number;
    private wid: number = 250;
    private hei: number = 83;
    private 剩余展示次数: number;

    public constructor(bannerAdId: string) {
        this.bannerAdId = bannerAdId;
        this.create();
    }
    private create(): void {
        console.log("createBanner " + this.bannerAdId);
        this.剩余展示次数 = DatasManager.banner展示超过n次销毁;
        this.bannerAd = wx.createBannerAd({
            adUnitId: this.bannerAdId,
            appSid: bdAppSid,
            style: {
                left: platformCtrl.screenWidth + 1000,
                top: 0,
                width: Math.round(510 * platformCtrl.screenHeight / hei0),
                height: 83
            }
        });
        this.bannerAd.onError(res => {
            //console.error("bannerAd.onError() " + JSON.stringify(res));
            this.bannerAd.destroy();
            this.bannerAd = null;
        });
        this.bannerAd.onResize(res => {//{"width":300,"height":86.08695652173913}
            //console.log("bannerAd.onResize() " + JSON.stringify(res));
            this.adjust();
        });
        this.bannerAd.style.width = 250;

        this.adjust();
    }

    public show(dx: number, dy: number): boolean {
        console.log("showBanner " + this.bannerAdId + " " + dx + " " + dy);
        if (this.bannerAd) {
            this.dx = dx;
            this.dy = dy;
            this.isShow = true;
            this.adjust();
            this.bannerAd.show();
            return true;
        }
        this.create();
        return false;
    }

    private adjust(): void {
        if (this.bannerAd) {
            if (this.isShow && this.wid && this.hei) {
                this.bannerAd.style.left = Math.round((platformCtrl.screenWidth - this.wid) / 2 * (this.dx + 1));
                this.bannerAd.style.top = Math.round((platformCtrl.screenHeight - this.hei) / 2 * (this.dy + 1));
                //console.log("banner: " + JSON.stringify(this.bannerAd.style));
            }
        }
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

export default class PlatformCtrlBD extends PlatformCtrl {

    private rewardedVideoAd: RewardedVideoAd;

    private rewardAdCallback: (success: boolean) => void;

    private bannerAds: Array<BDBannerAdContainer>;
    private currBannerAdContainer: BDBannerAdContainer;

    public constructor() {
        super();

        const sysInfo = wx.getSystemInfoSync();
        this.screenWidth = sysInfo.screenWidth;
        this.screenHeight = sysInfo.screenHeight;

        //this.language = sysInfo.language;
        this.language = "zh";
        this.isIOS = sysInfo.system ? sysInfo.system.toLowerCase().indexOf("ios") > -1 : false;
        this.粪叉 = sysInfo.model ? sysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphonex") > -1 : false;

        this.defaultLanguageKey = "CN";
        this.显示世界榜 = true;
        this.显示好友榜 = false;
        this.显示客服签到 = false;
        this.显示好友助力 = false;
        this.显示充值商店 = false;
        this.显示联系我们 = false;
        this.显示分享 = true;
        this.显示5星好评 = false;
        this.强制显示视频 = true;
        this.显示分享提示 = false;
        this.显示竞技场 = false;
        this.使用炫耀 = false;
        this.显示抖音录屏分享 = false;
        this.显示抖音更多游戏 = false;
        this.显示QQ盒子广告 = false;
    }

    public init(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        super.init(onLoadSubpackagesComplete, onInitComplete);
        this.wxInit(bdAppKey, onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.百度合成点击完毕出现Banner;

        this.loadRewardAd();

        disorder(DatasManager.百度Banner广告ID们);
        this.bannerAdIndex = -1;
        this.bannerAds = new Array();
        this.loadNextBannerAd();

        //百度防沉迷
        console.log("getAntiAddiction!!!!" + this.isIOS);
        if (wx.getAntiAddiction && !this.isIOS) {
            wx.getAntiAddiction().onAntiAddiction((args: { state: number, msg: string }) => {
                console.log("wx.getAntiAddiction().onAntiAddiction " + JSON.stringify(args));
                switch (args.state) {
                    case 10001://需要限制游戏（非法定节假日游戏时间限制1.5小时）
                        this.需要限制游戏(1.5);
                        break;
                    case 10002://需要限制游戏（法定节假日游戏时间限制3小时）
                        this.需要限制游戏(3);
                        break;
                    case 10003://需要限制游戏（当前时间22:00 - 8:00）
                        this.需要限制游戏(0);
                        break;
                }
            });
        } else {
            console.log("木有 swan.getAntiAddiction");
        }

        this.init2Complete(onComplete);
    }

    //verify

    private loadNextBannerAd(): void {
        if (this.bannerAds.length < DatasManager.百度Banner广告ID们.length) {
            this.bannerAds.push(new BDBannerAdContainer(DatasManager.百度Banner广告ID们[this.bannerAds.length]));
        }
    }

    public login(onComplete: () => void): void {
        GlobalStorage.openId = "BaiduGuest" + new Date().getTime();
        GlobalStorage.flush();
        onComplete();
    }

    //logout

    //rating

    public showBannerAd(bannerName: string, dx: number, dy: number): void {
        super.showBannerAd(bannerName, dx, dy);
        this.hideBannerAd();
        if (++this.bannerAdIndex >= this.bannerAds.length) {
            this.bannerAdIndex = 0;
        }
        for (let i: number = 0; i < this.bannerAds.length; i++) {
            this.currBannerAdContainer = this.bannerAds[(this.bannerAdIndex + i) % this.bannerAds.length];
            this.showBannerAdSuccess = this.currBannerAdContainer.show(dx, dy);
            if (this.showBannerAdSuccess) {
                break;
            }
        }
        this.loadNextBannerAd();
    }

    public hideBannerAd(): void {
        this.showBannerAdSuccess = false;
        if (this.currBannerAdContainer) {
            this.currBannerAdContainer.hide();
            this.currBannerAdContainer = null;
        }
    }

    public loadRewardAd(): void {
        this.rewardedVideoAdLoadTimes = 0;
        this.loadRewardAdSuccess = false;
        this._loadRewardAd();
    }

    private _loadRewardAd(): void {
        if (this.rewardedVideoAd) {
            this.rewardedVideoAd.offLoad(this._rewardAdLoad);
            this.rewardedVideoAd.offClose(this._rewardAdClose);
            this.rewardedVideoAd.offError(this._rewardAdError);
            this.rewardedVideoAd = null;
        }
        if (wx.createRewardedVideoAd && DatasManager.百度视频广告ID们.length) {
            this.rewardAdId = DatasManager.百度视频广告ID们[Math.floor(Math.random() * DatasManager.百度视频广告ID们.length)];
            console.log("loadReward " + this.rewardAdId);
            this.rewardedVideoAd = wx.createRewardedVideoAd({
                adUnitId: this.rewardAdId,
                appSid: bdAppSid
            });
            this.rewardedVideoAd.load().then(() => {
                //console.log("rewardedVideoAd.load() onfulfilled " + JSON.stringify(res));
                this.loadRewardAdSuccess = true;
                if (this.onLoadRewardAdSuccess) this.onLoadRewardAdSuccess();
            }, (res) => {
                //console.error("rewardedVideoAd.load() onrejected " + JSON.stringify(res));
                this.rewardAdError();
            }).catch(e => {
                //console.error("rewardedVideoAd.load() e=" + JSON.stringify(e));
                this.rewardAdError();
            });
            this.rewardedVideoAd.onLoad(this._rewardAdLoad);
            this.rewardedVideoAd.onClose(this._rewardAdClose);
            this.rewardedVideoAd.onError(this._rewardAdError);
        }
    }

    public showRewardAd(action: number, pos: string, callback: (success: boolean) => void): void {
        switch (action) {
            case 1:
                if (this.rewardedVideoAd && this.loadRewardAdSuccess) {
                    this.showRewardAdPos = pos;
                    this.aldSend("视频曝光", this.showRewardAdPos);
                    this.rewardAdCallback = callback;
                    Sounds.pauseMusic();
                    console.log("showReward " + this.rewardAdId);
                    this.rewardedVideoAd.show();
                    return;
                }
                break;
            case 2:
                //
                break;
        }
        this.share(callback);
    }

    //这里不能用this
    private _rewardAdLoad(): void { (platformCtrl as PlatformCtrlBD).rewardAdLoad(); }

    //这里不能用this
    private _rewardAdClose(res): void { (platformCtrl as PlatformCtrlBD).rewardAdClose(res); }

    //这里不能用this
    private _rewardAdError(): void { (platformCtrl as PlatformCtrlBD).rewardAdError(); }

    private rewardAdLoad(): void {
        //console.log("rewardAdLoad " + JSON.stringify(res));
        this.loadRewardAdSuccess = true;
        if (this.onLoadRewardAdSuccess) this.onLoadRewardAdSuccess();
    }

    private rewardAdClose(res: { isEnded: boolean }): void {//{"isEnded":false}
        //console.log("rewardAdClose " + JSON.stringify(res));
        main.delays.delay({ time: 0.5, action: () => { Sounds.resumeMusic(); } });
        if (res.isEnded) {
            this.aldSend("看完视频领取奖励", this.showRewardAdPos);
        }
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

    //getStore

    //setStore

    //deleteStore

    public get(req: Req, onComplete: (rsp: any) => void): void {
        get_wx(req, true, onComplete);
    }

    public post(req: Req, onComplete: (rsp: any) => void): void {
        post_wx(req, false, true, onComplete);
    }

}
