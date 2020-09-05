import PlatformCtrl from "./PlatformCtrl";
import { hei0, disorder, platformCtrl, OpenDataContexts, qqAppId, Req, get_wx, post_wx, wid0 } from "../zero/global";
import { GlobalStorage } from "./GlobalStorage";
import { DatasManager } from "../datas/DatasManager";
import { Sounds } from "./Sounds";
import { main } from "../Main";
/**
 * 总包16m
 * 主包4m
 * 分包1：4M
 * 分包2：4m
 * 分包3：4m
 */

class QQBannerAdContainer {

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
        const scale = platformCtrl.screenHeight / hei0;
        this.wid = Math.round(510 * scale);
        this.hei = Math.round(120 * scale);
        this.bannerAd = wx.createBannerAd({
            adUnitId: this.bannerAdId,
            style: {
                left: Math.round((platformCtrl.screenWidth - this.wid) / 2),
                top: Math.round(platformCtrl.screenHeight - this.hei),
                width: this.wid
            }
        });
        this.bannerAd.onError(res => {
            console.error("bannerAd.onError() " + JSON.stringify(res));
            this.bannerAd.destroy();
            this.bannerAd = null;
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

class QQBlockAdContainer {

    private blockAdId: string;
    public blockAd: BlockAd;
    private isShow: boolean;
    private dx: number;
    private dy: number;
    private wid: number;
    private hei: number;
    private 剩余展示次数: number;

    public constructor(blockAdId: string) {
        this.blockAdId = blockAdId;
        this.create();
    }
    private create(): void {
        console.log("createBlock " + this.blockAdId);
        this.剩余展示次数 = DatasManager.banner展示超过n次销毁;
        const scale = platformCtrl.screenHeight / hei0;
        this.wid = Math.round((wid0 > hei0 ? 590 : 390) * scale);
        this.hei = Math.round(150 * scale);
        this.blockAd = wx.createBlockAd({
            adUnitId: this.blockAdId,
            size: wid0 > hei0 ? 5 : 4,
            orientation: "landscape",
            style: {
                left: Math.round((platformCtrl.screenWidth - this.wid) / 2),
                top: Math.round(platformCtrl.screenHeight - this.hei)
            }
        });
        this.blockAd.onError(res => {//{"errMsg":"调整位置无效,边距是32px以上","errCode":1009}
            console.error("blockAd.onError() " + JSON.stringify(res));
            this.blockAd.destroy();
            this.blockAd = null;
        });
    }

    public show(dx: number, dy: number): boolean {
        console.log("showBlock " + this.blockAdId + " " + dx + " " + dy);
        if (this.blockAd) {
            this.dx = dx;
            this.dy = dy;
            this.isShow = true;
            this.adjust();
            this.blockAd.show();
            return true;
        }
        this.create();
        return false;
    }

    private adjust(): void {
        if (this.blockAd) {
            if (this.isShow && this.wid && this.hei) {
                this.blockAd.style.left = Math.round((platformCtrl.screenWidth - this.wid) / 2 * (this.dx + 1)) - platformCtrl.横幅左边间距 * platformCtrl.screenHeight / hei0 * this.dx;
                let top: number = Math.round((platformCtrl.screenHeight - this.hei) / 2 * (this.dy + 1));
                if (platformCtrl.粪叉 && this.dy == 1) {
                    top -= 10;
                }
                this.blockAd.style.top = top;
                //console.log("block: " + JSON.stringify(this.blockAd.style));
            }
        }
    }

    public hide(): void {
        if (this.blockAd) {
            if (this.isShow) {
                this.isShow = false;
                this.blockAd.hide();
                if (platformCtrl.强制销毁 || --this.剩余展示次数 <= 0) {
                    platformCtrl.强制销毁 = false;
                    this.blockAd.destroy();
                    this.blockAd = null;
                    this.create();
                }
            }
        }
    }

}

class QQInsertAdContainer {

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

export default class PlatformCtrlQQ extends PlatformCtrl {

    private rewardedVideoAd: RewardedVideoAd;

    private rewardAdCallback: (success: boolean) => void;

    private bannerAds: Array<QQBannerAdContainer>;
    private currBannerAdContainer: QQBannerAdContainer;

    private blockAdIndex: number;
    private blockAds: Array<QQBlockAdContainer>;
    private currBlockAdContainer: QQBlockAdContainer;

    private insertAdIndex: number;
    private insertAds: Array<QQInsertAdContainer>;

    private appBox: AppBox;

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
        this.显示QQ盒子广告 = true;
    }

    public init(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        super.init(onLoadSubpackagesComplete, onInitComplete);
        this.wxInit(qqAppId, onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.QQ合成点击完毕出现Banner;

        this.loadRewardAd();

        disorder(DatasManager.QQBanner广告ID们);

        this.bannerAdIndex = -1;
        this.bannerAds = new Array();
        this.loadNextBannerAd();

        disorder(DatasManager.QQ积木广告ID们);

        this.blockAdIndex = -1;
        this.blockAds = new Array();
        this.loadNextBlockAd();

        disorder(DatasManager.QQ插屏广告ID们);

        this.insertAdIndex = -1;
        this.insertAds = new Array();
        this.loadNextInsertAd();

        if (DatasManager.QQ盒子广告ID) {
            if (wx.createAppBox) {
                this.appBox = wx.createAppBox({ adUnitId: DatasManager.QQ盒子广告ID });
                this.appBox.load();
            } else {
                console.error("wx.createAppBox=" + wx.createAppBox);
            }
        }

        this.init2Complete(onComplete);
    }

    //verify

    public initOpenDataContext(): void {
        new OpenDataContexts();
    }

    private loadNextBannerAd(): void {
        if (wx.createBannerAd) {
            if (this.bannerAds.length < DatasManager.QQBanner广告ID们.length) {
                this.bannerAds.push(new QQBannerAdContainer(DatasManager.QQBanner广告ID们[this.bannerAds.length]));
            }
        }
    }

    private loadNextBlockAd(): void {
        if (wx.createBlockAd) {
            if (this.blockAds.length < DatasManager.QQ积木广告ID们.length) {
                this.blockAds.push(new QQBlockAdContainer(DatasManager.QQ积木广告ID们[this.blockAds.length]));
            }
        }
    }

    private loadNextInsertAd(): void {
        if (wx.createInterstitialAd) {
            if (this.insertAds.length < DatasManager.QQ插屏广告ID们.length) {
                this.insertAds.push(new QQInsertAdContainer(DatasManager.QQ插屏广告ID们[this.insertAds.length]));
            }
        }
    }

    public login(onComplete: () => void): void {
        wx.login({
            success: (res: { errMsg: string, code: string }) => {//{"errMsg":"login:ok","code":"0219kBc70mIN5F1WFpb70kwKc709kBcR"}
                //console.log("wx.login() success " + JSON.stringify(res));
                this.post({ op: "../common/qqlogin", appId: qqAppId, code: res.code }, (rsp: { session_key: string, openid: string }) => {//{"data":{"session_key":"XSF06sNqswsaaRcsN7eGUA==","openid":"oPFj-48Qu2UXLznZfHt8-zwBHSZI"},"header":{"Date":"Thu, 14 Mar 2019 13:03:06 GMT","Server":"Apache/2.4.25 (Debian)","X-Powered-By":"PHP/5.6.37","Vary":"Accept-Encoding","Content-Encoding":"gzip","Content-Length":"101","Keep-Alive":"timeout=5, max=99","Connection":"Keep-Alive","Content-Type":"text/html; charset=UTF-8"},"statusCode":200,"cookies":[],"errMsg":"request:ok"}
                    //console.log("qqlogin " + JSON.stringify(rsp));
                    GlobalStorage.openId = rsp.openid;
                    GlobalStorage.flush();
                    onComplete();
                });
            }
        });
    }

    //logout

    //rating

    public showBannerAd(bannerName: string, dx: number, dy: number): void {
        this.showBannerAdSuccess = false;
        super.showBannerAd(bannerName, dx, dy);
        this.hideBannerAd();
        //const 出哪个: Array<"出Banner" | "出Block"> = ["出Block", "出Banner"];
        const 出哪个: Array<"出Banner" | "出Block"> = ["出Banner", "出Block"];
        while (出哪个.length) {
            const 出那个 = 出哪个.shift();
            console.log(出那个);
            switch (出那个) {
                case "出Banner":
                    if (wx.createBannerAd) this._showBannerAd(dx, dy);
                    break;
                case "出Block":
                    if (wx.createBlockAd) this._showBlockAd(dx, dy);
                    break;
            }
            if (this.showBannerAdSuccess) {
                break;
            }
        }
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
    private _showBlockAd(dx: number, dy: number): void {
        if (dx == 0 && dy == 1) { } else {
            return;
        }
        if (this.blockAds.length) {
            if (++this.blockAdIndex >= this.blockAds.length) {
                this.blockAdIndex = 0;
            }
            for (let i: number = 0; i < this.blockAds.length; i++) {
                this.currBlockAdContainer = this.blockAds[(this.blockAdIndex + i) % this.blockAds.length];
                this.showBannerAdSuccess = this.currBlockAdContainer.show(dx, dy);
                if (this.showBannerAdSuccess) {
                    break;
                }
            }
            this.loadNextBlockAd();
        }
    }

    public hideBannerAd(): void {
        this.showBannerAdSuccess = false;
        if (this.currBannerAdContainer) {
            this.currBannerAdContainer.hide();
            this.currBannerAdContainer = null;
        }
        if (this.currBlockAdContainer) {
            this.currBlockAdContainer.hide();
            this.currBlockAdContainer = null;
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
        if (wx.createRewardedVideoAd && DatasManager.QQ视频广告ID们.length) {
            this.rewardAdId = DatasManager.QQ视频广告ID们[Math.floor(Math.random() * DatasManager.QQ视频广告ID们.length)];
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
    private _rewardAdLoad(): void { (platformCtrl as PlatformCtrlQQ).rewardAdLoad(); }

    //这里不能用this
    private _rewardAdClose(res): void { (platformCtrl as PlatformCtrlQQ).rewardAdClose(res); }

    //这里不能用this
    private _rewardAdError(): void { (platformCtrl as PlatformCtrlQQ).rewardAdError(); }

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

    public showAppBox(): void {
        if (this.appBox) {
            this.appBox.show();
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

    public unzip1(upzipTextComplete: (file: string, text: string) => void): void {
        this.fsUnzip1(upzipTextComplete);
    }

}
