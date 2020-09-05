import 框框 from "./框框";
import { UserStorage } from "../zero/UserStorage";
import Car from "./Car";
import { game } from "../pages/Game";
import { DatasManager } from "../datas/DatasManager";

export default class Station {

    public node: cc.Node;
    public stationId: number;
    //比如：已解锁，已解锁，未解锁，已解锁
    //则 index 为：0, 1, x, 2
    //pos 为：0, 1, x, 3
    public index:number;
    public pos: number;
    public s: Array<cc.Node>;
    public 框框: 框框;
    public 预览: cc.Sprite;
    private done: (car: Car, station: Station) => void;

    public car: Car;//有车或正有车开过去

    public init(node: cc.Node, stationId: number, pos: number): void {
        this.node = node;
        this.stationId = stationId;
        this.pos = pos;
        this.s = this.node.getChildByName("container").children.slice();
        this.框框 = new 框框();
        this.框框.init(this.node.getChildByName("框框"));
        this.预览 = new cc.Node().addComponent(cc.Sprite);
        this.框框.node.addChild(this.预览.node);
        this.预览.node.opacity = 150;
    }

    public refresh(): void {
        const position = UserStorage.positionss[this.stationId][this.pos];
        for (const dsp of this.s) {
            dsp.active = false;
        }
        if (position && position.level > 0) {
            if (this.s[position.level]) {
                this.s[position.level].active = true;
            }
            this.框框.node.active = true;
            this.框框.set(position.level);
        } else {
            this.s[0].active = true;
            this.框框.node.active = false;
        }
    }

    public doo(done: (car: Car, station: Station) => void) {
        this.done = done;
        const position = UserStorage.positionss[this.stationId][this.pos];
        const buildData = DatasManager.buildDatasss[this.stationId][this.pos][position.level - 1];
        console.log("预计服务时间：" + buildData.JobTime + "秒");
        const startTime = new Date().getTime();
        game.delays.delay({
            time: buildData.JobTime,
            action: () => {
                console.log("实际服务时间：" + (new Date().getTime() - startTime) + "毫秒");
                done = this.done;
                this.done = null;
                done(this.car, this);
            }
        });
    }

}
