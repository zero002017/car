import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import WatchVideo from "../ui/WatchVideo";
import { platformCtrl, guideAllComplete, getSpNode, getHeroInfo, HeroInfo } from "../zero/global";
import HeroInfos from "../game/HeroInfos";
import { game } from "../pages/Game";
import { DatasManager } from "../datas/DatasManager";
import { UserStorage } from "../zero/UserStorage";
import LevelData from "../datas/LevelData";
import ExpBar from "../game/ExpBar";
import { popups } from "./Popups";
import { RewardGems } from "./RewardGems";

const { ccclass, property } = cc._decorator;

let 胜利视频倍数Index: number = -1;

@ccclass
export class End extends Popup {

	private faces: cc.Node;
	private heroInfos: HeroInfos;
	private expBar: ExpBar;
	private coin: cc.Node;
	private coins: cc.Label;
	private gem: cc.Node;
	private gems: cc.Label;
	private 恭喜升级: cc.Node;
	private lingqu: cc.Node;
	private watchVideo: WatchVideo;

	private nextHeroInfo: HeroInfo;
	private 升级奖励钻石: number;

	public onHide: () => void;

	public init(): void {

		this.faces = this.node.getChildByName("faces");
		this.heroInfos = this.node.getChildByName("heroInfos").getComponent(HeroInfos);
		this.heroInfos.init();
		this.expBar = this.node.getChildByName("expBar").getComponent(ExpBar);
		this.expBar.init();
		const _coins = this.node.getChildByName("coins");
		this.coin = _coins.getChildByName("icon");
		this.coins = _coins.getChildByName("txt").getComponent(cc.Label);
		const _gems = this.node.getChildByName("gems");
		this.gem = _gems.getChildByName("icon");
		this.gems = _gems.getChildByName("txt").getComponent(cc.Label);
		this.恭喜升级 = this.node.getChildByName("恭喜升级");

		this.lingqu = this.node.getChildByName("lingqu");
		this.lingqu.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			main.moneys.addMoney("金币", game.gameMoneys.金币.value, this.coin, null);
			main.moneys.addMoney("钻石", this.升级奖励钻石, this.gem, null);
			this.hide();
		});

		this.watchVideo = this.node.getChildByName("watchVideo").getComponent(WatchVideo);
		this.watchVideo.init();

	}

	public show(): void {
		super.show();

		main.moneysUp();

		main.showBannerAd("结算", 0, 1);

		main.startCPB.active(this.node);

		this.faces.destroyAllChildren();
		let koufens: number = 0;
		let exps: number = 0;
		let x: number = -1;
		let y: number = 0;
		for (const feelingData of game.feelingDatas) {
			koufens += feelingData.Koufen;
			exps += feelingData.EXP;
			const face = getSpNode("faces", (DatasManager.FeelingDatas.indexOf(feelingData) + 1).toString());
			this.faces.addChild(face);
			if (++x >= 15) {
				x = 0;
				y++;
			}
			face.x = x * 24;
			face.y = -y * 24;
		}

		UserStorage.lastEvaluate = -1;
		for (const evaluateData of DatasManager.EvaluateDatas) {
			UserStorage.lastEvaluate++;
			if (evaluateData.Koufens >= koufens) {
				break;
			}
		}

		UserStorage.exp += exps;
		UserStorage.flush();

		this.heroInfos.set(game.heroInfo);
		this.heroInfos.evaluate.string = "";
		this.expBar.set(game.heroInfo.showExp, game.heroInfo.nextLevelData);

		this.恭喜升级.active = false;

		this.coins.string = game.gameMoneys.金币.value.toString();
		this.升级奖励钻石 = 0;
		this.nextHeroInfo = getHeroInfo(UserStorage.exp);
		if (this.nextHeroInfo.level > game.heroInfo.level) {
			for (let level = game.heroInfo.level + 1; level <= this.nextHeroInfo.level; level++) {
				const levelData = DatasManager.LevelDatas[level - 1];
				this.升级奖励钻石 += levelData.zuanshi;
			}
		}
		this.gems.string = this.升级奖励钻石.toString();

		if (guideAllComplete()) {
			胜利视频倍数Index = Math.floor(Math.random() * DatasManager.胜利视频倍数.length);
		} else {
			胜利视频倍数Index = 0;
		}
		const 倍数 = DatasManager.胜利视频倍数[胜利视频倍数Index];

		this.watchVideo.set(倍数 + "倍领取", "胜利", DatasManager.胜利观看视频, null, () => {
			main.moneys.addMoney("金币", game.gameMoneys.金币.value * 倍数, this.coin, null);
			main.moneys.addMoney("钻石", this.升级奖励钻石 * 倍数, this.gem, null);
			this.hide();
		});

		Sounds.stopMusic();

		platformCtrl.showInsertAdDelay("结算开始插屏广告");
	}

	public showComplete(): void {
		super.showComplete();

		platformCtrl.showMoreGame2Btn();

		const nodes: Array<{ showExp: number, expStep: number, level: number, reachExp: number, nextLevelData: LevelData }> = new Array();
		for (let level: number = game.heroInfo.level; level <= this.nextHeroInfo.level; level++) {
			let currLevelData: LevelData = DatasManager.LevelDatas[level - 1];
			let nextLevelData: LevelData = DatasManager.LevelDatas[level];
			nodes.push({
				showExp: 0,
				expStep: Math.max(1, Math.round((nextLevelData || currLevelData).Exp * 0.008)),
				level: level,
				reachExp: (nextLevelData || currLevelData).Exp,
				nextLevelData: nextLevelData
			});
		}
		nodes[0].showExp = game.heroInfo.showExp;
		nodes[nodes.length - 1].reachExp = this.nextHeroInfo.showExp;
		//console.log(JSON.stringify(nodes, null, "\t"));

		let nodeIndex: number = 0;
		Sounds.playFX("结算经验条");
		const step = () => {
			let node = nodes[nodeIndex];
			if ((node.showExp += node.expStep) >= node.reachExp) {
				node.showExp = node.reachExp;

				if (++nodeIndex >= nodes.length || nodes[nodeIndex].level == DatasManager.LevelDatas.length) {
					main.enterFrames.clear(step);

					this.heroInfos.set(this.nextHeroInfo);
					this.expBar.set(this.nextHeroInfo.showExp, this.nextHeroInfo.nextLevelData);

					cc.audioEngine.stopAllEffects();

					if (this.nextHeroInfo.level > game.heroInfo.level) {
						this.恭喜升级.active = true;
						this.恭喜升级.stopAllActions();
						this.恭喜升级.scaleX = this.恭喜升级.scaleY = 2;
						this.恭喜升级.opacity = 0;
						this.恭喜升级.runAction(cc.scaleTo(0.8, 1, 1).easing(cc.easeBackOut()));
						this.恭喜升级.runAction(cc.fadeIn(0.8));

						Sounds.playFX("结算经验条停止");
					}

					if (game.currEventData.Type == "根据评分奖励钻石") {
						popups.show(RewardGems);
					}

					return;

				} else {
					this.heroInfos.lv.string = nodes[nodeIndex].level.toString();
				}
			}
			this.expBar.set(node.showExp, node.nextLevelData);
		};

		main.enterFrames.add(step);
	}

	public hide(): void {
		super.hide();

		main.hideBannerAd();

		platformCtrl.hideMoreGame2Btn();

		if (this.onHide) {
			this.onHide();
			this.onHide = null;
		}
	}

	public hideComplete(): void {
		super.hideComplete();

		main.startCPB.deactive();
	}

}
