import Data from "./Data";
export default interface PositionData extends Data {//位置
	huafei: number;//解锁花费
	dengji: number;//解锁等级需求
	shijian: number;//解锁时间
	gailv: number;//小游戏概率
	quanzhong: number;//权重
	kongwei: number;//空位权重
}
