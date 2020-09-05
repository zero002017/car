import { Sounds } from "../zero/Sounds";
import { wid0, platformCtrl } from "../zero/global";
import { prefabs } from "./Prefabs";
import { IMoreGame2 } from "./IMoreGame2";
import { main } from "../Main";
import { DatasManager } from "../datas/DatasManager";
import CPBIcon from "../popups/CPBIcon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoreGame2 extends cc.Component implements IMoreGame2 {

	private area: cc.Node;
	private container: cc.Node;
	private bottom: cc.Node;
	private scrollView: cc.ScrollView;
	private _container: cc.Node;
	public lachu1: cc.Node;
	private exit: cc.Node;

	public init(): void {

		let cpbIndices: Array<number> = platformCtrl.获取n个重复随机CPB(20);
		if (cpbIndices) { } else {
			main.moreGame2 = null;
			return;
		}

		this.area = this.node.getChildByName("area");
		this.container = this.node.getChildByName("container");
		this.bottom = this.container.getChildByName("bottom");
		this.scrollView = this.container.getChildByName("scrollView").getComponent(cc.ScrollView);
		this._container = this.scrollView.node.getChildByName("view").getChildByName("container");
		this.lachu1 = this.container.getChildByName("lachu1");
		this.exit = this.container.getChildByName("exit");

		this.lachu1.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.show();
		});

		this.area.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});

		this.exit.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});

		this.area.active = false;
		this.lachu1.x -= platformCtrl.横幅左边间距;
		this.lachu1.active = false;
		this.bottom.active = false;
		this.scrollView.node.active = false;
		this.exit.active = false;

		this.node.active = true;

		platformCtrl.addMoreGame2(this);

		this.向下滚();

	}

	public autoShow(): void {
		if (this.scrollView.node.active) {
			return;
		}
		this.show();
	}

	public refresh(): void {
		let cpbIndices: Array<number> = platformCtrl.获取n个重复随机CPB(20);
		if (cpbIndices) { } else {
			main.delays.delay({
				time: 0,
				action: () => {
					this.node.active = false;
					platformCtrl.removeMoreGame2(this);
				}
			});
			return;
		}

		this._container.destroyAllChildren();
		let x: number = -1;
		let y: number = 0;
		for (let cpbIndex of cpbIndices) {
			if (++x >= 4) {
				x = 0;
				y++;
			}
			let icon: CPBIcon = prefabs.instantiate("CPBIcon3").getComponent(CPBIcon);
			this._container.addChild(icon.node);
			icon.node.x = x * 270;
			icon.node.y = -y * 260;
			icon.init("抽屉", cpbIndex, false, false, null);
			icon.successRecord = true;
		}
		this._container.height = (y + 1) * 260;
	}

	private show(): void {
		this.refresh();
		this.area.active = true;
		this.bottom.active = true;
		this.scrollView.node.active = true;
		this.exit.active = true;
		this.lachu1.opacity = 0;
		this.container.stopAllActions();
		this.container.runAction(cc.moveTo(0.6, wid0, 0).easing(cc.easeCircleActionInOut()));
	}

	private hide(): void {
		this.area.active = false;
		this.container.stopAllActions();
		this.container.runAction(cc.sequence(
			cc.moveTo(0.4, 0, 0).easing(cc.easeCircleActionInOut()),
			cc.callFunc(() => {
				this.bottom.active = false;
				this.scrollView.node.active = false;
				this.exit.active = false;
				this.lachu1.opacity = 255;
			})
		));
	}

	private 向下滚(): void {
		this.scrollView.scrollToPercentVertical(1, 8, false);
		main.delays.delay({
			time: DatasManager.瀑布流来回一次时间 / 2,
			action: () => {
				this.向上滚();
			}
		});
	}
	private 向上滚(): void {
		this.scrollView.scrollToPercentVertical(0, 8, false);
		main.delays.delay({
			time: DatasManager.瀑布流来回一次时间 / 2,
			action: () => {
				this.向下滚();
			}
		});
	}

}
