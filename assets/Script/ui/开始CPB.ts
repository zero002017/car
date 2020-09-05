import CPBIcon from "../popups/CPBIcon";
import { platformCtrl, disorder } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class 开始CPB extends cc.Component {

	public init(): void {

		let restCPBIndices: Array<number> = new Array();
		let cpbIndex: number = -1;
		for (let cpbGameInfo of platformCtrl.cpbConfig.cpbs) {
			cpbIndex++;
			if (platformCtrl.cpbConfig.推荐1.indexOf(cpbIndex) == -1) {
				restCPBIndices.push(cpbIndex);
			}
		}
		disorder(restCPBIndices);

		let icons1: cc.Node = this.node.getChildByName("icons1");
		let i: number = -1;
		for (let child of icons1.children) {
			i++;
			if (i < platformCtrl.cpbConfig.推荐1.length) {
				cpbIndex = platformCtrl.cpbConfig.推荐1[i];
			} else {
				cpbIndex = restCPBIndices.pop();
			}
			child.getComponent(CPBIcon).init("开始CPA", cpbIndex, false, true, null);
		}
		
		let icons2: cc.Node = this.node.getChildByName("icons2");
		for (let child of icons2.children) {
			child.getComponent(CPBIcon).init("开始CPA", restCPBIndices, false, true, null);
		}

	}

	public active(container: cc.Node): void {
		if (platformCtrl.cpbConfig) {

			this.node.parent.removeChild(this.node, false);
			container.addChild(this.node);

			this.node.x = 0;
			this.node.y = 0;

			this.node.active = true;

		}
	}

	public deactive(): void {
		this.node.active = false;
	}

}
