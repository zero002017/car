import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import Costs from "../ui/Costs";
import { main } from "../Main";
import { Atlas } from "../zero/Atlas";
import { prefabs } from "../ui/Prefabs";
import { 礼品店StationId, 音响StationId, getSpNode, formatTime } from "../zero/global";
import Station from "../game/Station";
import 音响 from "../game/音响";
import 礼品店 from "../game/礼品店";
import { DatasManager } from "../datas/DatasManager";
import { UserStorage } from "../zero/UserStorage";
import TechnologyData from "../datas/TechnologyData";
import WatchVideo from "../ui/WatchVideo";

const { ccclass, property } = cc._decorator;

@ccclass
export class Costs2 extends Popup {

	private titleIcon: cc.Sprite;
	private title: cc.Label;
	private container: cc.Node;
	public time: cc.Node;
	public timeTxt: cc.Label;
	private info: cc.Label;
	private desc1: cc.Label;
	private desc2: cc.Label;
	private costs: Costs;
	private videoInfo: cc.Label;
	private watchVideo: WatchVideo;
	private close: cc.Node;

	private onHide: (success: boolean) => void;

	public init(): void {

		this.titleIcon = this.node.getChildByName("titleIcon").getComponent(cc.Sprite);
		this.title = this.node.getChildByName("title").getComponent(cc.Label);
		this.container = this.node.getChildByName("container");
		this.time = this.node.getChildByName("time");
		this.timeTxt = this.time.getChildByName("txt").getComponent(cc.Label);
		this.info = this.node.getChildByName("info").getComponent(cc.Label);
		this.desc1 = this.node.getChildByName("desc1").getComponent(cc.Label);
		this.desc2 = this.node.getChildByName("desc2").getComponent(cc.Label);

		this.costs = this.node.getChildByName("costs").getComponent(Costs);
		this.costs.init(null, () => {
			this.hide();
			if (this.onHide) {
				this.onHide(true);
				this.onHide = null;
			}
		});

		this.videoInfo = this.node.getChildByName("videoInfo").getComponent(cc.Label);
		this.watchVideo = this.node.getChildByName("watchVideo").getComponent(WatchVideo);
		this.watchVideo.init();

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
			if (this.onHide) {
				this.onHide(false);
				this.onHide = null;
			}
		});

	}

	public set(key: "购买" | "增加" | "升级1" | "升级2" | "等待" | "完成", stationOrTechnologyData: 音响 | 礼品店 | Station | TechnologyData, position: UserStorage.Position, info: string, desc1: string, desc2: string, onHide: (success: boolean) => void, moneys: Array<number>): void {

		this.onHide = onHide;

		this.titleIcon.spriteFrame = Atlas.spss["keys"][key];

		this.time.active = false;
		this.costs.node.active = true;
		this.videoInfo.node.active = false;
		this.watchVideo.node.active = false;
		switch (key) {
			case "购买":
				this.title.string = "建造";
				break;
			case "升级1":
			case "升级2":
				this.title.string = "升级";
				break;
			case "等待":
				this.title.string = "加速";
				this.videoInfo.string = "看视频减" + formatTime(DatasManager.一钻等于几秒钟, false);
				const f = () => {
					this.watchVideo.set("视频加速", "看视频加速", DatasManager.看视频加速观看视频, null, () => {
						position.startTime -= DatasManager.一钻等于几秒钟 * 1000;
						UserStorage.flush();
						f();
					});
				};
				f();
				break;
			default:
				this.title.string = key;
				break;
		}

		this.container.destroyAllChildren();

		let node: cc.Node;
		if (
			stationOrTechnologyData instanceof 音响 ||
			stationOrTechnologyData instanceof 礼品店 ||
			stationOrTechnologyData instanceof Station
		) {
			const stationData = DatasManager.StationDatasById[stationOrTechnologyData.stationId];
			node = prefabs.instantiate(stationData.Name);
			switch (stationData.ID) {
				case 音响StationId:
				case 礼品店StationId:
					node.children[0].active = false;
					break;
				default:
					const station = new Station();
					station.init(node, stationOrTechnologyData.stationId, stationOrTechnologyData.pos);
					station.refresh();
					const position = UserStorage.positionss[station.stationId][station.pos];
					const currLevel = (position ? position.level : 0);
					station.s[currLevel].active = false;
					station.s[currLevel + 1].active = true;
					station.框框.node.active = true;
					station.框框.set(currLevel + 1);
					break;
			}
		} else {
			node = getSpNode("technologys", (stationOrTechnologyData.ID - 112000000).toString());
		}
		this.container.addChild(node);

		this.info.string = info;
		this.desc1.string = desc1;
		this.desc2.string = desc2;

		this.costs.set(moneys);

	}

	public updateWait(restSec: number): void {
		if (restSec > 0) {
			this.timeTxt.string = formatTime(restSec, true);
			this.costs.costs[1].itemValue = Math.ceil(restSec / DatasManager.一钻等于几秒钟);
			this.costs.costs[1].money_txt.string = this.costs.costs[1].itemValue.toString();
			if (UserStorage.getItem("钻石") >= this.costs.costs[1].itemValue) {
				this.costs.node.active = true;
				this.videoInfo.node.active = false;
				this.watchVideo.node.active = false;
			} else {
				this.costs.node.active = false;
				this.videoInfo.node.active = true;
				this.watchVideo.node.active = true;
			}
		} else {
			this.hide();
			if (this.onHide) {
				this.onHide(false);
				this.onHide = null;
			}
		}
	}

	public show(): void {
		super.show();

		main.moneysUp();

		Sounds.playFX("建筑点击音效");
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
