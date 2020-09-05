import PlatformCtrl from "./PlatformCtrl";
import { GlobalStorage } from "./GlobalStorage";
import { Req, get_xhr, post_xhr, wxAppId, User } from "./global";
import { RankDatas } from "../popups/Rank";
import { DatasManager } from "../datas/DatasManager";
/**
 *不限
 */

export default class PlatformCtrlTest extends PlatformCtrl {

    public constructor() {
        super();

        this.screenWidth = document.documentElement.clientWidth;
        this.screenHeight = document.documentElement.clientHeight;

        //this.language = navigator.language;
        this.language = "zh";
        this.isIOS = false;
        this.粪叉 = false;

        this.defaultLanguageKey = "CN";
        this.显示世界榜 = true;
        this.显示好友榜 = true;
        this.显示客服签到 = false;
        this.显示好友助力 = true;
        this.显示充值商店 = true;
        this.显示联系我们 = false;
        this.显示分享 = true;
        this.显示5星好评 = false;
        this.强制显示视频 = false;
        this.显示分享提示 = false;
        this.显示竞技场 = false;
        this.使用炫耀 = true;
        this.显示抖音录屏分享 = false;
        this.显示抖音更多游戏 = false;
        this.显示QQ盒子广告 = false;
    }

    //loadSubpackage

    public init(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        super.init(onLoadSubpackagesComplete, onInitComplete);

        if (GlobalStorage.openId) { } else {
            GlobalStorage.openId = "TestGuest" + new Date().getTime();
            GlobalStorage.flush();
        }
        GlobalStorage.nickname = "调试";

        //openId = "oPFj-48Qu2UXLznZfHt8-zwBHSZI";
        //nickname = "zero";

        this.loadCPA(wxAppId);
        this.loadCPB(wxAppId);

        this.init_next(onLoadSubpackagesComplete, onInitComplete);
    }

    public init2(onComplete: () => void): void {
        DatasManager.胜利宝箱点击完毕出现Banner = DatasManager.微信合成点击完毕出现Banner;

        this.loadRewardAdSuccess = true;

        this.init2Complete(onComplete);

        //this.需要限制游戏(0.01);
    }

    // public initOpenDataContext(): void {
    //     new OpenDataContexts();
    // }

    //login

    //logout

    //share

    //rating

    //showBannerAd

    //hideBannerAd

    //showRewardAd

    //pay

    //getSettings

    public getStore(onComplete: () => void): void {
        this.getStoreComplete({ times: 0 }, onComplete);
    }

    public setStore(): void { }

    public deleteStore(onComplete: () => void): void {
        if (onComplete) onComplete();
    }

    public getRanks(limit: number, onComplete: (rsp: RankDatas) => void): void {
        if (onComplete) onComplete({
            "self": { "kill": 8, "vs": 0 },
            "friends": {
                "kill": [
                    { "nickname": "zero", "openId": "olBL35U9G2Y5HctDjoZJmjEtvTYs", "score": 8 }
                ]
            }
        });
    }

    public getInviteList(onComplete: (rsp: { yaoqingNum: number, openIds: Array<string> }) => void): void {
        if (onComplete) onComplete({ "yaoqingNum": 0, "openIds": ["o0tF45Aw162yZsWRBn-YCNWpgDK0"] });
    }

    public getVS(vss: Array<number>, onComplete: (rsp: Array<User>) => void): void {
        //if (onComplete) onComplete({});
        //if (onComplete) onComplete([{ "nickname": "陆志斌小号", "openId": "olBL35VAkiG6mW46Ws_WbK2CRjBI", "data": "HwCLAAgAAAAAAAAAAAAAAAAAAwDNAFYAXQBvABMARwAUAP0ALwDzAOwABwB7AHYAEwAiAL8AIQAjANIACADUACIAwQBLAFUA8QCwAHgAJwD2ACQA6wBZAGcAPwAQAGoAFAApANAAJgC2ANoApABRACAA5QArAAgACABNAEkAKACGADQABAA1AMEALgDlAM8AeAC8ALsA\/wCCALsAOwC7AOsA3QB1AEIAFwCQABAALwDWAMwAuQDnAN4AOQBzAO4AeABnAOYAEQBvAC8A9wC7AM8AzwAoABYAQQDlANIAhAAsAJcACgAhADQAxQBUAHIADQCwAAIAsgBoAIMAmACoADwAUQAsACAAagCRAAYADADnAJEA1wBaAOcARwDXACEAfAAKAFAA7wBmAM8AeQB0AIAAygDFAIUAAgCqANkAVAD1ANkAPwCgAH4A7wBXAKcAtwBaAEIABQDkAO4A\/ADhAG0AXAD3AEcAzgCNADcAgwD2AN0AwQDtADsA0QDkAN4ASwBvAPEAPgBfADoA4ACrAFsAIQDkAHQAOgD9AKMARQCAACIAygDKADoApAD4ABMAkQDJALcA9wDdANcAfwAOAOcA7gBPAA8AeAD7AFkAsADMALsADQC+APkAcAA4AMIAogAAAN8AfwA4AFgA3ACJAKoAvQB4AMoA7wDtAIYAEwC+ANoAcgC6AFEABABWAPQA7gC8ABgAZgBLAEkAuQB4AFQALgAeAMoA7QCuAGQA5QDiAIwAXACcAJEAiwDjAGUA5AB4ADQAFgA7ABUArQB2APAAOwA\/AGoApwC0AA4A8wDGAJMA8gAkAHQAGQB6AFMAYwC6AEEAJgAjAP8AAQAxAEgAQwC\/AEoApgCYAEkADADrALQACgDgALQAogCZAKQAgABMAKAA+gAdAGcAdgADAEMA1wCgAGkAdADaAKoA6ABxAJ4ApgCYANYAZAAIAKEAMgCCAJUACACzAIgAcQCxAEoAmAB\/AEoAigBFADgAFADuAN4AngC7APMA1ADrAK0AowCyAGUA2ABEACQAXQAMAAsAiwCqAP4AMgAVAN0AZgBWADAA8wDjAJUAugBuAM8AUACFANUAUgDnAG0A2gAgACQAjgBcABIAhwANAOAAagAGAIIAGgA\/ANYAbQCFADUAFQBWAKkAEwDTADoATwBZAG0AzgD2ACUAiwBtACUAfgBhAA8ADQBCAA0AmgBaACYAQAAmAOEA\/AAOAOsABQBQAEUApwAsAIEAaQBBANkA7wAVAH0AjgBmAHQApgAiAGcADQBKAJgA+gBdAJMAsAApADUAtACtAKoA0QDqACwAUQC\/ALEALQCbAM4A+QDCAGMAwwBFAGYAEADwACsA+gD\/ACAA+ACrANQAiQChAPsAqQDzAMgAZgCaAF4AnQCNAOkAVwBsANUApgBTAKoAbwD1ADgAmABdACwAggCsABkASgBmAGgA4ACLAEYArgASAC0AGACRADkAmwA2AEUAhQDRAPAAQgDhALMAUQDYAFMA0wCuAOkArACWAFYAKQD6AE0AAwB9AKUAQABeAKYA1ADJAEQAnACXACgApQBlAJgAswBUANMA\/gBPAIUAnAC3APgA2ADxAMQA0AD9ACQAcwA8ACkA4wAYAG4AugBTAPgA6wDuABQAzgDbACkAnADpAFQAngAGAOAATADTAD4AWAD8AIQATgBlABoAgAAzAK0AugA8AFoANADtAL8AdAC8AP8A+AArAPEAXwDKAOsAvwD0AAkA\/gBLAHkA\/QCXAHIA+wAvAH0ArAD\/APIAJwCdAH8A\/AClAPwAlwDzAPoALwDnAP0AUgDJAHkATQCXADMApgDnAOkAqAB8APIAlwBqAJQAOACeAKsAowA+APMAVADeAJIAEwCpANYAgwDiAGkA+wAKAGEAZgCpAFIAVwCaAPAAGgAIAN8AhwDFABgADwABADAArgChAFwAOwAHAJsA+wDWAG4AJABuANQAMAAtALgAugDjAPcAiQCiABIA9QCCAKYABwBAAEkA8gA\/ALkAsAB6ACEAHABNAEQAIwBcACwAAQDbAG0A\/QDFAH8A2QCNAJQAmgBEACMAVQALAG4AWwC4AEQAMwAHANAAfwBpAJwA1wBrAJQApQBuAG8A9wDJAHMA7wDGAKIAuwB3AKgAJwDvAGwA\/gD2ABYA3wB+AOYA9AAeALkALwC3ANwAdwAtAOcA\/gDPAIIAxADbAH8AwwBYAFAA+wC9AI4AIACPAIYAnACNAN0AfgD3ALcAfgB3AFkAvACZAAUADQDAAEEA+wDQAD0APABwAN8AdgBEAM0AygCFANMAgwC1AJsAfAB\/AA0ACwDGAOAAaADJANsA\/AAnAMkAAwAGAN8A\/ABvAPAAuACVANIALAAYAEIAYwCmAJ4AYACHAO8ANQCiABgALAAyAIYAHwC+APIAngAsAPMAtQDbAPAAigAeAHQAtgDgAOkA6wBsAP8AywBXAJYARAB8AOEAPQAPAO0AfADTAPIACwAAAAAA", "score": 1 }]);
        if (onComplete) onComplete([{ "nickname": "迈雪儿", "openId": "robot1169", "data": "[{\"unlock\":true,\"buduiId\":106001000,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101010001,\"level\":1},{\"unlock\":true,\"id\":101010002,\"level\":1},{\"unlock\":true,\"id\":101010003,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101010004,\"level\":6},{\"unlock\":true,\"id\":101010005,\"level\":6},{\"unlock\":true,\"id\":101010006,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001100,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101020001,\"level\":1},{\"unlock\":true,\"id\":101020002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101020003,\"level\":6},{\"unlock\":true,\"id\":101020004,\"level\":6},{\"unlock\":true,\"id\":101020005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001200,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101030001,\"level\":1},{\"unlock\":true,\"id\":101030002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101030003,\"level\":6},{\"unlock\":true,\"id\":101030004,\"level\":6},{\"unlock\":true,\"id\":101030005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001300,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":4,\"level\":53},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45}],\"pugongs\":[{\"unlock\":true,\"id\":101040001,\"level\":1},{\"unlock\":true,\"id\":101040002,\"level\":1},{\"unlock\":true,\"id\":101040003,\"level\":1},{\"unlock\":true,\"id\":101040004,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101040005,\"level\":6},{\"unlock\":true,\"id\":101040006,\"level\":6},{\"unlock\":true,\"id\":101040007,\"level\":6},{\"unlock\":true,\"id\":101040008,\"level\":6}]}]", "score": 1 }, { "nickname": "伊雪儿", "openId": "robot1167", "data": "[{\"unlock\":true,\"buduiId\":106001000,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101010001,\"level\":1},{\"unlock\":true,\"id\":101010002,\"level\":1},{\"unlock\":true,\"id\":101010003,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101010004,\"level\":6},{\"unlock\":true,\"id\":101010005,\"level\":6},{\"unlock\":true,\"id\":101010006,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001100,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101020001,\"level\":1},{\"unlock\":true,\"id\":101020002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101020003,\"level\":6},{\"unlock\":true,\"id\":101020004,\"level\":6},{\"unlock\":true,\"id\":101020005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001200,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101030001,\"level\":1},{\"unlock\":true,\"id\":101030002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101030003,\"level\":6},{\"unlock\":true,\"id\":101030004,\"level\":6},{\"unlock\":true,\"id\":101030005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001300,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":4,\"level\":51},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45}],\"pugongs\":[{\"unlock\":true,\"id\":101040001,\"level\":1},{\"unlock\":true,\"id\":101040002,\"level\":1},{\"unlock\":true,\"id\":101040003,\"level\":1},{\"unlock\":true,\"id\":101040004,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101040005,\"level\":6},{\"unlock\":true,\"id\":101040006,\"level\":6},{\"unlock\":true,\"id\":101040007,\"level\":6},{\"unlock\":true,\"id\":101040008,\"level\":6}]}]", "score": 3 }, { "nickname": "伊迈尔", "openId": "robot1166", "data": "[{\"unlock\":true,\"buduiId\":106001000,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101010001,\"level\":1},{\"unlock\":true,\"id\":101010002,\"level\":1},{\"unlock\":true,\"id\":101010003,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101010004,\"level\":6},{\"unlock\":true,\"id\":101010005,\"level\":6},{\"unlock\":true,\"id\":101010006,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001100,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101020001,\"level\":1},{\"unlock\":true,\"id\":101020002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101020003,\"level\":6},{\"unlock\":true,\"id\":101020004,\"level\":6},{\"unlock\":true,\"id\":101020005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001200,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101030001,\"level\":1},{\"unlock\":true,\"id\":101030002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101030003,\"level\":6},{\"unlock\":true,\"id\":101030004,\"level\":6},{\"unlock\":true,\"id\":101030005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001300,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":4,\"level\":50},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45}],\"pugongs\":[{\"unlock\":true,\"id\":101040001,\"level\":1},{\"unlock\":true,\"id\":101040002,\"level\":1},{\"unlock\":true,\"id\":101040003,\"level\":1},{\"unlock\":true,\"id\":101040004,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101040005,\"level\":6},{\"unlock\":true,\"id\":101040006,\"level\":6},{\"unlock\":true,\"id\":101040007,\"level\":6},{\"unlock\":true,\"id\":101040008,\"level\":6}]}]", "score": 4 }]);
    }

    public vsWin(vsOpenId: string, vss: Array<number>, onComplete: (rsp: Array<User>) => void): void {
        //if (onComplete) onComplete({});
        //if (onComplete) onComplete([{ "nickname": "陆志斌小号", "openId": "olBL35VAkiG6mW46Ws_WbK2CRjBI", "data": "HwCLAAgAAAAAAAAAAAAAAAAAAwDNAFYAXQBvABMARwAUAP0ALwDzAOwABwB7AHYAEwAiAL8AIQAjANIACADUACIAwQBLAFUA8QCwAHgAJwD2ACQA6wBZAGcAPwAQAGoAFAApANAAJgC2ANoApABRACAA5QArAAgACABNAEkAKACGADQABAA1AMEALgDlAM8AeAC8ALsA\/wCCALsAOwC7AOsA3QB1AEIAFwCQABAALwDWAMwAuQDnAN4AOQBzAO4AeABnAOYAEQBvAC8A9wC7AM8AzwAoABYAQQDlANIAhAAsAJcACgAhADQAxQBUAHIADQCwAAIAsgBoAIMAmACoADwAUQAsACAAagCRAAYADADnAJEA1wBaAOcARwDXACEAfAAKAFAA7wBmAM8AeQB0AIAAygDFAIUAAgCqANkAVAD1ANkAPwCgAH4A7wBXAKcAtwBaAEIABQDkAO4A\/ADhAG0AXAD3AEcAzgCNADcAgwD2AN0AwQDtADsA0QDkAN4ASwBvAPEAPgBfADoA4ACrAFsAIQDkAHQAOgD9AKMARQCAACIAygDKADoApAD4ABMAkQDJALcA9wDdANcAfwAOAOcA7gBPAA8AeAD7AFkAsADMALsADQC+APkAcAA4AMIAogAAAN8AfwA4AFgA3ACJAKoAvQB4AMoA7wDtAIYAEwC+ANoAcgC6AFEABABWAPQA7gC8ABgAZgBLAEkAuQB4AFQALgAeAMoA7QCuAGQA5QDiAIwAXACcAJEAiwDjAGUA5AB4ADQAFgA7ABUArQB2APAAOwA\/AGoApwC0AA4A8wDGAJMA8gAkAHQAGQB6AFMAYwC6AEEAJgAjAP8AAQAxAEgAQwC\/AEoApgCYAEkADADrALQACgDgALQAogCZAKQAgABMAKAA+gAdAGcAdgADAEMA1wCgAGkAdADaAKoA6ABxAJ4ApgCYANYAZAAIAKEAMgCCAJUACACzAIgAcQCxAEoAmAB\/AEoAigBFADgAFADuAN4AngC7APMA1ADrAK0AowCyAGUA2ABEACQAXQAMAAsAiwCqAP4AMgAVAN0AZgBWADAA8wDjAJUAugBuAM8AUACFANUAUgDnAG0A2gAgACQAjgBcABIAhwANAOAAagAGAIIAGgA\/ANYAbQCFADUAFQBWAKkAEwDTADoATwBZAG0AzgD2ACUAiwBtACUAfgBhAA8ADQBCAA0AmgBaACYAQAAmAOEA\/AAOAOsABQBQAEUApwAsAIEAaQBBANkA7wAVAH0AjgBmAHQApgAiAGcADQBKAJgA+gBdAJMAsAApADUAtACtAKoA0QDqACwAUQC\/ALEALQCbAM4A+QDCAGMAwwBFAGYAEADwACsA+gD\/ACAA+ACrANQAiQChAPsAqQDzAMgAZgCaAF4AnQCNAOkAVwBsANUApgBTAKoAbwD1ADgAmABdACwAggCsABkASgBmAGgA4ACLAEYArgASAC0AGACRADkAmwA2AEUAhQDRAPAAQgDhALMAUQDYAFMA0wCuAOkArACWAFYAKQD6AE0AAwB9AKUAQABeAKYA1ADJAEQAnACXACgApQBlAJgAswBUANMA\/gBPAIUAnAC3APgA2ADxAMQA0AD9ACQAcwA8ACkA4wAYAG4AugBTAPgA6wDuABQAzgDbACkAnADpAFQAngAGAOAATADTAD4AWAD8AIQATgBlABoAgAAzAK0AugA8AFoANADtAL8AdAC8AP8A+AArAPEAXwDKAOsAvwD0AAkA\/gBLAHkA\/QCXAHIA+wAvAH0ArAD\/APIAJwCdAH8A\/AClAPwAlwDzAPoALwDnAP0AUgDJAHkATQCXADMApgDnAOkAqAB8APIAlwBqAJQAOACeAKsAowA+APMAVADeAJIAEwCpANYAgwDiAGkA+wAKAGEAZgCpAFIAVwCaAPAAGgAIAN8AhwDFABgADwABADAArgChAFwAOwAHAJsA+wDWAG4AJABuANQAMAAtALgAugDjAPcAiQCiABIA9QCCAKYABwBAAEkA8gA\/ALkAsAB6ACEAHABNAEQAIwBcACwAAQDbAG0A\/QDFAH8A2QCNAJQAmgBEACMAVQALAG4AWwC4AEQAMwAHANAAfwBpAJwA1wBrAJQApQBuAG8A9wDJAHMA7wDGAKIAuwB3AKgAJwDvAGwA\/gD2ABYA3wB+AOYA9AAeALkALwC3ANwAdwAtAOcA\/gDPAIIAxADbAH8AwwBYAFAA+wC9AI4AIACPAIYAnACNAN0AfgD3ALcAfgB3AFkAvACZAAUADQDAAEEA+wDQAD0APABwAN8AdgBEAM0AygCFANMAgwC1AJsAfAB\/AA0ACwDGAOAAaADJANsA\/AAnAMkAAwAGAN8A\/ABvAPAAuACVANIALAAYAEIAYwCmAJ4AYACHAO8ANQCiABgALAAyAIYAHwC+APIAngAsAPMAtQDbAPAAigAeAHQAtgDgAOkA6wBsAP8AywBXAJYARAB8AOEAPQAPAO0AfADTAPIACwAAAAAA", "score": 1 }]);
        if (onComplete) onComplete([{ "nickname": "迈雪儿", "openId": "robot1169", "data": "[{\"unlock\":true,\"buduiId\":106001000,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101010001,\"level\":1},{\"unlock\":true,\"id\":101010002,\"level\":1},{\"unlock\":true,\"id\":101010003,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101010004,\"level\":6},{\"unlock\":true,\"id\":101010005,\"level\":6},{\"unlock\":true,\"id\":101010006,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001100,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101020001,\"level\":1},{\"unlock\":true,\"id\":101020002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101020003,\"level\":6},{\"unlock\":true,\"id\":101020004,\"level\":6},{\"unlock\":true,\"id\":101020005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001200,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101030001,\"level\":1},{\"unlock\":true,\"id\":101030002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101030003,\"level\":6},{\"unlock\":true,\"id\":101030004,\"level\":6},{\"unlock\":true,\"id\":101030005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001300,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":4,\"level\":53},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45}],\"pugongs\":[{\"unlock\":true,\"id\":101040001,\"level\":1},{\"unlock\":true,\"id\":101040002,\"level\":1},{\"unlock\":true,\"id\":101040003,\"level\":1},{\"unlock\":true,\"id\":101040004,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101040005,\"level\":6},{\"unlock\":true,\"id\":101040006,\"level\":6},{\"unlock\":true,\"id\":101040007,\"level\":6},{\"unlock\":true,\"id\":101040008,\"level\":6}]}]", "score": 1 }, { "nickname": "贾莎拉", "openId": "robot1168", "data": "[{\"unlock\":true,\"buduiId\":106001000,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101010001,\"level\":1},{\"unlock\":true,\"id\":101010002,\"level\":1},{\"unlock\":true,\"id\":101010003,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101010004,\"level\":6},{\"unlock\":true,\"id\":101010005,\"level\":6},{\"unlock\":true,\"id\":101010006,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001100,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101020001,\"level\":1},{\"unlock\":true,\"id\":101020002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101020003,\"level\":6},{\"unlock\":true,\"id\":101020004,\"level\":6},{\"unlock\":true,\"id\":101020005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001200,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65},{\"jieji\":5,\"level\":65}],\"pugongs\":[{\"unlock\":true,\"id\":101030001,\"level\":1},{\"unlock\":true,\"id\":101030002,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101030003,\"level\":6},{\"unlock\":true,\"id\":101030004,\"level\":6},{\"unlock\":true,\"id\":101030005,\"level\":6}]},{\"unlock\":true,\"buduiId\":106001300,\"jieji\":4,\"level\":20,\"equips\":[{\"jieji\":4,\"level\":52},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45},{\"jieji\":4,\"level\":45}],\"pugongs\":[{\"unlock\":true,\"id\":101040001,\"level\":1},{\"unlock\":true,\"id\":101040002,\"level\":1},{\"unlock\":true,\"id\":101040003,\"level\":1},{\"unlock\":true,\"id\":101040004,\"level\":1}],\"skills\":[{\"unlock\":true,\"id\":101040005,\"level\":6},{\"unlock\":true,\"id\":101040006,\"level\":6},{\"unlock\":true,\"id\":101040007,\"level\":6},{\"unlock\":true,\"id\":101040008,\"level\":6}]}]", "score": 2 }]);
    }

    public get(req: Req, onComplete: (rsp: any) => void): void {
        get_xhr(req, false, onComplete);
    }

    public post(req: Req, onComplete: (rsp: any) => void): void {
        post_xhr(req, false, onComplete);
    }

}
