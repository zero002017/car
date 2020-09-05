import Data from "./Data";
export default interface TechnologyData extends Data {//科技
	level: number;//等级
	Description: string;//文字描述
	GoldUp: number;//增加金币
	UnlockLevel: number;//解锁等级
	Coins: number;//升级消耗金币
	LevelUpTime: number;//升级时间（秒）
}
