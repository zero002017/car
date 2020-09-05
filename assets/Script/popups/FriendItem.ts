import { DatasManager } from "../datas/DatasManager";
import { UserStorage } from "../zero/UserStorage";
import { platformCtrl, getHeadByOpenId } from "../zero/global";
import { main } from "../Main";
import { Sounds } from "../zero/Sounds";
import Menu from "../pages/Menu";
import { GlobalStorage } from "../zero/GlobalStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export class FriendItem extends cc.Component {

	private add_: cc.Node;
	private head: cc.Sprite;
	private txt: cc.Label;
	private icon: cc.Node;
	private noFriend: cc.Node;
	private lingqu: cc.Node;
	private yilingqu: cc.Node;

	public init(index: number, friendOpenId: string): void {

		this.add_ = this.node.getChildByName("add_");
		this.head = this.node.getChildByName("head").getComponent(cc.Sprite);
		this.txt = this.node.getChildByName("txt").getComponent(cc.Label);
		this.icon = this.node.getChildByName("icon");
		this.noFriend = this.node.getChildByName("noFriend");
		this.lingqu = this.node.getChildByName("lingqu");
		this.yilingqu = this.node.getChildByName("yilingqu");

		if (friendOpenId) {
			this.txt.node.active = true;
			const gems = (GlobalStorage.邀请次数们[friendOpenId] > 1 ? Math.ceil(DatasManager.每邀请一位好友获得钻石个数 * 0.5) : DatasManager.每邀请一位好友获得钻石个数);
			this.txt.string = "+" + gems;

			this.add_.active = false;
			this.noFriend.active = false;

			this.head.spriteFrame = getHeadByOpenId(friendOpenId);
			// LoadImgs.load(cdn + "heads/" + friendOpenId + ".jpg", sp => {
			// 	this.head.spriteFrame = sp;
			// }, true);

			if (UserStorage.lingquYaoqingFriendOpenIds.indexOf(friendOpenId) > -1) {
				this.lingqu.active = false;
			} else {
				this.yilingqu.active = false;
				this.lingqu.on(cc.Node.EventType.TOUCH_END, () => {
					Sounds.playFX("点击");
					UserStorage.lingquYaoqingFriendOpenIds.push(friendOpenId);
					this.lingqu.active = false;
					this.yilingqu.active = true;
					main.moneys.addMoney("钻石", gems, this.icon, null);
					(main.currPage as Menu).好友助力.refresh(false);
				});
			}

		} else {
			this.txt.node.active = false;
			this.head.node.active = false;
			this.lingqu.active = false;
			this.yilingqu.active = false;
			this.noFriend.on(cc.Node.EventType.TOUCH_START, () => {
				Sounds.playFX("点击");
				platformCtrl.share(null);
			});
		}

	}

}
