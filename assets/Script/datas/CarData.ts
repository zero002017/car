import Data from "./Data";
export default interface CarData extends Data {//车
	speed: number;//移动速度（像素/秒）
	gold: number;//基础金币
	Unlock: number;//解锁关卡
	jilv: number;//出现权重
}
