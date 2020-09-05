import { platformCtrl, cpbAtlas } from "../zero/global";
import { Sounds } from "../zero/Sounds";
import { DatasManager } from "../datas/DatasManager";
import { main } from "../Main";
import { LoadImgs } from "../zero/LoadImgs";

const { ccclass, property } = cc._decorator;

const loopCPBIndicess: Array<Array<number>> = new Array();
const loopIndices: Array<number> = new Array();

@ccclass
export default class CPBIcon extends cc.Component {

	public img: cc.Sprite;
	public nameTxt: cc.Sprite;
	public nameTxt2: cc.Label;
	private nameTxtWid0: number;

	private pos: string;
	public successRecord: boolean;
	private failShowMoreGame: boolean;
	private openCallback: (icon: CPBIcon, cpbGameInfo: CPBGameInfo, success: boolean) => void;

	private cpbGameInfo: CPBGameInfo;
	private loopsIndex: number;

	public init(pos: string, cpbIndexOrCPBIndices: number | Array<number>, successRecord: boolean, failShowMoreGame: boolean, openCallback: (icon: CPBIcon, cpbGameInfo: CPBGameInfo, success: boolean) => void): void {

		if (platformCtrl.cpbConfig) { } else {
			this.node.active = false;
			return;
		}

		this.img = this.node.getChildByName("img").getComponent(cc.Sprite);
		if (cpbAtlas) {
			const cpb文字底 = this.node.getChildByName("cpb文字底");
			if (cpb文字底) {
				let spriteFrame: cc.SpriteFrame = new cc.SpriteFrame(cpbAtlas);
				spriteFrame.setRect(new cc.Rect(platformCtrl.cpbConfig.文字底[0], platformCtrl.cpbConfig.文字底[1], platformCtrl.cpbConfig.文字底[2], platformCtrl.cpbConfig.文字底[3]));
				spriteFrame.insetLeft = spriteFrame.insetTop = spriteFrame.insetRight = spriteFrame.insetBottom = 10;
				cpb文字底.getComponent(cc.Sprite).spriteFrame = spriteFrame;
			}
		}
		this.nameTxt = this.node.getChildByName("nameTxt").getComponent(cc.Sprite);
		this.nameTxtWid0 = this.nameTxt.node.width;
		this.nameTxt2 = this.node.getChildByName("nameTxt2").getComponent(cc.Label);

		this.pos = pos;
		this.successRecord = successRecord;
		this.failShowMoreGame = failShowMoreGame;
		this.openCallback = openCallback;

		this.node.on(cc.Node.EventType.TOUCH_END, () => {
			Sounds.playFX("点击");
			platformCtrl.openCPB(this.pos, this, this.cpbGameInfo, this.successRecord, this.failShowMoreGame, this.openCallback);
		});

		if (typeof (cpbIndexOrCPBIndices) == "number") {
			//console.log("1 cpbIndexOrCPBIndices=" + cpbIndexOrCPBIndices);
			this.set(cpbIndexOrCPBIndices);
		} else {
			//console.log("2 cpbIndexOrCPBIndices=" + cpbIndexOrCPBIndices);
			this.loopsIndex = loopCPBIndicess.indexOf(cpbIndexOrCPBIndices);
			if (this.loopsIndex == -1) {
				this.loopsIndex = loopCPBIndicess.length;
				loopCPBIndicess.push(cpbIndexOrCPBIndices);
				loopIndices.push(-1);
			}
			this.next();
		}
	}

	private set(cpbIndex: number): void {
		this.cpbGameInfo = platformCtrl.cpbConfig.cpbs[cpbIndex];
		if (this.cpbGameInfo) {
			if (cpbAtlas) {
				let spriteFrame: cc.SpriteFrame = new cc.SpriteFrame(cpbAtlas);
				spriteFrame.setRect(new cc.Rect(this.cpbGameInfo.iconRect[0], this.cpbGameInfo.iconRect[1], this.cpbGameInfo.iconRect[2], this.cpbGameInfo.iconRect[3]));
				this.img.spriteFrame = spriteFrame;
				if (this.nameTxt) {
					spriteFrame = new cc.SpriteFrame(cpbAtlas);
					spriteFrame.setRect(new cc.Rect(this.cpbGameInfo.nameRect[0], this.cpbGameInfo.nameRect[1], this.cpbGameInfo.nameRect[2], this.cpbGameInfo.nameRect[3]));
					this.nameTxt.spriteFrame = spriteFrame;
					this.nameTxt.node.width = Math.min(this.cpbGameInfo.nameRect[2], this.nameTxtWid0);
				}
			} else {
				LoadImgs.load(this.cpbGameInfo.icon, sp => {
					this.img.spriteFrame = sp;
				}, false);
				if (this.nameTxt2) {
					this.nameTxt2.string = this.cpbGameInfo.name;
				}
			}
		} else {
			console.error("cpbIndex=" + cpbIndex);
		}
	}

	public next(): void {
		if (++loopIndices[this.loopsIndex] >= loopCPBIndicess[this.loopsIndex].length) {
			loopIndices[this.loopsIndex] = 0;
		}
		this.set(loopCPBIndicess[this.loopsIndex][loopIndices[this.loopsIndex]]);
		main.delays.delay({
			time: DatasManager.CPA图标轮播间隔,
			action: () => {
				this.next();
			}
		});
	}

}
