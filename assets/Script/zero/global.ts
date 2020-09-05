import { DatasManager } from "../datas/DatasManager";
import { UserStorage } from "./UserStorage";
import Base64Util from "./Base64Util";
import PlatformCtrl from "./PlatformCtrl";
import PlatformCtrlTest from "./PlatformCtrlTest";
import PlatformCtrlWX from "./PlatformCtrlWX";
import PlatformCtrlQQ from "./PlatformCtrlQQ";
import PlatformCtrlBD from "./PlatformCtrlBD";
import PlatformCtrlDY from "./PlatformCtrlDY";
import PlatformCtrlMGC from "./PlatformCtrlMGC";
import PlatformCtrlOPPO from "./PlatformCtrlOPPO";
import PlatformCtrlSW from "./PlatformCtrlSW";
import { Sounds } from "./Sounds";
import Counter from "./Counter";
import { main, 疑似iPad矮胖型屏幕, yaoqingData } from "../Main";
import { 防沉迷 } from "../popups/防沉迷";
import { popups } from "../popups/Popups";
import { 强制引导退出 } from "../popups/强制引导退出";
import { DayGemReceive } from "../popups/DayGemReceive";
import PlatformCtrlVIVO from "./PlatformCtrlVIVO";
import PlatformCtrlUCH5 from "./PlatformCtrlUCH5";
import { Atlas } from "./Atlas";
import CPBIcon from "../popups/CPBIcon";
import { MeiriGems } from "../popups/MeiriGems";
import { FriendHelp } from "../popups/FriendHelp";
import { GlobalStorage } from "./GlobalStorage";
import PlatformCtrlNative from "./PlatformCtrlNative";
import PlatformCtrlBL from "./PlatformCtrlBL";
import LevelData from "../datas/LevelData";

export const gameName: string = "car";
export const chName: string = "我的修车铺";
export const maxWid: number = 1280;
export const wid0: number = 1136;
export const hei0: number = 640;
export const frameRate: number = 60;

export const 加油站StationId = 108000100;
export const 洗车房StationId = 108000101;
export const 修理厂StationId = 108000102;
export const 装饰店StationId = 108000103;
export const 停车位StationId = 108000104;
export const 服务站StationId = 108000105;
export const 音响StationId = 108000201;
export const 礼品店StationId = 108000202;

export const storageTime: number = 20200815171829;

export const enum WXGSRoomState {
    inTeam = 1,//组队中
    gameStart = 2,//该房间的对局游戏已开始
    gameEnd = 3,//该房间的对局游戏已结束
    roomDestroy = 4,//房间已销毁
    roomConnect = 5//房间连接已建立，等待对战连接建立
}

export const enum WXGSRole {
    member = 0,//普通成员
    owner = 1//房主
}

export interface Share {
    rate?: number;
    title: string;
    subTitle?: string;
    imageUrl: string;
    query?: string;
    friendInfoIndex?: number;
    success?: () => void;
    fail?: (e) => void;
}

export interface Req {
    op?: string;
    url?: string;
    appId?: string;
    appKey?: string;
    openId?: string;
    friendOpenId?: string;
    limit?: number;
    nickname?: string;
    headImgURL?: string;
    rankType?: string;
    score?: number;
    msg?: string;
    code?: string;
    data?: string;
    vss?: string;
    vsOpenId?: string;
    vsScore?: number;
}

export interface NativeAdInfo {
    adId: string
    title: string
    icon: string
}

const _host: string = "https://tiny.qimiaosenlin.com/";
const _cdn2: string = _host + "cdn/";
const gameRoot: string = _host + gameName + "/";
export const webRoot: string = _cdn2 + gameName + "/web/";
export const cdn: string = "https://cdn-tiny.qimiaosenlin.com/cdn/";
export let useCDN = false;

export const bdAppKey: string = "xQMHfq68MZbbOW1ZHA2AHBvdxd0PZwEE";//百度小游戏
export const bdAppSid: string = "a6993fc3";//百度小游戏
export const dyAppId: string = "tt2be95d54b4c3f57e";//抖音小游戏
export const dyShareId: string = "1f30f1j12ag414wucl";//抖音小游戏
export const oppoAppId: string = "30222869";//OPPO小游戏
export const qqAppId: string = "1109087483";//QQ小程序
export const wxAppId: string = "wxaf25055d7ca91c38";//微信小游戏
export const biliAppId: string = "xxxxxxx";//B站小游戏
export const swAppId: string = wxAppId;//手卫小游戏
export const mgcAppId: string = wxAppId;//梦工厂小游戏

export const platformType: "调试" | "微信小游戏" | "QQ小程序" | "百度小游戏" | "抖音小游戏" | "UCH5" | "梦工厂小游戏" | "OPPO小游戏" | "VIVO小游戏" | "手卫小游戏" | "B站小游戏" | "Native" = window["platformType"] || "调试";
console.log("platformType=" + platformType + " os=" + cc.sys.os);
export let platformCtrl: PlatformCtrl;

switch (platformType) {
    case "调试":
        platformCtrl = new PlatformCtrlTest();
        //platformCtrl.cpaConfigURL = _cdn2 + "cpb/cpaWX.json";
        platformCtrl.cpbConfigURL = _cdn2 + "cpb/cpbWX_test.json";
        break;
    case "微信小游戏":
        platformCtrl = new PlatformCtrlWX();
        platformCtrl.subpackageNames = ["resources"];
        //platformCtrl.cpaConfigURL = webRoot + "cpa1000.json";//微信CPA
        platformCtrl.cpbConfigURL = webRoot + "cpb1000.json";//微信CPB
        break;
    case "QQ小程序":
        platformCtrl = new PlatformCtrlQQ();
        platformCtrl.subpackageNames = ["resources"];
        //platformCtrl.cpaConfigURL = _cdn2 + "cpb/cpaQQ.json";
        platformCtrl.cpbConfigURL = _cdn2 + "cpb/cpbQQ.json";
        break;
    case "百度小游戏":
        platformCtrl = new PlatformCtrlBD();
        platformCtrl.subpackageNames = ["resources"];
        //platformCtrl.cpaConfigURL = _cdn2 + "cpb/cpaBD.json";
        platformCtrl.cpbConfigURL = _cdn2 + "cpb/cpbBD.json";
        break;
    case "抖音小游戏":
        platformCtrl = new PlatformCtrlDY();
        //platformCtrl.cpaConfigURL = _cdn2 + "cpb/cpaDY.json";
        platformCtrl.cpbConfigURL = _cdn2 + "cpb/cpbDY.json";
        break;
    case "UCH5":
        platformCtrl = new PlatformCtrlUCH5(wid0, hei0);
        break;
    case "梦工厂小游戏":
        platformCtrl = new PlatformCtrlMGC();
        platformCtrl.subpackageNames = ["resources"];
        //platformCtrl.cpaConfigURL = _cdn2 + "cpb/cpaWX.json";
        platformCtrl.cpbConfigURL = _cdn2 + "cpb/cpbWX.json";
        break;
    case "OPPO小游戏":
        platformCtrl = new PlatformCtrlOPPO();
        break;
    case "VIVO小游戏":
        platformCtrl = new PlatformCtrlVIVO();
        platformCtrl.subpackageNames = ["resources"];
        break;
    case "手卫小游戏":
        platformCtrl = new PlatformCtrlSW();
        break;
    case "B站小游戏":
        platformCtrl = new PlatformCtrlBL();
        platformCtrl.subpackageNames = ["resources"];
        //platformCtrl.cpaConfigURL = _cdn2 + "cpb/cpaBL.json";
        platformCtrl.cpbConfigURL = _cdn2 + "cpb/cpbBL.json";
        break;
    case "Native":
        platformCtrl = new PlatformCtrlNative();
        break;
    default:
        console.error("未知平台：" + platformType);
        break;
}
platformCtrl.onShowMoreGame = () => {
    if (main.moreGame2) {
        main.moreGame2.autoShow();
    }
};
platformCtrl.onShowMoreGame2Btn = () => {
    if (main.moreGame2) {
        main.moreGame2.lachu1.active = true;
    }
};
platformCtrl.onHideMoreGame2Btn = () => {
    if (main.moreGame2) {
        main.moreGame2.lachu1.active = false;
    }
};

export let cpbAtlas: cc.Texture2D;
platformCtrl.loadCPBAtlas = () => {
    const f = () => {
        if (main.bottomCPBs) {
            main.bottomCPBs.refresh();
        }

        for (const child of main.cpbIcons.children) {
            child.getComponent(CPBIcon).init("主界面左上", platformCtrl.cpbConfig.推荐1, false, true, null);
        }

        main.startCPB.init();
        if (platformCtrl.cpbConfig.加载页显示) {
            //if (main.currPage instanceof Loading) {//报错：Uncaught TypeError: Object prototype may only be an Object or null: undefined
            if (main.currPage == main.loading) {
                main.startCPB.active(main.currPage.node);
            }
        }
    };
    if (platformCtrl.cpbConfig.atlas) {
        cc.assetManager.loadRemote(cdn + "cpb/" + platformCtrl.cpbConfig.atlas, (error, texture: cc.Texture2D) => {
            cpbAtlas = texture;
            f();
        });
    } else {
        cpbAtlas = null;
        f();
    }
};
platformCtrl.模拟打开CPB = (cpbGameInfo: CPBGameInfo, success: (res: { errMsg: string }) => void, fail: (res: { errMsg: string }) => void) => {
    popups.confirm("模拟打开CPB " + cpbGameInfo.name, flag => {
        if (flag) {
            success({ errMsg: "" });
        } else {
            fail({ errMsg: "用户取消" });
        }
    });
};
platformCtrl.onShowInsertCPB = (cpbIndex: number, cpbIndex2: number, pos: string) => {
    main.insertCPB.node.active = true;
    main.insertCPB.show(cpbIndex, cpbIndex2, pos);
}

platformCtrl.压缩存档 = true;
platformCtrl.替换有人At你 = true;
platformCtrl.sendMessageImg = cdn + "share/00016625E550ADA8.jpg";
platformCtrl.zip1Files = ["datas/datas.json", "sps/jsons.json"];
platformCtrl.showDayGemReceive = () => {
    popups.show(DayGemReceive);
};
window["platformCtrl"] = platformCtrl;

//开放数据域
export class OpenDataContexts {

    public static instance: OpenDataContexts;

    public openDataContextTex: cc.Texture2D;

    public constructor() {

        OpenDataContexts.instance = this;

        if (typeof (wx) == "undefined") {
            window["sharedCanvas"] = cc.game.canvas;
        } else {
            sharedCanvas.width = 640;
            sharedCanvas.height = 2048;
        }

        this.openDataContextTex = new cc.Texture2D();

    }
    public updateOpenDataContext(): void {
        this.openDataContextTex.initWithElement(sharedCanvas);
        main.delays.delay({
            time: 0.1,
            action: () => {
                this.openDataContextTex.initWithElement(sharedCanvas);
            }
        });
    }
    public postMessage(action: string, data?: any): void {
        if (data) { } else {
            data = {};
        }
        data.action = action;
        //console.log("postMessage " + JSON.stringify(data));
        if (typeof (wx) == "undefined") { } else {
            wx.getOpenDataContext().postMessage(data);
        }
    }

    //写数据操作
    public setUserCloudStorage(): void {
        if (typeof (wx) == "undefined") { } else {
            wx.setUserCloudStorage({
                KVDataList: [{
                    key: "data",
                    value: JSON.stringify({
                    })
                }],
                success: res => {
                    console.log("setUserCloudStorage " + JSON.stringify(res));
                    this.postMessage("getFriendDatas");
                },
                fail: () => {
                    console.error("setUserCloudStorage 失败");
                }
            });
        }
    }

}

//防沉迷
export class Fangchenmis {

    public static instance: Fangchenmis;

    private counter1: Counter;
    public counter2: Counter;
    private txt: cc.Label;

    public constructor() {
        Fangchenmis.instance = this;
        //this.txt = main.node.getChildByName("fangchenmi_txt").getComponent(cc.Label);
        //this.txt.node.active = true;
    }

    public startCounter1(_sec: number, _onComplete: () => void): void {
        if (this.counter1) {
            this.counter1.clear();
            this.counter1 = null
        }
        this.counter1 = new Counter();
        this.counter1.init(_sec, sec => {
            if (this.txt) {
                this.txt.string = formatTime(sec, true);
            }
        });
        this.counter1.start(_onComplete);
    }

    public showPopup1(msg: string): void {
        let popup: 防沉迷 = popups.show(防沉迷);
        popup.txt.string = msg;
        popup.ok.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            popup.hide();
        });
    }

    public startCounter2(_sec: number, _onComplete: () => void): void {
        this.counter2 = new Counter();
        this.counter2.init(_sec, sec => {
            if (this.txt) {
                this.txt.string = formatTime(sec, true);
            }
        });
        this.counter2.start(_onComplete);
    }

    public showPopup2(msg: string): void {
        popups.show(强制引导退出).txt.string = msg;
    }

}

export function 钻石不足(): void {
    if (popups.getPopup(MeiriGems).showing || popups.getPopup(FriendHelp).showing) { } else {
        // if (yaoqingData) { } else {
        //     GlobalStorage.下次弹出每日钻石 = true;
        // }
        // if (GlobalStorage.下次弹出每日钻石) {
        popups.show(MeiriGems);
        //     GlobalStorage.下次弹出每日钻石 = false;
        // } else {
        //     popups.show(FriendHelp);
        //     GlobalStorage.下次弹出每日钻石 = true;
        // }
    }
}

export interface User {
    openId: string,
    nickname: string,
    score: number,
    data: string
}

export const g: number = -1.15;
export const bossId: number = 106000998;

export let shareMoneyStartTime: number;
export let shareMoneyTime: number;
export function updateShareMoneyTime(): void {
    shareMoneyStartTime = new Date().getTime();
    shareMoneyTime = Math.floor((DatasManager.看视频领金币间隔[0] + Math.random() * (DatasManager.看视频领金币间隔[1] - DatasManager.看视频领金币间隔[0])) * 1000);
    console.log("shareMoneyTime=" + shareMoneyTime);
}

export function normal(rc: cc.RenderComponent): void {
    rc.setMaterial(0, cc.MaterialVariant.createWithBuiltin('2d-sprite', rc));
}
export function grey(rc: cc.RenderComponent): void {
    rc.setMaterial(0, cc.MaterialVariant.createWithBuiltin('2d-gray-sprite', rc));
}

export function getDDs(d: number, total: number): Array<number> {
    let seg: number = Math.floor(d / total);
    if (seg < 1) {
        seg = 1;
        total = d;
    }
    let dds: Array<number> = new Array();
    for (let i: number = 0; i < total; i++) {
        dds.push(seg);
    }
    let dd: number = seg * total - d;
    if (dd < 0) {
        dd *= -1;
        let i: number = -1;
        while (dd--) {
            dds[++i]++;
        }
    }
    return dds;
}
// function testGetDDss(): void {
//     testGetDDs(1);
//     testGetDDs(2);
//     testGetDDs(5);
//     testGetDDs(8);
//     testGetDDs(10);
//     testGetDDs(123);
// }
// function testGetDDs(d: number): void {
//     let dds: Array<number> = getDDs(d, 6);
//     console.log("d=" + d + ", dds=" + dds);
// }
// testGetDDss();

export function getSpNode(spsName: string, spName: string): cc.Node {
    const node = new cc.Node();
    if (Atlas.spss[spsName]) {
        if (Atlas.spss[spsName][spName]) {
            node.addComponent(cc.Sprite).spriteFrame = Atlas.spss[spsName][spName];
        } else {
            console.error("木有 " + spsName + " " + spName);
        }
    } else {
        console.error("木有 " + spName);
    }
    return node;
}

// export function getBuduiIdByOpenId(openId: string): number {
//     let sum: number = 0;
//     let i: number = openId.length;
//     while (i--) {
//         sum += openId.charCodeAt(i);
//     }
//     return DatasManager.BuduiDatas[sum % DatasManager.BuduiDatas.length].ID;
// }
export function getHeadByOpenId(openId: string): cc.SpriteFrame {
    //return Atlas.spss["icons"][getBuduiIdByOpenId(openId) + "_2"];
    return null;
}

export function guideAllComplete(): boolean {
    return true;
}

export function shake(node: cc.Node): void {
    node.runAction(cc.repeatForever(cc.sequence(
        //cc.delayTime(2 + Math.random() * 2),
        cc.rotateTo(0.5, 10).easing(cc.easeBounceInOut()),
        cc.rotateTo(0.5, -10).easing(cc.easeBounceInOut()),
        cc.rotateTo(1, 0).easing(cc.easeBackOut())
    )));
}

export interface HeroInfo {
    level: number,
    currLevelData: LevelData;
    nextLevelData: LevelData;
    showExp: number;
}

export function getHeroInfo(exp: number): HeroInfo {
    let expSum: number = 0;
    let showExp: number = 0;
    let currLevelData: LevelData = null;
    let nextLevelData: LevelData = null;
    let i: number = -1;
    for (const levelData of DatasManager.LevelDatas) {
        i++;
        showExp = exp - expSum;
        expSum += levelData.Exp;
        if (exp < expSum) {
            currLevelData = DatasManager.LevelDatas[i - 1];
            nextLevelData = DatasManager.LevelDatas[i];
            break;
        }
    }
    if (currLevelData) { } else {
        currLevelData = DatasManager.LevelDatas[DatasManager.LevelDatas.length - 1];
    }
    return {
        level: DatasManager.LevelDatas.indexOf(currLevelData) + 1,
        currLevelData: currLevelData,
        nextLevelData: nextLevelData,
        showExp: showExp
    };
}

export function 检测全部转盘宝箱都领完了并重置转盘宝箱(): void {
    if (UserStorage.zhuanpanChestLingqus.indexOf(false) == -1) {
        UserStorage.choujiangTimes = 0;
        UserStorage.zhuanpanChestLingqus.length = 0;
        for (let choujiangChestData of DatasManager.ZhuanpanChestDatas) {
            UserStorage.zhuanpanChestLingqus.push(false);
        }
    }
}

export function 未领取邀请奖励数量(): number {
    if (yaoqingData && yaoqingData.openIds.length) {
        let 未领取邀请奖励数量: number = 0;
        for (const openId of yaoqingData.openIds) {
            if (UserStorage.lingquYaoqingFriendOpenIds.indexOf(openId) == -1) {
                未领取邀请奖励数量++;
            }
        }
        return 未领取邀请奖励数量;
    }
    return 0;
}

export function getCurrDate(): number {
    return Math.floor((new Date().getTime() / (1000 * 60 * 60) + 8) / 24);
}

export function formatTime(sec: number, showHour: boolean): string {
    if (showHour) {
        let hour: number = Math.floor(sec / 3600);
        sec -= hour * 3600;
        let min: number = Math.floor(sec / 60);
        sec -= min * 60;
        return hour + ":" + (100 + min).toString().substr(1) + ":" + (100 + sec).toString().substr(1);
    } else {
        let min: number = Math.floor(sec / 60);
        sec -= min * 60;
        return (100 + min).toString().substr(1) + ":" + (100 + sec).toString().substr(1);
    }
}

export function playAnimation(skel: sp.Skeleton, aniName: string, loop: boolean): sp.spine.TrackEntry {
    //skel.animation = aniName;
    return skel.setAnimation(0, aniName, loop);
}

export function getSkinNames(skel: sp.Skeleton, removeDefault?: boolean): Array<string> {
    const skinNames: Array<string> = new Array();
    if (skel.skeletonData.skeletonJson.skins) {
        for (const skin of skel.skeletonData.skeletonJson.skins as Array<{ name: string }>) {
            skinNames.push(skin.name);
        }
    }
    if (removeDefault) {
        const index = skinNames.indexOf("default");
        if (index > -1) {
            skinNames.splice(index, 1);
        }
    }
    skinNames.sort();
    return skinNames;
}

export function getAniNames(skel: sp.Skeleton): Array<string> {
    let aniNames: Array<string> = new Array();
    for (let aniName in skel.skeletonData.skeletonJson.animations) {
        aniNames.push(aniName);
    }
    aniNames.sort();
    return aniNames;
}

export function disorder(arr: Array<any>): void {
    let i: number = arr.length;
    while (i--) {
        let ran: number = Math.floor(Math.random() * arr.length);
        let tmp: any = arr[i];
        arr[i] = arr[ran];
        arr[ran] = tmp;
    }
}

export function notInOrTrue(obj: any, key: string): boolean {
    if (key in obj) {
        return obj[key];
    }
    return true;
}

const n2n_p0 = new cc.Vec2(0, 0);
const n2n_p100 = new cc.Vec2(100, 0);
const n2n_tmp = new cc.Vec2();
export const n2n_out = new cc.Vec2();
export function p0n2n(from: cc.Node, to: cc.Node): void {
    from.convertToWorldSpaceAR(n2n_p0, n2n_tmp);
    to.convertToNodeSpaceAR(n2n_tmp, n2n_out);
}
export function p100n2n(from: cc.Node, to: cc.Node): void {
    from.convertToWorldSpaceAR(n2n_p100, n2n_tmp);
    to.convertToNodeSpaceAR(n2n_tmp, n2n_out);
}

export function aabb(ltrb1: Array<number>, ltrb2: Array<number>): boolean {
    if (ltrb1 && ltrb2) {
        if (
            ltrb1[0] > ltrb2[2] ||
            ltrb2[0] > ltrb1[2] ||
            ltrb1[1] > ltrb2[3] ||
            ltrb2[1] > ltrb1[3]
        ) {
            return false;
        }
        return true;
    }
    return false;
}

export function getAABB(ltrb1: Array<number>, ltrb2: Array<number>): Array<number> {
    if (ltrb1 && ltrb2) {
        if (aabb(ltrb1, ltrb2)) {
            return [
                ltrb1[0] > ltrb2[0] ? ltrb1[0] : ltrb2[0],
                ltrb1[1] > ltrb2[1] ? ltrb1[1] : ltrb2[1],
                ltrb1[2] < ltrb2[2] ? ltrb1[2] : ltrb2[2],
                ltrb1[3] < ltrb2[3] ? ltrb1[3] : ltrb2[3]
            ];
        }
    }
    return null;
}

export function updateLTRB(absLTRB: Array<number>, x: number, y: number, sy: number, ltrb: Array<number>): void {
    absLTRB[0] = x + ltrb[0];
    absLTRB[2] = x + ltrb[2];
    if (sy < 0) {
        absLTRB[1] = y - ltrb[3];
        absLTRB[3] = y - ltrb[1];
    } else {
        absLTRB[1] = y + ltrb[1];
        absLTRB[3] = y + ltrb[3];
    }
}

export function drawLTRB(container: cc.Node, ltrb: Array<number>, color: cc.Color): cc.Node {
    const node = getSpNode("ui", "white");
    container.addChild(node);
    node.x = (ltrb[0] + ltrb[2]) / 2;
    node.y = (ltrb[1] + ltrb[3]) / 2;
    node.scaleX = (ltrb[2] - ltrb[0]);
    node.scaleY = (ltrb[3] - ltrb[1]);
    node.color = color;
    node.opacity = 100;
    return node;
}

export function drawPos(container: cc.Node, pos: Array<number>, color: cc.Color): cc.Node {
    const node = getSpNode("ui", "circle");
    container.addChild(node);
    node.x = pos[0];
    node.y = pos[1];
    node.scaleX = 0.1;
    node.scaleY = 0.1;
    node.color = color;
    node.opacity = 100;
    return node;
}

export function base64Encode(data: string): string {
    let buf: ArrayBuffer = new ArrayBuffer(data.length * 2);
    let view: Uint16Array = new Uint16Array(buf);
    let len: number = data.length;
    for (let i: number = 0; i < len; i++) {
        view[i] = data.charCodeAt(i);
    }
    return Base64Util.encode(buf);
}
export function base64Decode(code: string): string {
    let buf: ArrayBuffer = Base64Util.decode(code);
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

export function toast(msg: string): void {
    if (typeof (wx) == "undefined") {
        console.log(msg);
    } else {
        wx.showToast({ title: msg, icon: "none" });
    }
}

export function getZip1Path(): string {
    let zip1Path: string = cc.url.raw("resources/1.zip");
    if (platformCtrl.subpackageNames) {
        zip1Path = zip1Path.replace(/^res\//, "subpackages/resources/");
    }
    return zip1Path;
}

export function loadZip1(onComplete: (zipData: ArrayBuffer) => void): void {
    if (typeof (wx) == "undefined") {
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", getZip1Path(), true);
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
            onComplete(xhr.response);
        };
        xhr.send();
    } else {
        const fs = wx.getFileSystemManager();
        fs.readFile({
            filePath: "/" + getZip1Path(),
            success: (data: { data: ArrayBuffer }) => {
                onComplete(data.data);
            },
            fail: (errMsg: string) => {
                console.error("fs.readFile fail " + errMsg);
            }
        });
    }
}

export function getDeviceRect(node: cc.Node): Array<number> {
    const b = node.getBoundingBoxToWorld();
    //console.log(b);
    if (疑似iPad矮胖型屏幕) {
        const scale = platformCtrl.screenWidth / wid0;
        return [Math.round(b.x * scale), Math.round(platformCtrl.screenHeight - (b.y + b.height) * scale), Math.round(b.width * scale), Math.round(b.height * scale)];
    } else {
        const scale = platformCtrl.screenHeight / hei0;
        return [Math.round(b.x * scale), Math.round((hei0 - (b.y + b.height)) * scale), Math.round(b.width * scale), Math.round(b.height * scale)];
    }
}

export function get_xhr(req: Req, useData: boolean, onComplete: (rsp: any) => void): void {
    let url: string = getPostURL(req);
    console.log("get " + url);

    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "text";
    xhr.onload = () => {
        if (xhr.response) {
            console.log("get " + url + " 成功！");
            requestComplete(req, url, xhr.response, useData, onComplete);
        } else {
            console.error("get " + url + " 失败！");
        }
    };
    xhr.send();
}

export function post_xhr(req: Req, useData: boolean, onComplete: (rsp: any) => void): void {
    let url: string = getPostURL(req);
    console.log("post " + url);

    let sendData: string = "";
    for (let key in req) {
        sendData += "&" + key + "=" + escape(req[key]);
    }
    sendData = sendData.substr(1);

    let xhr: XMLHttpRequest = cc.loader.getXMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.responseType = "text";
    xhr.onload = () => {
        if (xhr.response) {
            console.log("post " + url + " 成功！");
            requestComplete(req, url, xhr.response, useData, onComplete);
        } else {
            console.error("post " + url + " 失败！");
        }
    };
    xhr.send(sendData);
}

export function get_wx(req: Req, useData: boolean, onComplete: (rsp: any) => void): void {
    let url: string = getPostURL(req);
    console.log("get " + url);

    wx.request({
        url: url,
        method: "GET",
        success: rsp => {
            console.log("get " + url + " 成功！");
            requestComplete(req, url, rsp, useData, onComplete);
        }, fail: () => {
            console.error("get " + url + " 失败！");
        }
    });
}

export function post_wx(req: Req, useSessionId: boolean, useData: boolean, onComplete: (rsp: any) => void): void {
    let url: string = getPostURL(req);
    console.log("post " + url);

    let header: any = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    if (useSessionId) {
        header.Cookie = "SESSION=" + wx.getStorageSync("sessionId");
    }

    wx.request({
        url: url,
        method: "POST",
        header: header,
        data: req,
        success: rsp => {
            console.log("post " + url + " 成功！");
            requestComplete(req, url, rsp, useData, onComplete);
        }, fail: () => {
            console.error("post " + url + " 失败！");
        }
    });
}

function getPostURL(req: Req): string {
    if (req.op) {
        let url: string = gameRoot + req.op + ".php";
        url = url.replace(/\w+\/\.\.\//, "");
        delete req.op;
        return url;
    }
    if (req.url) {
        let url: string = req.url;
        delete req.url;
        return url;
    }
    console.error("木有 op 或 url");
    return "";
}

function requestComplete(req: Req, url: string, rsp: any, useData: boolean, onComplete: (rsp: any) => void): void {
    if (typeof (rsp) == "string") {
        try {
            rsp = JSON.parse(rsp);
        } catch (e) {
            console.error("解析失败：" + rsp + "\nurl=" + url);
            rsp = null;
        }
    }
    if (useData) {
        if (rsp.data) {
            rsp = rsp.data;
        }
    }
    if (onComplete) {
        onComplete(rsp);
    }
}
