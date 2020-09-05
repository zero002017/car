import Storage_ from "./Storage_";
import { gameName, storageTime, getCurrDate, 音响StationId, 礼品店StationId } from "../zero/global";
import { DatasManager } from "../datas/DatasManager";

let $userStorageStorage: Storage_;
export namespace UserStorage {

    export let times: number;
    export let items: { [key: string]: number };
    export let removeInsertAds: boolean;
    export let signDatenum2: number;
    export let giftCodes: Array<string>;
    export let lastGiftCode: string;
    export let 首次进入游戏的路径4: string;
    export let 首次进入游戏的场景值4: number;
    export let 误触黑4: boolean;

    export let lastSignDate2: number;
    export let signCount: number;
    export let lastChoujiangDate: number;
    export let freeChoujiangTimes: number;
    export let choujiangTimes: number;
    export let zhuanpanChestLingqus: Array<boolean>;
    export let meiriDate: number;
    export let meiriGemsTimes: number;
    export let meiriCoinsTimes: number;
    export let lingquYaoqingDate: number;
    export let lingquYaoqingFriendOpenIds: Array<string>;
    export let clickedHutuiqiang: boolean;
    export let lingquHutuiDates: { [key: string]: number };

    export let exp: number;
    export let positionss: { [key: number]: Array<Position> };
    export let technologyss: { [key: number]: Array<Position> };
    export interface Position {
        startTime: number,
        level: number
    }
    export let showNeweds: Array<string>;
    export let fubenId: number;
    export let lastEvaluate: number;
    export let 首次弹帮助: boolean;
    export let 引导加油: boolean;
    export let 引导加油拖车: boolean;
    export let 引导洗车: boolean;
    export let 引导洗车小游戏: boolean;
    export let 引导玩洗车小游戏: boolean;

    export let lastLoginDate: number;
    export let 被邀请openIds: Array<string>;
    export let 当天统计过的邀请到的openId们: Array<string>;
    export let 邀请到的openId用于了分享: Array<string>;
    export let 用户跳转过的CPA插屏2: Array<string>;
    export let 清零用户跳转CPA图标Date: number;
    export let 用户当天跳转过的CPA图标: Array<string>;

    export let 分享Index: number;
    export let 分享Date: number;

    export function init(): void {
        $userStorageStorage = new Storage_(UserStorage, gameName + "_UserStorage" + storageTime);
        if ($userStorageStorage.jsonCode) {
            fix();
        } else {
            reset();
        }
    }

    export function toJSONCode(): string {
        return JSON.stringify(UserStorage);
    }

    export function migrate(oldKey: string, doo: (oldData: any) => void): void {
        let jsonCode: string = localStorage.getItem(oldKey);
        if (jsonCode) {
            jsonCode = jsonCode.replace(/\s*|\s*$/g, "");
            if (jsonCode) {
                doo(JSON.parse(jsonCode));
                fix();
                localStorage.setItem(oldKey, "");
            }
        }
    }

    export function update(onlineStore: { times: number }): void {
        //console.log("onlineStore.times=" + onlineStore.times + ", times=" + times);
        if (onlineStore.times > times) {
            for (let key in onlineStore) {
                UserStorage[key] = onlineStore[key];
            }
            fix();
        }

        updateDates();
    }

    export function clear(): void {
        $userStorageStorage.clear();
        $userStorageStorage = null;
    }

    export function reset(): void {

        times = -1;
        items = null;
        removeInsertAds = false;
        signDatenum2 = 0;
        giftCodes = null;
        lastGiftCode = null;
        首次进入游戏的路径4 = "";
        首次进入游戏的场景值4 = -2;
        误触黑4 = false;

        lastSignDate2 = 0;
        signCount = 0;
        lastChoujiangDate = 0;
        freeChoujiangTimes = 0;
        choujiangTimes = 0;
        zhuanpanChestLingqus = null;
        meiriDate = 0;
        meiriGemsTimes = 0;
        meiriCoinsTimes = 0;
        lingquYaoqingDate = 0;
        lingquYaoqingFriendOpenIds = null;
        clickedHutuiqiang = false;
        lingquHutuiDates = null;

        exp = 0;
        positionss = null;
        technologyss = null;
        showNeweds = null;
        fubenId = 0;
        lastEvaluate = -1;
        首次弹帮助 = false;
        引导加油 = false;
        引导加油拖车 = false;
        引导洗车 = false;
        引导洗车小游戏 = false;
        引导玩洗车小游戏 = false;

        lastLoginDate = 0;
        被邀请openIds = null;
        当天统计过的邀请到的openId们 = null;
        邀请到的openId用于了分享 = null;
        用户跳转过的CPA插屏2 = null;
        清零用户跳转CPA图标Date = 0;
        用户当天跳转过的CPA图标 = null;

        分享Index = 0;
        分享Date = 0;

        fix();

        times = -1;//flush() 会置成 0

        flush();
    }

    function fix(): void {

        if (times >= 0) { } else {
            times = -1;
        }
        if (items) { } else {
            items = {
                "金币": DatasManager.初始金币,
                "钻石": DatasManager.初始钻石,
                "音乐": DatasManager.StationDatasById[音响StationId].Stock,
                "礼物": DatasManager.StationDatasById[礼品店StationId].Stock,
            };
        }
        if (removeInsertAds) { } else {
            removeInsertAds = false;
        }
        if (signDatenum2 > 0) { } else {
            signDatenum2 = 0;
        }
        if (giftCodes && giftCodes.indexOf && giftCodes.push) { } else {
            giftCodes = new Array();
        }
        if (lastGiftCode) { } else {
            lastGiftCode = "";
        }
        if (首次进入游戏的路径4) { } else {
            首次进入游戏的路径4 = "";
        }
        if (首次进入游戏的场景值4 > -2) { } else {
            首次进入游戏的场景值4 = -2;
        }
        if (误触黑4) { } else {
            误触黑4 = false;
        }

        if (lastSignDate2 > 0) { } else {
            lastSignDate2 = 0;
        }
        if (signCount > 0) { } else {
            signCount = 0;
        }
        if (lastChoujiangDate > 0) { } else {
            lastChoujiangDate = 0;
        }
        if (freeChoujiangTimes > 0) { } else {
            freeChoujiangTimes = 0;
        }
        if (zhuanpanChestLingqus && zhuanpanChestLingqus.indexOf && zhuanpanChestLingqus.push) { } else {
            zhuanpanChestLingqus = new Array();
        }
        if (meiriDate > 0) { } else {
            meiriDate = 0;
        }
        if (meiriGemsTimes > 0) { } else {
            meiriGemsTimes = 0;
        }
        if (meiriCoinsTimes > 0) { } else {
            meiriCoinsTimes = 0;
        }
        if (lingquYaoqingDate > 0) { } else {
            lingquYaoqingDate = 0;
        }
        if (lingquYaoqingFriendOpenIds && lingquYaoqingFriendOpenIds.indexOf && lingquYaoqingFriendOpenIds.push) { } else {
            lingquYaoqingFriendOpenIds = new Array();
        }
        if (clickedHutuiqiang) { } else {
            clickedHutuiqiang = false;
        }
        if (lingquHutuiDates) { } else {
            lingquHutuiDates = {};
        }

        if (exp > 0) { } else {
            exp = 0;
        }
        if (positionss) { } else {
            positionss = {};
            for (const stationId in DatasManager.positionDatass) {
                const positionDatas = DatasManager.positionDatass[stationId];
                const positions = positionss[stationId] = new Array();
                for (const positionData of positionDatas) {
                    if (positionData.huafei > 0) { } else {
                        positions.push({ startTime: 0, level: 1 });
                    }
                }
            }
        }
        if (technologyss) { } else {
            technologyss = {};
            for (const stationId in DatasManager.technologyDatasss) {
                const technologyDatass = DatasManager.technologyDatasss[stationId];
                const technologys = technologyss[stationId] = new Array();
                for (const technologyDatas of technologyDatass) {
                    technologys.push({ startTime: 0, level: 0 });
                }
            }
        }
        if (showNeweds && showNeweds.indexOf && showNeweds.push) { } else {
            showNeweds = new Array();
        }
        if (fubenId > 0) { } else {
            fubenId = 0;
        }
        if (lastEvaluate > -1) { } else {
            lastEvaluate = -1;
        }
        if (首次弹帮助) { } else {
            首次弹帮助 = false;
        }
        if (引导加油) { } else {
            引导加油 = false;
        }
        if (引导加油拖车) { } else {
            引导加油拖车 = false;
        }
        if (引导洗车) { } else {
            引导洗车 = false;
        }
        if (引导洗车小游戏) { } else {
            引导洗车小游戏 = false;
        }
        if (引导玩洗车小游戏) { } else {
            引导玩洗车小游戏 = false;
        }

        if (lastLoginDate > 0) { } else {
            lastLoginDate = 0;
        }
        if (被邀请openIds && 被邀请openIds.indexOf && 被邀请openIds.push) { } else {
            被邀请openIds = new Array();
        }
        if (当天统计过的邀请到的openId们 && 当天统计过的邀请到的openId们.indexOf && 当天统计过的邀请到的openId们.push) { } else {
            当天统计过的邀请到的openId们 = new Array();
        }
        if (邀请到的openId用于了分享 && 邀请到的openId用于了分享.indexOf && 邀请到的openId用于了分享.push) { } else {
            邀请到的openId用于了分享 = new Array();
        }
        if (用户跳转过的CPA插屏2 && 用户跳转过的CPA插屏2.indexOf && 用户跳转过的CPA插屏2.push) { } else {
            用户跳转过的CPA插屏2 = new Array();
        }
        if (清零用户跳转CPA图标Date > 0) { } else {
            清零用户跳转CPA图标Date = 0;
        }
        if (用户当天跳转过的CPA图标 && 用户当天跳转过的CPA图标.indexOf && 用户当天跳转过的CPA图标.push) { } else {
            用户当天跳转过的CPA图标 = new Array();
        }

        if (分享Index > 0) { } else {
            分享Index = 0;
        }
        if (分享Date > 0) { } else {
            分享Date = 0;
        }

    }

    export function flush(): void {
        times++;
        if ($userStorageStorage) {
            $userStorageStorage.flush();
        }
    }

    export function updateDates(): void {
        let date: number = getCurrDate();
        if (lastChoujiangDate >= date) { } else {
            lastChoujiangDate = date;
            freeChoujiangTimes = DatasManager.每天免费抽奖次数;
            choujiangTimes = 0;
            zhuanpanChestLingqus = new Array();
            for (let choujiangChestData of DatasManager.ZhuanpanChestDatas) {
                zhuanpanChestLingqus.push(false);
            }
        }
        if (meiriDate >= date) { } else {
            meiriDate = date;
            meiriGemsTimes = 0;
            meiriCoinsTimes = 0;
        }
        if (lingquYaoqingDate >= date) { } else {
            lingquYaoqingDate = date;
            lingquYaoqingFriendOpenIds.length = 0;
        }
        if (lastLoginDate >= date) { } else {
            lastLoginDate = date;
            被邀请openIds = new Array();
            当天统计过的邀请到的openId们 = new Array();
            邀请到的openId用于了分享 = new Array();
        }
        if (清零用户跳转CPA图标Date >= date) { } else {
            清零用户跳转CPA图标Date = date;
            用户当天跳转过的CPA图标.length = 0;
        }

        flush();
    }

    export function getItem(name: string): number {
        return items[name] || 0;
    }
    export function setItem(name: string, value: number): void {
        items[name] = value;
        flush();
    }
    export function addItem(name: string, d: number): void {
        setItem(name, getItem(name) + d);
    }

}
