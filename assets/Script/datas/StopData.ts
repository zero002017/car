import Data from "./Data";
export default interface StopData extends Data {//停车位
	Secs: Array<number>;//出车间隔
	diyi: Array<number>;//第一个车时间
}
