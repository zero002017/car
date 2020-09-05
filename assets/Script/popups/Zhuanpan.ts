import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { DatasManager } from "../datas/DatasManager";
import ZhuanpanData from "../datas/ZhuanpanData";
import { UserStorage } from "../zero/UserStorage";
import { popups } from "./Popups";
import { Zhuanpan_item } from "./Zhuanpan_item";
import { ZhuanpanChest } from "./ZhuanpanChest";
import { Zhongjiang } from "./Zhongjiang";
import { platformCtrl, 检测全部转盘宝箱都领完了并重置转盘宝箱 } from "../zero/global";
import WatchVideo from "../ui/WatchVideo";

const { ccclass, property } = cc._decorator;

export let zhuanpan: Zhuanpan;

@ccclass
export class Zhuanpan extends Popup {

	private watchVideo: WatchVideo;
	private pointer: cc.Node;
	private label1: cc.Label;
	private label2: cc.Label;
	private totalTimes1: cc.Label;
	private totalTimes2: cc.Label;
	private bar: cc.Node;
	private close: cc.Node;

	private currZhuanpanData: ZhuanpanData;
	private maxTimes: number;
	private items: Array<Zhuanpan_item>;
	private chests: Array<ZhuanpanChest>;

	public init(): void {

		zhuanpan = this;

		this.watchVideo = this.node.getChildByName("watchVideo").getComponent(WatchVideo);
		this.watchVideo.init();

		this.pointer = this.node.getChildByName("pointer");
		this.label1 = this.node.getChildByName("label1").getComponent(cc.Label);
		this.label2 = this.node.getChildByName("label2").getComponent(cc.Label);
		this.totalTimes1 = this.node.getChildByName("totalTimes1").getComponent(cc.Label);
		this.totalTimes2 = this.node.getChildByName("totalTimes2").getComponent(cc.Label);
		this.bar = this.node.getChildByName("bar");

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});

		let _items: cc.Node = this.node.getChildByName("items");
		this.items = new Array();
		let i: number = -1;
		for (let child of _items.children) {
			i++;
			let item: Zhuanpan_item = child.getComponent(Zhuanpan_item);
			this.items[i] = item;
			item.init(DatasManager.ZhuanpanDatas[i]);
			item.node.angle = i * -45;
		}

		let _chests: cc.Node = this.node.getChildByName("chests");
		this.chests = new Array();
		this.maxTimes = DatasManager.ZhuanpanChestDatas[DatasManager.ZhuanpanChestDatas.length - 1].Times;
		i = -1;
		for (let child of _chests.children) {
			i++;
			let chest: ZhuanpanChest = child.getComponent(ZhuanpanChest);
			this.chests[i] = chest;
			chest.init(DatasManager.ZhuanpanChestDatas[i]);
		}

		this.pointer.on(cc.Node.EventType.TOUCH_START, () => {
			if (UserStorage.freeChoujiangTimes > 0) {
				UserStorage.freeChoujiangTimes--;
				Sounds.playFX("点击");
				this._choujiang(true);
				UserStorage.flush();
			} else {
				this.watchVideo.node.dispatchEvent(new cc.Event(cc.Node.EventType.TOUCH_START, false));
				this.watchVideo.node.dispatchEvent(new cc.Event(cc.Node.EventType.TOUCH_END, false));
			}
		});

	}

	public refresh(): void {
		this.label1.string = this.label2.string = UserStorage.freeChoujiangTimes > 0 ? "免费抽" : "视频抽";
		this.totalTimes1.string = this.totalTimes2.string = UserStorage.choujiangTimes.toString();
		this.bar.scaleX = Math.min(UserStorage.choujiangTimes / this.maxTimes, 1);
		for (let chest of this.chests) {
			chest.refresh();
		}

		this.watchVideo.set("双倍领取", "转盘", DatasManager.胜利观看视频, null, () => {
			this._choujiang(false);
		});
	}

	private _choujiang(free: boolean): void {
		main.disable.active = true;
		this.currZhuanpanData = DatasManager.zhuanpanDatasByRate[Math.floor(Math.random() * DatasManager.zhuanpanDatasByRate.length)];
		while (this.pointer.angle < -360) {
			this.pointer.angle += 360;
		}
		let n: number = 6 + Math.ceil(-this.pointer.angle / 360) + DatasManager.ZhuanpanDatas.indexOf(this.currZhuanpanData) / DatasManager.ZhuanpanDatas.length;
		let targetAngle: number = n * 360;
		this.pointer.runAction(cc.sequence(
			cc.rotateTo(4, targetAngle).easing(cc.easeCircleActionInOut()),
			cc.callFunc(() => {
				main.disable.active = false;
				let popup: Zhongjiang = popups.show(Zhongjiang);
				popup.set(this.currZhuanpanData, 倍数 => {
					let itemName: string;
					let itemNum: number;
					if (this.currZhuanpanData.Gems > 0) {
						itemName = "钻石";
						itemNum = this.currZhuanpanData.Gems;
					} else {
						itemName = "金币";
						itemNum = this.currZhuanpanData.Coins;
					}
					main.moneys.addMoney(itemName, itemNum * 倍数, popup.icon.node, null);
					UserStorage.choujiangTimes++;
					UserStorage.flush();
					this.refresh();
					if (free) {
						platformCtrl.showInsertAdDelay("转盘领取奖励插屏广告");
					}
				})
			})
		));
	}

	public show(): void {
		super.show();

		main.moneysUp();

		main.showBannerAd("签到转盘客服", 0, 1);

		检测全部转盘宝箱都领完了并重置转盘宝箱();

		this.refresh();
	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();

		main.hideBannerAd();
	}

	public hideComplete(): void {
		super.hideComplete();
	}

}
