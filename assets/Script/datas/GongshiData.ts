import { IntType } from "./Enums";
import Data from "./Data";
export default interface GongshiData extends Data {//公式
	Exps: string;//表达式
	IntType: IntType;//取整方式
	Mins: Array<number>;//下限
	Max: number;//上限
}
