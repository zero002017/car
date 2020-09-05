import { Sounds } from "../zero/Sounds";
import { popups } from "../popups/Popups";
import { main } from "../Main";
import { UserStorage } from "../zero/UserStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Costs extends cc.Component {

	private static itemNames: Array<string> = ["金币", "钻石"];
	private x0: number;
	public costs: Array<{ node: cc.Node, itemName: string, itemValue: number, money_icon: cc.Node, money_txt: cc.Label, btn: cc.Node }>;

	public init(onCanCost: () => boolean, onCost: () => void): void {
		this.x0 = this.node.x;
		this.costs = new Array();
		let i: number = -1;
		for (const child of this.node.children) {
			i++;
			const btn = child.getChildByName("btn");
			const cost = this.costs[i] = {
				node: child,
				itemName: Costs.itemNames[i],
				itemValue: 0,
				money_icon: btn.getChildByName("icon"),
				money_txt: btn.getChildByName("txt").getComponent(cc.Label),
				btn: btn
			};
			cost.itemName = Costs.itemNames[i];
			cost.btn.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
				Sounds.playFX("点击");
				if (onCanCost) {
					if (onCanCost()) { } else {
						return;
					}
				}
				for (const cost of this.costs) {
					if (cost.btn == evt.target) {
						popups.confirmCost(cost.itemName, cost.itemValue, flag => {
							if (flag) {
								main.moneys.costMoney(cost.itemName, cost.itemValue, onCost);
							}
						}, null);
						break;
					}
				}
			});
		}
	}

	public set(moneys: Array<number>): void {//coins gems
		let i: number = -1;
		let x: number = 0;
		let n: number = 0;
		for (const cost of this.costs) {
			i++;
			const money = moneys[i];
			if (money > 0) {
				n++;
				cost.node.x = x;
				x += 140;
				cost.itemValue = money;
				cost.money_txt.string = money.toString();
				cost.node.active = true;
			} else {
				cost.node.active = false;
			}
		}
		this.node.x = this.x0 - (n - 1) * 140 / 2;
	}

	protected update(dt: number): void {
		for (const cost of this.costs) {
			cost.btn.getComponent(cc.Button).interactable = (UserStorage.getItem(cost.itemName) >= cost.itemValue);
		}
	}

}
