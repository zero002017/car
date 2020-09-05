import PlatformCtrl from "./PlatformCtrl";
import { platformCtrl, Req, get_wx, post_wx, wxAppId } from "../zero/global";
import { GlobalStorage } from "./GlobalStorage";
import { DatasManager } from "../datas/DatasManager";
import { Sounds } from "./Sounds";
import { main } from "../Main";
/**
 *不限
 */

export default class PlatformCtrlSW extends PlatformCtrl {

    private rewardedVideoAd: RewardedVideoAd;

    private rewardAdCallback: (success: boolean) => void;

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
        this.显示分享 = false;
        this.显示5星好评 = false;
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
        this.wxInit(wxAppId, onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.微信合成点击完毕出现Banner;

        this.loadRewardAd();

        this.init2Complete(onComplete);
    }

    //verify

    public login(onComplete: () => void): void {
        GlobalStorage.openId = "SWGuest" + new Date().getTime();
        GlobalStorage.flush();
        onComplete();
    }

    //logout

    //rating

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
        if (wx.createRewardedVideoAd && DatasManager.微信视频广告ID们.length) {
            this.rewardAdId = DatasManager.微信视频广告ID们[Math.floor(Math.random() * DatasManager.微信视频广告ID们.length)];
            console.log("loadReward " + this.rewardAdId);
            this.rewardedVideoAd = wx.createRewardedVideoAd({
                adUnitId: this.rewardAdId
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
    private _rewardAdLoad(): void { (platformCtrl as PlatformCtrlSW).rewardAdLoad(); }

    //这里不能用this
    private _rewardAdClose(res): void { (platformCtrl as PlatformCtrlSW).rewardAdClose(res); }

    //这里不能用this
    private _rewardAdError(): void { (platformCtrl as PlatformCtrlSW).rewardAdError(); }

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

    public getStore(onComplete: () => void): void {
        this.getStoreComplete({ times: 0 }, onComplete);
    }

    public setStore(): void { }

    public deleteStore(onComplete: () => void): void {
        if (onComplete) onComplete();
    }

    public getInviteList(onComplete: (rsp: { yaoqingNum: number, openIds: Array<string> }) => void): void { }

    public invite(邀请者的openId: string): void { }

    public get(req: Req, onComplete: (rsp: any) => void): void {
        get_wx(req, true, onComplete);
    }

    public post(req: Req, onComplete: (rsp: any) => void): void {
        post_wx(req, true, true, onComplete);
    }

}
