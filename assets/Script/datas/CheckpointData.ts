import Data from "./Data";
export default interface CheckpointData extends Data {//关卡
	Min: number;//最低初始心情值
	shijian: Array<number>;//事件
	time: number;//时间
}
