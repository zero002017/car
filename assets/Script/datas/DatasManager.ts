//Datas 不要手动修改4
import BuildData from "./BuildData";
import CarData from "./CarData";
import CheckpointData from "./CheckpointData";
import ConditionData from "./ConditionData";
import EvaluateData from "./EvaluateData";
import EventData from "./EventData";
import FeelingData from "./FeelingData";
import GongshiData from "./GongshiData";
import LevelData from "./LevelData";
import PositionData from "./PositionData";
import SignData from "./SignData";
import StationData from "./StationData";
import StopData from "./StopData";
import StringData from "./StringData";
import TechnologyData from "./TechnologyData";
import ZhuanpanChestData from "./ZhuanpanChestData";
import ZhuanpanData from "./ZhuanpanData";
//Datas 不要手动修改4

import Data from "./Data";
import { Share } from "../zero/global";

export namespace DatasManager {

    //Datas 不要手动修改1
    export let BuildDatas: Array<BuildData>;//100000001~100000999
    export let BuildDatasById: { [key: number]: BuildData };
    export let CarDatas: Array<CarData>;//106000001~106000999
    export let CarDatasById: { [key: number]: CarData };
    export let CheckpointDatas: Array<CheckpointData>;//101000001~101000999
    export let CheckpointDatasById: { [key: number]: CheckpointData };
    export let ConditionDatas: Array<ConditionData>;//102000001~102000999
    export let ConditionDatasById: { [key: number]: ConditionData };
    export let EvaluateDatas: Array<EvaluateData>;//103000001~103000999
    export let EvaluateDatasById: { [key: number]: EvaluateData };
    export let EventDatas: Array<EventData>;//104000001~104000999
    export let EventDatasById: { [key: number]: EventData };
    export let FeelingDatas: Array<FeelingData>;//105000001~105000999
    export let FeelingDatasById: { [key: number]: FeelingData };
    export let GongshiDatas: Array<GongshiData>;//113000001~113000999
    export let GongshiDatasById: { [key: number]: GongshiData };
    export let LevelDatas: Array<LevelData>;//107000001~107000999
    export let LevelDatasById: { [key: number]: LevelData };
    export let PositionDatas: Array<PositionData>;//114000001~114000999
    export let PositionDatasById: { [key: number]: PositionData };
    export let SignDatas: Array<SignData>;//119000001~119000999
    export let SignDatasById: { [key: number]: SignData };
    export let StationDatas: Array<StationData>;//108000001~108000999
    export let StationDatasById: { [key: number]: StationData };
    export let StopDatas: Array<StopData>;//116000001~116000999
    export let StopDatasById: { [key: number]: StopData };
    export let StringDatas: Array<StringData>;//111000001~111000999
    export let StringDatasById: { [key: number]: StringData };
    export let TechnologyDatas: Array<TechnologyData>;//112000001~112000999
    export let TechnologyDatasById: { [key: number]: TechnologyData };
    export let ZhuanpanChestDatas: Array<ZhuanpanChestData>;//117000001~117000999
    export let ZhuanpanChestDatasById: { [key: number]: ZhuanpanChestData };
    export let ZhuanpanDatas: Array<ZhuanpanData>;//115000001~115000999
    export let ZhuanpanDatasById: { [key: number]: ZhuanpanData };
    //Datas 不要手动修改1

    //Datas 不要手动修改3
    export const 系统配置版本 = "20200825165644";
    export const 初始金币 = 0;
    export const 初始钻石 = 0;
    export const 刷新banner间隔 = 10;//秒
    export const 显示倍速 = true;
    export const 时间范围 = [6, 17.5];//6:00~17:30
    export const 一钻等于几秒钟 = 600;//秒
    export const 每天免费抽奖次数 = 1;
    export const 客服签到领钻石个数 = 10;
    export const 客服签到领钻石图标 = "2";//D:\wamp\www\qimiaosenlin\sword\egret\resource\images\loading\items\goods
    export const 每邀请一位好友获得钻石个数 = 10;
    export const 胜利宝箱倍数 = 3;
    export const 胜利视频倍数 = [2, 2, 2, 2];
    export const 多少关之前不出分享 = 0;
    export const 多少关之前不出连点宝箱 = 3;//此关以后（包括此关）
    export const 微信合成点击完毕出现Banner = [1,1,1,1];
    export const QQ合成点击完毕出现Banner = [0];
    export const 百度合成点击完毕出现Banner = [0];
    export const 抖音合成点击完毕出现Banner = [0];
    export const OPPO合成点击完毕出现Banner = [0];
    export const VIVO合成点击完毕出现Banner = [0];
    export const 梦嘉防封策略接口 = "";
    export const 梦嘉防封策略代码编号 = 8888;
    export let 误触关 = false;
    export const 误触白名单 = [2,1000,1001,1005,1006,1007,1008,1011,1012,1017,1023,1024,1027,1030,1035,1037,1038,1042,1044,1044,1047,1048,1053,1055,1058,1073,1079,1089,1090,1095,1096,1102,1103,1104,1106,1113,1114,1131,1139,1142];
    export const 误触白名单1 = [2,1000,1001,1005,1006,1007,1008,1011,1012,1017,1023,1024,1027,1030,1035,1037,1038,1042,1044,1044,1047,1048,1053,1055,1058,1073,1079,1089,1090,1095,1096,1102,1103,1104,1106,1113,1114,1131,1139,1142];
    export const 路径 = "";
    export const 误触白名单2 = [2,1000,1001,1005,1006,1007,1008,1011,1012,1017,1023,1024,1027,1030,1035,1037,1038,1042,1044,1044,1047,1048,1053,1055,1058,1073,1079,1089,1090,1095,1096,1102,1103,1104,1106,1113,1114,1131,1139,1142];
    export const 分享关 = false;
    export const 分享白名单 = [2,1000,1001,1005,1006,1007,1008,1011,1012,1017,1023,1024,1027,1030,1035,1037,1038,1042,1044,1044,1047,1048,1053,1055,1058,1073,1079,1089,1090,1095,1096,1102,1103,1104,1106,1113,1114,1131,1139,1142];
    export const CPA关 = false;
    export const CPA黑名单 = [666];
    export const 更新提示CN = "重大更新！制作人又喝多了系列！";
    export const 更新提示EN = "Updates!";
    export const 分享必须N秒以上 = 3;
    export const 分享成功概率 = 50;
    export const 分享失败提示CN = "获取失败，请重试！";
    export const 分享失败提示EN = "Fetch failed. Please try again.";
    export const 视频已用尽CN = "您的账号视频已用尽，请稍后再试！";
    export const 视频已用尽EN = "Fetch failed. Please try again.";
    export const 每天被邀请次数上限 = 3;
    export const 加载完毕执行 = "";
    export const 进入游戏执行 = "";
    export const 战斗开始执行 = "";
    export const 战斗胜利执行 = "";
    export const 战斗失败执行 = "";
    export let a = false;
    export const 分享们b = [{"rate": 1,"query": "id=1","title": "【有人@你】看你手有多快！","imageUrl": "https://cdn-tiny.qimiaosenlin.com/cdn/share/00030028F08A68D.png"}];
    export const 回放分享 = {
	"title": "【有人@你】打爆大怪，只需一分钟！",
	"imageUrl": "https://cdn-tiny.qimiaosenlin.com/cdn/share/0006086985E44EBC.jpg",
	"query": "openId=${openId}"
};
    export const 抖音分享 = null;
    export const QQ胜利往上抬延迟 = 2000;//毫秒
    export const 分享机制0 = [0, 1, 1, 1];//1档
    export const 分享机制1 = [0, 1, 1, 1];//2档
    export const 分享机制2 = [0, 1, 1, 1];//3档
    export const 视频获取失败走分享次数上限 = 20;
    export const 胜利观看视频 = false;
    export const 看视频领金币观看视频 = false;
    export const 看视频领钻石观看视频 = false;
    export const 签到双倍观看视频 = true;
    export const 转盘观看视频 = true;
    export const 中奖观看视频 = false;
    export const 看视频加速观看视频 = false;
    export const 钻石换金币花费 = 10;
    export const 钻石换金币得到 = 2000;
    export const 金币换钻石花费 = 3000;
    export const 金币换钻石得到 = 10;
    export const 每日钻石观看视频 = false;
    export const 每日金币观看视频 = false;
    export const 第5次每日钻石 = 3;
    export const 第10次每日钻石 = 5;
    export const 第n次每日钻石 = 1;
    export const 第5次每日金币 = 200;
    export const 第10次每日金币 = 300;
    export const 第n次每日金币 = 100;
    export const 一次性礼包金币图标 = "44";
    export const 一次性礼包金币数量 = 1000;
    export const 看视频领金币数量 = 200;
    export const 看视频领金币图标 = "11";
    export const 看视频领金币间隔 = [60, 120];
    export const 看视频领钻石数量 = 1;
    export const 看视频领钻石图标 = "1";
    export const 结算完毕插屏广告 = [1];
    export const 微信Banner广告ID们 = [];
    export const 微信视频广告ID们 = [];
    export const 微信插屏广告ID们 = [];
    export const 微信格子广告ID们 = [];
    export const 微信原生广告ID们 = [];
    export const GameBannerID们 = [];
    export const GamePortalID们 = [];
    export const 出Banner或GameBanner = [1];//1出Banner，0出GameBanner
    export const 出插屏或GamePortal = [1];//1出插屏，0出GamePortal
    export const QQBanner广告ID们 = [];
    export const QQ积木广告ID们 = [];
    export const QQ视频广告ID们 = [];
    export const QQ盒子广告ID = "";
    export const QQ插屏广告ID们 = [];
    export const 百度Banner广告ID们 = [];
    export const 百度视频广告ID们 = [];
    export const 抖音Banner广告ID们 = [];
    export const 抖音视频广告ID们 = [];
    export const 抖音插屏广告ID们 = [];
    export const OPPOBanner广告名称们 = ["礼包", "游戏顶部", "结算", "选模式和章节", "签到转盘客服"];
    export const OPPOBanner广告ID们 = [];
    export const OPPO视频广告ID们 = [];
    export const OPPO插屏广告ID们 = [];
    export const OPPO插屏视频广告ID们 = [];
    export const OPPO原生广告名称们 = ["主界面", "战斗"];
    export const OPPO原生广告ID们 = [];
    export const OPPO开屏广告ID们 = [];
    export const VIVOBanner广告ID们 = [];
    export const VIVO视频广告ID们 = [];
    export const VIVO插屏广告ID们 = [];
    export const VIVO原生广告ID们 = [];
    export const B站Banner广告ID们 = [];
    export const B站视频广告ID们 = [];
    export const B站插屏广告ID们 = [];
    export const FacebookBanner广告ID = "1982508651779400_1982511068445825";
    export const Facebook视频广告ID = "YOUR_PLACEMENT_ID";
    export const Facebook插屏广告ID = "1982508651779400_1982509301779335";
    export const 聚合Banner广告ID安卓 = "7545";
    export const 聚合Banner广告ID苹果 = "7659";
    export const 聚合视频广告ID = "reward1";
    export const 聚合插屏广告ID = "insert1";
    export const CPA图标轮播间隔 = 12;
    export const CN = ["^zh"];
    export const EN = ["^en"];
    export const banner展示超过n次销毁 = 7;
    export const 游戏左下角Banner显示时间 = 2;//秒
    export const 游戏左下角Banner显示概率 = 15;//%
    export const 游戏内Banner显示时间 = 5;//秒
    export const 游戏内Banner刷新间隔1 = 20;//白名单内用户n秒后刷新一次
    export const 游戏内Banner刷新间隔2 = 20;//白名单外用户n秒后刷新一次
    export const 瀑布流来回一次时间 = 50;//秒
    export const 离开游戏后返回弹出瀑布流 = false;
    //Datas 不要手动修改3

    export let 胜利宝箱点击完毕出现Banner: Array<number>;

    export let shares: Array<Share>;

    export let 第n次每日钻石s: Array<number>;
    export let 第n次每日金币s: Array<number>;

    export let zhuanpanDatasByRate: Array<ZhuanpanData>;
    export let positionDatass: { [key: number]: Array<PositionData> };
    export let buildDatasss: { [key: number]: Array<Array<BuildData>> };
    export let technologyDatasss: { [key: number]: Array<Array<TechnologyData>> };
    export let conditionDatasByPriority: Array<ConditionData>;
    export let stopDatass: Array<Array<StopData>>;

    export let 打分档次: number;
    export let 分享机制: Array<number>;
    export let 游戏左下角Banner连续不出: number;

    export function Init(datassOrJSONCode: string | { names: Array<string>, datas: Array<any> }): void {
        let datas: { names: Array<string>, datas: Array<any> };
        if (typeof (datassOrJSONCode) == "string") {
            datas = JSON.parse(datassOrJSONCode);
        } else {
            datas = datassOrJSONCode;
        }
        //Datas 不要手动修改2
        BuildDatas = datas.datas[datas.names.indexOf("Build")];
        BuildDatasById = getsById<BuildData>(BuildDatas);
        CarDatas = datas.datas[datas.names.indexOf("Car")];
        CarDatasById = getsById<CarData>(CarDatas);
        CheckpointDatas = datas.datas[datas.names.indexOf("Checkpoint")];
        CheckpointDatasById = getsById<CheckpointData>(CheckpointDatas);
        ConditionDatas = datas.datas[datas.names.indexOf("Condition")];
        ConditionDatasById = getsById<ConditionData>(ConditionDatas);
        EvaluateDatas = datas.datas[datas.names.indexOf("Evaluate")];
        EvaluateDatasById = getsById<EvaluateData>(EvaluateDatas);
        EventDatas = datas.datas[datas.names.indexOf("Event")];
        EventDatasById = getsById<EventData>(EventDatas);
        FeelingDatas = datas.datas[datas.names.indexOf("Feeling")];
        FeelingDatasById = getsById<FeelingData>(FeelingDatas);
        GongshiDatas = datas.datas[datas.names.indexOf("Gongshi")];
        GongshiDatasById = getsById<GongshiData>(GongshiDatas);
        LevelDatas = datas.datas[datas.names.indexOf("Level")];
        LevelDatasById = getsById<LevelData>(LevelDatas);
        PositionDatas = datas.datas[datas.names.indexOf("Position")];
        PositionDatasById = getsById<PositionData>(PositionDatas);
        SignDatas = datas.datas[datas.names.indexOf("Sign")];
        SignDatasById = getsById<SignData>(SignDatas);
        StationDatas = datas.datas[datas.names.indexOf("Station")];
        StationDatasById = getsById<StationData>(StationDatas);
        StopDatas = datas.datas[datas.names.indexOf("Stop")];
        StopDatasById = getsById<StopData>(StopDatas);
        StringDatas = datas.datas[datas.names.indexOf("String")];
        StringDatasById = getsById<StringData>(StringDatas);
        TechnologyDatas = datas.datas[datas.names.indexOf("Technology")];
        TechnologyDatasById = getsById<TechnologyData>(TechnologyDatas);
        ZhuanpanChestDatas = datas.datas[datas.names.indexOf("ZhuanpanChest")];
        ZhuanpanChestDatasById = getsById<ZhuanpanChestData>(ZhuanpanChestDatas);
        ZhuanpanDatas = datas.datas[datas.names.indexOf("Zhuanpan")];
        ZhuanpanDatasById = getsById<ZhuanpanData>(ZhuanpanDatas);
        //Datas 不要手动修改2

        zhuanpanDatasByRate = new Array();
        for (const zhuanpanData of ZhuanpanDatas) {
            let i: number = zhuanpanData.Rate;
            while (i--) {
                zhuanpanDatasByRate.push(zhuanpanData);
            }
        }

        positionDatass = {};
        for (const positionData of PositionDatas) {
            const stationId = 108000000 + (Math.floor(positionData.ID / 10) % 1000);
            let positionDatas = positionDatass[stationId];
            if (positionDatas) { } else {
                positionDatass[stationId] = positionDatas = new Array();
            }
            positionDatas.push(positionData);
        }

        buildDatasss = {};
        for (const buildData of BuildDatas) {
            const stationId = 108000000 + (Math.floor(buildData.ID / 100) % 1000);
            let buildDatass = buildDatasss[stationId];
            if (buildDatass) { } else {
                buildDatasss[stationId] = buildDatass = new Array();
            }
            const pos = Math.floor(buildData.ID / 10) % 10 - 1;
            let buildDatas = buildDatass[pos];
            if (buildDatas) { } else {
                buildDatass[pos] = buildDatas = new Array();
            }
            buildDatas.push(buildData);
        }

        technologyDatasss = {};
        for (const technologyData of TechnologyDatas) {
            const stationId = 108000000 + (Math.floor(technologyData.ID / 100) % 1000);
            let technologyDatass = technologyDatasss[stationId];
            if (technologyDatass) { } else {
                technologyDatasss[stationId] = technologyDatass = new Array();
            }
            const pos = (Math.floor(technologyData.ID / 10) % 10) - 1;
            let technologyDatas = technologyDatass[pos];
            if (technologyDatas) { } else {
                technologyDatass[pos] = technologyDatas = new Array();
            }
            technologyDatas.push(technologyData);
        }

        conditionDatasByPriority = new Array();
        for (const conditionData of ConditionDatas) {
            conditionDatasByPriority[conditionData.Priority] = conditionData;
        }
        let i: number = conditionDatasByPriority.length;
        while (i--) {
            if (conditionDatasByPriority[i]) { } else {
                conditionDatasByPriority.splice(i, 1);
            }
        }

        stopDatass = new Array();
        for (const stopData of StopDatas) {
            const 停车位数量 = Math.floor(stopData.ID / 100) % 10;
            let stopDatas = stopDatass[停车位数量 - 1];
            if (stopDatas) { } else {
                stopDatass[停车位数量 - 1] = stopDatas = new Array();
            }
            stopDatas.push(stopData);
        }
        //console.log(stopDatass);

        第n次每日钻石s = new Array();
        for (let key in DatasManager) {
            let matchResult: RegExpMatchArray = key.match(/^第(\d+)次每日钻石$/);
            if (matchResult) {
                第n次每日钻石s[parseInt(matchResult[1])] = DatasManager[key];
            }
        }

        第n次每日金币s = new Array();
        for (let key in DatasManager) {
            let matchResult: RegExpMatchArray = key.match(/^第(\d+)次每日金币$/);
            if (matchResult) {
                第n次每日金币s[parseInt(matchResult[1])] = DatasManager[key];
            }
        }

        打分档次 = 0;
        分享机制 = 分享机制0;
        游戏左下角Banner连续不出 = 0;

    }

    export function initShares(): void {
        shares = new Array();
        for (let share of 分享们b) {
            let i: number = share.rate;
            while (i--) {
                shares.push(share);
            }
        }
    }

    function getsById<TData extends Data>(datas: Array<TData>): { [key: number]: TData } {
        let datasById: { [key: number]: TData } = {};
        for (let data of datas) {
            datasById[data.ID] = data;
        }
        return datasById;
    }

    function getsByName<TData extends Data>(datas: Array<TData>): { [key: string]: TData } {
        let datasByName: { [key: string]: TData } = {};
        for (let data of datas) {
            if (data.Name) {
                if (datasByName[data.Name]) {
                    console.error("重复的 name：" + data.Name);
                } else {
                    datasByName[data.Name] = data;
                }
            }
        }
        return datasByName;
    }

    function getsByType<TData extends Data>(typeNames: Array<string>, datas: Array<TData>): { [key: string]: Array<TData> } {
        let datasByType: { [key: string]: Array<TData> } = {};
        for (let typeName of typeNames) {
            datasByType[typeName] = new Array();
        }
        for (let data of datas) {
            datasByType[data["Type"]].push(data);
        }
        return datasByType;
    }

    function getsByTypeName<TData extends Data>(typeNames: Array<string>, datas: Array<TData>): { [key: string]: { [key: string]: TData } } {
        let datasByTypeName: { [key: string]: { [key: string]: TData } } = {};
        for (let typeName of typeNames) {
            datasByTypeName[typeName] = {};
        }
        for (let data of datas) {
            datasByTypeName[data["Type"]][data.Name] = data;
        }
        return datasByTypeName;
    }

    function getsByStrKey<TData extends Data>(keyName: string, datas: Array<TData>): { [key: string]: Array<TData> } {
        let datasByKey: { [key: string]: Array<TData> } = {};
        for (let data of datas) {
            let key: string = data[keyName];
            let list: Array<TData> = datasByKey[key];
            if (list) { } else {
                list = datasByKey[key] = new Array();
            }
            list.push(data);
        }
        return datasByKey;
    }

    function getsByIntKey<TData extends Data>(keyName: string, datas: Array<TData>): { [key: number]: Array<TData> } {
        let datasByKey: { [key: number]: Array<TData> } = {};
        for (let data of datas) {
            let key: number = data[keyName];
            let list: Array<TData> = datasByKey[key];
            if (list) { } else {
                list = datasByKey[key] = new Array();
            }
            list.push(data);
        }
        return datasByKey;
    }

    function getsByNext<TData extends Data>(nextName: string, datas: Array<TData>): Array<Array<TData>> {
        let _prevIds: Array<number> = new Array();
        let _ids: Array<number> = new Array();
        let _datas: Array<TData> = new Array();
        let _nextIds: Array<number> = new Array();
        for (let data of datas) {
            _prevIds.push(0);
            _ids.push(data.ID);
            _datas.push(data);
            _nextIds.push(data[nextName]);
        }
        let index1: number = -1;
        for (let id of _nextIds) {
            index1++;
            //0, 4, 5, 1, 2 //_prevIds
            //1, 2, 3, 4, 5 //_ids
            //4, 5,-1, 2, 3 //_nextIds
            let index2: number = _ids.indexOf(id);
            if (index2 > -1) {
                _prevIds[index2] = _ids[index1];
            }
        }
        let mark: Array<number> = new Array();
        let datass: Array<Array<TData>> = new Array();
        for (let data of datas) {
            if (mark.indexOf(data.ID) > -1) {
                continue;
            }
            index1 = _ids.indexOf(data.ID);
            for (; ;) {
                let prevId: number = _prevIds[index1];
                if (prevId > 0) {
                    index1 = _ids.indexOf(prevId);
                }
                else {
                    break;
                }
            }
            let __datas: Array<TData> = new Array();
            let id: number = _ids[index1];
            while (id > 0) {
                let _data: TData = _datas[_ids.indexOf(id)];
                __datas.push(_data);
                mark.push(_data.ID);
                id = _data[nextName];
            }
            datass.push(__datas);
        }
        datass.sort(sortById);
        return datass;
    }

    function sortById<TData extends Data>(datas1: Array<TData>, datas2: Array<TData>) {
        return datas1[0].ID - datas2[0].ID;
    }

}