import { Popup } from "./Popup";
import { disorder, getSpNode } from "../zero/global";
import { Sounds } from "../zero/Sounds";
import { game } from "../pages/Game";
import { main } from "../Main";

const { ccclass, property } = cc._decorator;

@ccclass
export class MiniGameMatch extends Popup {

	private circles: Array<cc.Node>;
	private pos1: cc.Node;
	private pos2: cc.Node;
	private container: cc.Node;
	private tires: Array<cc.Node>;
	private ran: number;

	private 能点: boolean;

	public onHide: () => void;

	public init(): void {
		this.circles = this.node.getChildByName("circles").children.slice();
		this.pos1 = this.node.getChildByName("pos1");
		this.pos2 = this.node.getChildByName("pos2");
		this.container = this.node.getChildByName("container");
		this.tires = new Array();
	}

	public show(): void {
		super.show();

		this.container.destroyAllChildren();
		this.pos1.destroyAllChildren();
		this.pos2.destroyAllChildren();

		this.能点 = true;

		this.tires.length = 0;
		let i: number = -1;
		disorder(this.circles);
		for (const circle of this.circles) {
			i++;
			const tire = getSpNode("miniGames", "轮胎" + (i + 1));
			this.container.addChild(tire);
			this.tires.push(tire);
			tire.x = circle.x;
			tire.y = circle.y;
			tire.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
				if (this.能点) { } else {
					return;
				}
				const tire = evt.target;
				const index = this.tires.indexOf(tire);
				if (this.tires.indexOf(tire) == this.ran) {

					tire.destroy();
					this.tires[index] = null;

					this.pos2.addChild(getSpNode("miniGames", "轮胎" + (this.ran + 1)));

					this.hide();

					Sounds.playFX("小游戏点轮胎");

				} else {

					this.能点 = false;

					const x = getSpNode("miniGames", "x");
					this.container.addChild(x);
					x.x = tire.x;
					x.y = tire.y;
					tire.destroy();
					this.tires[index] = null;

					main.delays.delay({
						time: 1,
						action: () => {
							this.能点 = true;
						}
					});

					Sounds.playFX("走了");

				}
			});
		}

		this.ran = Math.floor(Math.random() * this.circles.length);
		this.pos1.addChild(getSpNode("miniGames", "轮胎" + (this.ran + 1)));
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
