import PlatformCtrl from "./PlatformCtrl";
import { GlobalStorage } from "./GlobalStorage";
import { DatasManager } from "../datas/DatasManager";
import { disorder, platformCtrl, NativeAdInfo, oppoAppId, toast, Req, get_xhr, post_xhr } from "./global";
import { Sounds } from "./Sounds";
import { main } from "../Main";
/**
 * 不限制
 */

const bannerAdContainers: { [key: string]: OPPOBannerAdContainer } = {};
let currBannerAdContainer: OPPOBannerAdContainer;
class OPPOBannerAdContainer {

    private bannerName: string;
    private bannerAdId: string;
    public bannerAd: oppoqg.BannerAd;
    private isShow: boolean;

    public constructor(bannerName: string, bannerAdId: string) {
        this.bannerName = bannerName;
        this.bannerAdId = bannerAdId;
        this.create();
    }
    private create(): void {
        console.log("createBanner " + this.bannerName + " " + this.bannerAdId);
        this.bannerAd = oppoqg.createBannerAd({
            posId: this.bannerAdId
        });
        this.bannerAd.onError(res => {
            console.error("bannerAd.onError() " + this.bannerName + " " + JSON.stringify(res));
            this.bannerAd.destroy();
            this.bannerAd = null;
        });
    }

    public show(dx: number, dy: number): boolean {
        console.log("showBanner " + this.bannerName + " " + this.bannerAdId + " " + dx + " " + dy);
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
                //this.bannerAd.hide();
                this.bannerAd.destroy();
                this.bannerAd = null;
                this.create();
            }
        }
    }

}

const oppoNativeAdContainers: { [key: string]: OPPONativeAdContainer } = {};
class OPPONativeAdContainer {

    private nativeName: string;
    private nativeAdId: string;
    private nativeAd: oppoqg.NativeAd;
    public infoIndex: number;
    public infos: Array<NativeAdInfo>;

    public constructor(nativeName: string, nativeAdId: string) {
        this.nativeName = nativeName;
        this.nativeAdId = nativeAdId;
        this.infos = new Array();
        this.create();
    }
    private create(): void {
        console.log("createNative " + this.nativeName + " " + this.nativeAdId);
        this.nativeAd = oppoqg.createNativeAd({
            adUnitId: this.nativeAdId
        });
        this.infoIndex = -1;
        this.infos.length = 0;
        this.nativeAd.load();
        this.nativeAd.onLoad(res => {//{"adList":[{"adId":"b9aef97a-ecf8-4990-97ed-eb60fc09ec00","clickBtnTxt":"点击安装","creativeType":3,"desc":"大牌正品，你想不到的最低价","iconUrlList":["http://images.pinduoduo.com/marketing_api/2019-12-06/31beb755-5566-4fba-b7cd-9a1b39046001.jpg"],"icon":"http://images.pinduoduo.com/marketing_api/2019-12-06/31beb755-5566-4fba-b7cd-9a1b39046001.jpg","interactionType":2,"logoUrl":"","title":"拼多多","imgUrlList":["http://images.pinduoduo.com/marketing_api/2019-12-06/31beb755-5566-4fba-b7cd-9a1b39046001.jpg"]}],"code":0,"msg":"ok"}
            console.log("nativeAd.onLoad() " + this.nativeName + " " + JSON.stringify(res));
            if (res.adList) {
                disorder(res.adList);
                for (let nativeAdArgs of res.adList) {
                    this.infos.push({
                        adId: nativeAdArgs.adId,
                        title: nativeAdArgs.title,
                        icon: nativeAdArgs.icon
                    });
                }
                //console.log(JSON.stringify(this.infos));
                console.log("获得 " + this.infos.length + " 个广告");
                for (let info of this.infos) {
                    console.log(info.title);
                }
            }
        });
        this.nativeAd.onError(res => {
            console.error("nativeAd.onError() " + this.nativeName + " " + JSON.stringify(res));
            this.nativeAd.destroy();
            this.nativeAd = null;
        });
    }

    public getInfo(): NativeAdInfo {
        if (this.nativeAd) {
            const info = this.infos[++this.infoIndex];
            console.log("getInfo", this.infoIndex, info);
            return info;
        } else {
            this.create();
        }
    }

    public show(info: NativeAdInfo): void {
        this.nativeAd.reportAdShow({ adId: info.adId });
    }

    public click(info: NativeAdInfo): void {
        this.nativeAd.reportAdClick({ adId: info.adId });
    }

    public remove(info: NativeAdInfo): void {
        //console.log("remove ", info);
        if (this.infoIndex < this.infos.length - 1) {
        } else {
            this.nativeAd.destroy();
            this.nativeAd = null;
            this.create();
        }
    }

}

export default class PlatformCtrlOPPO extends PlatformCtrl {

    private rewardedVideoAd: oppoqg.RewardedVideoAd;

    private rewardAdCallback: (success: boolean) => void;

    public constructor() {
        super();

        oppoqg.setLoadingProgress({ progress: 0 });

        const sysInfo = oppoqg.getSystemInfoSync();
        this.screenWidth = sysInfo.screenWidth;
        this.screenHeight = sysInfo.screenHeight;

        //this.language = navigator.language;
        this.language = "zh";
        this.isIOS = false;
        this.粪叉 = false;

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

        oppoqg.setLoadingProgress({ progress: 100 });

        oppoqg.loadingComplete({});

        this.init_next(onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.OPPO合成点击完毕出现Banner;

        // oppo 上报崩溃信息、
        if (oppoqg.reportMonitor) {
            oppoqg.reportMonitor('game_scene', 0);
            console.log("上传成功");
        } else {
            console.log("版本小于1060");
        }

        oppoqg.initAdService({
            appId: oppoAppId,
            isDebug: false,
            success: (res) => {
                console.log("initAdService success " + JSON.stringify(res));

                this.loadRewardAd();

                let i: number = -1;
                for (const bannerName of DatasManager.OPPOBanner广告名称们) {
                    i++;
                    bannerAdContainers[bannerName] = new OPPOBannerAdContainer(bannerName, DatasManager.OPPOBanner广告ID们[i]);
                }

                i = -1;
                for (const nativeName of DatasManager.OPPO原生广告名称们) {
                    i++;
                    oppoNativeAdContainers[nativeName] = new OPPONativeAdContainer(nativeName, DatasManager.OPPO原生广告ID们[i]);
                }

                this.init2Complete(onComplete);
            },
            fail: (res) => {
                console.error("initAdService fail " + JSON.stringify(res));
            }
        });
    }

    public login(onComplete: () => void): void {
        // console.log("oppo登陆调用 ");
        oppoqg.login({
            success: (res: { data: any }) => {
                // {"age":"-1",
                // "avatar":"https://cdopic0.heytapimage.com/play/201811/12/instantGame_default_avatar.png",
                // "birthday":"-1",
                // "isTourist":"false",
                // "nickName":"135******78",
                // "oid":"91321768",
                // "phoneNum":"135******78",
                // "sex":"",
                // "token":"TN_bk1HSXJjOG1MTlNqKzc5bHBvQ2U1V3M5TjVYQmQ5MWx5VVNpUlFuTWNQNjhSNldNSEpUdjUyemVEWWx5d0w5bg",
                // "uid":"1053789462",
                // "code":0,
                // "data":{"age":"-1","avatar":"https://cdopic0.heytapimage.com/play/201811/12/instantGame_default_avatar.png","birthday":"-1","isTourist":"false","nickName":"135******78","oid":"91321768","phoneNum":"135******78","sex":"","token":"TN_bk1HSXJjOG1MTlNqKzc5bHBvQ2U1V3M5TjVYQmQ5MWx5VVNpUlFuTWNQNjhSNldNSEpUdjUyemVEWWx5d0w5bg","uid":"1053789462","code":0}}

                console.log("wx.login() success " + JSON.stringify(res));
                GlobalStorage.openId = "OPPO" + res.data.uid;
                GlobalStorage.nickname = "" + res.data.uid;
                GlobalStorage.flush();
                onComplete();
            },
            fail: (res: any) => {
                //   console.log("oppo登陆失败" + res);
            },
            complete: (res: any) => {
                // console.log("oppo登陆完成" + res);
            }
        });
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
        this.hideBannerAd();
        currBannerAdContainer = bannerAdContainers[bannerName];
        if (currBannerAdContainer) {
            this.showBannerAdSuccess = currBannerAdContainer.show(dx, dy);
        } else {
            console.error("木有banner：" + bannerName);
        }
    }

    public hideBannerAd(): void {
        this.showBannerAdSuccess = false;
        if (currBannerAdContainer) {
            currBannerAdContainer.hide();
            currBannerAdContainer = null;
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
        if (oppoqg.createRewardedVideoAd && DatasManager.OPPO视频广告ID们.length) {
            this.rewardAdId = DatasManager.OPPO视频广告ID们[Math.floor(Math.random() * DatasManager.OPPO视频广告ID们.length)];
            console.log("loadReward " + this.rewardAdId);
            this.rewardedVideoAd = oppoqg.createRewardedVideoAd({
                posId: this.rewardAdId
            });
            this.rewardedVideoAd.onLoad(this._rewardAdLoad);
            this.rewardedVideoAd.onClose(this._rewardAdClose);
            this.rewardedVideoAd.onError(this._rewardAdError);
            this.rewardedVideoAd.load();
        }
    }

    public showRewardAd(action: number, pos: string, callback: (success: boolean) => void,): void {
        if (action == 2) { } else action = 1;
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
                } else {
                    console.log("showRewardAd 视频拉取失败，请稍后重试！", action);
                    toast("视频拉取失败，请稍后重试！");
                }
                break;
            case 2:
                //
                break;
        }
    }

    //这里不能用this
    private _rewardAdLoad(): void { (platformCtrl as PlatformCtrlOPPO).rewardAdLoad(); }

    //这里不能用this
    private _rewardAdClose(res): void { (platformCtrl as PlatformCtrlOPPO).rewardAdClose(res); }

    //这里不能用this
    private _rewardAdError(res): void { (platformCtrl as PlatformCtrlOPPO).rewardAdError(res); }

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

    private rewardAdError(res): void {
        console.error(JSON.stringify(res));
        this.loadRewardAdSuccess = false;
        if (++this.rewardedVideoAdLoadTimes < 3) {
            //console.log("尝试重新加载 " + this.rewardedVideoAdLoadTimes);
            this._loadRewardAd();
        }
    }

    public getNativeAdInfo(nativeName: string): NativeAdInfo {
        if (oppoNativeAdContainers[nativeName]) {
            return oppoNativeAdContainers[nativeName].getInfo();
        } else {
            console.error("木有native：" + nativeName);
        }
    }

    public showNativeAd(nativeAdInfo: NativeAdInfo): void {
        if (nativeAdInfo) {
            for (const nativeName in oppoNativeAdContainers) {
                const nativeAdContainer = oppoNativeAdContainers[nativeName];
                if (nativeAdContainer.infos.indexOf(nativeAdInfo) > -1) {
                    nativeAdContainer.show(nativeAdInfo);
                    break;
                }
            }
        }
    }

    public clickNativeAd(nativeAdInfo: NativeAdInfo): void {
        if (nativeAdInfo) {
            for (const nativeName in oppoNativeAdContainers) {
                const nativeAdContainer = oppoNativeAdContainers[nativeName];
                if (nativeAdContainer.infos.indexOf(nativeAdInfo) > -1) {
                    nativeAdContainer.click(nativeAdInfo);
                    break;
                }
            }
        }
    }

    public hideNativeAd(nativeAdInfo: NativeAdInfo): void {
        if (nativeAdInfo) {
            for (const nativeName in oppoNativeAdContainers) {
                const nativeAdContainer = oppoNativeAdContainers[nativeName];
                if (nativeAdContainer.infos.indexOf(nativeAdInfo) > -1) {
                    nativeAdContainer.remove(nativeAdInfo);
                    break;
                }
            }
        }
    }

    //pay

    //getSettings

    public getInviteList(onComplete: (rsp: { yaoqingNum: number, openIds: Array<string> }) => void): void { }

    public invite(邀请者的openId: string): void { }

    public get(req: Req, onComplete: (rsp: any) => void): void {
        get_xhr(req, false, onComplete);
    }

    public post(req: Req, onComplete: (rsp: any) => void): void {
        post_xhr(req, false, onComplete);
    }

}
