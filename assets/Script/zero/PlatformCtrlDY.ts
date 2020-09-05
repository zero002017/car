import PlatformCtrl from "./PlatformCtrl";
import { disorder, chName, platformCtrl, dyShareId, dyAppId, Req, get_wx, post_wx, toast, Share } from "./global";
import { DatasManager } from "../datas/DatasManager";
import { GlobalStorage } from "./GlobalStorage";
import { Sounds } from "./Sounds";
import { main } from "../Main";
/**
 * 总包8m？？？？
 * 不支持分包
 */

class DYBannerAdContainer {

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
                width: 160
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
                this.bannerAd.style.left = Math.round((platformCtrl.screenWidth - this.wid) / 2 * (this.dx + 1));
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

class DYInsertAdContainer {

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

export default class PlatformCtrlDY extends PlatformCtrl {

    private rewardedVideoAd: RewardedVideoAd;

    private rewardAdCallback: (success: boolean) => void;

    private bannerAds: Array<DYBannerAdContainer>;
    private currBannerAdContainer: DYBannerAdContainer;

    private insertAdIndex: number;
    private insertAds: Array<DYInsertAdContainer>;

    public constructor() {
        super();

        const sysInfo = wx.getSystemInfoSync();
        this.screenWidth = sysInfo.screenWidth;
        this.screenHeight = sysInfo.screenHeight;

        //this.language = sysInfo.language;
        this.language = "zh";
        this.粪叉 = sysInfo.model ? sysInfo.model.toLowerCase().replace(/\s+/g, "").indexOf("iphonex") > -1 : false;
        const Info = wx.getSystemInfoSync();
        this.isIOS = Info.platform === "ios";

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
        this.使用炫耀 = true;
        this.显示抖音录屏分享 = true;
        this.显示抖音更多游戏 = true;
        this.显示QQ盒子广告 = false;
    }

    //录屏
    private recorder: any;
    public GameRecorderManager(): any {
        if (this.recorder) { } else {
            this.recorder = wx.getGameRecorderManager();
            this.recorder.onStart(res => {
                console.log('录屏开始');
                this.DyVideoflag = false;
            })
            this.recorder.onStop(res => {
                console.log('录屏结束事件');
                console.log(res.videoPath);
                this.DyVideoPath = res.videoPath;
                this.DyVideoflag = true;
            })
            this.recorder.onError(res => {
                console.log('监听录屏错误事件');
                console.log(res.errMsg);
            })
            this.recorder.onInterruptionBegin(res => {
                console.log('监听录屏中断开始');
            })
            this.recorder.onInterruptionEnd(res => {
                console.log('监听录屏中断结束');
            })
        }
        return this.recorder;
    }
    public DyVideoShare(): any {
        console.log("DyVideoShare");
        wx.shareAppMessage({
            channel: 'video',
            title: chName,
            desc: chName + "来和我一起玩",
            imageUrl: '',
            templateId: dyShareId, // 替换成通过审核的分享ID
            query: '',
            extra: {
                videoPath: this.DyVideoPath, // 可替换成录屏得到的视频地址
                videoTopics: []
            },
            success: () => {
                console.log('分享视频成功');
            },
            fail: (e: number) => {
                console.log("分享失败")
                console.log(e)
                switch (e) {
                    case 1002:
                        toast("视频被清理，请重新录屏分享");
                        break;
                    case 1004:
                        toast("获取视频信息错误");
                        break;
                    case 1006:
                        toast("视频分享失败，请检查网络");
                        break;
                    default:
                        if (this.DyVideoflag) {
                            toast('分享视频失败');
                        } else {
                            toast('分享视频失败，正在录屏');
                        }
                        break;
                }
            }
        } as any)

    }

    public init(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        super.init(onLoadSubpackagesComplete, onInitComplete);
        this.wxInit(dyAppId, onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.抖音合成点击完毕出现Banner;

        this.loadRewardAd();

        disorder(DatasManager.抖音Banner广告ID们);

        this.bannerAdIndex = -1;
        this.bannerAds = new Array();
        this.loadNextBannerAd();

        // if (wid0 > hei0) {//目前该能力只支持竖屏版小游戏
        //     const isToutiaio = wx.getSystemInfoSync().appName === "Toutiao";
        //     // 插屏广告仅今日头条安卓客户端支持
        DatasManager.抖音插屏广告ID们.length = 0;
        // }
        disorder(DatasManager.抖音插屏广告ID们);

        this.insertAdIndex = -1;
        this.insertAds = new Array();
        this.loadNextInsertAd();

        this.init2Complete(onComplete);
    }

    //verify

    public showMoreGames(): void {
        // 监听弹窗关闭
        wx.onMoreGamesModalClose(function (res) {
            console.log("modal closed", res);
        });
        // 监听小游戏跳转
        wx.onNavigateToMiniProgram(function (res) {
            console.log(res.errCode);
            console.log(res.errMsg);
        });

        const systemInfo = wx.getSystemInfoSync();
        // iOS 不支持，建议先检测再使用
        if (!this.isIOS) {
            // 打开互跳弹窗
            try {
                wx.showMoreGamesModal({
                    appLaunchOptions: [
                        {
                            appId: dyAppId,
                            query: "from=" + encodeURIComponent(chName) + "&baz=qux",
                            extraData: {}
                        }
                        // {...}
                    ],
                    success(res) {
                        console.log("success", res.errMsg);
                    },
                    fail(res) {
                        console.log("fail", res.errMsg);
                    }
                });
            } catch (e) {
                console.log("该机型暂时不支持该功能：showMoreGamesModal");
            }
        }
    }

    private loadNextBannerAd(): void {
        if (this.bannerAds.length < DatasManager.抖音Banner广告ID们.length) {
            this.bannerAds.push(new DYBannerAdContainer(DatasManager.抖音Banner广告ID们[this.bannerAds.length]));
        }
    }

    private loadNextInsertAd(): void {
        if (wx.createInterstitialAd) {
            if (this.insertAds.length < DatasManager.抖音插屏广告ID们.length) {
                this.insertAds.push(new DYInsertAdContainer(DatasManager.抖音插屏广告ID们[this.insertAds.length]));
            }
        }
    }

    public getShare(share?: Share, id?: string): Share {
        if (share) { } else {
            if (DatasManager.抖音分享) {
                return super.getShare(DatasManager.抖音分享);
            }
        }
        return super.getShare(share, id);
    }

    public login(onComplete: () => void): void {
        // console.error("wx.login() fail " + JSON.stringify(res));
        GlobalStorage.openId = "DouyinGuest" + new Date().getTime();
        GlobalStorage.flush();
        onComplete();
    }

    //logout

    //rating

    public showBannerAd(bannerName: string, dx: number, dy: number): void {
        this.showBannerAdSuccess = false;
        if (dx == 0 && dy == 1) { } else {
            return;
        }
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
        if (wx.createRewardedVideoAd && DatasManager.抖音视频广告ID们.length) {
            this.rewardAdId = DatasManager.抖音视频广告ID们[Math.floor(Math.random() * DatasManager.抖音视频广告ID们.length)];
            console.log("loadReward " + this.rewardAdId);
            this.rewardedVideoAd = wx.createRewardedVideoAd({
                adUnitId: this.rewardAdId,
                appSid: dyAppId
            });
            this.rewardedVideoAd.load().then((res) => {
                console.log("rewardedVideoAd.load() onfulfilled " + JSON.stringify(res));
                this.loadRewardAdSuccess = true;
                if (this.onLoadRewardAdSuccess) this.onLoadRewardAdSuccess();
            }, (res) => {
                console.error("rewardedVideoAd.load() onrejected " + JSON.stringify(res));
                this.rewardAdError();
            }).catch(e => {
                console.error("rewardedVideoAd.load() e=" + JSON.stringify(e));
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
    private _rewardAdLoad(): void { (platformCtrl as PlatformCtrlDY).rewardAdLoad(); }

    //这里不能用this
    private _rewardAdClose(res): void { (platformCtrl as PlatformCtrlDY).rewardAdClose(res); }

    //这里不能用this
    private _rewardAdError(): void { (platformCtrl as PlatformCtrlDY).rewardAdError(); }

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
        if (wx.hbVideo) wx.hbVideo(res.isEnded);
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

}
