import { Popup } from "./Popup";
import { getSpNode, disorder } from "../zero/global";
import { Sounds } from "../zero/Sounds";

const { ccclass, property } = cc._decorator;

@ccclass
export class MiniGameJigsaw extends Popup {

	private 车灯1: cc.Node;
	private 车灯2: cc.Node;
	private items: Array<cc.Node>;
	private poss: Array<cc.Node>;
	private container: cc.Node;
	private parts: Array<cc.Node>;
	private rans: Array<number>;

	private 能点: boolean;

	public onHide: () => void;

	public init(): void {
		this.车灯1 = this.node.getChildByName("车灯1");
		this.车灯2 = this.node.getChildByName("车灯2");
		this.items = this.node.getChildByName("items").children.slice();
		this.poss = this.node.getChildByName("poss").children.slice();
		this.container = this.node.getChildByName("container");
		this.parts = new Array();
		this.rans = new Array();
	}

	public show(): void {
		super.show();

		this.container.destroyAllChildren();

		this.能点 = true;

		this.车灯1.opacity = 0;
		this.车灯2.opacity = 0;

		this.parts.length = 0;
		let i: number = -1;
		disorder(this.poss);
		for (const pos of this.poss) {
			i++;
			const part = getSpNode("miniGames", "部件" + (i + 1));
			this.container.addChild(part);
			this.parts.push(part);
			part.x = pos.x;
			part.y = pos.y;
			part.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
				if (this.能点) { } else {
					return;
				}
				const part = evt.target;
				const index = this.parts.indexOf(part);
				const _index: number = this.rans.indexOf(index);
				if (_index > -1) {

					this.items[index].active = true;

					part.destroy();
					this.parts[index] = null;

					this.rans.splice(_index, 1);

					if (this.rans.length == 1) {
						this.车灯1.stopAllActions();
						this.车灯1.opacity = 255;
					} else {
						this.车灯2.stopAllActions();
						this.车灯2.opacity = 255;
						this.hide();
					}

					Sounds.playFX("小游戏点配件" + (Math.floor(Math.random() * 3) + 1));

				} else {

					this.能点 = false;

					const x = getSpNode("miniGames", "x");
					this.container.addChild(x);
					x.x = part.x;
					x.y = part.y;
					part.destroy();
					this.parts[index] = null;

					if (this.rans.length == 2) {
						this.车灯1.stopAllActions();
						this.车灯1.opacity = 0;
						this.车灯1.runAction(cc.sequence(
							cc.fadeTo(1, 255).easing(cc.easeBounceInOut()),
							cc.callFunc(() => {
								this.车灯1.opacity = 0;
							})
						));
					}

					this.车灯2.stopAllActions();
					this.车灯2.opacity = 0;
					this.车灯2.runAction(cc.sequence(
						cc.fadeTo(1, 255).easing(cc.easeBounceInOut()),
						cc.callFunc(() => {
							this.车灯2.opacity = 0;
							this.能点 = true;
						})
					));

					Sounds.playFX("走了");

				}
			});
		}

		disorder(this.poss);
		this.rans[0] = this.poss[0].getSiblingIndex();
		this.rans[1] = this.poss[1].getSiblingIndex();

		for (const item of this.items) {
			item.active = true;
		}
		this.items[this.rans[0]].active = false;
		this.items[this.rans[1]].active = false;

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
