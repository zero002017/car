import Data from "./Data";
export default interface EventData extends Data {//事件
	Description: string;//描述
	Type: string;//类型
	Station: number;//收费建筑
	range: number;//增量
	tiaojian: number;//必要条件
}
