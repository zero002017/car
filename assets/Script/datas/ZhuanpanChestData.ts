import Data from "./Data";
export default interface ZhuanpanChestData extends Data {//转盘宝箱
	Icon: string;//图标
	Times: number;//次数
	Gems: number;//钻石数量
	Coins: number;//金币数量
}
