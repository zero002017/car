import { Popup } from "./Popup";
import { main } from "../Main";
import TechnologyItem from "../ui/TechnologyItem";
import { UserStorage } from "../zero/UserStorage";
import { Sounds } from "../zero/Sounds";

const { ccclass, property } = cc._decorator;

@ccclass
export class Technologys extends Popup {

	private items: Array<TechnologyItem>;
	private close: cc.Node;

	private onHide: () => void;

	public init(): void {
		const items = this.node.getChildByName("items");
		this.items = new Array();
		for (const child of items.children) {
			const item = child.getComponent(TechnologyItem);
			this.items.push(item);
			item.init();
		}

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});
	}

	public set(stationId: number, onHide: () => void): void {
		const technologys = UserStorage.technologyss[stationId];
		let i: number = -1;
		for (const technology of technologys) {
			i++;
			this.items[i].set(stationId, i, technology);
		}
		this.onHide = onHide;
	}

	public show(): void {
		super.show();

		main.moneysUp();
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();
		
		if (this.onHide) {
			this.onHide();
			this.onHide = null;
		}
	}

	public hideComplete(): void {
		super.hideComplete();
	}

}
