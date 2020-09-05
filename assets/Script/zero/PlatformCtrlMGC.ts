import PlatformCtrl from "./PlatformCtrl";
import { main } from "../Main";
import { hei0, disorder, platformCtrl, wxAppId, OpenDataContexts, Req, get_wx, post_wx } from "../zero/global";
import { GlobalStorage } from "./GlobalStorage";
import { DatasManager } from "../datas/DatasManager";
import { Sounds } from "./Sounds";
/**
 * 不限
 */

class MGCBannerAdContainer {

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

class MGCInsertAdContainer {

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

class MGCGameBannerAdContainer {

    private gameBannerAdId: string;
    public gameBannerAd: GameBannerAd;
    private isShow: boolean;
    private 剩余展示次数: number;

    public constructor(gameBannerAdId: string) {
        this.gameBannerAdId = gameBannerAdId;
        this.create();
    }
    private create(): void {
        console.log("createGameBanner " + this.gameBannerAdId);
        this.剩余展示次数 = DatasManager.banner展示超过n次销毁;
        this.gameBannerAd = wx.createGameBanner({
            adUnitId: this.gameBannerAdId
        });
        this.gameBannerAd.onError(res => {
            console.error("gameBannerAd.onError() " + JSON.stringify(res));
            this.gameBannerAd.destroy();
            this.gameBannerAd = null;
        });
        this.gameBannerAd.onResize(res => {//{"width":300,"height":86.08695652173913}
            //console.log("gameBannerAd.onResize() " + JSON.stringify(res));
        });
    }

    public show(dx: number, dy: number): boolean {
        console.log("showGameBanner " + this.gameBannerAdId + " " + dx + " " + dy);
        if (this.gameBannerAd) {
            this.isShow = true;
            this.gameBannerAd.show();
            return true;
        }
        return false;
    }

    public hide(): void {
        if (this.gameBannerAd) {
            if (this.isShow) {
                this.isShow = false;
                this.gameBannerAd.hide();
                if (platformCtrl.强制销毁 || --this.剩余展示次数 <= 0) {
                    platformCtrl.强制销毁 = false;
                    this.gameBannerAd.destroy();
                    this.gameBannerAd = null;
                    this.create();
                }
            }
        }
    }

}

class MGCGamePortalAdContainer {

    private gamePortalAdId: string;
    private gamePortalAd: GamePortalAd;
    private isLoaded: boolean;

    private onFinished: () => void;

    public constructor(gamePortalAdId: string) {
        this.gamePortalAdId = gamePortalAdId;
        console.log("loadGamePortal " + this.gamePortalAdId);
        this.isLoaded = false;
        this.gamePortalAd = wx.createGamePortal({
            adUnitId: this.gamePortalAdId
        });
        this.gamePortalAd.onLoad(() => {
            //console.log("gamePortalAd.onLoad()");
            this.isLoaded = true;
        });
        this.gamePortalAd.onError(res => {
            console.error("gamePortalAd.onError() " + JSON.stringify(res));
            this.gamePortalAd = null;
        });
        this.gamePortalAd.onClose(() => {
            this.isLoaded = false;
            this.finish();
            main._showBannerAd(platformCtrl.currBannerName, 0, 1);
        });
    }

    private finish(): void {
        platformCtrl.showingInsertAd = false;
        if (this.onFinished) {
            this.onFinished();
            this.onFinished = null;
        }
    }

    public show(onFinished: () => void): boolean {
        console.log("showPortal " + this.gamePortalAdId);
        this.onFinished = onFinished;
        if (this.isLoaded) {
            platformCtrl.showingInsertAd = true;
            this.gamePortalAd.show().then(() => {
                //console.log("showGamePortal 成功");
            }).catch(err => {
                console.error("showGamePortal 出错 " + JSON.stringify(err));
                this.finish();
            });
            return true;
        }
        this.finish();
        return false;
    }

}

class MGCGridAdContainer {
    private gridAdId: string;
    public gridAd: GridAd;
    private isShow: boolean;
    private dx: number;
    private dy: number;
    private wid: number;
    private hei: number;
    private 剩余展示次数: number;

    public constructor(gridAdId: string) {
        this.gridAdId = gridAdId;
        this.create();
    }
    private create(): void {
        console.log("createGrid " + this.gridAdId);
        this.剩余展示次数 = DatasManager.banner展示超过n次销毁;
        this.gridAd = wx.createGridAd({
            adUnitId: this.gridAdId,
            adTheme: "white",
            gridCount: 5,
            style: {
                left: platformCtrl.screenWidth + 1000,
                top: 0,
                width: Math.round(510 * platformCtrl.screenHeight / hei0),
                opacity: 1
            }
        });
        this.gridAd.onError(res => {//gridAd.onError() {"errMsg":"no advertisement","errCode":1004}
            console.error("gridAd.onError() " + JSON.stringify(res));
            this.gridAd.destroy();
            this.gridAd = null;
        });
        this.gridAd.onResize(res => {
            console.log("gridAd.onResize() " + JSON.stringify(res));
            this.wid = res.width;
            this.hei = res.height;
            this.adjust();
        });
    }

    public show(dx: number, dy: number): boolean {
        console.log("showGrid " + this.gridAdId + " " + dx + " " + dy);
        if (this.gridAd) {
            this.dx = dx;
            this.dy = dy;
            this.isShow = true;
            this.adjust();
            this.gridAd.show();
            return true;
        }
        this.create();
        return false;
    }

    private adjust(): void {
        if (this.gridAd) {
            if (this.isShow && this.wid && this.hei) {
                this.gridAd.style.left = Math.round((platformCtrl.screenWidth - this.wid) / 2 * (this.dx + 1)) - platformCtrl.横幅左边间距 * platformCtrl.screenHeight / hei0 * this.dx;
                let top: number = Math.round((platformCtrl.screenHeight - this.hei) / 2 * (this.dy + 1));
                if (platformCtrl.粪叉 && this.dy == 1) {
                    top -= 10;
                }
                this.gridAd.style.top = top;
                console.log("grid: " + JSON.stringify(this.gridAd.style));
            }
        }
    }

    public hide(): void {
        if (this.gridAd) {
            if (this.isShow) {
                this.isShow = false;
                this.gridAd.hide();
                if (platformCtrl.强制销毁 || --this.剩余展示次数 <= 0) {
                    platformCtrl.强制销毁 = false;
                    this.gridAd.destroy();
                    this.gridAd = null;
                    this.create();
                }
            }
        }
    }
}

class MGCCustomAdContainer {
    private customAdId: string;
    public customAd: CustomAd;
    private ok: boolean;
    private isShow: boolean;
    private dx: number;
    private dy: number;
    private wid: number;
    private hei: number;

    public constructor(customAdId: string) {
        this.customAdId = customAdId;
        this.create();
    }
    private create(): void {
        console.log("createCustom " + this.customAdId);
        this.customAd = wx.createCustomAd({
            adUnitId: this.customAdId,
            left: 10,
            top: 10,
            fixed: false
        });
        this.ok = true;
        this.customAd.onError(res => {
            console.error("customAd.onError() " + JSON.stringify(res));
            this.ok = false;
        });
    }

    public show(dx: number, dy: number): boolean {//customAd.onError() {"errMsg":"no advertisement","errCode":5047}
        console.log("showCustom " + this.customAdId + " " + dx + " " + dy);
        if (this.ok) {
            this.dx = dx;
            this.dy = dy;
            this.isShow = true;
            this.customAd.show();
            return true;
        }
        this.create();
        return false;
    }

    public hide(): void {
        if (this.isShow) {
            this.isShow = false;
            this.customAd.hide();
        }
    }
}

export default class PlatformCtrlMGC extends PlatformCtrl {

    private rewardedVideoAd: RewardedVideoAd;

    private rewardAdCallback: (success: boolean) => void;

    private bannerOrGameBannerIndex: number;
    private insertOrGamePortalIndex: number;

    private bannerAds: Array<MGCBannerAdContainer>;
    private currBannerAdContainer: MGCBannerAdContainer;

    private insertAdIndex: number;
    private insertAds: Array<MGCInsertAdContainer>;

    private gameBannerAdIndex: number;
    private gameBannerAds: Array<MGCGameBannerAdContainer>;
    private currGameBannerAdContainer: MGCGameBannerAdContainer;

    private gamePortalAdIndex: number;
    private gamePortalAds: Array<MGCGamePortalAdContainer>;

    private gridAdIndex: number;
    private gridAds: Array<MGCGridAdContainer>;
    private currGridAdContainer: MGCGridAdContainer;

    private customAdIndex: number;
    private customAds: Array<MGCCustomAdContainer>;
    private currCustomAdContainer: MGCCustomAdContainer;

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
        this.强制显示视频 = false;
        this.显示分享提示 = false;
        this.显示竞技场 = false;
        this.使用炫耀 = false;
        this.显示抖音录屏分享 = false;
        this.显示抖音更多游戏 = false;
        this.显示QQ盒子广告 = false;
    }

    public init(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        super.init(onLoadSubpackagesComplete, onInitComplete);
        this.wxInit(wxAppId, onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.微信合成点击完毕出现Banner;

        this.loadRewardAd();

        this.bannerOrGameBannerIndex = -1;
        this.insertOrGamePortalIndex = -1;

        disorder(DatasManager.微信Banner广告ID们);

        this.bannerAdIndex = -1;
        this.bannerAds = new Array();
        this.loadNextBannerAd();

        disorder(DatasManager.微信插屏广告ID们);

        this.insertAdIndex = -1;
        this.insertAds = new Array();
        this.loadNextInsertAd();

        disorder(DatasManager.GameBannerID们);

        this.gameBannerAdIndex = -1;
        this.gameBannerAds = new Array();
        this.loadNextGameBannerAd();

        disorder(DatasManager.GamePortalID们);

        this.gamePortalAdIndex = -1;
        this.gamePortalAds = new Array();
        this.loadNextGamePortalAd();

        disorder(DatasManager.微信格子广告ID们);

        this.gridAdIndex = -1;
        this.gridAds = new Array();
        this.loadNextGridAd();

        disorder(DatasManager.微信原生广告ID们);
        this.customAdIndex = -1;
        this.customAds = new Array();
        this.loadNextCustomAd();

        this.init2Complete(onComplete);
    }

    public canRequestSubscribeMessage(): boolean {
        return wx.requestSubscribeMessage ? true : false;
    }

    public requestSubscribeMessage(currId: string, onComplete: (accept: boolean) => void): void {
        wx.requestSubscribeMessage({
            tmplIds: [currId],//需要订阅的消息模板的id的集合（注意：iOS客户端7.0.6版本、Android客户端7.0.7版本之后的一次订阅才支持多个模板消息，iOS客户端7.0.5版本、Android客户端7.0.6版本之前的一次订阅只支持一个模板消息）消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置
            success: (res: { errMsg: string }) => {//wx.requestSubscribeMessage success {"errMsg":"requestSubscribeMessage:ok","GgjP1o1i737R8CnuHLga0ThxHoPWNBv7tGqnOotPW5s":"accept"}
                //console.log("wx.requestSubscribeMessage success " + JSON.stringify(res));
                onComplete(res[currId] == "accept");
            },
            fail: (res: any) => {
                console.error("wx.requestSubscribeMessage fail " + JSON.stringify(res));
            }
        });
    }

    //verify

    public initOpenDataContext(): void {
        new OpenDataContexts();
    }

    private loadNextBannerAd(): void {
        if (wx.createBannerAd) {
            if (this.bannerAds.length < DatasManager.微信Banner广告ID们.length) {
                this.bannerAds.push(new MGCBannerAdContainer(DatasManager.微信Banner广告ID们[this.bannerAds.length]));
            }
        }
    }

    private loadNextInsertAd(): void {
        if (wx.createInterstitialAd) {
            if (this.insertAds.length < DatasManager.微信插屏广告ID们.length) {
                this.insertAds.push(new MGCInsertAdContainer(DatasManager.微信插屏广告ID们[this.insertAds.length]));
            }
        }
    }

    private loadNextGameBannerAd(): void {
        if (wx.createGameBanner) {
            if (this.gameBannerAds.length < DatasManager.GameBannerID们.length) {
                this.gameBannerAds.push(new MGCGameBannerAdContainer(DatasManager.GameBannerID们[this.gameBannerAds.length]));
            }
        }
    }

    private loadNextGamePortalAd(): void {
        if (wx.createGamePortal) {
            if (this.gamePortalAds.length < DatasManager.GamePortalID们.length) {
                this.gamePortalAds.push(new MGCGamePortalAdContainer(DatasManager.GamePortalID们[this.gamePortalAds.length]));
            }
        }
    }

    private loadNextGridAd(): void {
        if (wx.createGridAd) {
            if (this.gridAds.length < DatasManager.微信格子广告ID们.length) {
                this.gridAds.push(new MGCGridAdContainer(DatasManager.微信格子广告ID们[this.gridAds.length]));
            }
        }
    }

    private loadNextCustomAd(): void {
        if (wx.createCustomAd) {
            if (this.customAds.length < DatasManager.微信原生广告ID们.length) {
                this.customAds.push(new MGCCustomAdContainer(DatasManager.微信原生广告ID们[this.customAds.length]));
            }
        }
    }

    public login(onComplete: () => void): void {
        GlobalStorage.openId = "MGCGuest" + new Date().getTime();
        GlobalStorage.flush();
        onComplete();
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
        if (++this.bannerOrGameBannerIndex >= DatasManager.出Banner或GameBanner.length) {
            this.bannerOrGameBannerIndex = 0;
        }
        let 出哪个: Array<"出Banner" | "出GameBanner" | "出Grid" | "出Custom">;
        if (DatasManager.出Banner或GameBanner[this.bannerOrGameBannerIndex] == 1) {
            出哪个 = ["出Banner", "出GameBanner"];
        } else {
            出哪个 = ["出GameBanner", "出Banner"];
        }
        //出哪个 = ["出Grid", "出Custom", "出Banner", "出GameBanner"];
        while (出哪个.length) {
            const 出那个 = 出哪个.shift();
            console.log(出那个);
            switch (出那个) {
                case "出Banner":
                    if (wx.createBannerAd) this._showBannerAd(dx, dy);
                    break;
                case "出GameBanner":
                    if (wx.createGameBanner) this._showGameBannerAd(dx, dy);
                    break;
                case "出Grid":
                    if (wx.createGridAd) this._showGridAd(dx, dy);
                    break;
                case "出Custom":
                    if (wx.createCustomAd) this._showCustomAd(dx, dy);
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
    private _showGameBannerAd(dx: number, dy: number): void {
        if (this.gameBannerAds.length) {
            if (dx == 0 && dy == 1) { } else {
                this.showBannerAdSuccess = false;
                return;
            }
            if (++this.gameBannerAdIndex >= this.gameBannerAds.length) {
                this.gameBannerAdIndex = 0;
            }
            this.currGameBannerAdContainer = this.gameBannerAds[this.gameBannerAdIndex];
            this.showBannerAdSuccess = this.currGameBannerAdContainer.show(dx, dy);
            this.loadNextGameBannerAd();
        }
    }
    private _showGridAd(dx: number, dy: number): void {
        if (this.gridAds.length) {
            if (++this.gridAdIndex >= this.gridAds.length) {
                this.gridAdIndex = 0;
            }
            for (let i: number = 0; i < this.gridAds.length; i++) {
                this.currGridAdContainer = this.gridAds[(this.gridAdIndex + i) % this.gridAds.length];
                this.showBannerAdSuccess = this.currGridAdContainer.show(dx, dy);
                if (this.showBannerAdSuccess) {
                    break;
                }
            }
            this.loadNextGridAd();
        }
    }
    private _showCustomAd(dx: number, dy: number): void {
        if (this.customAds.length) {
            if (++this.customAdIndex >= this.customAds.length) {
                this.customAdIndex = 0;
            }
            for (let i: number = 0; i < this.customAds.length; i++) {
                this.currCustomAdContainer = this.customAds[(this.customAdIndex + i) % this.customAds.length];
                this.showBannerAdSuccess = this.currCustomAdContainer.show(dx, dy);
                if (this.showBannerAdSuccess) {
                    break;
                }
            }
            this.loadNextCustomAd();
        }
    }

    public hideBannerAd(): void {
        this.showBannerAdSuccess = false;
        if (this.currBannerAdContainer) {
            this.currBannerAdContainer.hide();
            this.currBannerAdContainer = null;
        }
        if (this.currGameBannerAdContainer) {
            this.currGameBannerAdContainer.hide();
            this.currGameBannerAdContainer = null;
        }
        if (this.currGridAdContainer) {
            this.currGridAdContainer.hide();
            this.currGridAdContainer = null;
        }
        if (this.currCustomAdContainer) {
            this.currCustomAdContainer.hide();
            this.currCustomAdContainer = null;
        }
    }

    protected showInsertAd_(): void {
        this.showInsertAdSuccess = false;
        if (++this.insertOrGamePortalIndex >= DatasManager.出插屏或GamePortal.length) {
            this.insertOrGamePortalIndex = 0;
        }
        let 出哪个: Array<"出插屏" | "出GamePortal">;
        if (DatasManager.出插屏或GamePortal[this.insertOrGamePortalIndex] == 1) {
            出哪个 = ["出插屏", "出GamePortal"];
        } else {
            出哪个 = ["出GamePortal", "出插屏"];
        }
        while (出哪个.length) {
            const 出那个 = 出哪个.shift();
            console.log(出那个);
            switch (出那个) {
                case "出插屏":
                    if (wx.createInterstitialAd) this._showInsertAd();
                    break;
                case "出GamePortal":
                    if (wx.createGamePortal) this._showGameInsertAd();
                    break;
            }
            if (this.showInsertAdSuccess) {
                break;
            }
        }
    }

    private _showInsertAd(): void {
        if (this.insertAds.length) {
            if (++this.insertAdIndex >= this.insertAds.length) {
                this.insertAdIndex = 0;
            }
            this.insertAds[this.insertAdIndex].show(success => {
                this.loadNextInsertAd();
                if (success) { } else {
                    this._showGameInsertAd();
                }
            });
            this.showInsertAdSuccess = true;
        }
    }
    private _showGameInsertAd(): void {
        if (this.gamePortalAds.length) {
            if (++this.gamePortalAdIndex >= this.gamePortalAds.length) {
                this.gamePortalAdIndex = 0;
            }
            this.gamePortalAds[this.gamePortalAdIndex].show(() => {
                this.loadNextGamePortalAd();
            });
            this.showInsertAdSuccess = true;
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
    private _rewardAdLoad(): void { (platformCtrl as PlatformCtrlMGC).rewardAdLoad(); }

    //这里不能用this
    private _rewardAdClose(res): void { (platformCtrl as PlatformCtrlMGC).rewardAdClose(res); }

    //这里不能用this
    private _rewardAdError(): void { (platformCtrl as PlatformCtrlMGC).rewardAdError(); }

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
        post_wx(req, true, true, onComplete);
    }

    public unzip1(upzipTextComplete: (file: string, text: string) => void): void {
        this.fsUnzip1(upzipTextComplete);
    }

}
