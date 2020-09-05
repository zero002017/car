import Data from "./Data";
export default interface EvaluateData extends Data {//评价
	Koufens: number;//总扣分
	score: string;//结算评价
	Reward: number;//钻石奖励（随机事件）
	Baodao: string;//记者报道
}
