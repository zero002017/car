import CPBIcon from "../popups/CPBIcon";
import { platformCtrl, disorder } from "../zero/global";
import { IMoreGame2 } from "./IMoreGame2";
import { prefabs } from "./Prefabs";
import { main } from "../Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BottomCPBs extends cc.Component implements IMoreGame2 {

    private scrollView: cc.ScrollView;

    private key: string;
    private pos: string;
    private container: cc.Node;

    public init(key: string, pos: string): void {

        this.scrollView = this.node.getChildByName("scrollView").getComponent(cc.ScrollView);
        this.container = this.scrollView.node.getChildByName("view").getChildByName("container");

        this.key = key;
        this.pos = pos;

        this.refresh();

        platformCtrl.addMoreGame2(this);

        this.向右滚();
    }

    public refresh(): void {
        if (platformCtrl.cpbConfig) {

            this.container.destroyAllChildren();

            let cpbIndices: Array<number> = platformCtrl.获取n个重复随机CPB(20);
            let successRecord: boolean;
            if (cpbIndices) {
                successRecord = true;
            } else {
                cpbIndices = new Array();
                let cpbIndex: number = platformCtrl.cpbConfig.cpbs.length;
                while (cpbIndex--) {
                    cpbIndices.push(cpbIndex);
                }
                disorder(cpbIndices);
                successRecord = false;
            }
            let i: number = -1;
            for (let cpbIndex of cpbIndices) {
                i++;
                let icon: CPBIcon = prefabs.instantiate("CPBIcon").getComponent(CPBIcon);
                this.container.addChild(icon.node);
                icon.node.x = 50 + i * 120;
                icon.init(this.pos, cpbIndex, successRecord, true, null);
            }
            this.container.width = (i + 1) * 120;

        }
    }

    private 向右滚(): void {
        this.scrollView.scrollToPercentHorizontal(1, 15, false);
        main.delays.delay({
            time: 16,
            action: () => {
                this.向左滚();
            }
        });
    }
    private 向左滚(): void {
        this.scrollView.scrollToPercentHorizontal(0, 15, false);
        main.delays.delay({
            time: 16,
            action: () => {
                this.向右滚();
            }
        });
    }

}
