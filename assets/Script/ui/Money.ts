import { UserStorage } from "../zero/UserStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Money extends cc.Component {

    public icon: cc.Node;
    public txt: cc.Label;
    public add_: cc.Node;

    public itemName: string;
    public value: number;

    public init(): void {
        const money: cc.Node = this.node.getChildByName("money");
        this.icon = money.getChildByName("icon");
        this.txt = money.getChildByName("txt").getComponent(cc.Label);
        this.add_ = this.node.getChildByName("add_");
    }

    public set(itemName: string): void {
        this.itemName = itemName;
        this.value = UserStorage.getItem(this.itemName);
        this.refresh();
    }

    public refresh(): void {
        this.txt.string = this.value.toString();
    }

}
