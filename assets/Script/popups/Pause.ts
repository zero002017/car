import { Popup } from "./Popup";
import { GlobalStorage } from "../zero/GlobalStorage";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import Toggle2 from "../ui/Toggle2";
import { platformCtrl } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export class Pause extends Popup {

	private music: Toggle2;
	private sound: Toggle2;
	private back: cc.Node;

	private flag: boolean;
	public callback: (flag: boolean) => void;

	public init(): void {

		this.music = this.node.getChildByName("music").getComponent(Toggle2);
		this.music.init();
		this.sound = this.node.getChildByName("sound").getComponent(Toggle2);
		this.sound.init();
		this.back = this.node.getChildByName("back");

		this.music.onToggle = () => {
			GlobalStorage.musicOn = this.music.toggle;
			Sounds.updateMusic();
		};
		this.sound.onToggle = () => {
			GlobalStorage.soundOn = this.sound.toggle;
		};

		this.back.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.flag = true;
			this.hide();
			GlobalStorage.flush();
		});

	}

	public show(): void {
		super.show();

		main.moneysUp();

		main.showBannerAd("礼包", 0, 1);
		
		this.music.toggle = GlobalStorage.musicOn;
		this.sound.toggle = GlobalStorage.soundOn;
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

		if (this.callback) {
			this.callback(this.flag);
			this.callback = null;
		}
	}

}
