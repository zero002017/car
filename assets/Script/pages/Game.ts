import 音响 from "../game/音响";
import 礼品店 from "../game/礼品店";
import { Sounds } from "../zero/Sounds";
import { UserStorage } from "../zero/UserStorage";
import { popups } from "../popups/Popups";
import 停车位s from "../game/停车位s";
import 服务站s from "../game/服务站s";
import 加油站s from "../game/加油站s";
import 装饰店s from "../game/装饰店s";
import 修理厂s from "../game/修理厂s";
import 洗车房s from "../game/洗车房s";
import { frameRate, getHeroInfo, 停车位StationId, 服务站StationId, 加油站StationId, 装饰店StationId, 修理厂StationId, 洗车房StationId, drawLTRB, 音响StationId, 礼品店StationId, getSpNode, wid0, hei0, playAnimation, HeroInfo, platformCtrl, shake, formatTime } from "../zero/global";
import Delays from "../zero/Delays";
import EnterFrames from "../zero/EnterFrames";
import Tweens from "../zero/Tweens";
import { main, stageWid } from "../Main";
import Car from "../game/Car";
import Stations from "../game/Stations";
import { DatasManager } from "../datas/DatasManager";
import { gongshis } from "../zero/Gongshi";
import EventData from "../datas/EventData";
import Station from "../game/Station";
import { prefabs } from "../ui/Prefabs";
import 等待 from "../game/等待";
import CheckpointData from "../datas/CheckpointData";
import StopData from "../datas/StopData";
import { Pause } from "../popups/Pause";
import { sps } from "../zero/sps";
import GameMoneys from "../game/GameMoneys";
import { Start_ } from "../popups/Start_";
import FeelingData from "../datas/FeelingData";
import HeroInfos from "../game/HeroInfos";
import { End } from "../popups/End";
import { GiftCode } from "../popups/GiftCode";
import { Event } from "../popups/Event";
import { Costs2 } from "../popups/Costs2";
import BuildData from "../datas/BuildData";
import { Technologys } from "../popups/Technologys";
import { MiniGameJigsaw } from "../popups/MiniGameJigsaw";
import { MiniGameWash } from "../popups/MiniGameWash";
import { MiniGameMatch } from "../popups/MiniGameMatch";
import 引导加油拖车 from "../game/引导加油拖车";

const { ccclass, property } = cc._decorator;

export let game: Game;

let 进路Y: number;
let 上路Y: number;
let 下路Y: number;
let 左路X: number;
let 右路X: number;
let 出路Y: number;

@ccclass
export default class Game extends cc.Component {

    public delays: Delays;
    public enterFrames: EnterFrames;
    public tweens: Tweens;

    public heroInfos: HeroInfos;
    private day: cc.Label;
    public gameMoneys: GameMoneys;
    private time: number;
    private totalTime: number;
    private timeDelayTime: number;
    private 时间到: boolean;
    public paused: boolean;

    private area: cc.Node;

    private 音响: 音响;
    private 礼品店: 礼品店;

    public 停车位s: 停车位s;
    public 服务站s: 服务站s;
    public 加油站s: 加油站s;
    public 装饰店s: 装饰店s;
    public 修理厂s: 修理厂s;
    public 洗车房s: 洗车房s;
    public stationss: Array<Stations>;

    private bottom: cc.Node;
    private container: cc.Node;
    private dsps: Array<cc.Node>;
    private sortedDsps: Array<cc.Node>;
    private cars: Array<Car>;
    public 泡泡们: cc.Node;
    private upgrades: cc.Node;
    private go: cc.Node;

    public checkpointData: CheckpointData;
    private stopDatas: Array<StopData>;
    public 初始心情: number;
    public feelingDatas: Array<FeelingData>;
    private carIdsByRate: Array<number>;
    public currEventData: EventData;
    public 权重增加s: { [key: number]: number };
    private 事件金币增加百分比: number;
    public 心情衰减速度: number;
    public 音响播放中: boolean;

    private currTouchPointID: number;
    private currGift: cc.Node;
    public currCar: Car;
    private currStation: Station;
    private oldMouseX: number;
    private oldMouseY: number;
    private moveTimes: number;

    public heroInfo: HeroInfo;

    private hideGuide: () => void;

    public init(): void {

        main.menu.gameLeft.getChildByName("暂停").on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            this.paused = true;
            popups.show(Pause).callback = flag => {
                this.paused = false;
            };
        });
        this.heroInfos = main.menu.left.getChildByName("heroInfos").getComponent(HeroInfos);
        this.heroInfos.init();
        const day = main.menu.left.getChildByName("day");
        day.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            popups.show(GiftCode);
        });
        this.day = day.getChildByName("txt").getComponent(cc.Label);
        this.gameMoneys = main.menu.gameRight.getChildByName("gameMoneys").getComponent(GameMoneys);
        this.gameMoneys.init();

        game = this;

        this.delays = new Delays();
        this.enterFrames = new EnterFrames();
        this.tweens = new Tweens();

        this.area = this.node.getChildByName("area");
        this.area.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.area.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.area.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);

        const poss = this.node.getChildByName("poss");
        进路Y = poss.getChildByName("进路").y;
        上路Y = poss.getChildByName("上路").y;
        下路Y = poss.getChildByName("下路").y;
        左路X = poss.getChildByName("左路").x;
        右路X = poss.getChildByName("右路").x;
        出路Y = poss.getChildByName("出路").y;
        poss.destroy();

        this.音响 = this.node.getChildByName("音响").getComponent(音响);
        this.音响.init();
        this.音响.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.paused || this.音响播放中) { } else {
                const position = UserStorage.positionss[音响StationId][0];
                if (position && position.level > 0) {
                    //消耗
                    Sounds.playFX("点击");
                    const num = UserStorage.getItem("音乐");
                    if (num > 0) {
                        UserStorage.addItem("音乐", -1);
                        UserStorage.flush();
                        this.音响.refresh();
                        const effect = sps.getSkel("特效");
                        this.container.addChild(effect.node);
                        playAnimation(effect, "yinyue", true);
                        for (const car of this.cars) {
                            car.currFeelingData = DatasManager.FeelingDatas[0];
                            car.happy = this.初始心情;
                            car.update表情();
                        }
                        Sounds.pauseMusic();
                        Sounds.playFX("音响播放");
                        this.音响播放中 = true;
                        main.delays.delay({
                            time: 17,
                            action: () => {
                                this.音响播放中 = false;
                                Sounds.resumeMusic();
                                effect.node.destroy();
                            }
                        });
                    } else {
                        popups.alert("音乐不足！");
                    }
                }
            }
        });

        this.礼品店 = this.node.getChildByName("礼品店").getComponent(礼品店);
        this.礼品店.init();

        this.停车位s = this.node.getChildByName("停车位s").getComponent(停车位s);
        this.停车位s.init(停车位StationId);
        this.服务站s = this.node.getChildByName("服务站s").getComponent(服务站s);
        this.服务站s.init(服务站StationId);
        this.加油站s = this.node.getChildByName("加油站s").getComponent(加油站s);
        this.加油站s.init(加油站StationId);
        this.装饰店s = this.node.getChildByName("装饰店s").getComponent(装饰店s);
        this.装饰店s.init(装饰店StationId);
        this.修理厂s = this.node.getChildByName("修理厂s").getComponent(修理厂s);
        this.修理厂s.init(修理厂StationId);
        this.洗车房s = this.node.getChildByName("洗车房s").getComponent(洗车房s);
        this.洗车房s.init(洗车房StationId);

        this.bottom = this.node.getChildByName("bottom");
        this.container = this.node.getChildByName("container");
        this.dsps = new Array();
        this.sortedDsps = new Array();

        this.stationss = [this.停车位s, this.服务站s, this.加油站s, this.装饰店s, this.修理厂s, this.洗车房s];
        for (const stations of this.stationss) {
            for (const station of stations.s) {

                station.s[0].parent.removeChild(station.s[0], false);
                this.bottom.addChild(station.s[0]);
                station.s[0].x += station.node.x + stations.node.x;
                station.s[0].y += station.node.y + stations.node.y;

                for (let i: number = 1; i < station.s.length; i++) {
                    station.s[i].parent.removeChild(station.s[i], false);
                    this.container.addChild(station.s[i]);
                    station.s[i].x += station.node.x + stations.node.x;
                    station.s[i].y += station.node.y + stations.node.y;
                    this.dsps.push(station.s[i]);
                }

                station.node.removeChild(station.框框.node, false);
                this.container.addChild(station.框框.node);
                station.框框.node.x += station.node.x + stations.node.x;
                station.框框.node.y += station.node.y + stations.node.y;
                this.dsps.push(station.框框.node);

            }

            if (stations.牌) {
                stations.node.removeChild(stations.牌, false);
                this.container.addChild(stations.牌);
                stations.牌.x += stations.node.x;
                stations.牌.y += stations.node.y;
                this.dsps.push(stations.牌);
            }
        }
        for (const dsp of this.dsps) {
            dsp["排序用XY"] = Math.round((1000 - dsp.y) * 10000 + (1000 + dsp.x));
        }

        this.cars = new Array();
        this.feelingDatas = new Array();
        this.carIdsByRate = new Array();

        this.泡泡们 = this.node.getChildByName("泡泡们");

        this.upgrades = this.node.getChildByName("upgrades");

        this.go = this.node.getChildByName("go");
        this.go.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("开局叮叮");

            //popups.show(MiniGameJigsaw);
            //popups.show(MiniGameWash);
            //popups.show(MiniGameMatch);

            this.hideUpgrades();
            this.startFuben();
        });

        this.currTouchPointID = -1;

    }

    private step = () => {
        if (this.paused) return;
        const dt = 1 / frameRate;
        game.delays.step(dt);
        if (this.paused) return;
        game.enterFrames.step();
        if (this.paused) return;
        game.tweens.step(dt);
        if (this.paused) return;

        if (this.时间到) { } else {
            if (--this.timeDelayTime <= 0) {
                this.timeDelayTime = this.checkpointData.time * frameRate;
                if (++this.time >= this.totalTime) {
                    this.时间到 = true;
                    Sounds.playFX("下班铃声");
                }
                this.gameMoneys.updateTime(this.time);
            }
        }

        for (const car of this.cars) {
            car.step();
            if (car.status == "等待") {
                if (car.happy > 0) { } else {
                    Sounds.playFX("走了");
                    this.carLeave(car, 0);
                }
            }
        }

        this.adjustDepths();
    }
    private adjustDepths(): void {
        for (const car of this.cars) {
            car.node["排序用XY"] = Math.round((1000 - (car.node.y - 64)) * 10000 + (1000 + car.node.x));
        }
        this.sortedDsps.length = 0;
        for (const dsp of this.dsps) {
            if (dsp.active) {
                this.sortedDsps.push(dsp);
            }
        }
        this.sortedDsps.sort((dsp1: cc.Node, dsp2: cc.Node) => {
            return dsp1["排序用XY"] - dsp2["排序用XY"];
        });
        let i: number = -1;
        for (const dsp of this.sortedDsps) {
            i++;
            dsp.setSiblingIndex(i);
        }
    }

    private moveCar(car: Car, station: Station, onMoveComplete: (car: Car) => void): void {
        const oldStation = car.station;
        if (oldStation) {
            car.station = null;
            oldStation.car = null;
            if (oldStation.stationId == 停车位StationId) {
                const stopData = this.stopDatas[oldStation.index];
                this.nextCarDelay(oldStation, stopData.Secs[0] + (Math.random() * (stopData.Secs[1] - stopData.Secs[0])));
            }
        }
        if (station) {
            car.station = station;
            station.car = car;
        }
        car.移动(this.getXYs(oldStation, station), onMoveComplete);
    }

    private getXYs(oldStation: Station, station: Station): Array<Array<number>> {

        //进路 -- 停车位
        if (oldStation) { } else {
            return [[station.框框.node.x, station.框框.node.y]];
        }

        switch (oldStation.stationId) {
            case 停车位StationId:
                if (station) {
                    switch (station.stationId) {
                        case 服务站StationId:
                            //停车位 -- 服务站
                            return [[NaN, 上路Y], [station.框框.node.x, 上路Y], [station.框框.node.x, station.框框.node.y]];
                        case 加油站StationId:
                            //停车位 -- 加油站
                            return [[NaN, 上路Y], [station.框框.node.x, 上路Y], [station.框框.node.x, station.框框.node.y]];
                        case 修理厂StationId:
                            //停车位 -- 修理厂
                            return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 下路Y], [station.框框.node.x, 下路Y], [station.框框.node.x, station.框框.node.y]];
                        case 洗车房StationId:
                            //停车位 -- 洗车房
                            return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 下路Y], [station.框框.node.x, 下路Y], [station.框框.node.x, station.框框.node.y]];
                        case 装饰店StationId:
                            //停车位 -- 装饰店
                            return [[NaN, 上路Y], [station.框框.node.x, 上路Y], [station.框框.node.x, station.框框.node.y]];
                    }
                }
                //停车位 -- 出路
                return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 出路Y]];
            case 服务站StationId:
                if (station) {
                    switch (station.stationId) {
                        case 加油站StationId:
                            //服务站 -- 加油站
                            return [[NaN, 上路Y], [station.框框.node.x, 上路Y], [station.框框.node.x, station.框框.node.y]];
                        case 修理厂StationId:
                            //服务站 -- 修理厂
                            return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 下路Y], [station.框框.node.x, 下路Y], [station.框框.node.x, station.框框.node.y]];
                        case 洗车房StationId:
                            //服务站 -- 洗车房
                            return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 下路Y], [station.框框.node.x, 下路Y], [station.框框.node.x, station.框框.node.y]];
                        case 装饰店StationId:
                            //服务站 -- 装饰店
                            return [[NaN, 上路Y], [station.框框.node.x, 上路Y], [station.框框.node.x, station.框框.node.y]];
                    }
                }
                //服务站 -- 出路
                return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 出路Y]];
            case 加油站StationId:
                if (station) {
                    switch (station.stationId) {
                        case 修理厂StationId:
                            //加油站 -- 修理厂
                            return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 下路Y], [station.框框.node.x, 下路Y], [station.框框.node.x, station.框框.node.y]];
                        case 洗车房StationId:
                            //加油站 -- 洗车房
                            return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 下路Y], [station.框框.node.x, 下路Y], [station.框框.node.x, station.框框.node.y]];
                        case 装饰店StationId:
                            //加油站 -- 装饰店
                            return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 下路Y], [右路X, 下路Y], [右路X, 上路Y], [station.框框.node.x, 上路Y], [station.框框.node.x, station.框框.node.y]];
                    }
                }
                //加油站 -- 出路
                return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 出路Y]];
            case 修理厂StationId:
                if (station) {
                    switch (station.stationId) {
                        case 洗车房StationId:
                            //修理厂 -- 洗车房
                            return [[NaN, 下路Y], [station.框框.node.x, 下路Y], [station.框框.node.x, station.框框.node.y]];
                        case 装饰店StationId:
                            //修理厂 -- 装饰店
                            return [[NaN, 下路Y], [右路X, 下路Y], [右路X, 上路Y], [station.框框.node.x, 上路Y], [station.框框.node.x, station.框框.node.y]];
                    }
                }
                //修理厂 -- 出路
                return [[NaN, 出路Y]];
            case 洗车房StationId:
                if (station) {
                    switch (station.stationId) {
                        case 装饰店StationId:
                            //洗车房 -- 装饰店
                            return [[NaN, 下路Y], [右路X, 下路Y], [右路X, 上路Y], [station.框框.node.x, 上路Y], [station.框框.node.x, station.框框.node.y]];
                    }
                }
                //洗车房 -- 出路
                return [[NaN, 出路Y]];
            case 装饰店StationId:
                //装饰店 -- 出路
                return [[NaN, 上路Y], [左路X, 上路Y], [左路X, 出路Y]];
        }

    }

    private getCar(p: cc.Vec2): Car {
        for (const stations of this.stationss) {
            for (const station of stations.s) {
                const position = UserStorage.positionss[station.stationId][station.pos];
                if (position && position.level > 0) {
                    if (station.car && station.car.status == "等待" && station.car.conditionDatas.length) {
                        const b = station.node.getBoundingBoxToWorld();
                        //console.log("b=" + b);
                        //drawLTRB(main.debug, [b.x, b.y, b.x + b.width, b.y + b.height], cc.Color.YELLOW);
                        if (b.contains(p)) {
                            Sounds.playFX("车拿起");
                            return station.car;
                        }
                    }
                }
            }
        }
    }
    private getStation(): Station {
        const carB = this.currCar.node.getBoundingBoxToWorld();
        for (const stations of this.stationss) {
            if (stations.stationId == this.currCar.conditionDatas[0].Station) {
                for (const station of stations.s) {
                    const position = UserStorage.positionss[station.stationId][station.pos];
                    if (position && position.level > 0) {
                        if (station.car) { } else {
                            const b = station.框框.node.getBoundingBoxToWorld();
                            //console.log("b=" + b);
                            //drawLTRB(main.debug, [b.x, b.y, b.x + b.width, b.y + b.height], cc.Color.YELLOW);
                            if (b.intersects(carB)) {
                                return station;
                            }
                        }
                    }
                }
                const b = stations.node.getBoundingBoxToWorld();
                //console.log("b=" + b);
                //drawLTRB(main.debug, [b.x, b.y, b.x + b.width, b.y + b.height], cc.Color.YELLOW);
                if (b.intersects(carB)) {
                    for (const station of stations.s) {
                        const position = UserStorage.positionss[station.stationId][station.pos];
                        if (position && position.level > 0) {
                            if (station.car) { } else {
                                return station;
                            }
                        }
                    }
                }
            }
        }
    }

    private touchStart(evt: cc.Event.EventTouch): void {
        if (this.hideGuide) { } else {
            if (this.paused) {
                return;
            }
        }
        //console.log(evt.target);//会崩溃
        //console.log(evt.target.name);
        if (this.currTouchPointID == -1) {

            const p = evt.getLocation();
            const b = this.礼品店.node.getBoundingBoxToWorld();
            //console.log("b=" + b);
            //drawLTRB(main.debug, [b.x, b.y, b.x + b.width, b.y + b.height], cc.Color.YELLOW);
            if (b.contains(p)) {
                const position = UserStorage.positionss[礼品店StationId][0];
                if (position && position.level > 0) {
                    //消耗
                    const num = UserStorage.getItem("礼物");
                    if (num > 0) {
                        this.currGift = getSpNode("ui", "礼物");
                        this.container.addChild(this.currGift);
                        this.currGift.x = p.x - wid0 / 2 - (stageWid - wid0) / 2;
                        this.currGift.y = p.y - hei0 / 2;
                        Sounds.playFX("礼品拿起");
                    } else {
                        popups.alert("礼物不足！");
                        Sounds.playFX("点击");
                    }
                }
            }

            if (this.currGift) { } else {
                this.currCar = this.getCar(p);
            }

            if (this.currGift || this.currCar) {
                if (this.hideGuide) {
                    this.hideGuide();
                    this.hideGuide = null;
                    main.menu.gameLeft.active = true;
                }
                this.oldMouseX = p.x;
                this.oldMouseY = p.y;
                this.currTouchPointID = evt.getID();
                this.moveTimes = 0;
            }

        } else {
            //另一个手指触碰，或微信从左边拉开又回来后点击
            this.endTouch(evt);
        }
    }
    private touchMove(evt: cc.Event.EventTouch): void {
        if (this.currTouchPointID == evt.getID()) {
            this.moveTimes++;
            const p = evt.getLocation();
            const dx = p.x - this.oldMouseX;
            const dy = p.y - this.oldMouseY;
            this.oldMouseX = p.x;
            this.oldMouseY = p.y;
            if (this.currGift) {
                this.currGift.x += dx;
                this.currGift.y += dy;
            } else if (this.currCar) {
                this.currCar.node.x += dx;
                this.currCar.node.y += dy;
                if (this.currStation) {
                    this.currStation.预览.spriteFrame = null;
                }
                this.currStation = this.getStation();
                if (this.currStation) {
                    let imgIndex: 1 | 3;
                    switch (this.currStation.stationId) {
                        case 停车位StationId:
                        case 加油站StationId:
                        case 装饰店StationId:
                            imgIndex = 3;
                            break;
                        default:
                            imgIndex = 1;
                            break;

                    }
                    this.currStation.预览.spriteFrame = this.currCar.imgs[imgIndex].getComponent(cc.Sprite).spriteFrame;
                }
            }
        }
    }
    private touchEnd(evt: cc.Event.EventTouch): void {
        if (this.currTouchPointID == evt.getID()) {
            this.endTouch(evt);
        }
    }

    private endTouch(evt: cc.Event.EventTouch): void {
        this.currTouchPointID = -1;
        //console.log("moveTimes=" + this.moveTimes);
        if (this.currGift) {
            const giftB = this.currGift.getBoundingBoxToWorld();
            this.currGift.destroy();
            this.currGift = null;
            for (const car of this.cars) {
                const b = car.node.getBoundingBoxToWorld();
                if (b.intersects(giftB)) {
                    UserStorage.addItem("礼物", -1);
                    UserStorage.flush();
                    this.礼品店.refresh();
                    car.currFeelingData = DatasManager.FeelingDatas[0];
                    car.happy = this.初始心情;
                    car.update表情();
                    Sounds.playFX("送礼物");
                    return;
                }
            }
            Sounds.playFX("礼品和车放下");
        } else if (this.currCar) {
            this.currCar.node.x = this.currCar.station.框框.node.x;
            this.currCar.node.y = this.currCar.station.框框.node.y;
            if (this.currStation) {
                this.moveCar(this.currCar, this.currStation, car => {
                    car.station.预览.spriteFrame = null;

                    let 玩小游戏: boolean;
                    if (!UserStorage.引导洗车小游戏 && car.station.stationId == 洗车房StationId) {
                        UserStorage.引导洗车小游戏 = true;
                        UserStorage.flush();
                        玩小游戏 = true;
                    } else {
                        switch (car.station.stationId) {
                            case 修理厂StationId:
                            case 洗车房StationId:
                            case 装饰店StationId:
                                玩小游戏 = !!gongshis.jisuan("玩小游戏", false, {});
                                break;
                            default:
                                玩小游戏 = false;
                                break;
                        }
                    }
                    if (玩小游戏) {
                        car.要玩小游戏();
                    } else {
                        const effect = sps.getSkel("特效");
                        this.container.addChild(effect.node);
                        effect.node.x = car.node.x;
                        effect.node.y = car.node.y;
                        const stationData = DatasManager.StationDatasById[car.station.stationId];
                        playAnimation(effect, stationData.Effect, true);
                        car.被服务中();
                        car.station.doo((car, station) => {
                            effect.node.destroy();
                            car.被服务完毕();
                            car.等待();
                        });
                        Sounds.playFX(stationData.Name);
                    }
                });
            } else {
                Sounds.playFX("礼品和车放下");
            }
            this.currCar = null;
            this.currStation = null;
        }
    }

    private startFuben(): void {
        for (const stations of this.stationss) {
            const positions = UserStorage.positionss[stations.stationId];
            let index: number = -1;
            for (const station of stations.s) {
                const position = positions[station.pos];
                if (position && position.level > 0) {
                    station.index = ++index;
                }
            }
        }
        let 停车位数量: number = 0;
        for (const position of UserStorage.positionss[停车位StationId]) {
            if (position && position.level > 0) {
                停车位数量++;
            }
        }
        this.stopDatas = DatasManager.stopDatass[停车位数量 - 1];

        this.初始心情 = this.checkpointData.Min * DatasManager.FeelingDatas.length;

        this.gameMoneys.set();
        this.time = -1;
        this.totalTime = (DatasManager.时间范围[1] - DatasManager.时间范围[0]) * 2;
        this.timeDelayTime = 0;
        this.时间到 = false;
        this.gameMoneys.updateTime(0);
        this.cars.length = 0;
        this.feelingDatas.length = 0;
        this.carIdsByRate.length = 0;
        for (const carData of DatasManager.CarDatas) {
            if (UserStorage.fubenId + 1 >= carData.Unlock) {
                let i: number = carData.jilv;
                while (i--) {
                    this.carIdsByRate.push(carData.ID);
                }
            }
        }

        popups.show(Start_).onHide = () => {
            this.paused = false;
            main.enterFrames.add(this.step);
            for (const station of this.停车位s.s) {
                const position = UserStorage.positionss[station.stationId][station.pos];
                if (position && position.level > 0) {
                    const stopData = this.stopDatas[station.index];
                    this.nextCarDelay(station, stopData.diyi[0] + Math.random() * (stopData.diyi[1] - stopData.diyi[0]));
                }
            }
        };
    }

    private nextCarDelay(station: Station, sec: number): void {
        if (this.时间到) {
            return;
        }
        game.delays.delay({
            time: sec,
            action: () => {
                const car = new Car();
                const position = UserStorage.positionss[station.stationId][station.pos];
                const buildData = DatasManager.buildDatasss[station.stationId][station.pos][position.level - 1];
                car.init(this.carIdsByRate[Math.floor(Math.random() * this.carIdsByRate.length)], buildData.xinqingyanchang * frameRate, station.框框.node.x, 进路Y);
                this.cars.push(car);
                this.container.addChild(car.node);
                this.dsps.push(car.node);
                this.moveCar(car, station, car => {
                    car.等待();
                    if (UserStorage.引导加油拖车) { } else {
                        UserStorage.引导加油拖车 = true;
                        UserStorage.flush();
                        game.paused = true;
                        const guide = main.node.getChildByName("引导加油拖车").getComponent(引导加油拖车);
                        guide.show();
                        main.menu.gameLeft.active = false;
                        this.hideGuide = () => {
                            guide.hide();
                            game.paused = false;
                        };
                    }
                });
            }
        });
    }

    private end(): void {
        this.paused = true;
        main.enterFrames.clear(this.step);
        main.delays.delay({
            time: 1,
            action: () => {

                const popup = popups.show(End);
                popup.onHide = () => {

                    UserStorage.fubenId++;
                    UserStorage.flush();
                    this.showUpgrades();

                    platformCtrl.showInsertAdDelay("结算完毕插屏广告");
                };
            }
        });
    }

    public show(): void {
        this.音响.refresh();
        this.礼品店.refresh();
        for (const stations of this.stationss) {
            stations.refresh();
        }
        this.showUpgrades();
    }
    private showUpgrades(): void {
        this.paused = true;
        main.moneys.node.active = true;
        main.menu.left.active = true;
        main.menu.gameLeft.active = false;
        main.menu.gameRight.active = false;
        this.go.active = true;
        this.heroInfo = getHeroInfo(UserStorage.exp);
        this.heroInfos.set(this.heroInfo);
        this.day.string = (UserStorage.fubenId + 1).toString();
        this._showUpgrades();

        this.checkpointData = DatasManager.CheckpointDatas[UserStorage.fubenId];
        if (this.checkpointData) { } else {
            this.checkpointData = DatasManager.CheckpointDatas[DatasManager.CheckpointDatas.length - 1];
        }

        const eventDatas: Array<EventData> = new Array();
        if (this.checkpointData.shijian) {
            for (const eventId of this.checkpointData.shijian) {
                const eventData = DatasManager.EventDatasById[eventId];
                if (eventData.tiaojian > 0) {
                    for (const position of UserStorage.positionss[eventData.tiaojian]) {
                        if (position && position.level > 0) {
                            eventDatas.push(eventData);
                            break;
                        }
                    }
                } else {
                    eventDatas.push(eventData);
                }
            }
        }
        this.currEventData = eventDatas.length ? eventDatas[Math.floor(Math.random() * eventDatas.length)] : DatasManager.EventDatas[0];
        this.权重增加s = {};
        this.事件金币增加百分比 = 0;
        let 心情衰减速度减少百分比: number = 0;
        switch (this.currEventData.Type) {
            case "收费建筑权重增加":
                this.权重增加s[this.currEventData.Station] = this.currEventData.range;
                break;
            case "事件金币增加百分比":
                this.事件金币增加百分比 = this.currEventData.range;
                break;
            case "心情衰减速度减少百分比":
                心情衰减速度减少百分比 = this.currEventData.range;
                break;
            case "根据评分奖励钻石":
                break;
        }
        this.心情衰减速度 = gongshis.jisuan("心情衰减速度", false, { 心情衰减速度减少百分比: 心情衰减速度减少百分比 }) / frameRate;

        if (this.currEventData.Name == "正常") { } else {
            popups.show(Event);
        }

        main.showCPBIcons(516, 180);
        main.menu.百度交叉推荐.show();
        Sounds.playMusic("背景衬托音效");
    }
    private _showUpgrades(): void {
        {
            const position = UserStorage.positionss[音响StationId][0];
            if (position) {
                if (position.startTime > 0) {
                    this.addUpgrade1(this.音响, "等待");
                } else {
                    if (UserStorage.getItem("音乐") < DatasManager.StationDatasById[音响StationId].Stock) {
                        this.addUpgrade1(this.音响, "增加");
                    }
                }
            } else {
                if (this.heroInfo.level >= DatasManager.positionDatass[音响StationId][0].dengji) {
                    this.addUpgrade1(this.音响, "购买");
                }
            }
        }
        {
            const position = UserStorage.positionss[礼品店StationId][0];
            if (position) {
                if (position.startTime > 0) {
                    this.addUpgrade1(this.礼品店, "等待");
                } else {
                    if (UserStorage.getItem("礼物") < DatasManager.StationDatasById[礼品店StationId].Stock) {
                        this.addUpgrade1(this.礼品店, "增加");
                    }
                }
            } else {
                if (this.heroInfo.level >= DatasManager.positionDatass[礼品店StationId][0].dengji) {
                    this.addUpgrade1(this.礼品店, "购买");
                }
            }
        }
        for (const stations of this.stationss) {
            if (stations.牌) {
                stations.牌.active = false;
            }
            for (const station of stations.s) {
                const position = UserStorage.positionss[station.stationId][station.pos];
                if (position) {
                    if (position.level > 0) {
                        if (stations.牌) {
                            stations.牌.active = true;
                        }
                    }
                    if (position.startTime > 0) {
                        this.addUpgrade1(station, "等待");
                    } else {
                        const nextBuildData = DatasManager.buildDatasss[station.stationId][station.pos][position.level];
                        if (nextBuildData) {
                            if (this.heroInfo.level >= nextBuildData.LevelUp) {
                                this.addUpgrade1(station, "升级1");
                            }
                        }
                    }
                } else {
                    if (this.heroInfo.level >= DatasManager.positionDatass[station.stationId][station.pos].dengji) {
                        this.addUpgrade1(station, "购买");
                    }
                }
            }
            if (stations.牌 && stations.牌.active) {
                const technologys = UserStorage.technologyss[stations.stationId];
                if (technologys) {
                    let 完成的: UserStorage.Position = null;
                    let 等待的: UserStorage.Position = null;
                    let 升级的: UserStorage.Position = null;
                    let i: number = -1;
                    for (const technology of technologys) {
                        i++;
                        if (technology.startTime > 0) {
                            if (technology.startTime == 1) {
                                完成的 = technology;
                            } else {
                                等待的 = technology;
                            }
                        } else {
                            const nextTechnologyData = DatasManager.technologyDatasss[stations.stationId][i][technology.level];
                            if (nextTechnologyData && this.heroInfo.level >= nextTechnologyData.UnlockLevel) {
                                升级的 = technology;
                            }
                        }
                    }
                    if (完成的) {
                        this.addUpgrade2(stations, "完成", stations.stationId, technologys.indexOf(完成的), 完成的);
                    } else if (升级的) {
                        this.addUpgrade2(stations, "升级2", stations.stationId, technologys.indexOf(升级的), 升级的);
                    } else if (等待的) {
                        this.addUpgrade2(stations, "等待", stations.stationId, technologys.indexOf(等待的), 等待的);
                    } else {

                    }
                }
            }
        }

        this.adjustDepths();
    }
    private addUpgrade1(station: 音响 | 礼品店 | Station, key: "购买" | "增加" | "升级1" | "等待" | "完成"): void {
        //console.log("addUpgrade1 " + key);
        const upgrade = prefabs.instantiate("升级1");
        this.upgrades.addChild(upgrade);
        const stationData = DatasManager.StationDatasById[station.stationId];
        const positionData = DatasManager.positionDatass[station.stationId][station.pos];
        const position = UserStorage.positionss[station.stationId][station.pos];
        const currLevel = (position ? position.level : 0);
        let nextBuildData: BuildData;
        switch (station.stationId) {
            case 音响StationId:
            case 礼品店StationId:
                upgrade.x = station.node.x;
                upgrade.y = station.node.y;
                nextBuildData = null;
                break;
            default:
                upgrade.x = station.node.parent.parent.x + station.node.x;
                upgrade.y = station.node.parent.parent.y + station.node.y;
                nextBuildData = DatasManager.buildDatasss[station.stationId][station.pos][currLevel];
                break;
        }

        let new_: cc.Node = upgrade.getChildByName("new_");
        new_.active = false;
        let newedKey: string = null;
        let _wait: 等待 = null;
        switch (key) {
            case "购买":
            //    break;
            //case "增加":
            //    break;
            case "升级1":
                newedKey = key + " " + station.stationId + " " + station.pos + " " + currLevel;
                if (UserStorage.showNeweds.indexOf(newedKey) == -1) {
                    new_.active = true;
                    shake(new_);
                } else {
                    newedKey = null;
                }
                break;
            case "等待":
                _wait = upgrade.getChildByName("icons").getChildByName("等待").getComponent(等待);
                _wait.init(position, currLevel == 0 ? positionData.shijian : nextBuildData.LevelUpTime, () => {
                    upgrade.destroy();
                    this.addUpgrade1(station, "完成");
                });
                break;
            case "完成":
                upgrade.runAction(cc.repeatForever(cc.sequence(
                    cc.moveTo(0.8, upgrade.x, upgrade.y + 4).easing(cc.easeSineInOut()),
                    cc.moveTo(0.8, upgrade.x, upgrade.y).easing(cc.easeSineInOut())
                )));
                upgrade.getChildByName("icons").getChildByName("完成").runAction(cc.repeatForever(cc.sequence(
                    cc.scaleTo(1, 1.06, 1.06).easing(cc.easeSineInOut()),
                    cc.scaleTo(1, 0.96, 0.96).easing(cc.easeSineInOut())
                )));
                break;
        }

        for (const icon of upgrade.getChildByName("icons").children) {
            icon.active = (icon.name == key);
        }

        upgrade.on(cc.Node.EventType.TOUCH_START, () => {
            if (newedKey) {
                new_.destroy();
                new_ = null;
                UserStorage.showNeweds.push(newedKey);
                UserStorage.flush();
                newedKey = null;
            }
            switch (key) {
                case "购买":
                    {
                        switch (station.stationId) {
                            case 音响StationId:
                            case 礼品店StationId:
                                popups.show(Costs2).set(key, station, null, stationData.Name, stationData.Description, "", success => {
                                    if (success) {
                                        UserStorage.positionss[station.stationId][station.pos] = {
                                            startTime: new Date().getTime(),
                                            level: 0
                                        };
                                        UserStorage.flush();
                                        upgrade.destroy();
                                        this.addUpgrade1(station, "等待");
                                    }
                                }, [positionData.huafei, 0]);
                                break;
                            default:
                                popups.show(Costs2).set(key, station, null, (currLevel + 1) + "级" + stationData.Name, nextBuildData.Description, nextBuildData.SkillDescription, success => {
                                    if (success) {
                                        UserStorage.positionss[station.stationId][station.pos] = {
                                            startTime: new Date().getTime(),
                                            level: 0
                                        };
                                        UserStorage.flush();
                                        upgrade.destroy();
                                        this.addUpgrade1(station, "等待");
                                    }
                                }, [positionData.huafei, 0]);
                                break;
                        }
                    }
                    break;
                case "增加":
                    {
                        popups.show(Costs2).set(key, station, null, stationData.Name, stationData.goumai, "", success => {
                            if (success) {
                                switch (station.stationId) {
                                    case 音响StationId:
                                        UserStorage.setItem("音乐", stationData.Stock);
                                        break;
                                    case 礼品店StationId:
                                        UserStorage.setItem("礼物", stationData.Stock);
                                        break;
                                }
                                upgrade.destroy();
                                station.refresh();
                            }
                        }, [stationData.AddNeedCoins, stationData.AddNeedGems]);
                    }
                    break;
                case "升级1":
                    {
                        popups.show(Costs2).set(key, station, null, (currLevel + 1) + "级" + stationData.Name, nextBuildData.Description, nextBuildData.SkillDescription, success => {
                            if (success) {
                                position.startTime = new Date().getTime();
                                UserStorage.flush();
                                upgrade.destroy();
                                this.addUpgrade1(station, "等待");
                            }
                        }, [nextBuildData.LevelUpNeed, 0]);
                    }
                    break;
                case "等待":
                    const cost2 = popups.show(Costs2);
                    switch (station.stationId) {
                        case 音响StationId:
                        case 礼品店StationId:
                            cost2.set(key, station, position, stationData.Name, stationData.Description, "", success => {
                                if (success) {
                                    position.startTime = 1;
                                    UserStorage.flush();
                                    upgrade.destroy();
                                    this.addUpgrade1(station, "等待");
                                }
                                _wait.onUpdate = null;
                            }, [0, 1]);
                            break;
                        default:
                            cost2.set(key, station, position, (currLevel + 1) + "级" + stationData.Name, nextBuildData.Description, nextBuildData.SkillDescription, success => {
                                if (success) {
                                    position.startTime = 1;
                                    UserStorage.flush();
                                    upgrade.destroy();
                                    this.addUpgrade1(station, "等待");
                                }
                                _wait.onUpdate = null;
                            }, [0, 1]);
                            break;
                    }
                    cost2.time.active = true;
                    _wait.onUpdate = restSec => {
                        cost2.updateWait(restSec);
                    };
                    break;
                case "完成":
                    {
                        position.startTime = 0;
                        position.level++;
                        UserStorage.flush();
                        upgrade.destroy();
                        station.refresh();
                        this._hideUpgrades();
                        this._showUpgrades();
                        Sounds.playFX("结束升级的点击音效");
                    }
                    break;
            }
        });
    }
    private addUpgrade2(stations: Stations, key: "升级2" | "等待" | "完成", stationId: number, pos: number, technology: UserStorage.Position): void {
        //console.log("addUpgrade2 " + key);
        const upgrade = prefabs.instantiate("升级2");
        this.upgrades.addChild(upgrade);
        const upgrade2 = stations.node.getChildByName("upgrade2");
        upgrade.x = stations.node.x + upgrade2.x;
        upgrade.y = stations.node.y + upgrade2.y;
        if (upgrade2.scaleX < 0) {
            upgrade.scaleX = -1;
            upgrade.getChildByName("icons").scaleX = -1;
            upgrade.getChildByName("new_").scaleX = -1;
        }

        let new_: cc.Node = upgrade.getChildByName("new_");
        new_.active = false;
        let newedKey: string = null;
        switch (key) {
            case "升级2":
                newedKey = key + " " + stationId + " " + pos + " " + technology.level;
                if (UserStorage.showNeweds.indexOf(newedKey) == -1) {
                    new_.active = true;
                    shake(new_);
                } else {
                    newedKey = null;
                }
                break;
            case "等待":
                break;
            case "完成":
                upgrade.runAction(cc.repeatForever(cc.sequence(
                    cc.moveTo(0.8, upgrade.x, upgrade.y + 4).easing(cc.easeSineInOut()),
                    cc.moveTo(0.8, upgrade.x, upgrade.y).easing(cc.easeSineInOut())
                )));
                upgrade.getChildByName("icons").getChildByName("完成").runAction(cc.repeatForever(cc.sequence(
                    cc.scaleTo(1, 1.06, 1.06).easing(cc.easeSineInOut()),
                    cc.scaleTo(1, 0.96, 0.96).easing(cc.easeSineInOut())
                )));
                break;
        }

        for (const icon of upgrade.getChildByName("icons").children) {
            icon.active = (icon.name == key);
        }

        upgrade.on(cc.Node.EventType.TOUCH_START, () => {
            if (newedKey) {
                new_.destroy();
                new_ = null;
                UserStorage.showNeweds.push(newedKey);
                UserStorage.flush();
                newedKey = null;
            }
            popups.show(Technologys).set(stationId, () => {
                this._hideUpgrades();
                this._showUpgrades();
            });
        });
    }
    private hideUpgrades(): void {
        main.moneys.node.active = false;
        main.menu.left.active = false;
        main.menu.gameLeft.active = true;
        main.menu.gameRight.active = true;
        this.go.active = false;
        this._hideUpgrades();
        main.hideCPBIcons();
        main.menu.百度交叉推荐.hide();
        Sounds.playMusic("背景音乐");
    }
    private _hideUpgrades(): void {
        this.upgrades.destroyAllChildren();
    }

    public 玩小游戏(car: Car): void {
        car.小游戏.active = false;
        car.被服务中();
        const onHide = () => {
            car.被服务完毕();
            car.等待();
        };
        switch (car.station.stationId) {
            case 修理厂StationId:
                popups.show(MiniGameJigsaw).onHide = onHide;
                break;
            case 洗车房StationId:
                const popup = popups.show(MiniGameWash);
                popup.car.spriteFrame = car.imgs[2].getComponent(cc.Sprite).spriteFrame;
                popup.onHide = onHide;
                break;
            case 装饰店StationId:
                popups.show(MiniGameMatch).onHide = onHide;
                break;
        }
    }

    public 收钱(car: Car): void {
        Sounds.playFX("收钱");
        const coins = gongshis.jisuan("金币获取", false, { 车辆基础金币: car.data.gold, 建筑金钱加成: car.建筑金钱加成, 心情金钱加成: car.currFeelingData.Gold, 科技金币加成: car.科技金币加成, 事件金币增加百分比: game.事件金币增加百分比 });
        this.gameMoneys.addMoney("金币", coins, car.给钱.getChildByName("金币"), null);
        this.carLeave(car, coins);
    }

    private carLeave(car: Car, coins: number): void {
        const txt = prefabs.instantiate("金币飘字");
        this.container.addChild(txt);
        txt.x = car.node.x - 40;
        txt.y = car.node.y + 40;
        txt.getChildByName("txt1").getComponent(cc.Label).string = txt.getChildByName("txt2").getComponent(cc.Label).string = "+" + coins;
        txt.runAction(cc.sequence(
            cc.moveTo(1.2, txt.x, txt.y + 50),
            cc.callFunc(() => {
                txt.destroy();
            })
        ));
        txt.runAction(cc.sequence(
            cc.delayTime(0.8),
            cc.fadeOut(0.4)
        ));

        car.离开();
        this.feelingDatas.push(car.currFeelingData);
        this.moveCar(car, null, car => {
            this.dsps.splice(this.dsps.indexOf(car.node), 1);
            this.cars.splice(this.cars.indexOf(car), 1);
            car.node.destroy();
            car.泡泡们.destroy();
            if (this.cars.length) { }
            else if (this.时间到) {
                this.end();
            }
        });
    }

    public hideComplete(): void {
        this.hideUpgrades();
    }

}
