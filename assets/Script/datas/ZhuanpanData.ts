import Data from "./Data";
export default interface ZhuanpanData extends Data {//转盘
	icon: string;//icon
	Rate: number;//概率
	Gems: number;//钻石数量
	Coins: number;//金币数量
}
