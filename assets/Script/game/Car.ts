import { prefabs } from "../ui/Prefabs";
import CarData from "../datas/CarData";
import { DatasManager } from "../datas/DatasManager";
import { gongshis } from "../zero/Gongshi";
import { UserStorage } from "../zero/UserStorage";
import { frameRate, 洗车房StationId, 修理厂StationId, getSpNode, 服务站StationId, 加油站StationId, 装饰店StationId, playAnimation, getAniNames, 停车位StationId } from "../zero/global";
import ConditionData from "../datas/ConditionData";
import { game } from "../pages/Game";
import { Atlas } from "../zero/Atlas";
import FeelingData from "../datas/FeelingData";
import Station from "./Station";
import { Sounds } from "../zero/Sounds";
import { sps } from "../zero/sps";

export default class Car {

    public node: cc.Node;
    public station: Station;//有车或正有车开过去
    public imgs: Array<cc.Node>;
    private 脏: cc.Node;
    private 冒烟: boolean;
    public 泡泡们: cc.Node;
    private 需求: cc.Node;
    public 小游戏: cc.Node;
    public 给钱: cc.Node;
    private 表情: cc.Sprite;

    public data: CarData;
    private modelId: number;
    private dx: -1 | 0 | 1;
    private dy: -1 | 0 | 1;
    private speed: number;
    private targetXYs: Array<Array<number>>;
    private onMoveComplete: (car: Car) => void;
    public status: "移动" | "等待" | "被服务中" | "离开";
    private 心情延长时间: number;
    public happy: number;
    public currFeelingData: FeelingData;
    public conditionDatas: Array<ConditionData>;
    public 建筑金钱加成: number;
    public 科技金币加成: number;

    public init(carId: number, 心情延长时间: number, x: number, y: number): void {
        this.node = prefabs.instantiate("Car");
        this.泡泡们 = this.node.getChildByName("泡泡们");
        this.node.removeChild(this.泡泡们, false);
        game.泡泡们.addChild(this.泡泡们);
        this.需求 = this.泡泡们.getChildByName("需求");
        this.需求.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.8, 0, 30).easing(cc.easeSineInOut()),
            cc.moveTo(0.8, 0, 20).easing(cc.easeSineInOut())
        )));
        this.小游戏 = this.泡泡们.getChildByName("小游戏");
        this.小游戏.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.8, 0, 30).easing(cc.easeSineInOut()),
            cc.moveTo(0.8, 0, 20).easing(cc.easeSineInOut())
        )));
        this.小游戏.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            this.给钱.active = false;
            game.玩小游戏(this);
        });
        this.给钱 = this.泡泡们.getChildByName("给钱");
        this.给钱.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.8, 0, 30).easing(cc.easeSineInOut()),
            cc.moveTo(0.8, 0, 20).easing(cc.easeSineInOut())
        )));
        this.给钱.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            this.给钱.active = false;
            game.收钱(this);
        });
        this.表情 = this.泡泡们.getChildByName("表情").getComponent(cc.Sprite);

        this.需求.active = false;
        this.小游戏.active = false;
        this.给钱.active = false;

        this.data = DatasManager.CarDatasById[carId];
        this.speed = this.data.speed / frameRate;
        const imgs = this.node.getChildByName("imgs");
        imgs.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.1, 1.02, 0.98).easing(cc.easeSineInOut()),
            cc.scaleTo(0.05, 0.98, 1.02).easing(cc.easeSineInOut())
        )));
        this.imgs = [
            imgs.getChildByName("r"),
            imgs.getChildByName("u"),
            imgs.getChildByName("l"),
            imgs.getChildByName("d")
        ];
        this.脏 = imgs.getChildByName("脏");
        this.脏.active = false;

        this.changeModel();

        this.心情延长时间 = 心情延长时间;
        this.happy = game.初始心情;
        this.currFeelingData = DatasManager.FeelingDatas[0];
        this.update表情();

        this.conditionDatas = new Array();
        if (UserStorage.引导洗车) {
            for (const conditionData of DatasManager.conditionDatasByPriority) {
                const positionDatas = DatasManager.positionDatass[conditionData.Station];
                let 权重和: number = 0;
                let i: number = -1;
                for (const position of UserStorage.positionss[conditionData.Station]) {
                    i++;
                    let hasCar: boolean = false;
                    if (position && position.level > 0) {
                        switch (conditionData.Station) {
                            case 服务站StationId:
                                if (game.服务站s.s[i].car) {
                                    hasCar = true;
                                }
                                break;
                            case 加油站StationId:
                                if (game.加油站s.s[i].car) {
                                    hasCar = true;
                                }
                                break;
                            case 修理厂StationId:
                                if (game.修理厂s.s[i].car) {
                                    hasCar = true;
                                }
                                break;
                            case 洗车房StationId:
                                if (game.洗车房s.s[i].car) {
                                    hasCar = true;
                                }
                                break;
                            case 装饰店StationId:
                                if (game.装饰店s.s[i].car) {
                                    hasCar = true;
                                }
                                break;
                        }
                        权重和 += hasCar ? positionDatas[i].quanzhong : positionDatas[i].kongwei;
                    }
                }
                if (gongshis.jisuan("状态", false, { 权重总值: conditionData.zongzhi, 权重和: 权重和, 权重增加: game.权重增加s[conditionData.Station] || 0 })) {
                    this.conditionDatas.push(conditionData);
                }
            }
            if (this.conditionDatas.length) { } else {
                this.conditionDatas.push(DatasManager.ConditionDatas[1]);
            }
        } else if (UserStorage.引导加油) {
            UserStorage.引导洗车 = true;
            UserStorage.flush();
            this.conditionDatas.push(DatasManager.ConditionDatas[3]);
        } else {
            UserStorage.引导加油 = true;
            UserStorage.flush();
            this.conditionDatas.push(DatasManager.ConditionDatas[1]);
        }

        for (const conditionData of this.conditionDatas) {
            switch (conditionData.Station) {
                case 洗车房StationId:
                    this.脏.active = true;
                    break;
                case 修理厂StationId:
                    this.冒烟 = true;
                    break;
            }
        }

        this.建筑金钱加成 = 0;
        this.科技金币加成 = 0;

        let output: string = "";
        for (const conditionData of this.conditionDatas) {
            output += "," + DatasManager.StationDatasById[conditionData.Station].Name;
        }
        output = this.happy + " " + output.substr(1);
        console.log(output);

        this.node.x = this.泡泡们.x = x;
        this.node.y = this.泡泡们.y = y;

    }

    private changeModel(): void {
        if (this.modelId == 0) {
            //modelId==0 表示只有一种颜色的车，装饰时不能换颜色
        } else {
            let model: string = "car_" + (this.data.ID % 10) + "_";
            const ran = Math.floor(Math.random() * 10);
            for (let i: number = 0; i < 10; i++) {
                const modelId = (i + ran) % 10;
                if (this.modelId == modelId) {
                    continue;
                }
                this.modelId = modelId;
                if (Atlas.spss["cars"][model + modelId + "_l"]) {
                    model += modelId + "_";
                    break;
                }
            }
            this.imgs[0].getComponent(cc.Sprite).spriteFrame = Atlas.spss["cars"][model + "l"];
            this.imgs[1].getComponent(cc.Sprite).spriteFrame = Atlas.spss["cars"][model + "u"];
            this.imgs[2].getComponent(cc.Sprite).spriteFrame = Atlas.spss["cars"][model + "l"];
            this.imgs[3].getComponent(cc.Sprite).spriteFrame = Atlas.spss["cars"][model + "d"];
        }
    }

    public update表情(): void {
        this.表情.spriteFrame = Atlas.spss["faces"][(DatasManager.FeelingDatas.indexOf(this.currFeelingData) + 1)];
    }

    public 移动(xys: Array<Array<number>>, onMoveComplete: (car: Car) => void): void {
        this.需求.active = false;
        this.targetXYs = xys;
        this.onMoveComplete = onMoveComplete;
        this.status = "移动";
        this.移动一段();
        if (this.station) {
            if (this.station.stationId == 停车位StationId) { } else {
                Sounds.playFX("开车" + (Math.floor(Math.random() * 3) + 1));
            }
        }
    }
    private 移动一段(): void {
        if (isNaN(this.targetXYs[0][0])) {
            this.targetXYs[0][0] = this.node.x;
        }
        if (isNaN(this.targetXYs[0][1])) {
            this.targetXYs[0][1] = this.node.y;
        }
        const dx: number = this.targetXYs[0][0] - this.node.x;
        const dy: number = this.targetXYs[0][1] - this.node.y;
        if (dx * dx > dy * dy) {
            this.dx = dx < 0 ? -1 : 1;
            this.dy = 0;
        } else {
            this.dx = 0;
            this.dy = dy < 0 ? -1 : 1;
        }
        for (const img of this.imgs) {
            img.active = false;
        }
        if (this.dx == 0) {
            this.imgs[this.dy == -1 ? 3 : 1].active = true;
        } else {
            this.imgs[this.dx == -1 ? 2 : 0].active = true;
        }
    }
    public 等待(): void {
        this.status = "等待";
        if (this.conditionDatas.length) {
            this.需求.active = true;
            const stationIdStr = this.conditionDatas[0].Station.toString();
            for (const icon of this.需求.getChildByName("icons").children) {
                icon.active = (icon.name == stationIdStr);
            }
            if (this.station.stationId == 停车位StationId) {
                Sounds.playFX("车喇叭" + (Math.floor(Math.random() * 8) + 1));
            } else {
                Sounds.playFX("提醒下一阶段");
            }
            //在保证不重叠的情况下尽量调大点击区域：
            switch (this.station.stationId) {
                case 停车位StationId:
                    this.node.width = 72;
                    break;
                case 服务站StationId:
                    this.node.width = 88;
                    break;
                default:
                    this.node.width = 110;
                    break;
            }
        } else {
            this.给钱.active = true;
            const effect = sps.getSkel("金币");
            this.给钱.getChildByName("金币").addChild(effect.node);
            playAnimation(effect, getAniNames(effect)[0], true);
            Sounds.playFX("提醒收钱");
        }
        this.update表情();
    }
    public 要玩小游戏(): void {
        this.status = "等待";
        this.小游戏.active = true;
        const stationIdStr = this.conditionDatas[0].Station.toString();
        for (const icon of this.小游戏.getChildByName("icons").children) {
            icon.active = (icon.name == stationIdStr);
        }
        Sounds.playFX("提醒下一阶段");
    }
    public 被服务中(): void {
        this.status = "被服务中";
    }
    public 被服务完毕(): void {
        this.happy = (DatasManager.FeelingDatas.length - DatasManager.FeelingDatas.indexOf(this.currFeelingData)) * game.checkpointData.Min - 0.001;
        console.log("心情恢复到：" + this.happy);
        switch (this.station.stationId) {
            case 洗车房StationId:
                this.脏.active = false;
                break;
            case 修理厂StationId:
                this.冒烟 = false;
                break;
            case 装饰店StationId:
                this.changeModel();
                break;
        }
        const position = UserStorage.positionss[this.station.stationId][this.station.pos];
        const buildData = DatasManager.buildDatasss[this.station.stationId][this.station.pos][position.level - 1];
        for (const technology of UserStorage.technologyss[this.station.stationId]) {
            if (technology.level > 0) {
                this.科技金币加成 += DatasManager.technologyDatasss[this.station.stationId][this.station.pos][technology.level - 1].GoldUp;
            }
        }
        this.建筑金钱加成 += buildData.GoldUp;
        this.conditionDatas.shift();
    }
    public 离开(): void {
        this.status = "离开";
        this.需求.active = false;
        this.小游戏.active = false;
        this.给钱.active = false;
    }

    public step(): void {
        if (this.冒烟) {
            if (Math.random() < 0.4) {
                this.addSmoke();
            }
        }
        switch (this.status) {
            case "移动":
                const dx: number = this.targetXYs[0][0] - this.node.x;
                const dy: number = this.targetXYs[0][1] - this.node.y;
                if (dx * dx + dy * dy > this.speed * this.speed) {
                    this.node.x += this.dx * this.speed;
                    this.node.y += this.dy * this.speed;
                } else {
                    this.node.x = this.targetXYs[0][0];
                    this.node.y = this.targetXYs[0][1];
                    this.targetXYs.shift();
                    if (this.targetXYs.length) {
                        this.移动一段();
                    } else {
                        if (this.onMoveComplete) {
                            const onMoveComplete = this.onMoveComplete;
                            this.onMoveComplete = null;
                            onMoveComplete(this);
                        }
                    }
                }
                break;
            case "等待":
                if (game.currCar == this) { } else {
                    if (this.心情延长时间 > 0) {
                        this.心情延长时间--;
                    } else {
                        if (game.音响播放中) { } else {
                            if ((this.happy -= game.心情衰减速度) < 0) {
                                this.happy = 0;
                            }
                        }
                    }
                    //console.log("happy=" + this.happy);
                    for (const feelingData of DatasManager.FeelingDatas) {
                        if (this.happy > (DatasManager.FeelingDatas.length - DatasManager.FeelingDatas.indexOf(feelingData) - 1) * game.checkpointData.Min) {
                            if (this.currFeelingData != feelingData) {
                                this.currFeelingData = feelingData;
                                this.update表情();
                            }
                            break;
                        }
                    }
                }
                break;
            case "被服务中":
                break;
        }
        this.泡泡们.x = this.node.x;
        this.泡泡们.y = this.node.y;
    }

    private addSmoke(): void {
        const smoke = getSpNode("ui", "烟");
        game.node.addChild(smoke);
        smoke.x = this.node.x + (Math.random() - 0.5) * 4;
        smoke.y = this.node.y + (Math.random() - 0.5) * 4;
        smoke.scaleX = smoke.scaleY = 0.5 + Math.random() * 0.5;
        smoke.runAction(cc.sequence(
            cc.moveTo(2, smoke.x + (Math.random() - 0.5) * 8, smoke.y + 50 + (Math.random() - 0.5) * 8).easing(cc.easeCubicActionOut()),
            cc.callFunc(() => {
                smoke.destroy();
            })
        ));
        smoke.runAction(cc.fadeOut(2));
    }

}
