import Counter from "../zero/Counter";
import { platformCtrl, cdn } from "../zero/global";
import { Sounds } from "../zero/Sounds";
import { UserStorage } from "../zero/UserStorage";
import { stageWid } from "../Main";
import { LoadImgs } from "../zero/LoadImgs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InsertCPB extends cc.Component {

	private img: cc.Sprite;
	private time: cc.Label;

	private counter: Counter;

	private pos: string;
	private cpbGameInfo: CPBGameInfo;
	private cpbIndex: number;
	private cpbIndex2: number;

	public init(): void {
		this.img = this.node.getChildByName("img").getComponent(cc.Sprite);
		this.time = this.node.getChildByName("time").getComponent(cc.Label);
		this.node.on(cc.Node.EventType.TOUCH_END, () => {
			Sounds.playFX("点击");
			if (this.counter) {
				this.counter.stop();
				this.counter = null;
			}
			platformCtrl.openCPB(this.pos, null, this.cpbGameInfo, false, false, (icon, cpbGameInfo, success) => {
				if (success) {
					UserStorage.用户跳转过的CPA插屏2.push(cpbGameInfo.appId);
					UserStorage.flush();
					this.hide();
				} else {
					if (this.cpbIndex2) {
						this.show(this.cpbIndex2, -1, this.pos);
					} else {
						this.hide();
					}
				}
			});
		});
	}

	private hide(): void {
		if (this.counter) {
			this.counter.stop();
			this.counter = null;
		}
		this.node.active = false;
	}

	public show(cpbIndex: number, cpbIndex2: number, pos: string): void {
		this.cpbIndex = cpbIndex;
		this.cpbIndex2 = cpbIndex2;
		this.pos = pos;
		this.node.active = true;
		console.log("cpbIndex=" + this.cpbIndex, "cpbIndex2=" + this.cpbIndex2);
		if (this.counter) {
			this.counter.stop();
			this.counter = null;
		}
		this.cpbGameInfo = platformCtrl.cpbConfig.cpbs[this.cpbIndex];
		let url: string = this.cpbGameInfo.insert;
		if (url.indexOf("https://") == 0) { } else {
			url = cdn + "cpa/" + url;
		}
		LoadImgs.load(url, sp => {
			this.img.spriteFrame = sp;
			this.img.node.width = stageWid;
			this.counter = new Counter();
			this.counter.init(5, sec => {
				this.time.string = sec + "秒后跳过";
			});
			this.counter.start(() => {
				this.hide();
			});
		}, true);
	}

}
