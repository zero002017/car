import ZhuanpanChestData from "../datas/ZhuanpanChestData";
import { DatasManager } from "../datas/DatasManager";
import { UserStorage } from "../zero/UserStorage";
import { grey, normal } from "../zero/global";
import { Sounds } from "../zero/Sounds";
import { popups } from "./Popups";
import { ChestLingqu } from "./ChestLingqu";

const { ccclass, property } = cc._decorator;

@ccclass
export class ZhuanpanChest extends cc.Component {

	private data: ZhuanpanChestData;

	private icon: cc.Node;
	private icon_grey: cc.Node;
	private yilingqu: cc.Node;

	public init(data: ZhuanpanChestData): void {

		this.data = data;

		this.icon = this.node.getChildByName("icon");
		this.icon_grey = this.node.getChildByName("icon_grey");
		this.yilingqu = this.node.getChildByName("yilingqu");

		this.refresh();

		this.node.on(cc.Node.EventType.TOUCH_START, () => {
			Sounds.playFX("点击");
			if (UserStorage.choujiangTimes < this.data.Times) {
				//popups.alert("转动转盘累计" + this.data.Times + "次可领取");
				popups.show(ChestLingqu).set(this.data, false);
			} else if (UserStorage.zhuanpanChestLingqus[DatasManager.ZhuanpanChestDatas.indexOf(this.data)]) {
			} else {
				popups.show(ChestLingqu).set(this.data, true);
			}
		});

	}

	public refresh(): void {
		if (UserStorage.choujiangTimes >= this.data.Times) {
			this.icon.active = true;
			this.icon_grey.active = false;
		} else {
			this.icon.active = false;
			this.icon_grey.active = true;
		}
		this.yilingqu.active = UserStorage.zhuanpanChestLingqus[DatasManager.ZhuanpanChestDatas.indexOf(this.data)];
	}

}
