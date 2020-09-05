const { ccclass, property } = cc._decorator;

@ccclass
export default class Version extends cc.Component {

	protected start(): void {
		this.node.getChildByName("txt").getComponent(cc.Label).string = "v1000";
	}

}
