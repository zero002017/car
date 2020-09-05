import Data from "./Data";
export default interface StationData extends Data {//收费建筑
	Description: string;//描述
	goumai: string;//购买描述
	xinqingUp: number;//心情提升
	Time: number;//持续时间（秒）
	Stock: number;//次数上限
	AddNeedCoins: number;//补充消耗金币
	AddNeedGems: number;//补充消耗钻石
	Effect: string;//特效
}
