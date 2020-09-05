import { DatasManager } from "../datas/DatasManager";
import { GlobalStorage } from "./GlobalStorage";
import GongshiData from "../datas/GongshiData";
import { IntType } from "../datas/Enums";

export namespace gongshis {

	const enum OpType {
		括号 = "括号",
		二目 = "二目"
	}

	const enum Code {
		左括号 = "(",
		右括号 = ")",
		乘 = "*",
		除 = "/",
		加 = "+",
		减 = "-",
		大于 = ">",
		大于等于 = ">=",
		小于 = "<",
		小于等于 = "<=",
		等于 = "==",
		不等于 = "!==",
		与 = "&&",
		或 = "||",
		范围 = "~"
	}

	const opTypes = {
		"(": OpType.括号,
		")": OpType.括号,
		"*": OpType.二目,
		"/": OpType.二目,
		"+": OpType.二目,
		"-": OpType.二目,
		">": OpType.二目,
		">=": OpType.二目,
		"<": OpType.二目,
		"<=": OpType.二目,
		"==": OpType.二目,
		"!==": OpType.二目,
		"&&": OpType.二目,
		"||": OpType.二目,
		"~": OpType.二目
	};

	const opPriorities = {
		"*": 1, "/": 1,
		"+": 2, "-": 2,
		">": 3, ">=": 3, "<": 3, "<=": 3,
		"==": 4, "!=": 4,
		"&&": 5,
		"||": 6,
		"~": 7
	};

	function getCode(str: string): any {
		if (opTypes[str]) {
			return str;
		}
		let matchArr: RegExpMatchArray = str.match(/^[\+\-\d\.]+$/);
		if (matchArr) {
			return parseFloat(str);
		}
		matchArr = str.match(/^(.+?)([AB])?$/);
		return { name0: str, name: matchArr[1], isB: matchArr[2] == "B" };
	}

	function normalize(codes: string): string {
		codes = codes.replace(/\s+/g, "");
		codes = codes.replace(/[＝=]+/g, "==");
		return codes
			.replace(/[（\[【]/g, "(")
			.replace(/[）\]】]/g, ")")
			.replace(/＋/g, "+")
			.replace(/－/g, "-")
			.replace(/×/g, "*")
			.replace(/／/g, "/")
			.replace(/÷/g, "/")
			.replace(/～/g, "~")
			.replace(/＞/g, ">")
			.replace(/\>\=\=/g, ">=")
			.replace(/\<\=\=/g, "<=")
			.replace(/\!\=\=/g, "!=")
			.replace(/≥/g, ">=")
			.replace(/＜/g, "<")
			.replace(/≤/g, "<=")
			.replace(/＝/g, "==")
			.replace(/≠/g, "!=");
	}

	let gongshis: { [key: string]: Gongshi };
	export function init(): void {
		gongshis = {};
		for (let gongshiData of DatasManager.GongshiDatas) {
			gongshis[gongshiData.Name] = new Gongshi(gongshiData);
		}

		//test("受伤程度分数", { 剩余HP: -1, 总HP: 100 }, null, 20);
	}

	function test(name: string, propsA: { [key: string]: number }, propsB: { [key: string]: number }, _value: number): void {
		let value: number = jisuan(name, GlobalStorage.gongshiDebug, propsA, propsB);
		if (value == _value) { } else {
			console.error(name + " 非预期计算结果：" + value + "\npropsA=" + JSON.stringify(propsA) + "\npropsB=" + JSON.stringify(propsB));
		}
	}

	export function jisuan(name: string, _debug: boolean, propsA: { [key: string]: number }, propsB?: { [key: string]: number }): number {
		if (gongshis[name]) {
			return gongshis[name].jisuan(GlobalStorage.gongshiDebug || _debug, propsA, propsB);
		} else {
			console.error("木有公式：" + name);
		}
	}

	class Gongshi {

		public data: GongshiData;
		public exps: Array<any>;
		public codes: Array<any>;
		public mins: Array<number>;
		public max: number;

		public constructor(_data: GongshiData) {
			this.data = _data;
			this.mins = this.data.Mins || [];
			if (this.mins.length < 1) {
				this.mins[0] = 0;
			}
			if (this.mins.length < 2) {
				this.mins[1] = this.mins[0];
			}
			this.max = this.data.Max || 0x7fffffff;
			for (let min of this.mins) {
				if (min < this.max) { } else {
					console.error("下限必须小于上限！" + min + " " + this.max);
				}
			}
			let codes: RegExpMatchArray = normalize(this.data.Exps).match(/\&\&|\|\||\>\=|\<\=|\=\=|\!\=|[\&\|\>\<\=\!\+\-\*\/\~\(\)]|[^\&\|\>\<\=\!\+\-\*\/\~\(\)]+/g)
			let stack: Array<string> = new Array();
			this.exps = new Array();
			this.codes = new Array();
			for (let subStr of codes) {
				let code: any = getCode(subStr);
				this.exps.push(code);
				if (opPriorities[code]) {
					while (stack.length) {
						let op: string = stack[stack.length - 1];
						if (op == Code.左括号) {
							break;
						}
						if (opPriorities[op] <= opPriorities[code]) {
							this.codes.push(op);
							stack.pop();
						} else {
							break;
						}
					}
					stack.push(code);
				} else {
					switch (code) {
						case Code.左括号:
							stack.push(code);
							break;
						case Code.右括号:
							while (stack[stack.length - 1] != Code.左括号) {
								this.codes.push(stack.pop());
							}
							stack.pop();
							break;
						default:
							this.codes.push(code);
							break;
					}
				}
			}
			let i: number = stack.length;
			while (i--) {
				this.codes.push(stack[i]);
			}
			//console.log(this.data.Name + "\nexps=" + JSON.stringify(this.exps) + "\ncodes=" + JSON.stringify(this.codes));
		}

		public jisuan(_debug: boolean, propsA: { [key: string]: number }, propsB: { [key: string]: number }): number {
			let value: number;
			let stack: Array<number> = new Array();
			for (let code of this.codes) {
				switch (opTypes[code]) {
					case OpType.括号:
						//
						break;
					case OpType.二目:
						let value2: number = stack.pop();
						let value1: number = stack.pop();
						switch (code) {
							case Code.乘:
								value = value1 * value2;
								break;
							case Code.除:
								value = value1 / value2;
								break;
							case Code.加:
								value = value1 + value2;
								break;
							case Code.减:
								value = value1 - value2;
								break;
							case Code.大于:
								value = value1 > value2 ? 1 : 0;
								break;
							case Code.大于等于:
								value = value1 >= value2 ? 1 : 0;
								break;
							case Code.小于:
								value = value1 < value2 ? 1 : 0;
								break;
							case Code.小于等于:
								value = value1 <= value2 ? 1 : 0;
								break;
							case Code.等于:
								value = value1 == value2 ? 1 : 0;
								break;
							case Code.不等于:
								value = value1 != value2 ? 1 : 0;
								break;
							case Code.与:
								if (value1) {
									value = value2;
								} else {
									value = value1;
								}
								break;
							case Code.或:
								if (value1) {
									value = value1;
								} else {
									value = value2;
								}
								break;
							case Code.范围:
								value = value1 + Math.floor(Math.random() * (value2 - value1));
								break;
							default:
								console.error("未知code：" + code);
								value = 0;
								break;
						}
						stack.push(value);
						break;
					default:
						if (typeof (code) == "number") {
							stack.push(code);
						} else {
							let _propsA: { [key: string]: number };
							let _propsB: { [key: string]: number };
							if (code.isB) {
								_propsA = propsB;
								_propsB = propsA;
							} else {
								_propsA = propsA;
								_propsB = propsB;
							}
							if (code.name in _propsA) {
								value = _propsA[code.name];
							} else if (code.name in gongshis) {
								value = gongshis[code.name].jisuan(_debug, _propsA, _propsB);
							} else {
								switch (code.name) {
									case "随机数":
										value = Math.floor(Math.random() * 10000) / 10000;
										break;
									default:
										console.error("木有属性或公式：" + code.name);
										value = 0;
										break;
								}
							}
							if (_debug) {
								code.value = value;
							}
							stack.push(value);
						}
						break;
				}
				//console.log("stack=" + stack);
			}

			value = stack[0];

			if (_debug) {
				let log: string = this.data.Name + "[" + value + "] =";
				for (let code of this.exps) {
					switch (opTypes[code]) {
						case OpType.括号:
						case OpType.二目:
							log += " " + code;
							break;
						default:
							if (typeof (code) == "number") {
								log += " " + code;
							} else {
								log += " " + code.name0 + "[" + code.value + "]";
							}
							break;
					}
				}
				console.log(log);
			}

			if (stack.length == 1) {
				var min: number = this.mins[0] + Math.floor(Math.random() * (this.mins[1] - this.mins[0]));
				if (value < min) {
					value = min;
				} else if (value > this.max) {
					value = this.max;
				}
				switch (this.data.IntType) {
					case IntType.向下:
						value = Math.floor(value);
						break;
					case IntType.向上:
						value = Math.ceil(value);
						break;
					case IntType.四舍五入:
						value = Math.round(value);
						break;
				}
				return value;
			}

			console.error(this.data.Name + " 公式格式错误！\nexps=" + JSON.stringify(this.exps) + "\ncodes=" + JSON.stringify(this.codes));
			return 0;
		}
	}
}