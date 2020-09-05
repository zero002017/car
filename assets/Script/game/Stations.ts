import Station from "./Station";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Stations extends cc.Component {

    public stationId: number;
    public s: Array<Station>;
    public 牌: cc.Node;

    public init(stationId: number): void {
        this.stationId = stationId;
        const s: cc.Node = this.node.getChildByName("s");
        this.s = new Array();
        let i: number = -1;
        for (const child of s.children) {
            i++;
            const station = new Station();
            this.s.push(station);
            station.init(child, this.stationId, i);
        }
        this.牌 = this.node.getChildByName("牌");
    }

    public refresh(): void {
        for (const station of this.s) {
            station.refresh();
        }
    }

}
