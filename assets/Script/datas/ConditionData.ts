import Data from "./Data";
export default interface ConditionData extends Data {//状态
	Station: number;//收费建筑
	Priority: number;//优先级
	zongzhi: number;//权重总值
}
