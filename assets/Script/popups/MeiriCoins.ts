import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { UserStorage } from "../zero/UserStorage";
import WatchVideo from "../ui/WatchVideo";
import { DatasManager } from "../datas/DatasManager";
import { platformCtrl } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export class MeiriCoins extends Popup {

	private times2: cc.Label;
	private num2: cc.Label;
	private times: cc.Label;
	private icon: cc.Node;
	private num: cc.Label;
	private watchVideo: WatchVideo;
	private close: cc.Node;

	private currNum: number;

	public init(): void {

		this.times2 = this.node.getChildByName("times2").getComponent(cc.Label);
		this.num2 = this.node.getChildByName("num2").getComponent(cc.Label);
		this.times = this.node.getChildByName("times").getComponent(cc.Label);
		this.icon = this.node.getChildByName("icon");
		this.num = this.node.getChildByName("num").getComponent(cc.Label);

		this.watchVideo = this.node.getChildByName("watchVideo").getComponent(WatchVideo);
		this.watchVideo.init();

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});
	}

	private refresh(): void {

		this.watchVideo.set("现在观看", "每日金币", DatasManager.每日金币观看视频, null, () => {
			main.moneys.addMoney("金币", this.currNum, this.icon, null);
			UserStorage.meiriCoinsTimes++;
			this.refresh();
			UserStorage.flush();
		});

		let currTimes: number = UserStorage.meiriCoinsTimes + 1;

		let nextBigTimes: number;
		if (currTimes < DatasManager.第n次每日金币s.length - 1) {
			nextBigTimes = currTimes;
			while (nextBigTimes < DatasManager.第n次每日金币s.length) {
				if (DatasManager.第n次每日金币s[nextBigTimes]) {
					break;
				}
				nextBigTimes++;
			}
		} else {
			nextBigTimes = DatasManager.第n次每日金币s.length - 1;
		}

		this.times2.string = nextBigTimes.toString();
		this.num2.string = "x" + DatasManager.第n次每日金币s[nextBigTimes];

		this.times.string = currTimes.toString();
		this.currNum = DatasManager.第n次每日金币s[currTimes] || DatasManager.第n次每日金币;
		this.num.string = "x" + this.currNum;

	}

	public show(): void {
		super.show();

		main.hideBannerAd();

		main.moneysUp();

		this.refresh();
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();
	}

	public hideComplete(): void {
		super.hideComplete();
		
		//platformCtrl.showMoreGame();
	}

}
