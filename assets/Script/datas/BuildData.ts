import Data from "./Data";
export default interface BuildData extends Data {//建筑
	level: number;//等级
	Description: string;//描述
	SkillDescription: string;//描述2
	JobTime: number;//工作时间
	xinqingyanchang: number;//心情延长时间（秒）
	GoldUp: number;//建筑金钱加成
	LevelUp: number;//升级等级
	LevelUpNeed: number;//升级消耗数量
	LevelUpTime: number;//升级时间（秒）
}
