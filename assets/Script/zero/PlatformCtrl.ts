import { DatasManager } from "../datas/DatasManager";
import { webRoot, getCurrDate, base64Encode, base64Decode, Req, guideAllComplete, NativeAdInfo, toast, OpenDataContexts, disorder, Fangchenmis, getZip1Path, loadZip1, User, Share, platformType } from "../zero/global";
import { GlobalStorage } from "./GlobalStorage";
import { UserStorage } from "./UserStorage";
import { RankDatas } from "../popups/Rank";
import { IMoreGame2 } from "../ui/IMoreGame2";
import { Sounds } from "./Sounds";
import { main } from "../Main";
import { locales } from "../ui/locales";
import { recorder } from "../game/Recorder";
export default abstract class PlatformCtrl {

    public screenWidth: number;
    public screenHeight: number;
    public isIOS: boolean;
    public 粪叉: boolean;
    public 已授权: boolean;

    public DyVideoPath: string;
    public DyVideoflag: boolean;

    public languageKeys: Array<string> = ["CN", "TW", "EN"];
    public defaultLanguageKey: "CN" | "TW" | "EN";
    public language: string;
    public languageKey: string;

    public 显示世界榜: boolean;
    public 显示好友榜: boolean;
    public 显示客服签到: boolean;
    public 显示好友助力: boolean;
    public 显示充值商店: boolean;
    public 显示联系我们: boolean;
    public 显示分享: boolean;
    public 显示5星好评: boolean;
    public 强制显示视频: boolean;
    public 显示分享提示: boolean;
    public 显示竞技场: boolean;
    public 使用炫耀: boolean;
    public 显示抖音录屏分享: boolean;
    public 显示抖音更多游戏: boolean;
    public 显示QQ盒子广告: boolean;

    public showBannerAdSuccess: boolean;
    public showInsertAdSuccess: boolean;
    public loadRewardAdSuccess: boolean;
    protected rewardAdId: string;
    public onLoadRewardAdSuccess: () => void;
    protected showRewardAdPos: string;
    public onlineStore: { times: number };

    private subpackageIndex: number;
    public subpackageNames: Array<string>;

    private moreGame2s: Array<IMoreGame2>;
    public onShowMoreGame: () => void;
    public onShowMoreGame2Btn: () => void;
    public onHideMoreGame2Btn: () => void;

    public cpaConfigURL: string;
    public cpaConfigURL1: string;//第一套配置 https://api.mokagm.com/outer/sdk/data/mutual-pos
    public cpaConfigURL2: string;//第二套配置 https://games.mokamrp.com/outer/sdk/data/mutual-pos-two
    private cpa122cpb: boolean;
    public getCPAConfigURL12(mjAppKey: string, cpa122cpb: boolean): void {
        const apikey = "61b59ba885d90188169f17dbacd29d74";
        const timestamp = new Date().getTime();
        const apiSecret = "0ceaf4f01e84e726c6603b9f9575a7d5";
        const args = "?apisign=" + md5(apikey + timestamp + apiSecret) + "&apikey=" + apikey + "&timestamp=" + timestamp + "&apiSecret=" + apiSecret + "&appkey=" + mjAppKey;
        this.cpaConfigURL1 = "https://api.mokagm.com/outer/sdk/data/mutual-pos" + args;
        this.cpaConfigURL2 = "https://games.mokamrp.com/outer/sdk/data/mutual-pos-two" + args;
        this.cpa122cpb = cpa122cpb;
    }
    public cpaConfig: CPAConfig;
    public onLoadCPAComplete: () => void;
    public 模拟打开CPA: (cpaGameInfo: CPAGameInfo, success: (res: { errMsg: string }) => void, fail: (res: { errMsg: string }) => void) => void;
    public onShowInsertCPA: (cpaId: string, cpaId2: string, pos: string) => void;
    public ourCPAId: string;
    public ourCPA: CPAGameInfo;
    public cpaReportURL: string;
    public cpaReportData: {
        "dirty": boolean,
        "p_comm":   //用户信息
        {
            "appid": string,  	//游戏appid
            "openid": string,	//用户uuid
            "wxcode": string	//用户来源标识，没有不填
        },
        "mg_click": //点击
        Array<{
            "turn_appid": string,	//跳转cpa的appid
            "path": string,			//跳转cpa的路径
            "pos_id": string		//位置id
        }>,
        "mg_light": //曝光
        Array<{
            "p": string,	//曝光的位置id
            "k": string,	//曝光的cpa的appid
            "n": string		//曝光次数
        }>,
    };

    public cpbConfigURL: string;
    public cpbConfig: CPBConfig;
    public loadCPBAtlas: () => void;
    public 模拟打开CPB: (cpbGameInfo: CPBGameInfo, success: (res: { errMsg: string }) => void, fail: (res: { errMsg: string }) => void) => void;
    public onShowInsertCPB: (cpbIndex: number, cpbIndex2: number, pos: string) => void;

    public 压缩存档: boolean;
    public 替换有人At你: boolean;
    public sendMessageImg: string;
    public zip1Files: Array<string>;
    public showDayGemReceive: () => void;
    public saveHead: boolean;
    public 横幅左边间距: number = 0;

    public launchScene: number;
    public launchQuery: { wxgamecid: string };

    private feedbackButton: FeedbackButton;
    private userInfoButtons: Array<UserInfoButton>;

    protected onShareCallback: (success: boolean) => void;
    protected 从分享回来: boolean;

    public hutuiStartTime: number;
    public onHutuiCallback: (success: boolean) => void;

    public showingInsertAd: boolean;

    protected currStageId: string;
    protected currStageName: string;

    public currBannerName: string;

    private onlineSettings: { 系统配置版本: string };

    public onShows: Array<() => void>;
    public onHides: Array<() => void>;

    public bannerAdIndex: number;

    public 强制销毁: boolean;

    public accessInfo: string;//帧同步游戏邀请者的accessInfo，我方是被邀请者
    public record: string;

    protected startShareTime: number;
    protected rewardedVideoAdLoadTimes: number;

    protected launchOptions: Array<LaunchOption>;

    public shareImgURL: string;

    private lastSetStoreTime: number;

    public constructor() {
        this.onlineStore = null;
        this.launchScene = 12345;
        this.launchQuery = null;

        this.强制销毁 = false;

        this.launchOptions = new Array();

        this.onShows = new Array();
        this.onHides = new Array();

        this.lastSetStoreTime = 0;
    }

    //录屏管理
    public GameRecorderManager(): any { }
    //录屏对应视频分享
    public DyVideoShare(): any { }
    public showGameRecorderShareButton(xywh: Array<number>): void { }
    public hideGameRecorderShareButton(): void { }

    protected loadSubpackage(subpackageName: string, onComplete: () => void): void {
        console.log("加载子包 " + subpackageName);
        wx.loadSubpackage({
            name: subpackageName,
            success: (res: { errMsg: string }) => {//{"errMsg":"loadSubpackage:ok"}
                //console.log("wx.loadSubpackage() success " + JSON.stringify(res));
                onComplete();
            }, fail: (res) => {
                console.error("wx.loadSubpackage() fail " + JSON.stringify(res));
            }
        });
    }

    public init(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        GlobalStorage.init();
        GlobalStorage.flush();

        console.log("defaultLanguageKey=" + this.defaultLanguageKey);
        console.log("language=" + this.language);
        if (GlobalStorage.selectedLanguageKey) {
            this.languageKey = GlobalStorage.selectedLanguageKey;
        } else {
            const languageLower = this.language.toLowerCase();
            this.languageKey = null;
            for (const languageKey of this.languageKeys) {
                const lanRegs: Array<string> = DatasManager[languageKey];
                if (lanRegs) {
                    for (const lanReg of lanRegs) {
                        if (new RegExp(lanReg).test(languageLower)) {
                            this.languageKey = languageKey;
                            break;
                        }
                    }
                    if (this.languageKey) {
                        break;
                    }
                }
            }
            if (this.languageKey) { } else {
                this.languageKey = this.defaultLanguageKey;
            }
        }
        console.log("languageKey=" + this.languageKey);

        this.moreGame2s = new Array();
    }

    protected wxInit(appId: string, onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {
        // console.log("wx.setWindowSize=" + wx.setWindowSize);
        // if (wx.setWindowSize) {
        //     wx.setWindowSize({
        //         width: 1234, height: 444,
        //         success: res => { console.log("setWindowSize success" + JSON.stringify(res)); },
        //         fail: res => { console.error("setWindowSize fail" + JSON.stringify(res)); }
        //     });
        // }

        //显示分享按钮，设置默认分享。
        wx.showShareMenu({
            withShareTicket: true,
            menus: ["shareAppMessage", "shareTimeline"]
        });

        //右上角三点分享
        (wx.aldOnShareAppMessage || wx.onShareAppMessage)(() => {
            //console.log("wx.aldOnShareAppMessage() " + JSON.stringify(res));
            return this.getShare();
        });

        const launchOption = wx.getLaunchOptionsSync();
        this.其他小游戏点击而来打点("点进来", launchOption);
        this.launchScene = launchOption.scene || 0;
        this.launchQuery = launchOption.query;
        this.aldSend("场景值", this.launchScene.toString());
        this.addLaunchOption(launchOption);

        wx.onShow((res: LaunchOption) => {//{"query":{"openId":"odMRK5KoNn4TPcDio1yah1CTuot8","ald_share_src":"61ca2cd71f6c53a7869659faf8915a60","ald_desc":"undefined"},"scene":1007}
            //console.log("wx.onShow() " + JSON.stringify(res));
            main.delays.delay({
                time: 0.5,
                action: () => {

                    Sounds.resumeMusic();

                    if (this.onShareCallback) {
                        //从分享回来
                        if (DatasManager.a) {
                            this.shareSuccess();
                        } else {
                            const ms = new Date().getTime() - this.startShareTime;
                            //console.log("ms=" + ms);
                            if (ms > DatasManager.分享必须N秒以上 * 1000 && Math.random() * 100 < DatasManager.分享成功概率) {
                                this.shareSuccess();
                            } else {
                                this.shareFailed(locales.getText([DatasManager.分享失败提示CN, DatasManager.分享失败提示CN, DatasManager.分享失败提示EN]));
                            }
                        }
                    } else if (this.onHutuiCallback) {
                        //从互推回来
                        const ms = new Date().getTime() - this.hutuiStartTime;
                        //console.log("ms=" + ms);
                        this.onHutuiCallback(ms > 15 * 1000);
                        this.onHutuiCallback = null;
                    } else if (this.从分享回来) {
                    } else if (res.query && res.query.accessInfo) {
                    } else {
                        if (DatasManager.离开游戏后返回弹出瀑布流) {
                            this.showMoreGame();
                        }
                    }
                    this.从分享回来 = false;

                    this.addLaunchOption(res);

                    for (const onShow of this.onShows) {
                        onShow();
                    }
                }
            });
        });

        wx.onHide((res: { targetAction: number, targetPagePath: string }) => {//{"targetAction":0,"targetPagePath":""}
            //console.log("wx.onHide() " + JSON.stringify(res));

            Sounds.pauseMusic();

            if (this.粪叉) {//解决粪叉分享回来后banner广告上移
                if (this.showBannerAdSuccess) {
                    this.showBannerAd(this.currBannerName, 0, 1);
                }
            }

            if (this.cpaReportURL) {
                if (this.cpaReportData.dirty) {
                    delete this.cpaReportData.dirty;
                    this.cpaReportData.p_comm.appid = appId;
                    this.cpaReportData.p_comm.openid = GlobalStorage.openId;

                    wx.request({
                        url: this.cpaReportURL,
                        data: this.cpaReportData,
                        method: "POST",
                        dataType: "json"
                    });

                    this.resetCPAReportData();
                }
            }

            for (const onHide of this.onHides) {
                onHide();
            }

        });

        if (this.cpaConfigURL) {
            this.loadCPA(appId);
        }
        if (this.cpbConfigURL) {
            this.loadCPB(appId);
        }

        if (this.cpaReportURL) {
            this.resetCPAReportData();
        }

        wx.getSetting({
            success: (res: { errMsg: string, authSetting: { "scope.userInfo": boolean } }) => {
                //console.log("wx.getSetting() success " + JSON.stringify(res));
                //{"errMsg":"getSetting:ok","authSetting":{}}
                //{"errMsg":"getSetting:ok","authSetting":{"scope.userInfo":true}}
                if (res.authSetting["scope.userInfo"]) {
                    //用户已经授权

                    wx.getUserInfo({
                        success: (res: { errMsg: string, userInfo: { nickName: string, gender: 1 | 0, avatarUrl: string } }) => {
                            //console.log("wx.getUserInfo() success " + JSON.stringify(res));
                            //{"errMsg":"getUserInfo:ok","rawData":"{\"nickName\":\"zero\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"Chaoyang\",\"province\":\"Beijing\",\"country\":\"China\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI9voxB0SYySahwVIajEoQib2XmGEyJia2icNvBcg4QE5eAGZiaDFycYMLpr9AMdhTibTBbicxcF1CqTVog/132\"}","userInfo":{"nickName":"zero","gender":1,"language":"zh_CN","city":"Chaoyang","province":"Beijing","country":"China","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI9voxB0SYySahwVIajEoQib2XmGEyJia2icNvBcg4QE5eAGZiaDFycYMLpr9AMdhTibTBbicxcF1CqTVog/132"},"signature":"9d2f928ea1ae4be2cebc119718b690921252b69b","encryptedData":"aaZTkO+JfsUalT9Xj1HHFEPMVMxOyyUajhN5If4R8Kd6M2gDrAY3tnj57oiZ6DLoGmWuwkJ/tNfWxYxcszZVur0yoqgPZyntMAwwqVvhRTVDyjCedhONToDv0U2FaWbgdpIR+xmh3V9oddjdrwtYjN74M7YzfyMOzSxpx83/d2aauDHvBwWyAmGgOz9mTdkHVT/Tx7g/DWxVfi77dEGKvWq2NPJ4hnE10d5er6dfLBQyLhY0Xzl2QwkF+sPy2FuOA0TmPMS/MqRpgG461xiylrBYK3tBjv88G8H2Kl0X5S6mBYTXuX/dqsnWRnkOPGOYnjri4TqRzknzj6O77nCfqkBNLEMSsFho5a4JUlUoRmZRaOGrUunJwtUV2Yttz0ox19eZJbzWysuvK1qm4WW9nMQZfTNAgjzEmrhbCFTTrBXaGAfQv+G8Y44jeO8Lis8zKO9xV9q+VaWu2p89ZzS+sqBHvSQk7MlDK3uga9/lk3c=","iv":"D4tkzclSPoIvMU2qAgbcmA=="}
                            this.initUserInfo(res.userInfo.nickName, res.userInfo.gender, res.userInfo.avatarUrl);
                        },
                        fail: (res: { errMsg: string }) => {
                            console.error("wx.getUserInfo() fail " + JSON.stringify(res));
                            //{"errMsg":"getUserInfo:fail auth deny"}
                            //{"errMsg":"getUserInfo:fail scope unauthorized"}
                        }
                    });

                }// else {
                //    //用户未授权
                //}

                this.init_next(onLoadSubpackagesComplete, onInitComplete);

            },
            fail: (res: { errCode: number, errMsg: string }) => {
                console.error("wx.getSetting() fail" + JSON.stringify(res));
            }
        });

        //保持屏幕亮
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
    }

    private addLaunchOption(launchOption: LaunchOption): void {
        if (launchOption.query && launchOption.query.id) {
            this.aldSend("分享", "接收 id=" + launchOption.query.id);
        }
        this.launchOptions.push(launchOption);
        this.checkLaunchOptions();
    }

    public checkLaunchOptions(): void {
        if (GlobalStorage.openId && UserStorage.被邀请openIds) {
            for (let launchOption of this.launchOptions) {
                console.log("launchOption=" + JSON.stringify(launchOption));
                if (launchOption.query) {
                    if (launchOption.query.record) {
                        this.record = launchOption.query.record;
                    } else if (launchOption.query.accessInfo) {
                        this.accessInfo = launchOption.query.accessInfo;
                    } else if (launchOption.query.openId) {
                        this.我是从邀请点进来的(launchOption.query.openId);
                    }
                }
            }
            this.launchOptions.length = 0;
        }
    }
    private 我是从邀请点进来的(邀请者的openId: string): void {
        if (GlobalStorage.openId) {
            if (GlobalStorage.openId == 邀请者的openId) {
                return;
            }
            console.log("我是从邀请点进来的 邀请者的openId=" + 邀请者的openId);
            if (UserStorage.被邀请openIds.indexOf(邀请者的openId) == -1) {
                if (UserStorage.被邀请openIds.length < DatasManager.每天被邀请次数上限) {
                    UserStorage.被邀请openIds.push(邀请者的openId);
                    UserStorage.flush();
                    this.invite(邀请者的openId);
                }
            }
        }
    }

    protected init_next(onLoadSubpackagesComplete: () => void, onInitComplete: () => void): void {

        if (this.subpackageNames) {
            let loadNextSubpackage = () => {
                if (++this.subpackageIndex >= this.subpackageNames.length) {
                    console.log("加载子包们完成");
                    if (onLoadSubpackagesComplete) {
                        onLoadSubpackagesComplete();
                    }
                    return;
                }
                this.loadSubpackage(this.subpackageNames[this.subpackageIndex], loadNextSubpackage);
            }
            this.subpackageIndex = -1;
            console.log("开始加载子包们");
            loadNextSubpackage();
        } else {
            if (onLoadSubpackagesComplete) {
                onLoadSubpackagesComplete();
            }
        }

        console.log("GlobalStorage.openId=" + GlobalStorage.openId);
        console.log("GlobalStorage.nickname=" + GlobalStorage.nickname);

        if (GlobalStorage.openId) { } else {
            this.login(() => {
                if (this.onlineSettings) {
                    this.aldSendOpenid();
                    if (onInitComplete) {
                        onInitComplete();
                    }
                }
            });
        }
        this.getSettings(rsp => {
            this.onlineSettings = rsp;
            console.log("本地配置版本 " + DatasManager.系统配置版本 + ", 线上配置版本 " + this.onlineSettings.系统配置版本);
            if (this.onlineSettings.系统配置版本 > DatasManager.系统配置版本) {
                for (let key in this.onlineSettings) {
                    DatasManager[key] = this.onlineSettings[key];
                }
                console.log("使用线上配置");
            } else {
                console.log("使用本地配置");
            }
            console.log("a=" + DatasManager.a);
            if (GlobalStorage.openId) {
                this.aldSendOpenid();
                if (onInitComplete) {
                    onInitComplete();
                }
            }
        });
    }

    protected loadCPA(appId: string): void {
        if (this.cpaConfigURL) { } else {
            return;
        }
        this.get(
            { url: this.cpaConfigURL },
            (rsp: CPAConfig) => {
                this.getCPA(rsp, appId);
            }
        );
    }
    private getCPA(rsp: CPAConfig, appId: string): void {
        if (rsp && rsp.data && rsp.data.addturnlist) {

            if (this.ourCPAId && this.ourCPA) {
                rsp.data.addturnlist[this.ourCPAId] = this.ourCPA;
            }

            const removeIds: Array<string> = new Array();
            if (this.isIOS) {
                if (rsp.苹果不显示) {
                    for (const _appId of rsp.苹果不显示) {
                        for (const key in rsp.data.addturnlist) {
                            if (rsp.data.addturnlist[key].otherAppId == _appId) {
                                delete rsp.data.addturnlist[key];
                                removeIds.push(key);
                            }
                        }
                    }
                }
            }

            for (const key in rsp.data.addturnlist) {
                if (rsp.data.addturnlist[key].otherAppId == appId) {
                    delete rsp.data.addturnlist[key];
                    removeIds.push(key);
                }
            }

            let gameIcon1Ids: Array<string> = null;
            let 推荐2Ids: Array<string> = null;
            let gameIcon2IdsCopy: Array<string> = null;

            if (rsp.推荐2) {
                推荐2Ids = new Array();
                for (let key in rsp.data.addturnlist) {
                    if (rsp.推荐2.indexOf(rsp.data.addturnlist[key].otherAppId) > -1) {
                        推荐2Ids.push(key);
                    }
                }
                disorder(推荐2Ids);
                console.log("推荐2Ids=" + 推荐2Ids);
            }

            for (let key in rsp.data) {
                switch (key) {
                    case "isopen":
                    case "version":
                        break;
                    case "addturnlist":
                        break;
                    default:
                        let itemList: Array<string> = rsp.data[key]["itemlist"];
                        for (let removeId of removeIds) {
                            let index: number = itemList.indexOf(removeId);
                            if (index > -1) {
                                itemList.splice(index, 1);
                            }
                        }
                        if (key == "gameIcon2") {
                            gameIcon2IdsCopy = itemList.slice();
                            disorder(gameIcon2IdsCopy);
                            console.log("gameIcon2IdsCopy=" + gameIcon2IdsCopy);
                        } else {
                            if (key == "gameIcon1") {
                                gameIcon1Ids = itemList;
                            }
                            if (this.ourCPAId) {
                                itemList.unshift(this.ourCPAId);
                            }
                        }
                        break;
                }
            }

            if (gameIcon1Ids && (推荐2Ids || gameIcon2IdsCopy)) {
                while (gameIcon1Ids.length < 4) {
                    if (推荐2Ids && 推荐2Ids.length) {
                        gameIcon1Ids.push(推荐2Ids.pop());
                    } else if (gameIcon2IdsCopy && gameIcon2IdsCopy.length) {
                        gameIcon1Ids.push(gameIcon2IdsCopy.pop());
                    } else {
                        break;
                    }
                }
            }

            //console.log(rsp.CPA关 + "\n" + rsp.CPA黑名单);
            if (rsp.CPA关) {
                rsp = null;
            } else if (rsp.CPA黑名单) {
                let enterScene: number;
                if (UserStorage.首次进入游戏的场景值4 > -2) {
                    enterScene = UserStorage.首次进入游戏的场景值4;
                } else {
                    enterScene = this.launchScene;
                }
                //console.log(enterScene);
                if (rsp.CPA黑名单.indexOf(enterScene) > -1) {
                    rsp = null;
                }
            }

            if (rsp) {
                this.cpaConfig = rsp;
            }

            if (this.onLoadCPAComplete) {
                this.onLoadCPAComplete();
                this.onLoadCPAComplete = null;
            }

        }
    }

    protected loadCPA12(onComplete: () => void): void {
        if (this.cpaConfigURL1 && this.cpaConfigURL2) { } else {
            if (onComplete) onComplete();
            return;
        }
        this.get(
            { url: UserStorage.误触黑4 ? this.cpaConfigURL1 : this.cpaConfigURL2 },
            (rsp: CPA12Config) => {
                console.log(rsp);
                if (rsp && rsp.data) {
                    if (this.cpa122cpb) {
                        const cpbConfig = {
                            开: true,
                            加载页显示: true,
                            黑名单: [],
                            苹果不显示: [],
                            推荐1: [],
                            推荐2: [],
                            atlas: null,
                            文字底: null,
                            cpbs: []
                        };
                        let i: number = -1;
                        for (const cpa12GameInfo of rsp.data) {
                            i++;
                            if (cpa12GameInfo.Position <= 4) {
                                cpbConfig.推荐1.push(i);
                            } else {
                                cpbConfig.推荐2.push(i);
                            }
                            cpbConfig.cpbs.push({
                                appId: cpa12GameInfo.GameAppId,
                                name: cpa12GameInfo.GameName,
                                nameRect: null,
                                path: cpa12GameInfo.PromoteLink,
                                icon: cpa12GameInfo.Icon,
                                iconRect: null,
                                insert: ""
                            });
                        }
                        console.log(JSON.stringify(cpbConfig));
                        this.getCPB(cpbConfig as any, null);
                    } else {
                        const cpaConfig = {
                            success: true,
                            msg: "",
                            version: "",
                            data: {
                                isopen: true,
                                version: "",
                                mainIcon: { itemlist: [], adtype: "icon" },
                                mainIcons: { itemlist: [], adtype: "icon" },
                                hutuiqiang: { itemlist: [], adtype: "icon" },
                                gameIcon1: { itemlist: [], adtype: "icon" },//推荐1
                                gameIcon2: { itemlist: [], adtype: "icon" },
                                addturnlist: {} as { [key: string]: CPAGameInfo }
                            },
                            苹果不显示: [],
                            推荐2: [],
                            CPA关: false,
                            CPA黑名单: [],
                            加载页显示CPA: true,
                            qrs: []
                        };
                        let i: number = -1;
                        for (const cpa12GameInfo of rsp.data) {
                            i++;
                            const id = (i + 1).toString();
                            cpaConfig.data.mainIcon.itemlist.push(id);
                            cpaConfig.data.mainIcons.itemlist.push(id);
                            cpaConfig.data.hutuiqiang.itemlist.push(id);
                            if (cpa12GameInfo.Position <= 4) {
                                cpaConfig.data.gameIcon1.itemlist.push(id);
                            } else {
                                cpaConfig.推荐2.push(cpa12GameInfo.GameAppId);
                            }
                            cpaConfig.data.gameIcon2.itemlist.push(id);
                            cpaConfig.data.addturnlist[id] = {
                                otherIconUrl: cpa12GameInfo.Icon,
                                otherInsertUrl: "",
                                otherBannerUrl: "",
                                otherBanner2Url: "",
                                otherAppId: cpa12GameInfo.GameAppId,
                                otherName: cpa12GameInfo.GameName,
                                otherIndexPath: cpa12GameInfo.PromoteLink
                            };
                        }
                        console.log(JSON.stringify(cpaConfig));
                        this.getCPA(cpaConfig as any, null);
                    }
                } else {
                    if (this.cpa122cpb) {
                        this.getCPB(null, null);
                    } else {
                        this.getCPA(null, null);
                    }
                }
                if (onComplete) onComplete();
            }
        );
    }

    protected loadCPB(appId: string): void {
        if (this.cpbConfigURL) { } else {
            return;
        }
        this.get(
            { url: this.cpbConfigURL },
            (rsp: CPBConfig) => {
                this.getCPB(rsp, appId);
            }
        );
    }
    private getCPB(rsp: CPBConfig, appId: string): void {
        if (rsp.开 && rsp.cpbs) {

            if (rsp.黑名单) {
                let enterScene: number;
                if (UserStorage.首次进入游戏的场景值4 > -2) {
                    enterScene = UserStorage.首次进入游戏的场景值4;
                } else {
                    enterScene = this.launchScene;
                }
                //console.log(enterScene);
                if (rsp.黑名单.indexOf(enterScene) > -1) {
                    return;
                }
            }

            if (rsp.推荐1) { } else {
                rsp.推荐1 = new Array();
            }
            if (rsp.推荐2) { } else {
                rsp.推荐2 = new Array();
            }

            let cpbIndex: number = rsp.cpbs.length;
            while (cpbIndex--) {
                if (rsp.cpbs[cpbIndex].appId == appId) {
                    rsp.cpbs[cpbIndex] = null;
                }
            }

            if (this.isIOS) {
                if (rsp.苹果不显示) {
                    for (let cpbIndex of rsp.苹果不显示) {
                        rsp.cpbs[cpbIndex] = null;
                    }
                }
            }

            cpbIndex = rsp.cpbs.length;
            while (cpbIndex--) {
                if (rsp.cpbs[cpbIndex]) { } else {
                    rsp.cpbs.splice(cpbIndex, 1);
                    let i: number = rsp.推荐1.length;
                    while (i--) {
                        if (rsp.推荐1[i] == cpbIndex) {
                            rsp.推荐1.splice(i, 1);
                        } else if (rsp.推荐1[i] > cpbIndex) {
                            rsp.推荐1[i]--;
                        }
                    }
                    i = rsp.推荐2.length;
                    while (i--) {
                        if (rsp.推荐2[i] == cpbIndex) {
                            rsp.推荐2.splice(i, 1);
                        } else if (rsp.推荐2[i] > cpbIndex) {
                            rsp.推荐2[i]--;
                        }
                    }
                }
            }

            disorder(rsp.推荐1);
            disorder(rsp.推荐2);
            while (rsp.推荐1.length < 4) {
                if (rsp.推荐2.length) {
                    rsp.推荐1.push(rsp.推荐2.pop());
                } else {
                    break;
                }
            }
            if (rsp.推荐1.length < 4) {
                cpbIndex = rsp.cpbs.length;
                while (cpbIndex--) {
                    if (rsp.推荐1.indexOf(cpbIndex) == -1) {
                        rsp.推荐1.push(cpbIndex);
                        if (rsp.推荐1.length < 4) { } else {
                            break;
                        }
                    }
                }
            }

            this.cpbConfig = rsp;

            this.loadCPBAtlas();

        }
    }

    private 其他小游戏点击而来: string;
    public 其他小游戏点击而来打点(key: string, launchOption?: LaunchOption): void {
        //launchOption={"scene":1037,"query":{"ald_link_key":"fe74d368bddeda32","ald_position_id":"0","ald_media_id":"18924"},"referrerInfo":{"appId":"wxca52f367ab432bca","extraData":{"from":"火柴人冲突"}}}
        if (launchOption) {
            if (launchOption.referrerInfo && launchOption.referrerInfo.appId) {
                this.其他小游戏点击而来 = launchOption.referrerInfo.appId;
                if (launchOption.query && launchOption.query.lt) {
                    this.其他小游戏点击而来 += " " + launchOption.query.lt;
                }
            }
        }
        if (this.其他小游戏点击而来) {
            this.aldSend("其他小游戏点击而来", this.其他小游戏点击而来 + " " + key);
        }
    }

    public abstract init2(onComplete: () => void): void;
    protected init2Complete(onComplete: () => void): void {
        DatasManager.initShares();
        UserStorage.init();
        this.checkUpdate();
        if (onComplete) {
            onComplete();
        }
    }

    private checkUpdate(): void {
        if (typeof (wx) == "undefined") { } else {
            const updateManager: UpdateManager = wx.getUpdateManager();

            updateManager.onCheckForUpdate((res: { hasUpdate: boolean }) => {
                console.log("updateManager.onCheckForUpdate " + JSON.stringify(res));
            });

            updateManager.onUpdateReady(() => {
                //console.log("updateManager.onUpdateReady");
                wx.showModal({
                    title: "提示",
                    content: locales.getText([DatasManager.更新提示CN, DatasManager.更新提示CN, DatasManager.更新提示EN]),
                    success: () => {
                        updateManager.applyUpdate();
                    },
                    showCancel: false,
                    confirmText: "更 新"
                });
            });

            updateManager.onUpdateFailed(() => {
                console.error("updateManager.onUpdateFailed");
            });
        }
    }

    private 闯关中: boolean;
    private 限制游戏小时数: number;
    protected 需要限制游戏(限制游戏小时数: number): void {
        if (Fangchenmis.instance) { } else {
            new Fangchenmis();
        }
        this.限制游戏小时数 = 限制游戏小时数;
        if (Fangchenmis.instance.counter2) {
            return;
        }
        let date: number = getCurrDate();
        if (GlobalStorage.fangchenmi_date >= date) {
        } else {
            GlobalStorage.fangchenmi_date = date;
            GlobalStorage.fangchenmi_startTime = new Date().getTime();
            GlobalStorage.flush();
        }
        let restSec: number = Math.round(this.限制游戏小时数 * 60 * 60 - (new Date().getTime() - GlobalStorage.fangchenmi_startTime) / 1000);
        if (restSec > 0) { } else {
            restSec = 0;
        }
        Fangchenmis.instance.startCounter1(restSec, () => {
            if (this.闯关中) {
                Fangchenmis.instance.showPopup1((this.限制游戏小时数 > 0 ? "您累计游戏时长已经达到" + this.限制游戏小时数 + "小时" : "夜深了") + "，请尽快下线休息，做适当身体活动，合理安排学习生活！");
                Fangchenmis.instance.startCounter2(5 * 60, () => {
                    this.强制引导退出();
                });
            } else {
                this.强制引导退出();
            }
        });
    }

    private 强制引导退出(): void {
        Fangchenmis.instance.showPopup2((this.限制游戏小时数 > 0 ? "您累计游戏时长已经达到" + this.限制游戏小时数 + "小时" : "夜深了") + "，请立即下线休息，做适当身体活动，合理安排学习生活！");
    }

    public canRequestSubscribeMessage(): boolean { return false; }
    public requestSubscribeMessage(currId: string, onComplete: (accept: boolean) => void): void { }

    public verify(): boolean {
        return true;
    }

    public initOpenDataContext(): void { }

    public shareMessageToFriend(friendInfoIndex: number): void {
        if (OpenDataContexts.instance) {
            wx.setMessageToFriendQuery({ shareMessageToFriendScene: 1 });
            let share: Share = this.getShare();
            share.friendInfoIndex = friendInfoIndex;
            OpenDataContexts.instance.postMessage("shareMessageToFriend", share);
        }
    }

    public getShare(share?: Share, id?: string): Share {
        if (share) { } else {
            share = DatasManager.shares[Math.floor(Math.random() * DatasManager.shares.length)];
            id = share.query.match(/id\=(\d+)/)[1];
        }
        share = JSON.parse(JSON.stringify(share));
        if (GlobalStorage.nickname) {
            if (this.替换有人At你) {
                share.title = share.title.replace("有人@你", GlobalStorage.nickname + "@你");
            }
            share.title = share.title.replace("{nickname}", GlobalStorage.nickname);
        } else {
            share.title = share.title.replace("{nickname}", "有人");
        }
        share.query = "id=" + id + "&openId=" + GlobalStorage.openId;
        this.aldSend("分享", "发送 id=" + id);
        share.success = () => {
            console.log("分享成功");
            if (this.onShareCallback) {
                this.shareSuccess();
            }
        };
        share.fail = (e) => {
            console.log("分享失败", e);
            if (this.onShareCallback) {
                this.shareFailed(locales.getText([DatasManager.分享失败提示CN, DatasManager.分享失败提示CN, DatasManager.分享失败提示EN]));
            }
        };
        return share;
    }

    public login(onComplete: () => void): void { onComplete(); }

    public logout(): void { }

    //主动转发
    public share(callback: (success: boolean) => void): void {
        this.onShareCallback = callback;
        if (this.onShareCallback) {
            this.startShareTime = new Date().getTime();
        }
        this.从分享回来 = true;
        if (typeof (wx) == "undefined") { } else {
            (wx.aldShareAppMessage || wx.shareAppMessage)(this.getShare());
        }
    }

    public shareAccessInfo(accessInfo: string): void {
        this.从分享回来 = true;
        const share = this.getShare();
        share.query = "accessInfo=" + accessInfo;
        if (typeof (wx) == "undefined") { } else {
            (wx.aldShareAppMessage || wx.shareAppMessage)(this.getShare());
        }
    }

    public shareRecord(): void {
        this.从分享回来 = true;
        const share = this.getShare(DatasManager.回放分享, "12345");
        if (this.shareImgURL) {
            share.imageUrl = this.shareImgURL;
        }
        share.query += "&record=" + recorder.encode();
        if (typeof (wx) == "undefined") { } else {
            (wx.aldShareAppMessage || wx.shareAppMessage)(share);
        }
    }

    public showMoreGames(): void { }

    protected shareSuccess(): void {
        this.shareCallback(true);
    }

    protected shareFailed(msg: string): void {
        //toast(msg);
        this.shareCallback(false);
    }

    private shareCallback(success: boolean): void {
        let onShareCallback = this.onShareCallback;
        this.onShareCallback = null;
        main.delays.delay({
            time: 0.2,
            action: () => {
                onShareCallback(success);
            }
        });
    }

    public rating(): void { }

    public showBannerAd(bannerName: string, dx: number, dy: number): void {
        this.currBannerName = bannerName;
    }

    public hideBannerAd(): void { }

    public showInsertAdDelay(key: string): void {
        if (guideAllComplete()) {
            main.delays.delay({
                time: 0.5,
                action: () => {
                    this.showInsertAd(key);
                },
                group: key
            });
        }
    }
    protected showInsertAd(key: string): void {
        const showInsertAds: Array<number> = DatasManager[key];
        if (showInsertAds) { } else {
            //console.error("木有 " + key);
            return;
        }
        let index: number = DatasManager[key + "Index"];
        if (index > 0) {
            if (++index >= showInsertAds.length) {
                index = 0;
            }
        } else {
            index = 0;
        }
        DatasManager[key + "Index"] = index;
        if (showInsertAds[index]) {
            console.log(key);
            this.showInsertAd_();
        }
    }
    protected showInsertAd_(): void { }

    public loadRewardAd(): void { }

    public showRewardAd(action: number, pos: string, callback: (success: boolean) => void): void {
        callback(true);
    }

    public getNativeAdInfo(nativeName: string): NativeAdInfo { return null; }

    public showNativeAd(nativeAdInfo: NativeAdInfo): void { }

    public clickNativeAd(nativeAdInfo: NativeAdInfo): void { }

    public hideNativeAd(nativeAdInfo: NativeAdInfo): void { }

    public showAppBox(): void { }

    public addMoreGame2(moreGame2: IMoreGame2): void {
        this.moreGame2s.push(moreGame2);
    }
    public removeMoreGame2(moreGame2: IMoreGame2): void {
        let index: number = this.moreGame2s.indexOf(moreGame2);
        if (index > -1) {
            this.moreGame2s.splice(index, 1);
        }
    }

    public showMoreGame(): void {
        if (this.onlineStore) {
            if (guideAllComplete()) {
                if (this.onShowMoreGame) {
                    this.onShowMoreGame();
                }
            }
        }
    }

    public showMoreGame2Btn(): void {
        if (this.onShowMoreGame2Btn) {
            this.onShowMoreGame2Btn();
        }
    }
    public hideMoreGame2Btn(): void {
        if (this.onHideMoreGame2Btn) {
            this.onHideMoreGame2Btn();
        }
    }

    public showInsertCPA(pos: string): void {
        if (this.cpaConfig) {

            let cpaIds: Array<string> = new Array();
            let 推荐1: Array<string> = this.getCPAIds("gameIcon1");
            if (推荐1) {
                推荐1.slice();
                disorder(推荐1);
                console.log("推荐1=" + 推荐1);
                for (let cpaId of 推荐1) {
                    let cpaGameInfo: CPAGameInfo = this.cpaConfig.data.addturnlist[cpaId];
                    if (cpaGameInfo.otherInsertUrl) {
                        if (UserStorage.用户跳转过的CPA插屏2.indexOf(cpaGameInfo.otherAppId) > -1) { } else {
                            cpaIds.push(cpaId);
                        }
                    }
                }
                console.log("cpaIds=" + cpaIds);
            }

            if (cpaIds.length >= 2) { } else {
                if (this.cpaConfig.推荐2) {
                    let 推荐2: Array<string> = new Array();
                    for (let appId of this.cpaConfig.推荐2) {
                        for (let cpaId in this.cpaConfig.data.addturnlist) {
                            let cpaGameInfo: CPAGameInfo = this.cpaConfig.data.addturnlist[cpaId];
                            if (cpaGameInfo.otherAppId == appId) {
                                推荐2.push(cpaId);
                                break;
                            }
                        }
                    }
                    disorder(推荐2);
                    console.log("推荐2=" + 推荐2);
                    for (let cpaId of 推荐2) {
                        let cpaGameInfo: CPAGameInfo = this.cpaConfig.data.addturnlist[cpaId];
                        if (cpaGameInfo.otherInsertUrl) {
                            if (UserStorage.用户跳转过的CPA插屏2.indexOf(cpaGameInfo.otherAppId) > -1) { } else {
                                cpaIds.push(cpaId);
                            }
                        }
                    }
                    console.log("cpaIds=" + cpaIds);
                }
            }

            if (cpaIds.length >= 2) { } else {
                let 剩余: Array<string> = new Array();
                for (let cpaId in this.cpaConfig.data.addturnlist) {
                    let cpaGameInfo: CPAGameInfo = this.cpaConfig.data.addturnlist[cpaId];
                    if (cpaGameInfo.otherInsertUrl) {
                        if (UserStorage.用户跳转过的CPA插屏2.indexOf(cpaGameInfo.otherAppId) > -1) { } else {
                            if (cpaIds.indexOf(cpaId) == -1) {
                                剩余.push(cpaId);
                            }
                        }
                    }
                }
                disorder(剩余);
                console.log("剩余=" + 剩余);
                cpaIds = cpaIds.concat(剩余);
                console.log("cpaIds=" + cpaIds);
            }

            if (cpaIds.length) {
                if (this.onShowInsertCPA) {
                    this.onShowInsertCPA(cpaIds[0], cpaIds[1], pos);
                }
            }
        }
    }

    public 获取20个重复随机CPA(): Array<string> {
        if (this.cpaConfig) {
            let cpaIds: Array<string> = new Array();
            for (let cpaId in this.cpaConfig.data.addturnlist) {
                let cpaGameInfo: CPAGameInfo = this.cpaConfig.data.addturnlist[cpaId];
                if (UserStorage.用户当天跳转过的CPA图标.indexOf(cpaGameInfo.otherAppId) > -1) { } else {
                    cpaIds.push(cpaId);
                }
            }
            if (cpaIds.length > 0) {
                let cpaIdss: Array<string> = new Array();
                while (cpaIdss.length < 42) {
                    disorder(cpaIds);
                    cpaIdss = cpaIdss.concat(cpaIds);
                }
                cpaIdss.length = 42;
                return cpaIdss;
            }
        }
        return null;
    }

    public getCPAIds(key: string): Array<string> {
        if (this.cpaConfig) {
            let cpaAdSet: CPAAdSet = this.cpaConfig.data[key];
            if (cpaAdSet) {
                if (cpaAdSet.itemlist && cpaAdSet.itemlist.length) {
                    return cpaAdSet.itemlist;
                } else {
                    console.error("木有 cpaAdSet.itemlist：" + key);
                }
            } else {
                console.error("木有 cpaAdSet：" + key);
            }
        }
        return null;
    }

    protected resetCPAReportData(): void {
        this.cpaReportData = {
            dirty: false,
            p_comm: { appid: "", openid: "", wxcode: "" },
            mg_click: [],
            mg_light: []
        };
    }
    public openCPA(key: string, pos: string, item: any, cpaGameInfo: CPAGameInfo, successRecord: boolean, failShowMoreGame: boolean, openCallback: (item: any, cpaGameInfo: CPAGameInfo, success: boolean) => void): void {
        console.log("openCPA " + key + " " + pos, cpaGameInfo);
        const success = (res: { errMsg: string }) => {//{"errMsg":"navigateToMiniProgram:ok"}
            console.log("wx.navigateToMiniProgram success " + JSON.stringify(res));
            if (typeof (wx) == "undefined") { } else {
                wx.aldSendEvent("CPA确认跳转", { key: key, pos: pos, 游戏名称: cpaGameInfo.otherName, appId: cpaGameInfo.otherAppId });
            }
            if (openCallback) {
                openCallback(item, cpaGameInfo, true);
            }
            if (successRecord) {
                UserStorage.用户当天跳转过的CPA图标.push(cpaGameInfo.otherAppId);
                UserStorage.flush();
                for (const moreGame2 of this.moreGame2s) {
                    moreGame2.refresh();
                }
            }
        };
        const fail = (res: { errMsg: string }) => {
            console.error("wx.navigateToMiniProgram fail " + JSON.stringify(res));
            if (openCallback) {
                openCallback(item, cpaGameInfo, false);
            }
            if (failShowMoreGame) {
                this.showMoreGame();
            }
        };
        if (this.cpaReportURL) {
            this.cpaReportData.mg_click.push({
                turn_appid: cpaGameInfo.otherAppId,
                path: cpaGameInfo.otherIndexPath,
                pos_id: pos
            });
            this.cpaReportData.dirty = true;
        }
        if (typeof (wx) == "undefined") {
            if (this.模拟打开CPA) {
                this.模拟打开CPA(cpaGameInfo, success, fail);
            }
        } else {
            wx.aldSendEvent("CPA点击", { key: key, pos: pos, 游戏名称: cpaGameInfo.otherName, appId: cpaGameInfo.otherAppId });
            const args = {
                appId: cpaGameInfo.otherAppId,
                path: cpaGameInfo.otherIndexPath,
                // extraData: {
                //     from: chName
                // },
                // envVersion: 'release',
                success: undefined,
                fail: undefined
            }
            console.log("navigateToMiniProgram", args);
            args.success = success;
            args.fail = fail;
            wx.navigateToMiniProgram(args);
        }
    }

    public showInsertCPB(pos: string): void {
        if (this.cpbConfig) {

            let 带插屏又没跳转过的CPBIndices: Array<number> = new Array();
            let cpbIndex = -1;
            for (let cpbGameInfo of this.cpbConfig.cpbs) {
                cpbIndex++;
                if (cpbGameInfo.insert) {
                    if (UserStorage.用户跳转过的CPA插屏2.indexOf(cpbGameInfo.appId) == -1) {
                        带插屏又没跳转过的CPBIndices.push(cpbIndex);
                    }
                }
            }

            disorder(带插屏又没跳转过的CPBIndices);

            let cpbIndices: Array<number> = new Array();

            let i: number = 带插屏又没跳转过的CPBIndices.length;
            while (i--) {
                cpbIndex = 带插屏又没跳转过的CPBIndices[i];
                if (this.cpbConfig.推荐1.indexOf(cpbIndex) > -1) {
                    cpbIndices.push(cpbIndex);
                    带插屏又没跳转过的CPBIndices.splice(i, 1);
                }
            }

            i = 带插屏又没跳转过的CPBIndices.length;
            while (i--) {
                cpbIndex = 带插屏又没跳转过的CPBIndices[i];
                if (this.cpbConfig.推荐2.indexOf(cpbIndex) > -1) {
                    cpbIndices.push(cpbIndex);
                    带插屏又没跳转过的CPBIndices.splice(i, 1);
                }
            }

            cpbIndices = cpbIndices.concat(带插屏又没跳转过的CPBIndices);

            if (cpbIndices.length) {
                if (this.onShowInsertCPB) {
                    this.onShowInsertCPB(cpbIndices[0], cpbIndices[1], pos);
                }
            }
        }
    }

    public 获取n个重复随机CPB(n: number): Array<number> {
        if (this.cpbConfig) {
            const cpbIndices: Array<number> = new Array();
            let cpbIndex: number = -1;
            for (const cpbGameInfo of this.cpbConfig.cpbs) {
                cpbIndex++;
                if (UserStorage.用户当天跳转过的CPA图标.indexOf(cpbGameInfo.appId) == -1) {
                    cpbIndices.push(cpbIndex);
                }
            }
            if (cpbIndices.length > 0) {
                let cpbIndicess: Array<number> = new Array();
                while (cpbIndicess.length < n) {
                    disorder(cpbIndices);
                    cpbIndicess = cpbIndicess.concat(cpbIndices);
                }
                cpbIndicess.length = n;
                return cpbIndicess;
            }
        }
        return null;
    }

    public openCPB(pos: string, icon: any, cpbGameInfo: CPBGameInfo, successRecord: boolean, failShowMoreGame: boolean, openCallback: (icon: any, cpbGameInfo: CPBGameInfo, success: boolean) => void): void {
        console.log("openCPB " + " " + pos, cpbGameInfo);
        const success = (res: { errMsg: string }) => {//{"errMsg":"navigateToMiniProgram:ok"}
            console.log("wx.navigateToMiniProgram success " + JSON.stringify(res));
            if (typeof (wx) == "undefined") { } else {
                wx.aldSendEvent("CPA确认跳转", { pos: pos, 游戏名称: cpbGameInfo.name, appId: cpbGameInfo.appId });
            }
            if (openCallback) {
                openCallback(icon, cpbGameInfo, true);
            }
            if (successRecord) {
                UserStorage.用户当天跳转过的CPA图标.push(cpbGameInfo.appId);
                UserStorage.flush();
                for (const moreGame2 of this.moreGame2s) {
                    moreGame2.refresh();
                }
            }
        };
        const fail = (res: { errMsg: string }) => {
            console.error("wx.navigateToMiniProgram fail " + JSON.stringify(res));
            if (openCallback) {
                openCallback(icon, cpbGameInfo, false);
            }
            if (failShowMoreGame) {
                this.showMoreGame();
            }
        };
        if (typeof (wx) == "undefined") {
            if (this.模拟打开CPB) {
                this.模拟打开CPB(cpbGameInfo, success, fail);
            }
        } else {
            wx.aldSendEvent("CPA点击", { pos: pos, 游戏名称: cpbGameInfo.name, appId: cpbGameInfo.appId });
            const args = {
                appId: cpbGameInfo.appId,
                path: cpbGameInfo.path,
                // extraData: {
                //     from: chName
                // },
                // envVersion: 'release',
                success: undefined,
                fail: undefined
            }
            console.log("navigateToMiniProgram", args);
            args.success = success;
            args.fail = fail;
            wx.navigateToMiniProgram(args);
        }
    }

    public createFeedbackButton(xywh: Array<number>): void {
        if (this.显示联系我们) {
            if (typeof (wx) == "undefined") { } else {
                if (wx.createFeedbackButton) {
                    this.feedbackButton = wx.createFeedbackButton({
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
            }
        }
    }

    public destroyFeedbackButton(): void {
        if (this.feedbackButton) {
            this.feedbackButton.destroy();
            this.feedbackButton = null;
        }
    }

    public createUserInfoButton(xywh: Array<number>, onClick: () => void): void {
        if (typeof (wx) == "undefined") { } else {
            if (this.已授权) {
                return;
            }
            if (wx.createUserInfoButton) {
                let userInfoButton: UserInfoButton = wx.createUserInfoButton({
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
                userInfoButton.onTap(res => {
                    //console.log("userInfoButton.onTap() " + JSON.stringify(res));
                    //{"errMsg":"getUserInfo:fail auth deny"}
                    //{"errMsg":"getUserInfo:ok","rawData":"{\"nickName\":\"zero\",\"gender\":1,\"language\":\"zh_CN\",\"city\":\"Chaoyang\",\"province\":\"Beijing\",\"country\":\"China\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI9voxB0SYySahwVIajEoQib2XmGEyJia2icNvBcg4QE5eAGZiaDFycYMLpr9AMdhTibTBbicxcF1CqTVog/132\"}","userInfo":{"nickName":"zero","gender":1,"language":"zh_CN","city":"Chaoyang","province":"Beijing","country":"China","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI9voxB0SYySahwVIajEoQib2XmGEyJia2icNvBcg4QE5eAGZiaDFycYMLpr9AMdhTibTBbicxcF1CqTVog/132"},"signature":"9d2f928ea1ae4be2cebc119718b690921252b69b","encryptedData":"Zp1G7gXFJL54BCgVwmJhtorNgZytkj1bCAKt4gSo0tFhIsC0T3lLsfP74FKC1Dud9PMu94GbxinhkH+o5bs3bz8rAamSVRyRRrvHwRw4kXEuhiKlH9kV8X3SZN385trf0AY8/MvI8Ozx6F9Qoowl8gz5QNG+HIjKCJPrJsNgeArgqRjuMpV/jR/ZkQGatq/Wqrx+xaf24GpCOIpzC+nOStjJ7xcBvEYNeEnoVjtaHowFab/gPqu/IkdKmtm1Pe9Fm99Jj53eTd575J8A8B2SzyRAAWydIzlfJgOx1egHOTztt3BH4rV/F/3eSSdKjy74Rz/atFY9HAeKWKlhqeKeHluy+QoRsgKvsTomqE3jlVAvN3Ysa1X41bLw5exKXjLk9VuQcEDQrV9HX5+B7zNR8uMNESVYjq918cDUcGrvVLclWmtgrbicFrAKD4mm0JJPXFrA8Q+4Gz32ZXWz7ohDIM5ta8ykRNGI46YfWDdn67A=","iv":"/kfos0HCPfJ7rylo81la3w=="}
                    if (res.userInfo) {
                        this.destroyUserInfoButtons();
                        this.initUserInfo(res.userInfo.nickName, res.userInfo.gender, res.userInfo.avatarUrl);
                        if (onClick) {
                            onClick();
                        }
                    }
                });
                if (this.userInfoButtons) { } else {
                    this.userInfoButtons = new Array();
                }
                this.userInfoButtons.push(userInfoButton);
            }
        }
    }

    private initUserInfo(_nickname: string, _gender: 0 | 1 | 2, _headImgURL: string): void {//已授权
        this.已授权 = true;
        GlobalStorage.nickname = _nickname;
        GlobalStorage.gender = _gender;
        console.log("initUserInfo nickname=" + _nickname + ", gender=" + _gender + ", headImgURL=" + _headImgURL);
        if (this.saveHead) {
            if (GlobalStorage.openId && GlobalStorage.headImgURL != _headImgURL) {
                this.post({ op: "../common/savehead2", openId: GlobalStorage.openId, headImgURL: _headImgURL }, null);
            }
        }
        GlobalStorage.headImgURL = _headImgURL;
        GlobalStorage.flush();
    }

    public destroyUserInfoButtons(): void {
        if (this.userInfoButtons) {
            for (let userInfoButton of this.userInfoButtons) {
                userInfoButton.destroy();
            }
            this.userInfoButtons.length = 0;
            this.userInfoButtons = null;
        }
    }

    public openDayGem(): void {
        if (typeof (wx) == "undefined") { } else {
            if (wx.openCustomerServiceConversation) {
                wx.openCustomerServiceConversation({
                    showMessageCard: true,
                    sendMessageImg: this.sendMessageImg,
                    sendMessagePath: "签到",
                    sendMessageTitle: "签到",
                    // sessionFrom: "客服"
                    success: (res: { path: string }) => {
                        console.log("openCustomerServiceConversation " + JSON.stringify(res));
                        //{"path":"","query":{},"errMsg":"enterContact:ok"}
                        //{"path":"签到","query":{},"errMsg":"enterContact:ok"}
                        if (res.path == "签到") {
                            let date: number = getCurrDate();
                            console.log("date========" + date + "UserStorage.signDatenum ========" + UserStorage.signDatenum2);

                            if (UserStorage.signDatenum2 >= date) {
                                toast("您已签到");
                            } else {
                                UserStorage.signDatenum2 = date;
                                UserStorage.flush();
                                if (this.showDayGemReceive) {
                                    this.showDayGemReceive();
                                }
                            }
                        }
                    },
                    // fail: res => { },
                    // complete: res => { }
                });
            }
        }
    }

    public 显示一键添加到我的小程序(): void {
        if (typeof (wx) == "undefined") { } else {
            if (wx.showFavoriteGuide) {
                wx.showFavoriteGuide({
                    type: "bar",
                    content: "一键添加到我的小程序",
                    success: (res) => {
                        console.log("一键添加到我的小程序成功，" + JSON.stringify(res));
                    },
                    fail: (res) => {
                        console.log("一键添加到我的小程序失败，" + JSON.stringify(res));
                    }
                });
            }
        }
    }

    public aldSend(key: string, value: string): void {
        if (typeof (wx) == "undefined") { } else {
            if (wx.aldSendEvent) {
                console.log("aldSend " + key + " " + value);
                wx.aldSendEvent(key, { value: value });
            }
        }
    }

    public aldSendOpenid(): void {
        if (typeof (wx) == "undefined") { } else {
            if (wx.aldSendOpenid) {
                wx.aldSendOpenid(GlobalStorage.openId);
            }
        }
    }

    public 关卡开始(stageId: string, stageName: string): void {
        this.闯关中 = true;
        this.currStageId = stageId;
        this.currStageName = stageName;
        if (typeof (wx) == "undefined") { } else {
            if (wx.aldStage && wx.aldStage.onStart) {
                wx.aldStage.onStart({
                    stageId: this.currStageId,
                    stageName: this.currStageName,
                    userId: GlobalStorage.openId
                });
            }
        }
    }
    public 关卡进行(): void {
        // wx.aldStage.onRunning({
        //     stageId: this.currStageId,
        //     stageName: this.currStageName,
        //     userId: openId,
        //     event: "tools",  //使用道具  关卡进行中，用户触发的操作    该字段必传
        //     params: {
        //         itemName: "屠龙刀",//使用道具名称 该字段必传
        //         itemCount: 1,   //使用道具数量  可选
        //         desc: "+9屠龙刀" //使用道具描述
        //     }
        // });
    }
    public 关卡结束(desc: "胜利" | "失败"): void {
        if (typeof (wx) == "undefined") { } else {
            if (wx.aldStage && wx.aldStage.onEnd) {
                wx.aldStage.onEnd({
                    stageId: this.currStageId,
                    stageName: this.currStageName,
                    userId: GlobalStorage.openId,
                    event: (desc == "胜利" ? "complete" : "fail"),
                    params: {
                        desc: desc
                    }
                });
            }
        }
    }

    public 结算完毕(): void {
        this.闯关中 = false;
        if (Fangchenmis.instance) {
            if (Fangchenmis.instance.counter2) {
                this.强制引导退出();
            }
        }
    }

    public shake(): void {
        if (typeof (wx) == "undefined") { } else {
            if (wx.vibrateShort) {
                wx.vibrateShort({
                    success: res => {
                        wx.vibrateShort({
                            success: res => {
                                wx.vibrateShort({
                                    success: res => { }
                                });
                            }
                        });
                    }
                });
            }
        }
    }

    public appsFlyerTrackEvent(eventType: string, eventValue: any): void {
        console.log("appsFlyerTrackEvent", eventType, eventValue);
    }

    public pay(sku: string, _callback: (success: boolean) => void): void {
        _callback(true);
    }

    protected getSettings(onComplete: (rsp: any) => void): void {
        this.get({ url: webRoot + "settings.json" }, onComplete);
    }

    public setRank(rankType: string, score: number): void {
        //单机
        //

        //在线
        if (this.显示世界榜) {
            this.post({ op: "setRank", openId: GlobalStorage.openId, nickname: GlobalStorage.nickname, rankType: rankType, score: score }, null);
        }
    }

    public getStore(onComplete: () => void): void {
        //单机
        //if (onComplete) onComplete({ times: 0 });

        //在线
        //console.log("UserStorage.times=" + UserStorage.times);
        if (UserStorage.times > 0) {
            this.getStoreComplete({ times: 0 }, onComplete);
        } else {
            if (this.压缩存档) {
                this.post({ op: "getStore2", openId: GlobalStorage.openId }, (rsp: { data: string }) => {
                    //console.log("getStoreComplete, onComplete=" + onComplete);
                    let code: string = rsp.data;
                    let data: { times: number } = null;
                    if (code) {
                        if (/^\s*\{/.test(code)) { } else {
                            code = pako.ungzip(base64Decode(code.replace(/ /g, "+")), { to: 'string' });
                        }
                        data = JSON.parse(code);
                    } else {
                        data = { times: 0 };
                    }
                    console.log(data);
                    if (data.times > 0) { } else {
                        //this.aldSend("玩家统计2", GlobalStorage.openId + " 用户注册");
                    }
                    this.getStoreComplete(data, onComplete);
                });
            } else {
                this.post({ op: "getStore", openId: GlobalStorage.openId }, (data: { times: number }) => {
                    //console.log("getStoreComplete, onComplete=" + onComplete);
                    if (data.times > 0) { } else {
                        //this.aldSend("玩家统计2", GlobalStorage.openId + " 用户注册");
                    }
                    this.getStoreComplete(data, onComplete);
                });
            }
        }
    }

    protected getStoreComplete(data: { times: number }, onComplete: () => void): void {

        this.onlineStore = data;
        UserStorage.update(this.onlineStore);

        DatasManager.误触白名单1.push(12345);
        DatasManager.误触白名单2.push(12345);
        const f = () => {
            if (DatasManager.误触关 || UserStorage.误触黑4) {
                DatasManager.胜利宝箱点击完毕出现Banner = [0];
            }

            DatasManager.分享白名单.push(12345);
            if (DatasManager.分享关 || DatasManager.分享白名单.indexOf(UserStorage.首次进入游戏的场景值4) == -1) {
                this.强制显示视频 = true;
            }

            const f = () => {
                //DatasManager.CPA黑名单.push(666);
                if (DatasManager.CPA关 || DatasManager.CPA黑名单.indexOf(UserStorage.首次进入游戏的场景值4) > -1) {
                    this.cpaConfig = null;
                }
                if (onComplete) onComplete();
            }

            if (this.cpaConfigURL1 && this.cpaConfigURL2) {
                this.loadCPA12(f);
            } else {
                f();
            }
        };

        if (platformType == "微信小游戏") {
            if (DatasManager.梦嘉防封策略接口) {
                UserStorage.误触黑4 = false;
                let isFirst: 0 | 1;
                if (UserStorage.首次进入游戏的场景值4 > -2) {
                    isFirst = 0;
                } else {
                    isFirst = 1;
                    UserStorage.首次进入游戏的场景值4 = this.launchScene;
                    UserStorage.首次进入游戏的路径4 = Object.keys(this.launchQuery).join(",");
                }
                const req = {
                    originType: DatasManager.梦嘉防封策略代码编号,//来源由发行提供的代码编号
                    path: Object.keys(this.launchQuery).join(","),//本次访问路径
                    sceneId: this.launchScene,//本次访问场景值
                    isFirst: isFirst,//是否首次登陆(1:首次 0：非首次)
                    firstPath: UserStorage.首次进入游戏的路径4 //首次访问路径
                };
                console.log(
                    "post " + DatasManager.梦嘉防封策略接口 + "\n" +
                    JSON.stringify(req)
                );
                wx.request({
                    url: DatasManager.梦嘉防封策略接口,
                    method: "POST",
                    header: {
                        "Content-Type": "application/json"
                    },
                    data: req,
                    success: (rsp: { data: 0 | 1 }) => {
                        console.log("post " + DatasManager.梦嘉防封策略接口 + " 成功！");
                        if (rsp && rsp.data == 1) {
                            console.log(1);
                            this.launchScene = 12345;
                        } else {
                            console.log(0);
                            UserStorage.误触黑4 = true;
                        }
                        f();
                    }, fail: () => {
                        console.error("post " + DatasManager.梦嘉防封策略接口 + " 失败！");
                        f();
                    }
                });
            } else {
                if (UserStorage.首次进入游戏的场景值4 > -2) {
                    if (DatasManager.误触白名单2.indexOf(this.launchScene) > -1) { } else {
                        console.log("2 " + this.launchScene);
                        UserStorage.误触黑4 = true;
                    }
                } else {
                    UserStorage.首次进入游戏的场景值4 = this.launchScene;
                    if (DatasManager.误触白名单1.indexOf(this.launchScene) > -1 && (this.launchQuery && this.launchQuery.wxgamecid)) { } else {
                        console.log("1 " + this.launchScene);
                        UserStorage.误触黑4 = true;
                    }
                }
                f();
            }
        } else {
            DatasManager.误触关 = true;
            f();
        }
        UserStorage.flush();
    }

    public setStore(): void {
        //单机
        //

        //在线
        const time = new Date().getTime();
        console.log("setStore " + (time - this.lastSetStoreTime));
        if (time - this.lastSetStoreTime > 60 * 1000) {
            this.lastSetStoreTime = time;
            let code: string = UserStorage.toJSONCode();
            if (this.压缩存档) {
                code = base64Encode(pako.gzip(code, { to: 'string' }));
            }
            this.post({ op: "setStore", openId: GlobalStorage.openId, nickname: GlobalStorage.nickname, data: code }, null);
        }
    }

    public deleteStore(onComplete: () => void): void {
        //单机
        //if (onComplete) onComplete();

        //在线
        this.post({ op: "deleteStore", openId: GlobalStorage.openId }, onComplete);
    }

    public getRanks(limit: number, onComplete: (rsp: RankDatas) => void): void {
        //单机
        //if (onComplete) onComplete({ "ranks": [{ "openId": "odMRK5LJmZf8wbRMBepmdPyYOyPg", "nickname": "Yuki", "score": 2927 }, { "openId": "odMRK5PJZtTk0Xe44xlGyxq30R0o", "nickname": "何一东", "score": 2802 }, { "openId": "odMRK5FiQGpDbiZH6PBJcUVH8-Z8", "nickname": "心想事成", "score": 2700 }, { "openId": "odMRK5AXNYjFwAj_z2n1mW0_-hpc", "nickname": "路ren~甲", "score": 2660 }, { "openId": "odMRK5Fw-uJGVsV3R_YX9Euid3RY", "nickname": "吴阳康", "score": 2247 }, { "openId": "odMRK5LAo8lQXyfXg-HX5o4Svc5g", "nickname": "এ陌ོ诺ꦿ水℘寒", "score": 2145 }, { "openId": "odMRK5GuLRFiJ0sXvK6MTNtst8jU", "nickname": "发发发", "score": 2124 }, { "openId": "odMRK5GU_tDFTGJQqgo7uCf-3XcQ", "nickname": "11凡", "score": 2116 }, { "openId": "odMRK5LKRxzhDXbuRJsgZiFwpiY4", "nickname": "枫菱", "score": 2100 }, { "openId": "odMRK5ACks0xviudX11C3QwLJ7SQ", "nickname": "杭州冠宇展柜13003665577", "score": 2083 }, { "openId": "odMRK5JEWPQ2HutjWsKzwqXQCjMs", "nickname": "", "score": 2053 }, { "openId": "user1559980187000", "nickname": "专业做趣步", "score": 1984 }, { "openId": "odMRK5NFAKcTrrNfPOTRFF5k_Mm4", "nickname": "赵海洋", "score": 1960 }, { "openId": "odMRK5DNVOyXgXx4PJy9DKrdXzL4", "nickname": "生如夏花", "score": 1928 }, { "openId": "odMRK5E5KVZ0tMARuab-Ha0_gR7U", "nickname": "DAVIDA", "score": 1870 }, { "openId": "odMRK5D_AdUzTSTFoer5f-Qhjt1E", "nickname": "", "score": 1837 }, { "openId": "odMRK5IDADlGkcChc8qfovjZHFi4", "nickname": "次", "score": 1736 }, { "openId": "odMRK5DrckTvB1sMAiTQZzGuP3q0", "nickname": "", "score": 1670 }, { "openId": "odMRK5GM7D7ALFrkxnufy5PEiICQ", "nickname": "", "score": 1578 }, { "openId": "odMRK5FmtWzqDqJ8KAIyBo_hZS20", "nickname": "奇奇", "score": 1529 }, { "openId": "odMRK5CmWf1oSpXc2NYbVhW1VGUg", "nickname": "", "score": 1518 }, { "openId": "odMRK5MHGZy2QtwNkp8ql7yjK4Uo", "nickname": "", "score": 1493 }, { "openId": "odMRK5FoDhRYz7LQAnm6E09kat3Y", "nickname": "丿灬你?武哥哥、、、", "score": 1444 }, { "openId": "odMRK5G-Y2s0Cac7MXrloRHedTJI", "nickname": "贺灿", "score": 1436 }, { "openId": "odMRK5MvRUcZUwxacX1DxdnUg2Xw", "nickname": "", "score": 1406 }, { "openId": "odMRK5FlDdvsimbz-42ALv2njVVk", "nickname": "海军", "score": 1380 }, { "openId": "odMRK5KYQlrOhaBIJJHWwL37aDp4", "nickname": "求知寻行", "score": 1379 }, { "openId": "odMRK5OMRSlPPIXn7arPvGXU14Bs", "nickname": "? 风轻云淡?", "score": 1357 }, { "openId": "odMRK5PfkHSisd3-GKqoW_BqfLkE", "nickname": "家有宝贝", "score": 1346 }, { "openId": "odMRK5HQgco2niN2pNQWZlQ6dD6s", "nickname": "", "score": 1343 }, { "openId": "odMRK5Na3ef9mAklqaiQ0nvRe6Lk", "nickname": "", "score": 1335 }, { "openId": "odMRK5C6ejp_z1kyNObFpF1J0pXk", "nickname": "Star丶优秀", "score": 1319 }, { "openId": "odMRK5ObVoFTDx-SQxvWylhSlKb8", "nickname": "一切都是为了生活。", "score": 1302 }, { "openId": "odMRK5PlO7wdL1hIFKPs7pGOuNrw", "nickname": "贵阳新生活装饰 任炯富", "score": 1297 }, { "openId": "odMRK5O1XHaO_Dr68bMpVSLN64qI", "nickname": "", "score": 1280 }, { "openId": "odMRK5OmrkvjdoK2zGHXD1zP-Jy8", "nickname": "兰", "score": 1280 }, { "openId": "odMRK5Ck9OqLc86LpRLDDQQcan-M", "nickname": "邹京晨", "score": 1278 }, { "openId": "odMRK5EArSWi0Q2VYEYrIc9KSwxk", "nickname": "bboy", "score": 1271 }, { "openId": "odMRK5Kz8gJHoK746XtKb4cpuoVs", "nickname": "安娜", "score": 1242 }, { "openId": "odMRK5P9xjL6ctQecG4RVAGkd40U", "nickname": "", "score": 1224 }, { "openId": "odMRK5GWXD_W0MeOecnxVEpo_pTM", "nickname": "痞子绅士", "score": 1211 }, { "openId": "odMRK5AfM3krWYrxq5Av-0Ytxb9Y", "nickname": "", "score": 1199 }, { "openId": "odMRK5BIlJzUzRdMIA8ejPWDuZcU", "nickname": "", "score": 1171 }, { "openId": "odMRK5FYCvR1L_XdEgNEbIqattc8", "nickname": "?", "score": 1167 }, { "openId": "odMRK5A80M2F9yT02qZms2_rFuaE", "nickname": "tarantella", "score": 1165 }, { "openId": "odMRK5NO3szRtilP6QZuIvxJBPqE", "nickname": "", "score": 1160 }, { "openId": "odMRK5J_Hp6n-4w0O7Xf1VCx-3s0", "nickname": "つ微凉徒眸意浅挚半", "score": 1159 }, { "openId": "odMRK5EvOsLdkysU_9lQbNW2W9D0", "nickname": "", "score": 1150 }, { "openId": "odMRK5HkfM-IEL-pqynPiF52OCs0", "nickname": "日勒子体", "score": 1144 }, { "openId": "odMRK5BOWetzAwyo6QG1EI7VOiPU", "nickname": "", "score": 1141 }, { "openId": "odMRK5LJP8zO7QknBI3q5MQZs6SY", "nickname": "", "score": 1139 }, { "openId": "odMRK5Nvz2_ExGRolOEv0rupReAs", "nickname": "公众号&小程序&网站&APP开发代运营", "score": 1134 }, { "openId": "odMRK5IyqnwtTPDCwj9dKQ7TqZzQ", "nickname": "", "score": 1130 }, { "openId": "odMRK5DxNbP4_zF3JyIaiiAe4yu8", "nickname": "환환 사랑해요", "score": 1128 }, { "openId": "odMRK5APrIw6VN4VcGmS6JGh63tE", "nickname": "N", "score": 1124 }, { "openId": "odMRK5FhBx8qDXLxR6Af_H2HEccQ", "nickname": "", "score": 1109 }, { "openId": "odMRK5Dvo8UmnTg8_8wdS-wckoOM", "nickname": "A冷兵器，掌柜", "score": 1104 }, { "openId": "odMRK5FB0II7Nz7Pq4-xEsuMUfRk", "nickname": "大苍蝇", "score": 1085 }, { "openId": "odMRK5KfsIKSvh7zGyrVZb02uxnE", "nickname": "红", "score": 1078 }, { "openId": "odMRK5BamLRo-nz8FvdOyRw45NFo", "nickname": "", "score": 1075 }, { "openId": "odMRK5Ibgj3fvRR46P4aQO5GAwJk", "nickname": "听风", "score": 1061 }, { "openId": "odMRK5KfECiu2lyGJXi0In3VuNVE", "nickname": "老王?", "score": 1054 }, { "openId": "odMRK5BbJnjf16qXzUWaJXnkr9VU", "nickname": "红梅", "score": 1054 }, { "openId": "odMRK5LRtwldsHqQdOvPGtWDkcpI", "nickname": "", "score": 1052 }, { "openId": "odMRK5DahzFSf8_l-devD-MUAp5c", "nickname": "", "score": 1048 }, { "openId": "odMRK5PIU01oBvHBAXO8GO9Xdm_8", "nickname": "", "score": 1047 }, { "openId": "odMRK5GhMnFnfpwtJAj1rIEnf5w4", "nickname": "不忘初心", "score": 1038 }, { "openId": "odMRK5M58y7NcJH5eWIT7QYF4efU", "nickname": "逍遥", "score": 1032 }, { "openId": "odMRK5FwUGIxy-07_jX4q5dYBidY", "nickname": "小燕子", "score": 1027 }, { "openId": "odMRK5E7KCXmNcYf_6IYGcJhEkrE", "nickname": "", "score": 1026 }, { "openId": "odMRK5PixvaFVLoHd2j4HNrPFIRk", "nickname": "", "score": 1026 }, { "openId": "odMRK5PfPMdN3bH7gnUdrEN1C0_I", "nickname": "山哥", "score": 1014 }, { "openId": "odMRK5Fz22hjoR9ukTmH3QqusMq0", "nickname": "", "score": 1003 }, { "openId": "C2B9750F1769E7C4FB2AADE3E5CB36B4", "nickname": "", "score": 1001 }, { "openId": "odMRK5AjINWczeeUL_UlSO5D4YMs", "nickname": "", "score": 1001 }, { "openId": "odMRK5HaGiVcPME7fxi0k3U2BoVc", "nickname": "认识是缘", "score": 998 }, { "openId": "odMRK5ANo5nMiRwshxlJzCuM4bhs", "nickname": "", "score": 989 }, { "openId": "odMRK5A_0fNElL7SULaXDoFi2r60", "nickname": "H", "score": 986 }, { "openId": "odMRK5MuzAwZpqxaBgNb_xK59wjg", "nickname": "", "score": 986 }, { "openId": "odMRK5FvwKGRp2eqyGM9Kh7DQdS4", "nickname": "当年", "score": 984 }, { "openId": "odMRK5JisPANfF_5oZQCrjTD-S-k", "nickname": "雨天的尾巴", "score": 977 }, { "openId": "odMRK5ElVX5PO8LDj7Rph3PkUStU", "nickname": "十一丶", "score": 975 }, { "openId": "odMRK5ENcRJe63PccNUf21WpC8sA", "nickname": "良友", "score": 955 }, { "openId": "odMRK5ICCeoK6KUoQFiFx0IcWZe4", "nickname": "乐兔", "score": 951 }, { "openId": "odMRK5DtiCCDk8F3ro_BUUQ_MUhQ", "nickname": "流氓也会萌萌哒", "score": 944 }, { "openId": "odMRK5M7h07nSuEhZA8vxPY_izmA", "nickname": "", "score": 940 }, { "openId": "odMRK5K16UhMFdciBC7Nb5FBO_cE", "nickname": "皮皮虾", "score": 934 }, { "openId": "odMRK5HujBHrJnzi0ePrBbVcPZLs", "nickname": "李敏", "score": 934 }, { "openId": "odMRK5K32q_VMjNI8723Oj_8JZZ4", "nickname": "寒", "score": 928 }, { "openId": "odMRK5HAoKjOPhtt5qWHykI-rbCE", "nickname": "诚信", "score": 927 }, { "openId": "odMRK5FAqlv2FRRzH3PgDTsu3UTg", "nickname": "", "score": 927 }, { "openId": "odMRK5NNOchg3aDFko4nRjgD3et0", "nickname": "", "score": 925 }, { "openId": "odMRK5BgOno2GFlZ8W_s-qXSJ5_c", "nickname": "", "score": 914 }, { "openId": "odMRK5EzLr9cRMqtzUemBh3ePrGY", "nickname": "", "score": 909 }, { "openId": "odMRK5DHZghTTD7utCF2shgUVtJQ", "nickname": "", "score": 903 }, { "openId": "odMRK5Ln_Krmyfypn8LII1Vxk8F4", "nickname": "暴走魔哥", "score": 901 }, { "openId": "odMRK5E6mC_yIj2sCfFfLT7RIpAQ", "nickname": "", "score": 885 }, { "openId": "odMRK5MBVHyoHKl-lZ4-IXzaKnkQ", "nickname": "辉", "score": 885 }, { "openId": "odMRK5OyXCd4rL08-fyzasQQS_Zg", "nickname": "Lv", "score": 882 }, { "openId": "odMRK5IPeTS0aKe5YBP4H4UrKCBo", "nickname": "", "score": 877 }] });

        //在线
        this.post({ op: "getRanks", openId: GlobalStorage.openId, limit: limit }, (rsp: RankDatas) => {
            if (rsp.ranks && rsp.ranks.indexOf && rsp.ranks.push) { } else {
                rsp.ranks = new Array();
            }
            if (rsp.friends) {
                if (rsp.friends.vs && rsp.friends.vs.indexOf && rsp.friends.vs.push) { } else {
                    rsp.friends.vs = new Array();
                }
                if (rsp.friends.fast1 && rsp.friends.fast1.indexOf && rsp.friends.fast1.push) { } else {
                    rsp.friends.fast1 = new Array();
                }
                if (rsp.friends.fast2 && rsp.friends.fast2.indexOf && rsp.friends.fast2.push) { } else {
                    rsp.friends.fast2 = new Array();
                }
                if (rsp.friends.fast3 && rsp.friends.fast3.indexOf && rsp.friends.fast3.push) { } else {
                    rsp.friends.fast3 = new Array();
                }
                if (rsp.friends.kill && rsp.friends.kill.indexOf && rsp.friends.kill.push) { } else {
                    rsp.friends.kill = new Array();
                }
            }
            onComplete(rsp);
        });
    }

    public getInviteList(onComplete: (rsp: { yaoqingNum: number, openIds: Array<string> }) => void): void {
        //单机
        //if (onComplete) onComplete({ "yaoqingNum": 0, "openIds": [] });

        //在线
        this.post({ op: "getInviteList", openId: GlobalStorage.openId }, (rsp: { yaoqingNum: number, openIds: Array<string>, AdLevel: number }) => {
            if (rsp.openIds && rsp.openIds.indexOf && rsp.openIds.push) { } else {
                rsp.openIds = new Array();
            }

            if ("AdLevel" in rsp) {
                if (DatasManager["分享机制" + rsp.AdLevel]) { } else {
                    rsp.AdLevel = 0;
                }
                let date: number = getCurrDate();
                if (UserStorage.分享Date >= date) { } else {
                    UserStorage.分享Date = date;
                    UserStorage.分享Index = 0;
                }
                DatasManager.打分档次 = rsp.AdLevel;
                DatasManager.分享机制 = DatasManager["分享机制" + rsp.AdLevel] || DatasManager.分享机制0;
                UserStorage.分享Index = 0;
                UserStorage.flush();
            }
            console.log("b" + rsp.AdLevel + "=" + DatasManager.分享机制);

            onComplete(rsp);
        });
    }

    public invite(邀请者的openId: string): void {
        //单机
        //

        //在线
        this.post({ op: "invite", openId: GlobalStorage.openId, friendOpenId: 邀请者的openId }, null);
    }

    public getGift(code: string, onComplete: (rsp: { info: string, message: string }) => void): void {
        this.post({ op: "getGift", openId: GlobalStorage.openId, nickname: GlobalStorage.nickname, code: code }, onComplete);
    }

    public getVS(vss: Array<number>, onComplete: (rsp: Array<User>) => void): void {
        this.post({ op: "getVS", openId: GlobalStorage.openId, vss: vss.toString() }, onComplete);
    }

    public vsWin(vsOpenId: string, vss: Array<number>, onComplete: (rsp: Array<User>) => void): void {
        this.post({ op: "vsWin", openId: GlobalStorage.openId, vsOpenId: vsOpenId, vss: vss.toString() }, onComplete);
    }

    public vsWin2(vsOpenId: string, vsScore: number): void {
        this.post({ op: "vsWin2", openId: GlobalStorage.openId, vsOpenId: vsOpenId, vsScore: vsScore }, null);
    }

    public abstract get(req: Req, onComplete: (rsp: any) => void): void;

    public abstract post(req: Req, onComplete: (rsp: any) => void): void;

    public unzip1(upzipTextComplete: (file: string, text: string) => void): void {
        this.jszipUnzip1(upzipTextComplete);
    }

    private jszipUnzip1(upzipTextComplete: (file: string, text: string) => void): void {
        console.log("使用 JSZip 解压");
        loadZip1(zipData => {
            JSZip.loadAsync(zipData).then(zip => {
                //console.log("JSZip 解压成功");
                for (let file of this.zip1Files) {
                    this.jszipUnzipText(zip, file, upzipTextComplete);
                }
            }).catch(() => {
                console.log("下载压缩包失败，请重启游戏");
            });
        });
    }
    private jszipUnzipText(zip: JSZip, file: string, upzipTextComplete: (file: string, text: string) => void): void {
        zip.file(file).async("text").then(text => {
            console.log("JSZip 解压：" + file);
            upzipTextComplete(file, text);
        });
    }

    protected fsUnzip1(upzipTextComplete: (file: string, text: string) => void): void {
        console.log("使用 wx fs 解压");

        const fs = wx.getFileSystemManager();
        const unzipDirPath: string = wx["env"].USER_DATA_PATH + "/1zip/";

        const zip1Path = "/" + getZip1Path();
        console.log("zip1Path=" + zip1Path);
        let unzip = () => {
            fs.unzip({
                zipFilePath: zip1Path,
                targetPath: unzipDirPath,
                success: (res: { errMsg: string }) => {
                    //console.log("解压成功 " + JSON.stringify(res));
                    for (let file of this.zip1Files) {
                        console.log("wx fs 解压：" + file);
                        upzipTextComplete(file, fs.readFileSync(unzipDirPath + file, "utf8") as string);
                    }
                },
                fail: (res: { errMsg: string }) => { console.error("解压失败 " + JSON.stringify(res)); }
            });
        }

        fs.access({
            path: unzipDirPath,
            success: () => {
                console.log("目录已存在：" + unzipDirPath);
                unzip();
            },
            fail: () => {
                console.log("创建目录：" + unzipDirPath);
                fs.mkdir({
                    dirPath: unzipDirPath,
                    //recursive: true,
                    success: (res: { errMsg: string }) => {
                        console.log("创建目录成功 " + JSON.stringify(res));
                        unzip();
                    },
                    fail: (res: { errMsg: string }) => {
                        console.error("创建目录失败 " + JSON.stringify(res));
                    }
                });
            }
        });

    }

}

//#region md5
/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global define */

/* eslint-disable strict */


/**
 * Calculates MD5 value for a given string.
 * If a key is provided, calculates the HMAC-MD5 value.
 * Returns a Hex encoded string unless the raw argument is given.
 *
 * @param {string} string Input string
 * @param {string} [key] HMAC key
 * @param {boolean} [raw] Raw output switch
 * @returns {string} MD5 output
 */
function md5(string, key?, raw?) {
    if (!key) {
        if (!raw) {
            return hexMD5(string)
        }
        return rawMD5(string)
    }
    if (!raw) {
        return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)



    /**
     * Add integers, wrapping at 2^32.
     * This uses 16-bit operations internally to work around bugs in interpreters.
     *
     * @param {number} x First integer
     * @param {number} y Second integer
     * @returns {number} Sum
     */
    function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff)
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xffff)
    }

    /**
     * Bitwise rotate a 32-bit number to the left.
     *
     * @param {number} num 32-bit number
     * @param {number} cnt Rotation count
     * @returns {number} Rotated number
     */
    function bitRotateLeft(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
    }

    /**
     * Basic operation the algorithm uses.
     *
     * @param {number} q q
     * @param {number} a a
     * @param {number} b b
     * @param {number} x x
     * @param {number} s s
     * @param {number} t t
     * @returns {number} Result
     */
    function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
    }
    /**
     * Basic operation the algorithm uses.
     *
     * @param {number} a a
     * @param {number} b b
     * @param {number} c c
     * @param {number} d d
     * @param {number} x x
     * @param {number} s s
     * @param {number} t t
     * @returns {number} Result
     */
    function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | (~b & d), a, b, x, s, t)
    }
    /**
     * Basic operation the algorithm uses.
     *
     * @param {number} a a
     * @param {number} b b
     * @param {number} c c
     * @param {number} d d
     * @param {number} x x
     * @param {number} s s
     * @param {number} t t
     * @returns {number} Result
     */
    function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
    }
    /**
     * Basic operation the algorithm uses.
     *
     * @param {number} a a
     * @param {number} b b
     * @param {number} c c
     * @param {number} d d
     * @param {number} x x
     * @param {number} s s
     * @param {number} t t
     * @returns {number} Result
     */
    function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t)
    }
    /**
     * Basic operation the algorithm uses.
     *
     * @param {number} a a
     * @param {number} b b
     * @param {number} c c
     * @param {number} d d
     * @param {number} x x
     * @param {number} s s
     * @param {number} t t
     * @returns {number} Result
     */
    function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t)
    }

    /**
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     *
     * @param {Array} x Array of little-endian words
     * @param {number} len Bit length
     * @returns {Array<number>} MD5 Array
     */
    function binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << len % 32
        x[(((len + 64) >>> 9) << 4) + 14] = len

        var i
        var olda
        var oldb
        var oldc
        var oldd
        var a = 1732584193
        var b = -271733879
        var c = -1732584194
        var d = 271733878

        for (i = 0; i < x.length; i += 16) {
            olda = a
            oldb = b
            oldc = c
            oldd = d

            a = md5ff(a, b, c, d, x[i], 7, -680876936)
            d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
            c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
            b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
            a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
            d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
            c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
            b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
            a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
            d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
            c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
            b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
            a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
            d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
            c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
            b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

            a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
            d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
            c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
            b = md5gg(b, c, d, a, x[i], 20, -373897302)
            a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
            d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
            c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
            b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
            a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
            d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
            c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
            b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
            a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
            d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
            c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
            b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

            a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
            d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
            c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
            b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
            a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
            d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
            c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
            b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
            a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
            d = md5hh(d, a, b, c, x[i], 11, -358537222)
            c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
            b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
            a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
            d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
            c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
            b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

            a = md5ii(a, b, c, d, x[i], 6, -198630844)
            d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
            c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
            b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
            a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
            d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
            c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
            b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
            a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
            d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
            c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
            b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
            a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
            d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
            c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
            b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

            a = safeAdd(a, olda)
            b = safeAdd(b, oldb)
            c = safeAdd(c, oldc)
            d = safeAdd(d, oldd)
        }
        return [a, b, c, d]
    }

    /**
     * Convert an array of little-endian words to a string
     *
     * @param {Array<number>} input MD5 Array
     * @returns {string} MD5 string
     */
    function binl2rstr(input) {
        var i
        var output = ''
        var length32 = input.length * 32
        for (i = 0; i < length32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff)
        }
        return output
    }

    /**
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     *
     * @param {string} input Raw input string
     * @returns {Array<number>} Array of little-endian words
     */
    function rstr2binl(input) {
        var i
        var output = []
        output[(input.length >> 2) - 1] = undefined
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0
        }
        var length8 = input.length * 8
        for (i = 0; i < length8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32
        }
        return output
    }

    /**
     * Calculate the MD5 of a raw string
     *
     * @param {string} s Input string
     * @returns {string} Raw MD5 string
     */
    function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
    }

    /**
     * Calculates the HMAC-MD5 of a key and some data (raw strings)
     *
     * @param {string} key HMAC key
     * @param {string} data Raw input string
     * @returns {string} Raw MD5 string
     */
    function rstrHMACMD5(key, data) {
        var i
        var bkey = rstr2binl(key)
        var ipad = []
        var opad = []
        var hash
        ipad[15] = opad[15] = undefined
        if (bkey.length > 16) {
            bkey = binlMD5(bkey, key.length * 8)
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636
            opad[i] = bkey[i] ^ 0x5c5c5c5c
        }
        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
    }

    /**
     * Convert a raw string to a hex string
     *
     * @param {string} input Raw input string
     * @returns {string} Hex encoded string
     */
    function rstr2hex(input) {
        var hexTab = '0123456789abcdef'
        var output = ''
        var x
        var i
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i)
            output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
        }
        return output
    }

    /**
     * Encode a string as UTF-8
     *
     * @param {string} input Input string
     * @returns {string} UTF8 string
     */
    function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input))
    }

    /**
     * Encodes input string as raw MD5 string
     *
     * @param {string} s Input string
     * @returns {string} Raw MD5 string
     */
    function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s))
    }
    /**
     * Encodes input string as Hex encoded string
     *
     * @param {string} s Input string
     * @returns {string} Hex encoded string
     */
    function hexMD5(s) {
        return rstr2hex(rawMD5(s))
    }
    /**
     * Calculates the raw HMAC-MD5 for the given key and data
     *
     * @param {string} k HMAC key
     * @param {string} d Input string
     * @returns {string} Raw MD5 string
     */
    function rawHMACMD5(k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
    }
    /**
     * Calculates the Hex encoded HMAC-MD5 for the given key and data
     *
     * @param {string} k HMAC key
     * @param {string} d Input string
     * @returns {string} Raw MD5 string
     */
    function hexHMACMD5(k, d) {
        return rstr2hex(rawHMACMD5(k, d))
    }
}
//#endregion
