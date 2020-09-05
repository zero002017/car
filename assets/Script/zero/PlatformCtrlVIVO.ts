import PlatformCtrl from "./PlatformCtrl";
import { DatasManager } from "../datas/DatasManager";
import { GlobalStorage } from "./GlobalStorage";
import { disorder, hei0, platformCtrl, toast, Req, get_xhr, post_xhr, NativeAdInfo } from "./global";
import { Sounds } from "./Sounds";
import { main } from "../Main";
/**
 * 总包8m
 * 主包4m
 * 分包1：4M
 * 
 * 
 */

const vivoNativeAdContainers: Array<VIVONativeAdContainer> = new Array();
class VIVONativeAdContainer {

    private nativeAdId: string;
    private nativeAd: vivoqg.NativeAd;
    public infoIndex: number;
    public infos: Array<NativeAdInfo>;

    public constructor(nativeAdId: string) {
        this.nativeAdId = nativeAdId;
        this.infos = new Array();
        this.create();
    }
    private create(): void {
        console.log("createNative " + this.nativeAdId);
        this.nativeAd = vivoqg.createNativeAd({
            posId: this.nativeAdId
        });
        this.infoIndex = -1;
        this.infos.length = 0;
        this.nativeAd.load();
        this.nativeAd.onLoad(res => {//{"adList":[{"adId":"b9aef97a-ecf8-4990-97ed-eb60fc09ec00","clickBtnTxt":"点击安装","creativeType":3,"desc":"大牌正品，你想不到的最低价","iconUrlList":["http://images.pinduoduo.com/marketing_api/2019-12-06/31beb755-5566-4fba-b7cd-9a1b39046001.jpg"],"icon":"http://images.pinduoduo.com/marketing_api/2019-12-06/31beb755-5566-4fba-b7cd-9a1b39046001.jpg","interactionType":2,"logoUrl":"","title":"拼多多","imgUrlList":["http://images.pinduoduo.com/marketing_api/2019-12-06/31beb755-5566-4fba-b7cd-9a1b39046001.jpg"]}],"code":0,"msg":"ok"}
            console.log("nativeAd.onLoad() " + JSON.stringify(res));
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
            console.error("nativeAd.onError() " + JSON.stringify(res));
            //this.nativeAd.destroy();
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
            //this.nativeAd.destroy();
            this.nativeAd = null;
            this.create();
        }
    }

}

export default class PlatformCtrlVIVO extends PlatformCtrl {

    private rewardedVideoAd: vivoqg.RewardedVideoAd;

    private rewardAdCallback: (success: boolean) => void;

    private bannerAd: vivoqg.BannerAd;

    private insertAdIndex: number;
    private insertAd: vivoqg.InsertAd;

    public constructor() {
        super();

        const sysInfo = vivoqg.getSystemInfoSync();
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

    protected loadSubpackage(subpackageName: string, onComplete: () => void): void {
        console.log("加载子包 " + subpackageName);
        vivoqg.loadSubpackage({
            name: subpackageName,
            success: (res: { errMsg: string }) => {//{"errMsg":"loadSubpackage:ok"}
                //console.log("vivoqg.loadSubpackage() success " + JSON.stringify(res));
                onComplete();
            }, fail: (res) => {
                console.error("vivoqg.loadSubpackage() fail" + JSON.stringify(res));
                this.loadSubpackage(subpackageName, onComplete);
            }
        });
    }

    public init(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        super.init(onLoadSubpackagesComplete, onInitComplete);

        DatasManager.a = false;

        if (GlobalStorage.openId) { } else {
            GlobalStorage.openId = "VIVOGuest" + new Date().getTime();
            GlobalStorage.flush();
        }
        GlobalStorage.nickname = "VIVO";

        this.init_next(onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.VIVO合成点击完毕出现Banner;

        this.loadRewardAdSuccess = true;

        disorder(DatasManager.VIVOBanner广告ID们);
        this.bannerAdIndex = -1;

        disorder(DatasManager.VIVO插屏广告ID们);
        this.insertAdIndex = -1;

        let i: number = -1;
        for (const nativeAdId of DatasManager.VIVO原生广告ID们) {
            i++;
            vivoNativeAdContainers[i] = new VIVONativeAdContainer(nativeAdId);
        }

        this.init2Complete(onComplete);
    }

    //login

    //logout

    //share

    //rating

    public showBannerAd(bannerName: string, dx: number, dy: number): void {
        if (dx == 0 && dy == 1) { } else {
            this.showBannerAdSuccess = false;
            return;
        }

        super.showBannerAd(bannerName, dx, dy);
        let relwidth = Math.round(510 * this.screenHeight / hei0);
        // let relheight = Math.round(510 * this.screenHeight / hei0);
        console.warn("bannerAd.relwidth() ", relwidth, this.screenHeight);
        this.hideBannerAd();

        if (++this.bannerAdIndex >= DatasManager.VIVOBanner广告ID们.length) {
            this.bannerAdIndex = 0;
        }
        let style = {};
        if (this.screenHeight < this.screenWidth) {
            console.log("横屏");
            style = {
                left: (this.screenWidth - 1080) / 2,
                top: this.screenHeight - 200,
                width: 500
            }
        } else {
            console.log("竖屏");
        }
        this.bannerAd = vivoqg.createBannerAd({
            posId: DatasManager.VIVOBanner广告ID们[this.bannerAdIndex],
            style: style
            //广告大概是1080*170.--auto resize position  
            // vivo 目前不支持修改大小，位置信息的坐标系与返回的坐标系不同，只能做底部和头部banner展示
        });
        this.bannerAd.onError(res => {
            console.error("bannerAd.onError() " + JSON.stringify(res));
            switch (res.code) {
                case 30003:
                    console.log("新用户7天内不能曝光Banner，请将手机时间调整为7天后，退出游戏重新进入")
                    break;
                case 30009:
                    console.log("10秒内调用广告次数超过1次，10秒后再调用")
                    break;
                case 30002:
                    console.log("加载广告失败，重新加载广告")
                    break;
                default:
                    console.log("banner广告展示失败")
                    break;
            }

        });
        this.bannerAd.onSize((res) => {
            console.log("banner展示成功")
            this.showBannerAdSuccess = true;
            console.log("this.wid", res.width, "this.height", res.height);
        });
        this.bannerAd.show();
    }

    public hideBannerAd(): void {
        this.showBannerAdSuccess = false;
        if (this.bannerAd) {
            this.bannerAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }

    protected showInsertAd_(): void {
        if (++this.insertAdIndex >= DatasManager.VIVO插屏广告ID们.length) {
            this.insertAdIndex = 0;
        }
        this.insertAd = vivoqg.createInterstitialAd({
            posId: DatasManager.VIVO插屏广告ID们[this.bannerAdIndex]
        });
        let insertAdShow = this.insertAd.show();
        insertAdShow && insertAdShow.then(() => {
            console.log("插屏广告展示成功");
        }).catch((err) => {
            switch (err.code) {
                case 30003:
                    console.log("新用户7天内不能曝光Banner，请将手机时间调整为7天后，退出游戏重新进入")
                    break;
                case 30009:
                    console.log("10秒内调用广告次数超过1次，10秒后再调用")
                    // setTimeout(() => {
                    //     show()
                    // }, 10000);
                    break;
                case 30002:
                    console.log("load广告失败，重新加载广告")
                    // setTimeout(() => {
                    //     retryShow()
                    // }, 10000);  
                    break;
                default:
                    // 参考 https://minigame.vivo.com.cn/documents/#/lesson/open-ability/ad?id=广告错误码信息 对错误码做分类处理
                    console.log("插屏广告展示失败")
                    console.log(JSON.stringify(err))
                    break;
            }
        });
    }

    public loadRewardAd(): void {
        //创建rewardAd

        this.loadRewardAdSuccess = false;
        this._loadRewardAd();
    }

    private _loadRewardAd(): void {
        console.log("拉取广告_loadRewardAd");
        if (this.rewardedVideoAd) {
            this.rewardedVideoAd.offLoad(this._rewardAdLoad);
            this.rewardedVideoAd.offClose(this._rewardAdClose);
            this.rewardedVideoAd.offError(this._rewardAdError);
            this.rewardedVideoAd = null;
        }
        if (vivoqg.createRewardedVideoAd && DatasManager.VIVO视频广告ID们.length) {
            this.rewardAdId = DatasManager.VIVO视频广告ID们[Math.floor(Math.random() * DatasManager.VIVO视频广告ID们.length)];
            console.log("loadReward " + this.rewardAdId);
            this.rewardedVideoAd = vivoqg.createRewardedVideoAd({
                posId: this.rewardAdId
            });
            this.rewardedVideoAd.onLoad(this._rewardAdLoad);
            this.rewardedVideoAd.onClose(this._rewardAdClose);
            this.rewardedVideoAd.onError(this._rewardAdError);
            // 第一次创建视频广告对象时，已自动加载一次广告，请勿重新加载
            this.rewardedVideoAd.load();
        } else {
            this.rewardAdCallback(false);
        }
    }

    public showRewardAd(action: number, pos: string, callback: (success: boolean) => void): void {
        switch (action) {
            case 1:
                this.showRewardAdPos = pos;
                this.aldSend("视频曝光", this.showRewardAdPos);
                this.rewardAdCallback = callback;
                this.loadRewardAd();
                return;
            case 2:
                //
                break;
        }
    }

    //这里不能用this
    private _rewardAdLoad(): void { (platformCtrl as PlatformCtrlVIVO).rewardAdLoad(); }

    //这里不能用this
    private _rewardAdClose(res): void { (platformCtrl as PlatformCtrlVIVO).rewardAdClose(res); }

    //这里不能用this
    private _rewardAdError(): void { (platformCtrl as PlatformCtrlVIVO).rewardAdError(); }

    private rewardAdLoad(): void {
        //console.log("rewardAdLoad " + JSON.stringify(res));
        this.loadRewardAdSuccess = true;
        if (this.onLoadRewardAdSuccess) this.onLoadRewardAdSuccess();
        Sounds.pauseMusic();
        this.rewardedVideoAd.show();
    }

    private rewardAdClose(res: { isEnded: boolean }): void {//{"isEnded":false}
        //console.log("rewardAdClose " + JSON.stringify(res));
        main.delays.delay({ time: 0.5, action: () => { Sounds.resumeMusic(); } });
        if (res.isEnded) {
            this.aldSend("看完视频领取奖励", this.showRewardAdPos);
        }
        //this.loadRewardAd();
        if (this.rewardAdCallback) {
            this.rewardAdCallback(res.isEnded);
            this.rewardAdCallback = null;
        }
    }

    private rewardAdError(): void {
        //console.error("rewardAdError");
        this.loadRewardAdSuccess = false;
        toast("激励广告展示失败，请稍后或下次重试！");
        this.rewardAdCallback(false);
    }

    public getNativeAdInfo(): NativeAdInfo {
        if (vivoNativeAdContainers.length) {
            return vivoNativeAdContainers[Math.floor(Math.random() * vivoNativeAdContainers.length)].getInfo();
        }
    }

    public showNativeAd(nativeAdInfo: NativeAdInfo): void {
        if (nativeAdInfo) {
            for (const nativeAdContainer of vivoNativeAdContainers) {
                if (nativeAdContainer.infos.indexOf(nativeAdInfo) > -1) {
                    nativeAdContainer.show(nativeAdInfo);
                    break;
                }
            }
        }
    }

    public clickNativeAd(nativeAdInfo: NativeAdInfo): void {
        if (nativeAdInfo) {
            for (const nativeAdContainer of vivoNativeAdContainers) {
                if (nativeAdContainer.infos.indexOf(nativeAdInfo) > -1) {
                    nativeAdContainer.click(nativeAdInfo);
                    break;
                }
            }
        }
    }

    public hideNativeAd(nativeAdInfo: NativeAdInfo): void {
        if (nativeAdInfo) {
            for (const nativeAdContainer of vivoNativeAdContainers) {
                if (nativeAdContainer.infos.indexOf(nativeAdInfo) > -1) {
                    nativeAdContainer.remove(nativeAdInfo);
                    break;
                }
            }
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
        get_xhr(req, false, onComplete);
    }

    public post(req: Req, onComplete: (rsp: any) => void): void {
        post_xhr(req, false, onComplete);
    }

}
