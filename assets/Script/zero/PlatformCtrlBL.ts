import PlatformCtrl from "./PlatformCtrl";
import { main } from "../Main";
import { hei0, disorder, platformCtrl, wxAppId, OpenDataContexts, Req, get_wx, post_wx, chName, Share, biliAppId } from "../zero/global";
import { GlobalStorage } from "./GlobalStorage";
import { DatasManager } from "../datas/DatasManager";
import { Sounds } from "./Sounds";
import { UserStorage } from "./UserStorage";
/**
 * 未知
 */

class BLBannerAdContainer {

    private bannerAdId: string;
    public bannerAd: BannerAd;
    private isShow: boolean;
    private dx: number;
    private dy: number;
    private wid: number;
    private hei: number;
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
            style: {
                left: platformCtrl.screenWidth + 1000,
                top: 0,
                width: Math.round(510 * platformCtrl.screenHeight / hei0)
            }
        });
        this.bannerAd.onError(res => {
            //console.error("bannerAd.onError() " + JSON.stringify(res));
            this.bannerAd.destroy();
            this.bannerAd = null;
        });
        this.bannerAd.onResize(res => {//{"width":300,"height":86.08695652173913}
            //console.log("bannerAd.onResize() " + JSON.stringify(res));
            this.wid = res.width;
            this.hei = res.height;
            this.adjust();
        });
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
                this.bannerAd.style.left = Math.round((platformCtrl.screenWidth - this.wid) / 2 * (this.dx + 1)) - platformCtrl.横幅左边间距 * platformCtrl.screenHeight / hei0 * this.dx;
                let top: number = Math.round((platformCtrl.screenHeight - this.hei) / 2 * (this.dy + 1));
                if (platformCtrl.粪叉 && this.dy == 1) {
                    top -= 10;
                }
                this.bannerAd.style.top = top;
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

class BLInsertAdContainer {

    private insertAdId: string;
    private insertAd: InsertAd;
    private isLoaded: boolean;

    private onFinished: (success: boolean) => void;

    public constructor(insertAdId: string) {
        this.insertAdId = insertAdId;
        console.log("loadInsert " + this.insertAdId);
        this.isLoaded = false;
        this.insertAd = wx.createInterstitialAd({
            adUnitId: this.insertAdId
        });
        this.insertAd.onLoad(() => {
            //console.log("insertAd.onLoad()");
            this.isLoaded = true;
        });
        this.insertAd.onError(res => {
            //console.error("insertAd.onError() " + JSON.stringify(res));
            this.isLoaded = false;
            this.insertAd = null;
        });
        this.insertAd.onClose(() => {
            this.isLoaded = false;
            this.finish(true);
            main._showBannerAd(platformCtrl.currBannerName, 0, 1);
        });
    }

    private finish(success: boolean): void {
        platformCtrl.showingInsertAd = false;
        if (this.onFinished) {
            this.onFinished(success);
            this.onFinished = null;
        }
    }

    public show(onFinished: (success: boolean) => void): boolean {
        console.log("showInsert " + this.insertAdId);
        this.onFinished = onFinished;
        if (this.isLoaded) {
            platformCtrl.showingInsertAd = true;
            this.insertAd.show().then(() => {
                //console.log("showInsert 成功");
            }).catch(err => {
                console.error("showInert 出错 " + JSON.stringify(err));
                this.finish(false);
            });
            return true;
        }
        this.finish(false);
        return false;
    }

}

export default class PlatformCtrlBL extends PlatformCtrl {

    private rewardedVideoAd: RewardedVideoAd;

    private rewardAdCallback: (success: boolean) => void;

    private bannerOrGameBannerIndex: number;
    private insertOrGamePortalIndex: number;

    private bannerAds: Array<BLBannerAdContainer>;
    private currBannerAdContainer: BLBannerAdContainer;

    private insertAdIndex: number;
    private insertAds: Array<BLInsertAdContainer>;

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
        this.显示好友榜 = true;
        this.显示客服签到 = false;
        this.显示好友助力 = true;
        this.显示充值商店 = false;
        this.显示联系我们 = true;
        this.显示分享 = true;
        this.显示5星好评 = false;
        this.强制显示视频 = false;
        this.显示分享提示 = false;
        this.显示竞技场 = false;
        this.使用炫耀 = true;
        this.显示抖音录屏分享 = true;
        this.显示抖音更多游戏 = false;
        this.显示QQ盒子广告 = false;
    }

    //录屏
    private recorder: any;
    private gameRecorderShareButton: any;
    public GameRecorderManager(): any {
        if (wx.getGameRecorder) {
            if (this.recorder) { } else {
                this.recorder = wx.getGameRecorder();
                //this.recorder.on("stop", () => { });
            }
            return this.recorder;
        }
    }
    public showGameRecorderShareButton(xywh: Array<number>): void {
        if (wx.createGameRecorderShareButton) {
            if (this.gameRecorderShareButton) { } else {
                this.gameRecorderShareButton = wx.createGameRecorderShareButton({
                    type: "text",
                    text: "",
                    style: {
                        //backgroundColor: "#ff0000",
                        left: xywh[0],
                        top: xywh[1],
                        width: xywh[2],
                        height: xywh[3]
                    }
                });
            }
            this.gameRecorderShareButton.show();
        }
    }
    public hideGameRecorderShareButton(): void {
        if (this.gameRecorderShareButton) {
            this.gameRecorderShareButton.hide();
        }
    }

    public init(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        super.init(onLoadSubpackagesComplete, onInitComplete);
        this.wxInit(wxAppId, onLoadSubpackagesComplete, onInitComplete);
        wx.launchSuccess();
    }

    private loadShareImg(share: Share): void {
        wx.downloadFile({
            url: share.imageUrl,
            success: res => {
                console.log(res);
                if (res && res.tempFilePath) {
                    share.imageUrl = res.tempFilePath;
                }
            }
        });
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.微信合成点击完毕出现Banner;

        this.loadRewardAd();

        disorder(DatasManager.B站Banner广告ID们);

        this.bannerAdIndex = -1;
        this.bannerAds = new Array();
        this.loadNextBannerAd();

        disorder(DatasManager.B站插屏广告ID们);

        this.insertAdIndex = -1;
        this.insertAds = new Array();
        this.loadNextInsertAd();

        this.init2Complete(() => {
            for (const share of DatasManager.shares) {
                share.subTitle = share.title;
                share.title = chName;
                this.loadShareImg(share);
            }
            if (onComplete) onComplete();
        });
    }

    //verify

    public initOpenDataContext(): void {
        new OpenDataContexts();
    }

    private loadNextBannerAd(): void {
        if (wx.createBannerAd) {
            if (this.bannerAds.length < DatasManager.B站Banner广告ID们.length) {
                this.bannerAds.push(new BLBannerAdContainer(DatasManager.B站Banner广告ID们[this.bannerAds.length]));
            }
        }
    }

    private loadNextInsertAd(): void {
        if (wx.createInterstitialAd) {
            if (this.insertAds.length < DatasManager.B站插屏广告ID们.length) {
                this.insertAds.push(new BLInsertAdContainer(DatasManager.B站插屏广告ID们[this.insertAds.length]));
            }
        }
    }

    public login(onComplete: () => void): void {
        wx.login({
            success: (res: { errMsg: string, code: string }) => {//{"errMsg":"login:ok","code":"0219kBc70mIN5F1WFpb70kwKc709kBcR"}
                console.log("wx.login() success " + JSON.stringify(res));
                this.post({ op: "../common/bllogin", appId: biliAppId, code: res.code }, (rsp: { session_key: string, openid: string }) => {//{"data":{"session_key":"XSF06sNqswsaaRcsN7eGUA==","openid":"oPFj-48Qu2UXLznZfHt8-zwBHSZI"},"header":{"Date":"Thu, 14 Mar 2019 13:03:06 GMT","Server":"Apache/2.4.25 (Debian)","X-Powered-By":"PHP/5.6.37","Vary":"Accept-Encoding","Content-Encoding":"gzip","Content-Length":"101","Keep-Alive":"timeout=5, max=99","Connection":"Keep-Alive","Content-Type":"text/html; charset=UTF-8"},"statusCode":200,"cookies":[],"errMsg":"request:ok"}
                    //console.log("wxlogin " + JSON.stringify(rsp));
                    GlobalStorage.openId = rsp.openid;
                    GlobalStorage.flush();
                    onComplete();
                });
            }, fail: (res) => {
                console.log("wx.login() fail " + JSON.stringify(res));
            }
        });
    }

    //logout

    //rating

    public showBannerAd(bannerName: string, dx: number, dy: number): void {
        this.showBannerAdSuccess = false;
        if (DatasManager.a) {
            if (dx == 0 && dy == 1) { } else {
                return;
            }
        }
        super.showBannerAd(bannerName, dx, dy);
        this.hideBannerAd();
        if (wx.createBannerAd) this._showBannerAd(dx, dy);
    }
    private _showBannerAd(dx: number, dy: number): void {
        if (this.bannerAds.length) {
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
    }

    public hideBannerAd(): void {
        this.showBannerAdSuccess = false;
        if (this.currBannerAdContainer) {
            this.currBannerAdContainer.hide();
            this.currBannerAdContainer = null;
        }
    }

    protected showInsertAd_(): void {
        if (wx.createInterstitialAd) {
            if (this.insertAds.length) {
                if (++this.insertAdIndex >= this.insertAds.length) {
                    this.insertAdIndex = 0;
                }
                this.insertAds[this.insertAdIndex].show(success => {
                    this.loadNextInsertAd();
                });
            }
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
        if (wx.createRewardedVideoAd && DatasManager.B站视频广告ID们.length) {
            this.rewardAdId = DatasManager.B站视频广告ID们[Math.floor(Math.random() * DatasManager.B站视频广告ID们.length)];
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
    private _rewardAdLoad(): void { (platformCtrl as PlatformCtrlBL).rewardAdLoad(); }

    //这里不能用this
    private _rewardAdClose(res): void { (platformCtrl as PlatformCtrlBL).rewardAdClose(res); }

    //这里不能用this
    private _rewardAdError(): void { (platformCtrl as PlatformCtrlBL).rewardAdError(); }

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

    protected getStoreComplete(data: { times: number }, onComplete: () => void): void {
        UserStorage.首次进入游戏的场景值4 = this.launchScene = 12345;
        super.getStoreComplete(data, onComplete);
    }

    //setStore

    //deleteStore

    public get(req: Req, onComplete: (rsp: any) => void): void {
        get_wx(req, true, onComplete);
    }

    public post(req: Req, onComplete: (rsp: any) => void): void {
        post_wx(req, false, true, onComplete);
    }

    public unzip1(upzipTextComplete: (file: string, text: string) => void): void {
        this.fsUnzip1(upzipTextComplete);
    }

}
