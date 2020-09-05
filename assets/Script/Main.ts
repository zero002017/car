import { DatasManager } from "./datas/DatasManager";
import Menu from "./pages/Menu";
import Page from "./pages/Page";
import TestEffects from "./pages/TestEffects";
import Loading from "./pages/Loading";
import { sps } from "./zero/sps";
import { GlobalStorage } from "./zero/GlobalStorage";
import { popups } from "./popups/Popups";
import { platformCtrl, maxWid, wid0, OpenDataContexts, hei0, frameRate, useCDN } from "./zero/global";
import { Sounds } from "./zero/Sounds";
import Moneys from "./ui/Moneys";
import BottomCPBs from "./ui/BottomCPBs";
import { UserStorage } from "./zero/UserStorage";
import { gongshis } from "./zero/Gongshi";
import { AVM1 } from "./zero/AVM1";
import Start from "./pages/Start";
import Prefabs, { prefabs } from "./ui/Prefabs";
import MoreGame2 from "./ui/MoreGame2";
import InsertCPB from "./popups/InsertCPB";
import { Atlas } from "./zero/Atlas";
import 开始CPB from "./ui/开始CPB";
import Delays from "./zero/Delays";
import EnterFrames from "./zero/EnterFrames";

const { ccclass, property } = cc._decorator;

export let main: Main;
export let stageWid: number;
export let swid: number;
export let 疑似iPad矮胖型屏幕: boolean;

export let yaoqingData: { yaoqingNum: number, openIds: Array<string> };

@ccclass
export default class Main extends cc.Component {

    public delays: Delays;
    public enterFrames: EnterFrames;

    public pages: cc.Node;
    public loading: Loading;
    private start_: Start;
    public menu: Menu;
    private testEffects: TestEffects;
    private cpbIcons_showing: boolean;
    public cpbIcons: cc.Node;
    public startCPB: 开始CPB;
    public moreGame2: MoreGame2;
    public insertCPB: InsertCPB;
    public moneys: Moneys;
    public moneysIsUp: boolean;
    public bottomCPBs: BottomCPBs;
    private tryToShowBannerAd: boolean;
    public disable: cc.Node;
    public debug: cc.Node;

    public currPage: Page;

    private platformCtrlIsInitComplete: boolean;
    private soundsIsInit: boolean;
    private prefabsIsInit: boolean;
    private datasIsInit: boolean;
    private spsIsInit: boolean;

    protected start(): void {

        main = this;

        main.delays = new Delays();
        main.enterFrames = new EnterFrames();

        window["DatasManager"] = DatasManager;
        window["platformCtrl"] = platformCtrl;
        window["GlobalStorage"] = GlobalStorage;
        window["UserStorage"] = UserStorage;
        window["main"] = main;
        window["sps"] = sps;
        window["Atlas"] = Atlas;
        window["Sounds"] = Sounds;
        window["prefabs"] = prefabs;

        console.log(platformCtrl.screenWidth + "x" + platformCtrl.screenHeight);
        if (platformCtrl.screenWidth / platformCtrl.screenHeight < wid0 / hei0) {
            main.node.getComponent(cc.Canvas).fitHeight = false;
            main.node.getComponent(cc.Canvas).fitWidth = true;
            疑似iPad矮胖型屏幕 = true;
        }

        stageWid = cc.winSize.width;
        swid = Math.min(maxWid, stageWid);
        console.log("stageWid=" + stageWid, "swid=" + swid);
        platformCtrl.横幅左边间距 = (stageWid - swid) / 2;

        main.pages = main.node.getChildByName("pages");

        main.loading = main.pages.getChildByName("loading").getComponent(Loading);
        main.loading.init();
        main.loading.onLoadComplete = () => {
            main.moreGame2 = main.node.getChildByName("moreGame2").getComponent(MoreGame2);
            main.moreGame2.init();
            main.go();
        };

        main.cpbIcons = main.node.getChildByName("cpbIcons");
        main.startCPB = main.node.getChildByName("startCPB").getComponent(开始CPB);

        main.currPage = main.loading;
        main.currPage.node.active = true;
        main.currPage.show();
        main.currPage.showComplete();

        main.platformCtrlIsInitComplete = false;
        main.soundsIsInit = false;
        main.prefabsIsInit = false;
        main.datasIsInit = false;
        main.spsIsInit = false;

        platformCtrl.init(() => {
            main.loadSubpackagesComplete();
        }, () => {
            main.platformCtrlInitComplete();
        });

    }

    protected update(dt: number): void {
        main.delays.step(1 / frameRate);
        main.enterFrames.step();
    }

    private loadSubpackagesComplete(): void {
        main.loading.addProgress(10);
        if (useCDN) {
            window["loadCDN"](() => {
                this.initRes();
            });
        } else {
            this.initRes();
        }
    }

    private initRes(): void {
        main.loading.addProgress(10);

        Atlas.init(main.node.getChildByName("atlas"), {});

        prefabs.init(main.node.getChildByName("prefabs").getComponent(Prefabs).prefabs);
        main.prefabsIsInit = true;
        main.loading.addProgress(5);
        main.check("prefabsIsInit");

        //console.log("1 cc.resources", cc.resources);//1 cc.resources undefined
        cc.assetManager.loadBundle("resources", (error, bundle: cc.AssetManager.Bundle) => {
            //console.log("2 cc.resources", cc.resources);//2 cc.resources _ {_config: o}
            bundle.loadDir("sounds/", cc.AudioClip, (error, audioClips: Array<cc.AudioClip>) => {
                //console.log("sounds/", audioClips);
                Sounds.init(audioClips);
                main.soundsIsInit = true;
                main.loading.addProgress(5);
                main.check("soundsIsInit");
            });
            if (window["useZip"]) { } else {
                window["useZip"] = false;
            }
            //window["useZip"] = true;
            console.log("useZip=" + window["useZip"]);
            if (window["useZip"]) {
                platformCtrl.unzip1((file, text) => {
                    switch (file) {
                        case "datas/datas.json":
                            DatasManager.Init(text);
                            main.datasIsInit = true;
                            main.loading.addProgress(10);
                            main.check("datasIsInit");
                            break;
                        case "sps/jsons.json":
                            sps.init(text, () => {
                                main.spsIsInit = true;
                                main.loading.addProgress(10);
                                main.check("spsIsInit");
                            });
                            break;
                        default:
                            console.error("未处理的 file：" + file);
                            break;
                    }
                });
            } else {
                cc.resources.load("datas", (error, asset: cc.JsonAsset) => {
                    DatasManager.Init(asset.json);
                    cc.resources.release("datas");
                    main.datasIsInit = true;
                    main.loading.addProgress(10);
                    main.check("datasIsInit");
                });
                cc.resources.load("sps/jsons", (error, jsons: cc.TextAsset) => {
                    sps.init(jsons.text, () => {
                        main.spsIsInit = true;
                        main.loading.addProgress(10);
                        main.check("spsIsInit");
                    });
                    cc.resources.release("sps/jsons");
                });
            }
        });
    }

    private platformCtrlInitComplete(): void {
        if (platformCtrl.显示好友助力) {
            platformCtrl.getInviteList((rsp: { yaoqingNum: number, openIds: Array<string> }) => {
                yaoqingData = rsp;
            });
        }
        main.platformCtrlIsInitComplete = true;
        main.loading.addProgress(40);
        //main.checkAddDebugTxt();
        main.check("platformCtrlInitComplete");
    }

    private check(info: string): void {
        console.log(`check ${info} ${main.platformCtrlIsInitComplete} ${main.soundsIsInit} ${main.prefabsIsInit} ${main.datasIsInit} ${main.spsIsInit} openId=${GlobalStorage.openId}`);
        if (
            main.platformCtrlIsInitComplete &&
            main.soundsIsInit &&
            main.prefabsIsInit &&
            main.datasIsInit &&
            main.spsIsInit &&
            GlobalStorage.openId
        ) {
            platformCtrl.init2(() => {
                main.platformCtrlInit2Complete();
            });
        }
    }

    private platformCtrlInit2Complete(): void {

        gongshis.init();

        main.start_ = main.pages.getChildByName("start_").getComponent(Start);
        main.start_.init();
        main.menu = main.pages.getChildByName("menu").getComponent(Menu);
        main.menu.init();
        main.testEffects = main.pages.getChildByName("testEffects").getComponent(TestEffects);
        main.testEffects.init();
        main.insertCPB = main.node.getChildByName("insertCPB").getComponent(InsertCPB);
        main.insertCPB.init();
        main.moneys = main.node.getChildByName("moneys").getComponent(Moneys);
        main.moneysIsUp = true;
        main.bottomCPBs = main.node.getChildByName("bottomCPBs").getComponent(BottomCPBs);
        main.bottomCPBs.init("mainIcons", "界面底部");
        main.disable = main.node.getChildByName("disable");
        main.disable.on(cc.Node.EventType.TOUCH_START, () => { });
        main.debug = main.node.getChildByName("debug");

        platformCtrl.initOpenDataContext();
        if (OpenDataContexts.instance) {
            OpenDataContexts.instance.postMessage("init", { selfOpenId: GlobalStorage.openId });
            OpenDataContexts.instance.postMessage("getFriendDatas");
        }

        platformCtrl.getStore(() => {

            main.node.getChildByName("popups").getComponent(popups.Popups).init();

            main.moneys.init();
            main.moneys.set();

            main.loading.addProgress(10);

            if (platformCtrl.cpbConfig) {
                platformCtrl.showInsertCPB("加载页");
            }

        });

        AVM1.run(DatasManager.加载完毕执行);
    }

    public moneysDown(): void {
        main.moneysIsUp = false;
        main.moneys.node.setSiblingIndex(main.pages.getSiblingIndex() + 1);
    }
    public moneysUp(): void {
        main.moneysIsUp = true;
        main.moneys.node.setSiblingIndex(popups.container.getSiblingIndex() + 1);
    }

    public go(): void {
        platformCtrl.checkLaunchOptions();
        main._go();

        platformCtrl.其他小游戏点击而来打点("点击开始按钮");

        AVM1.run(DatasManager.进入游戏执行);
    }

    public _go(): void {

        //####
        //main.goTestEffects();

        main.goMenu(1);
        Sounds.playFX("最开始的开始游戏");

    }

    public goStart(): void {
        Sounds.stopMusic();
        main.showPage(main.start_, -1);
    }

    public goMenu(dir: 1 | -1, s: number = 0.4): void {
        main.showPage(main.menu, dir, s);
    }

    public goTestEffects(): void {
        main.showPage(main.testEffects, 1);
    }

    private showPage(page: Page, dir: 1 | -1, s: number = 0.4): void {

        let oldPage: Page = main.currPage;
        main.currPage = page;

        if (oldPage) {
            if (oldPage == main.currPage) { } else {
                oldPage.hide();
                oldPage.node.stopAllActions();
                oldPage.node.runAction(cc.sequence(
                    cc.moveTo(s, -dir * 1388, 0).easing(cc.easeCircleActionInOut()),
                    cc.callFunc(() => {
                        oldPage.node.active = false;
                        oldPage.hideComplete();
                    })
                ));
            }
        }

        main.currPage.node.active = true;
        main.currPage.node.x = dir * 1388;

        main.currPage.show();
        main.currPage.node.stopAllActions();
        main.currPage.node.runAction(cc.sequence(
            cc.moveTo(s, 0, 0).easing(cc.easeCircleActionInOut()),
            cc.callFunc(() => {
                main.currPage.showComplete();
                main.disable.active = false;
            }, main)
        ));

        main.disable.active = true;
        main.moneys.node.active = false;

    }

    public showCPBIcons(x: number, y: number): void {
        main.cpbIcons_showing = true;
        main.cpbIcons.x = x;
        main.cpbIcons.y = y;
        main.updateCPBIcons();
    }
    public hideCPBIcons(): void {
        main.cpbIcons.active = false;
        main.cpbIcons_showing = false;
        main.updateCPBIcons();
    }

    public updateCPBIcons(): void {
        if (platformCtrl.cpbConfig) {
            if (main.cpbIcons_showing && popups.stackTop == -1) {
                main.cpbIcons.active = true;
                return;
            }
        }
        main.cpbIcons.active = false;
    }

    public showBannerAd(bannerName: "礼包" | "游戏顶部" | "结算" | "选模式和章节" | "签到转盘客服", dx: number, dy: number, 如果显示banner失败则显示bottomCPBs1: boolean = true): void {
        main.tryToShowBannerAd = true;
        if (platformCtrl.showingInsertAd) { } else {
            main._showBannerAd(bannerName, dx, dy, 如果显示banner失败则显示bottomCPBs1);
        }
    }

    public _showBannerAd(bannerName: string, dx: number, dy: number, 如果显示banner失败则显示bottomCPBs1: boolean = true): void {
        if (main.tryToShowBannerAd) {
            platformCtrl.showBannerAd(bannerName, dx, dy);
            if (platformCtrl.showBannerAdSuccess) {
                main.bottomCPBs.node.active = false;
            } else if (如果显示banner失败则显示bottomCPBs1) {
                if (platformCtrl.cpbConfig) {
                    main.bottomCPBs.node.active = true;
                    main.bottomCPBs.node.x = (swid - 640) * dx / 2;
                    main.bottomCPBs.node.y = -(hei0 - 164) * dy / 2;
                }
            }
        }
    }

    public hideBannerAd(): void {
        main.tryToShowBannerAd = false;
        platformCtrl.hideBannerAd();
        main.bottomCPBs.node.active = false;
    }

}
