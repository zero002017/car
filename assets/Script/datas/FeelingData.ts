import Data from "./Data";
export default interface FeelingData extends Data {//心情
	level: string;//心情状态
	Koufen: number;//扣分
	Gold: number;//心情金钱加成
	EXP: number;//经验
}
