import LevelData from "../datas/LevelData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExpBar extends cc.Component {

    private bar: cc.Node;
    private barWid0: number;

    public init(): void {
        this.bar = this.node.getChildByName("bar");
        this.barWid0 = this.bar.width;
    }

    public set(showExp: number, nextLevelData: LevelData): void {
        if (nextLevelData) {
            //this.exp.visible = true;
            //this.已满级.visible = false;
            //this.exp.text = showExp + "/" + nextLevelData.NeedExp;
            this.bar.width = this.barWid0 * showExp / nextLevelData.Exp;
        } else {
            //this.exp.visible = false;
            //this.已满级.visible = true;
            this.bar.width = this.barWid0;
        }
    }

}
