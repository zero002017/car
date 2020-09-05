import { UserStorage } from "../zero/UserStorage";
import { HeroInfo } from "../zero/global";
import { DatasManager } from "../datas/DatasManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeroInfos extends cc.Component {

    public lv: cc.Label;
    public evaluate: cc.Label;

    public init(): void {
        this.lv = this.node.getChildByName("lv").getComponent(cc.Label);
        this.evaluate = this.node.getChildByName("evaluate").getComponent(cc.Label);
    }

    public set(heroInfo: HeroInfo): void {
        this.lv.string = heroInfo.level.toString();
        this.evaluate.string = UserStorage.lastEvaluate > -1 ? DatasManager.EvaluateDatas[UserStorage.lastEvaluate].score : "--";
    }

}
