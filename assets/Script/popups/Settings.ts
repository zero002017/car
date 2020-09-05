import { Popup } from "./Popup";
import { popups } from "./Popups";
import { GlobalStorage } from "../zero/GlobalStorage";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";
import { UserStorage } from "../zero/UserStorage";
import Toggle2 from "../ui/Toggle2";
import { platformCtrl, hei0, getDeviceRect } from "../zero/global";

const { ccclass, property } = cc._decorator;

export let settings: Settings;

@ccclass
export class Settings extends Popup {

	private music: Toggle2;
	private sound: Toggle2;
	private contact: cc.Node;
	private share: cc.Node;
	private restart: cc.Node;
	private close: cc.Node;

	public init(): void {

		settings = this;

		this.music = this.node.getChildByName("music").getComponent(Toggle2);
		this.music.init();
		this.sound = this.node.getChildByName("sound").getComponent(Toggle2);
		this.sound.init();
		this.contact = this.node.getChildByName("contact");
		this.share = this.node.getChildByName("share");
		this.restart = this.node.getChildByName("restart");
		this.close = this.node.getChildByName("close");

		this.music.onToggle = () => {
			GlobalStorage.musicOn = this.music.toggle;
			Sounds.updateMusic();
		};
		this.sound.onToggle = () => {
			GlobalStorage.soundOn = this.sound.toggle;
		};

		this.share.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			platformCtrl.share(null);
		});

		this.restart.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
			GlobalStorage.flush();
			popups.confirm("数据将会重置", flag => {
				if (flag) {
					main.disable.active = true;
					const enterScene = UserStorage.首次进入游戏的场景值4;
					const 误触黑 = UserStorage.误触黑4;
					UserStorage.reset();
					UserStorage.首次进入游戏的场景值4 = enterScene;
					UserStorage.误触黑4 = 误触黑;
					UserStorage.updateDates();
					platformCtrl.deleteStore(() => {
						platformCtrl.logout();
						Sounds.stopMusic();
						main.moneys.set();
						main.goStart();
					});
				}
			});
		});

		this.close.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			this.hide();
			GlobalStorage.flush();
		});

		if (platformCtrl.显示联系我们) { } else {
			this.contact.active = false;
		}

		if (platformCtrl.显示分享) { } else {
			this.share.active = false;
		}

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

		platformCtrl.createFeedbackButton(getDeviceRect(this.contact));
	}

	public hide(): void {
		super.hide();

		main.hideBannerAd();

		platformCtrl.destroyFeedbackButton();
	}

	public hideComplete(): void {
		super.hideComplete();
	}

}
