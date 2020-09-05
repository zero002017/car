import { Popup } from "./Popup";
import { main } from "../Main";
import { Sounds } from "../zero/Sounds";

const { ccclass, property } = cc._decorator;

@ccclass
export class Help extends Popup {

	private pageIndex: number;
	private pages: Array<cc.Node>;

	public init(): void {

		this.node.getChildByName("通用框").on(cc.Node.EventType.TOUCH_START, () => {
			this.nextPage();
		});

		this.pages = [
			this.node.getChildByName("help1"),
			this.node.getChildByName("help2"),
			this.node.getChildByName("help3"),
			this.node.getChildByName("help4")
		];

	}

	private nextPage(): void {
		if (++this.pageIndex >= this.pages.length) {
			this.hide();
		} else {
			for (const page of this.pages) {
				page.active = false;
			}
			this.pages[this.pageIndex].active = true;
			Sounds.playFX("下一页按钮音效");
		}
	}

	public show(): void {
		super.show();

		main.moneysDown();

		this.pageIndex = -1;
		this.nextPage();
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();
	}

	public hideComplete(): void {
		super.hideComplete();
	}

}
