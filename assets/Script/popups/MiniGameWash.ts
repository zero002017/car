import { Popup } from "./Popup";
import { stageWid, main } from "../Main";
import { hei0, getSpNode } from "../zero/global";
import { Sounds } from "../zero/Sounds";
import { UserStorage } from "../zero/UserStorage";
import { game } from "../pages/Game";
import 引导玩洗车小游戏 from "../game/引导玩洗车小游戏";

const { ccclass, property } = cc._decorator;

@ccclass
export class MiniGameWash extends Popup {

	private 水渍: cc.Node;
	public car: cc.Sprite;
	private 脏: cc.Node;
	private container: cc.Node;
	private 海绵: cc.Node;
	private 海绵X0: number;
	private 海绵Y0: number;

	private currTouchPointID: number;
	private oldMouseX: number;
	private oldMouseY: number;
	private moveTimes: number;

	private hideGuide: () => void;

	public onHide: () => void;

	public init(): void {
		this.水渍 = this.node.getChildByName("水渍");
		this.car = this.node.getChildByName("car").getComponent(cc.Sprite);
		this.脏 = this.node.getChildByName("脏");
		this.container = this.node.getChildByName("container");
		this.海绵 = this.node.getChildByName("海绵");
		this.海绵X0 = this.海绵.x;
		this.海绵Y0 = this.海绵.y;

		this.node.width = stageWid;
		this.node.height = hei0;
		this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
	}

	private touchStart(evt: cc.Event.EventTouch): void {
		//console.log(evt.target);//会崩溃
		//console.log(evt.target.name);
		if (this.currTouchPointID == -1) {
			if (this.hideGuide) {
				this.hideGuide();
				this.hideGuide = null;
			}
			const p = evt.getLocation();
			const b = this.海绵.getBoundingBoxToWorld();
			//console.log("b=" + b);
			//drawLTRB(main.debug, [b.x, b.y, b.x + b.width, b.y + b.height], cc.Color.YELLOW);
			if (b.contains(p)) {
				this.海绵.stopAllActions();
				this.oldMouseX = p.x;
				this.oldMouseY = p.y;
				this.currTouchPointID = evt.getID();
				this.moveTimes = 0;
			}
		} else {
			//另一个手指触碰，或微信从左边拉开又回来后点击
			this.endTouch(evt);
		}
	}
	private touchMove(evt: cc.Event.EventTouch): void {
		if (this.currTouchPointID == evt.getID()) {
			this.moveTimes++;
			if (this.moveTimes % 30 == 0) {
				Sounds.playFX("小游戏擦车");
			}
			const p = evt.getLocation();
			const dx = p.x - this.oldMouseX;
			const dy = p.y - this.oldMouseY;
			this.oldMouseX = p.x;
			this.oldMouseY = p.y;
			this.海绵.x += dx;
			this.海绵.y += dy;
			const b = this.水渍.getBoundingBoxToWorld();
			if (b.contains(p)) {
				if (Math.random() < 0.1) {
					this.addPaopao();
				}
				if (this.脏.opacity > 0) {
					if ((this.脏.opacity -= 2) <= 0) {
						this.脏.opacity = 0;
						this.hide();
					}
				}
			}
		}
	}
	private touchEnd(evt: cc.Event.EventTouch): void {
		if (this.currTouchPointID == evt.getID()) {
			this.endTouch(evt);
		}
	}

	private endTouch(evt: cc.Event.EventTouch): void {
		if (this.currTouchPointID == -1) { } else {
			this.currTouchPointID = -1;
			//console.log("moveTimes=" + this.moveTimes);
			this.海绵.runAction(cc.moveTo(0.8, this.海绵X0, this.海绵Y0).easing(cc.easeSineInOut()));
		}
	}

	private addPaopao(): void {
		const paopao = getSpNode("miniGames", "泡泡" + (Math.floor(Math.random() * 2) + 1));
		this.container.addChild(paopao);
		paopao.x = this.海绵.x;
		paopao.y = this.海绵.y;
		paopao.runAction(cc.sequence(
			cc.moveTo(0.8, paopao.x + (Math.random() - 0.5) * 60, paopao.y + (Math.random() - 0.5) * 60).easing(cc.easeCubicActionOut()),
			cc.callFunc(() => {
				paopao.destroy();
			})
		));
		paopao.runAction(cc.fadeOut(0.8));
	}

	public show(): void {
		super.show();

		this.currTouchPointID = -1;
		this.container.destroyAllChildren();

		this.海绵.stopAllActions();
		this.海绵.x = this.海绵X0;
		this.海绵.y = this.海绵Y0;
		this.脏.opacity = 255;
	}

	public showComplete(): void {
		super.showComplete();

		if (UserStorage.引导玩洗车小游戏) { } else {
			UserStorage.引导玩洗车小游戏 = true;
			UserStorage.flush();
			game.paused = true;
			const guide = main.node.getChildByName("引导玩洗车小游戏").getComponent(引导玩洗车小游戏);
			guide.show();
			guide.hand.x = this.海绵X0;
			guide.hand.y = this.海绵Y0;
			guide.hand.runAction(cc.repeatForever(cc.sequence(
				cc.delayTime(1),
				cc.moveTo(1, -120, 0).easing(cc.easeCircleActionInOut()),
				cc.delayTime(0.4),
				cc.moveTo(0.4, 120, 0).easing(cc.easeCircleActionInOut()),
				cc.moveTo(0.4, -120, 0).easing(cc.easeCircleActionInOut()),
				cc.moveTo(0.4, 120, 0).easing(cc.easeCircleActionInOut()),
				cc.delayTime(1),
				cc.callFunc(() => {
					guide.hand.x = this.海绵X0;
					guide.hand.y = this.海绵Y0;
				})
			)));
			const f = () => {
				this.海绵.x = guide.hand.x;
				this.海绵.y = guide.hand.y;
			};
			main.enterFrames.add(f);
			this.hideGuide = () => {
				guide.hide();
				game.paused = false;
				main.enterFrames.clear(f);
			}
		}
	}

	public hide(): void {
		super.hide();

		if (this.onHide) {
			this.onHide();
			this.onHide = null;
		}
	}

	public hideComplete(): void {
		super.hideComplete();
	}

}
