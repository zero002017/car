import { Popup } from "./Popup";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { prefabs } from "../ui/Prefabs";
import { FriendRankItem } from "./FriendRankItem";
import { OpenDataContexts, platformCtrl } from "../zero/global";
import { RankItem } from "./RankItem";

const { ccclass, property } = cc._decorator;

export interface RankData {
	openId: string;
	nickname: string;
	score: number;
}

export interface RankDatas {
	ranks?: Array<RankData>;
	self: { vs: number, fast1?: number, fast2?: number, fast3?: number, kill: number };
	friends: { vs?: Array<RankData>, fast1?: Array<RankData>, fast2?: Array<RankData>, fast3?: Array<RankData>, kill: Array<RankData> };
}

@ccclass
export class Rank extends Popup {

	private tab11: cc.Node;
	private tab12: cc.Node;
	private tab21: cc.Node;
	private tab22: cc.Node;
	private scrollView: cc.ScrollView;
	private container: cc.Node;
	private _items: cc.Node;
	private openDataContextSprite: cc.Sprite;
	private xuanyao: cc.Node;
	private close: cc.Node;

	private worldRankDatas: RankDatas;

	public init(): void {

		this.tab11 = this.node.getChildByName("tab11");
		this.tab12 = this.node.getChildByName("tab12");
		this.tab21 = this.node.getChildByName("tab21");
		this.tab22 = this.node.getChildByName("tab22");

		this.tab11.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.tab(0);
		});
		this.tab21.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.tab(1);
		});

		this.scrollView = this.node.getChildByName("scrollView").getComponent(cc.ScrollView);
		this.container = this.scrollView.node.getChildByName("view").getChildByName("container");
		this._items = this.container.getChildByName("items");
		this.openDataContextSprite = this.container.getChildByName("openDataContextNode").getComponent(cc.Sprite);
		this.openDataContextSprite.node.active = false;

		this.xuanyao = this.node.getChildByName("xuanyao");
		this.xuanyao.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			platformCtrl.share(null);
		});

		this.close = this.node.getChildByName("close");
		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
		});
	}

	private tab(index: number): void {

		this._items.destroyAllChildren();

		switch (index) {
			case 0:
				this.tab11.active = false;
				this.tab12.active = true;
				this.tab21.active = true;
				this.tab22.active = false;

				this.openDataContextSprite.node.active = false;

				if (this.worldRankDatas) {
					let i: number = -1;
					const rankItems: Array<RankItem> = new Array();
					for (let rankData of this.worldRankDatas.ranks) {
						i++;
						const rankItem = prefabs.instantiate("RankItem").getComponent(RankItem);
						this._items.addChild(rankItem.node);
						rankItem.node.y = -100 * i;
						rankItem.init(i, rankData);
						rankItems[i] = rankItem;
					}
					this.container.height = 100 * this.worldRankDatas.ranks.length;
					for (const rankItem of rankItems) {
						rankItem.node.removeChild(rankItem.head.node, false);
						this._items.addChild(rankItem.head.node);
						rankItem.head.node.x += rankItem.node.x;
						rankItem.head.node.y += rankItem.node.y;
					}
					for (const rankItem of rankItems) {
						rankItem.node.removeChild(rankItem.nickname.node, false);
						this._items.addChild(rankItem.nickname.node);
						rankItem.nickname.node.x += rankItem.node.x;
						rankItem.nickname.node.y += rankItem.node.y;
					}
				}
				break;
			case 1:
				this.tab11.active = true;
				this.tab12.active = false;
				this.tab21.active = false;
				this.tab22.active = true;

				const count = 20;
				for (let i: number = 0; i < count; i++) {
					const rankItem = prefabs.instantiate("FriendRankItem").getComponent(FriendRankItem);
					this._items.addChild(rankItem.node);
					rankItem.node.y = -100 * i;
					rankItem.init(i);
				}
				this.container.height = 100 * count;
				if (OpenDataContexts.instance) {
					this.openDataContextSprite.node.active = true;
				}
				break;
		}

		this.scrollView.stopAutoScroll();
		this.scrollView.scrollToTop();

	}

	public show(): void {
		super.show();

		main.moneysDown();

		if (OpenDataContexts.instance) {
			this.openDataContextSprite.spriteFrame = new cc.SpriteFrame(OpenDataContexts.instance.openDataContextTex);
			OpenDataContexts.instance.postMessage("击杀榜");
			OpenDataContexts.instance.updateOpenDataContext();
		}

		if (platformCtrl.显示好友榜) {
			this.tab(1);
		} else {
			this.tab(0);
			this.tab21.active = false;
			this.tab22.active = false;
		}

		platformCtrl.getRanks(100, rsp => {
			this.worldRankDatas = rsp;
		});

	}

	public showComplete(): void {
		super.showComplete();
	}

	public hide(): void {
		super.hide();
	}

	public hideComplete(): void {
		super.hideComplete();
		this.openDataContextSprite.spriteFrame = null;
		this.openDataContextSprite.node.active = false;
	}

}
