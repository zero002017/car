//中文
import { DatasManager } from "../datas/DatasManager";
import { main } from "../Main";
import { GlobalStorage } from "./GlobalStorage";
import { UserStorage } from "./UserStorage";
import { platformCtrl } from "./global";

export namespace AVM1 {

    interface Code {
        op: string;
        args: Array<any>;
    }

    class Register {
        public index: number;
    }

    export function run(codeStr: string): void {

        window["DatasManager"] = DatasManager;
        window["platformCtrl"] = platformCtrl;
        window["GlobalStorage"] = GlobalStorage;
        window["UserStorage"] = UserStorage;
        window["main"] = main;

        let lines: Array<string> = codeStr.match(/\S.+\S/g);
        if (lines) {

            let codes: Array<Code> = new Array();
            let offsets: { [key: string]: number } = {};
            let offset: number = 0;
            for (let line of lines) {
                let matchArr: Array<string> = line.match(/^(label\d+)\:$/);
                if (matchArr) {
                    offsets[matchArr[1]] = offset;
                } else {
                    codes.push(getCode(line));
                    offset++;
                }
            }

            let stack: Array<any> = new Array();
            let locals: { [key: string]: any } = {};
            let registers: Array<any> = new Array();

            offset = 0;
            while (offset < codes.length) {
                let code: Code = codes[offset++];
                switch (code.op) {
                    case "end"://0x00
                        {
                            offset = codes.length;
                        }
                        break;
                    case "nop"://0x01
                        break;
                    //0x02
                    //0x03
                    //case "nextFrame"://0x04
                    //case "previousFrame"://0x05
                    //case "play"://0x06
                    //case "stop"://0x07
                    //case "toggleQuality"://0x08
                    //case "stopSounds"://0x09
                    case "add"://0x0a
                        {
                            let value1: number = stack.pop();
                            let value2: number = stack.pop();
                            let value3: number = value2 + value1;
                            stack.push(value3);
                        }
                        break;
                    case "subtract"://0x0b
                        {
                            let value1: number = stack.pop();
                            let value2: number = stack.pop();
                            let value3: number = value2 - value1;
                            stack.push(value3);
                        }
                        break;
                    case "multiply"://0x0c
                        {
                            let value1: number = stack.pop();
                            let value2: number = stack.pop();
                            let value3: number = value2 * value1;
                            stack.push(value3);
                        }
                        break;
                    case "divide"://0x0d
                        {
                            let value1: number = stack.pop();
                            let value2: number = stack.pop();
                            let value3: number = value2 / value1;
                            stack.push(value3);
                        }
                        break;
                    case "equals"://0x0e
                        {
                            let value1: any = stack.pop();
                            let value2: any = stack.pop();
                            let value3: boolean = value2 == value1;
                            stack.push(value3);
                        }
                        break;
                    case "less"://0x0f
                        {
                            let value1: any = stack.pop();
                            let value2: any = stack.pop();
                            let value3: boolean = value2 < value1;
                            stack.push(value3);
                        }
                        break;
                    case "and"://0x10
                        {
                            let value1: any = stack.pop();
                            let value2: any = stack.pop();
                            let value3: any = value2 && value1;
                            stack.push(value3);
                        }
                        break;
                    case "or"://0x11
                        {
                            let value1: any = stack.pop();
                            let value2: any = stack.pop();
                            let value3: any = value2 || value1;
                            stack.push(value3);
                        }
                        break;
                    case "not"://0x12
                        {
                            let value1: any = stack.pop();
                            let value2: boolean = !value1;
                            stack.push(value2);
                        }
                        break;
                    case "stringEquals"://0x13
                        {
                            let value1: string = stack.pop();
                            let value2: string = stack.pop();
                            let value3: boolean = value2 == value1;
                            stack.push(value3);
                        }
                        break;
                    //case "stringLength"://0x14
                    //case "stringExtract"://0x15
                    //0x16
                    case "pop"://0x17
                        {
                            stack.pop();
                        }
                        break;
                    case "toInteger"://0x18
                        {
                            let value1: string = stack.pop();
                            let value2: number = parseInt(value1);
                            stack.push(value2);
                        }
                        break;
                    //0x19
                    //0x1a
                    //0x1b
                    case "getVariable"://0x1c
                        {
                            let value1: string = stack.pop();//key
                            let value2: any = (value1 in locals) ? locals[value1] : window[value1];
                            stack.push(value2);
                        }
                        break;
                    case "setVariable"://0x1d
                        {
                            let value1: any = stack.pop();//值
                            let value2: string = stack.pop();//key
                            locals[value2] = value1;
                        }
                        break;
                    //0x1e
                    //0x1f
                    //case "setTarget2"://0x20
                    case "stringAdd"://0x21
                        {
                            let value1: string = stack.pop();
                            let value2: string = stack.pop();
                            let value3: string = value2 + value1;
                            stack.push(value3);
                        }
                        break;
                    //case "getProperty"://0x22
                    //case "setProperty"://0x23
                    //case "cloneSprite"://0x24
                    //case "removeSprite"://0x25
                    //case "trace"://0x26
                    //case "startDrag"://0x27
                    //case "endDrag"://0x28
                    case "stringLess"://0x29
                        {
                            let value1: string = stack.pop();
                            let value2: string = stack.pop();
                            let value3: boolean = value2 < value1;
                            stack.push(value3);
                        }
                        break;
                    //case "throw_"://0x2a
                    //case "castOp"://0x2b
                    //case "implementsOp"://0x2c
                    //case "FSCommand2"://0x2d //asv2010
                    //0x2e
                    //0x2f
                    case "randomNumber"://0x30
                        {
                            let value1: number = stack.pop();
                            value1 = Math.floor(Math.random() * value1);
                            stack.push(value1);
                        }
                        break;
                    //case "mbStringLength"://0x31
                    //case "charToAscii"://0x32
                    //case "asciiToChar"://0x33
                    //case "getTime"://0x34
                    //case "mbStringExtract"://0x35
                    //case "mbCharToAscii"://0x36
                    //case "mbAsciiToChar"://0x37
                    //0x38
                    //0x39
                    //case "delete_"://0x3a
                    //case "delete2"://0x3b
                    case "defineLocal"://0x3c
                        {
                            let value1: any = stack.pop();
                            let value2: string = stack.pop();
                            locals[value2] = value1;
                        }
                        break;
                    case "callFunction"://0x3d
                        {
                            let value1: string = stack.pop();//方法名
                            let value2: any = (value1 in locals) ? locals[value1] : window[value1];
                            let argsCount: number = stack.pop();//参数个数
                            let args: Array<any> = new Array();//参数
                            for (let i: number = 0; i < argsCount; i++) {
                                args.push(stack.pop());
                            }
                            let value3: any = value2.apply(null, args);
                            stack.push(value3);
                        }
                        break;
                    case "return_"://0x3e
                        {
                            stack.pop();
                            offset = codes.length;
                        }
                        break;
                    case "modulo"://0x3f
                        {
                            let value1: number = stack.pop();
                            let value2: number = stack.pop();
                            let value3: number = value2 % value1;
                            stack.push(value3);
                        }
                        break;
                    case "newObject"://0x40
                        {
                            let value1: string = stack.pop();//方法名
                            let value2: any = (value1 in locals) ? locals[value1] : window[value1];
                            let argsCount: number = stack.pop();//参数个数
                            let args: Array<any> = new Array();//参数
                            for (let i: number = 0; i < argsCount; i++) {
                                args.push(stack.pop());
                            }
                            args.unshift(null);//this
                            let value3: any = new (Function.prototype.bind.apply(value2, args))();
                            stack.push(value3);
                        }
                        break;
                    case "defineLocal2"://0x41
                        {
                            let value1: string = stack.pop();
                            locals[value1] = undefined;
                        }
                        break;
                    case "initArray"://0x42
                        {
                            let i: number = stack.pop();
                            let arr = [];
                            while (i--) {
                                let value: any = stack.pop();
                                arr.push(value);
                            }
                            stack.push(arr);
                        }
                        break;
                    case "initObject"://0x43
                        {
                            let i: number = stack.pop();
                            let obj = {};
                            while (i--) {
                                let value: any = stack.pop();
                                let key: string = stack.pop();
                                obj[key] = value;
                            }
                            stack.push(obj);
                        }
                        break;
                    case "typeOf"://0x44
                        {
                            let value1: any = stack.pop();
                            let value2: string = typeof (value1);
                            stack.push(value2);
                        }
                        break;
                    //case "targetPath"://0x45
                    //case "enumerate"://0x46
                    case "add2"://0x47
                        {
                            let value1: any = stack.pop();
                            let value2: any = stack.pop();
                            let value3: any = value2 + value1;
                            stack.push(value3);
                        }
                        break;
                    case "less2"://0x48
                        {
                            let value1: any = stack.pop();
                            let value2: any = stack.pop();
                            let value3: boolean = value2 < value1;
                            stack.push(value3);
                        }
                        break;
                    case "equals2"://0x49
                        {
                            let value1: any = stack.pop();
                            let value2: any = stack.pop();
                            let value3: boolean = value2 == value1;
                            stack.push(value3);
                        }
                        break;
                    //case "toNumber"://0x4a
                    //case "toString"://0x4b
                    case "pushDuplicate"://0x4c
                        {
                            let value1: any = stack.pop();
                            stack.push(value1);
                            stack.push(value1);
                        }
                        break;
                    case "stackSwap"://0x4d
                        {
                            let value1: any = stack.pop();
                            let value2: any = stack.pop();
                            stack.push(value1);
                            stack.push(value2);
                        }
                        break;
                    case "getMember"://0x4e
                        {
                            let value1: string = stack.pop();//key
                            let value2: any = stack.pop();//目标
                            let value3: string = value2[value1];//值
                            stack.push(value3);
                        }
                        break;
                    case "setMember"://0x4f
                        {
                            let value1: any = stack.pop();//值
                            let value2: string = stack.pop();//key
                            let value3: any = stack.pop();//目标
                            value3[value2] = value1;
                        }
                        break;
                    case "increment"://0x50
                        {
                            let value1: number = stack.pop();
                            value1++;
                            stack.push(value1);
                        }
                        break;
                    case "decrement"://0x51
                        {
                            let value1: number = stack.pop();
                            value1--;
                            stack.push(value1);
                        }
                        break;
                    case "callMethod"://0x52
                        {
                            let value1: string = stack.pop();//方法名
                            let value2: any = stack.pop();//调用者
                            let argsCount: number = stack.pop();//参数个数
                            let args: Array<any> = new Array();//参数
                            for (let i: number = 0; i < argsCount; i++) {
                                args.push(stack.pop());
                            }
                            let value3: any = value2[value1].apply(value2, args);
                            stack.push(value3);
                        }
                        break;
                    case "newMethod"://0x53
                        {
                            let value1: string = stack.pop();//方法名
                            let value2: any = stack.pop();//调用者
                            let argsCount: number = stack.pop();//参数个数
                            let args: Array<any> = new Array();//参数
                            for (let i: number = 0; i < argsCount; i++) {
                                args.push(stack.pop());
                            }
                            args.unshift(null);//this
                            let value3: any = new (Function.prototype.bind.apply(value2[value1], args))();
                            stack.push(value3);
                        }
                        break;
                    case "instanceOf"://0x54
                        {
                            let value1: any = stack.pop();
                            let value2: any = stack.pop();
                            let value3: boolean = value2 instanceof value1;
                            stack.push(value3);
                        }
                        break;
                    case "enumerate2"://0x55
                        {
                            let obj = stack.pop();
                            stack.push(null);
                            for (let key in obj) {
                                stack.push(key);
                            }
                        }
                        break;
                    //0x56
                    //0x57
                    //0x58
                    //0x59
                    //0x5a
                    //0x5b
                    //0x5c
                    //0x5d
                    //0x5e
                    //0x5f
                    //case "bitAnd"://0x60
                    //case "bitOr"://0x61
                    //case "bitXor"://0x62
                    //case "bitLShift"://0x63
                    //case "bitRShift"://0x64
                    //case "bitURShift"://0x65
                    case "strictEquals"://0x66
                        {
                            let value1: string = stack.pop();
                            let value2: string = stack.pop();
                            let value3: boolean = value2 === value1;
                            stack.push(value3);
                        }
                        break;
                    case "greater"://0x67
                        {
                            let value1: number = stack.pop();
                            let value2: number = stack.pop();
                            let value3: boolean = value2 > value1;
                            stack.push(value3);
                        }
                        break;
                    case "stringGreater"://0x68
                        {
                            let value1: string = stack.pop();
                            let value2: string = stack.pop();
                            let value3: boolean = value2 > value1;
                            stack.push(value3);
                        }
                        break;
                    //case "extends_"://0x69
                    //0x6a
                    //0x6b
                    //0x6c
                    //0x6d
                    //0x6e
                    //0x6f
                    //0x70
                    //0x71
                    //0x72
                    //0x73
                    //0x74
                    //0x75
                    //0x76
                    //0x77
                    //0x78
                    //0x79
                    //0x7a
                    //0x7b
                    //0x7c
                    //0x7d
                    //0x7e
                    //0x7f
                    //0x80
                    //case "gotoFrame"://0x81
                    //0x82
                    //case "getURL"://0x83
                    //0x84
                    //0x85
                    //0x86
                    case "storeRegister"://0x87
                        {
                            registers[code.args[0]] = stack[stack.length - 1];
                        }
                        break;
                    case "constantPool"://0x88
                        break;
                    //0x89
                    //case "waitForFrame"://0x8a
                    //case "setTarget"://0x8b
                    //case "gotoLabel"://0x8c
                    //case "waitForFrame2"://0x8d
                    //case "defineFunction2"://0x8e
                    //case "try_"://0x8f
                    //0x90
                    //0x91
                    //0x92
                    //0x93
                    //case "with_"://0x94
                    //0x95
                    case "push"://0x96
                        {
                            for (let arg of code.args) {
                                if (arg instanceof Register) {
                                    stack.push(registers[(arg as Register).index]);
                                } else {
                                    stack.push(arg);
                                }
                            }
                        }
                        break;
                    //0x97
                    //0x98
                    case "jump"://0x99
                        {
                            offset = offsets[code.args[0]];
                        }
                        break;
                    //case "getURL2"://0x9a
                    //case "defineFunction"://0x9b
                    //0x9c
                    case "if_"://0x9d
                        {
                            let value1: boolean = stack.pop();
                            if (value1) {
                                offset = offsets[code.args[0]];
                            }
                        }
                        break;
                    //case "call"://0x9e
                    //case "gotoFrame2"://0x9f
                    //0xa0
                    //0xa1
                    //0xa2
                    //0xa3
                    //0xa4
                    //0xa5
                    //0xa6
                    //0xa7
                    //0xa8
                    //0xa9
                    //0xaa
                    //0xab
                    //0xac
                    //0xad
                    //0xae
                    //0xaf
                    //0xb0
                    //0xb1
                    //0xb2
                    //0xb3
                    //0xb4
                    //0xb5
                    //0xb6
                    //0xb7
                    //0xb8
                    //0xb9
                    //0xba
                    //0xbb
                    //0xbc
                    //0xbd
                    //0xbe
                    //0xbf
                    //0xc0
                    //0xc1
                    //0xc2
                    //0xc3
                    //0xc4
                    //0xc5
                    //0xc6
                    //0xc7
                    //0xc8
                    //0xc9
                    //0xca
                    //0xcb
                    //0xcc
                    //0xcd
                    //0xce
                    //0xcf
                    //0xd0
                    //0xd1
                    //0xd2
                    //0xd3
                    //0xd4
                    //0xd5
                    //0xd6
                    //0xd7
                    //0xd8
                    //0xd9
                    //0xda
                    //0xdb
                    //0xdc
                    //0xdd
                    //0xde
                    //0xdf
                    //0xe0
                    //0xe1
                    //0xe2
                    //0xe3
                    //0xe4
                    //0xe5
                    //0xe6
                    //0xe7
                    //0xe8
                    //0xe9
                    //0xea
                    //0xeb
                    //0xec
                    //0xed
                    //0xee
                    //0xef
                    //0xf0
                    //0xf1
                    //0xf2
                    //0xf3
                    //0xf4
                    //0xf5
                    //0xf6
                    //0xf7
                    //0xf8
                    //0xf9
                    //0xfa
                    //0xfb
                    //0xfc
                    //0xfd
                    //0xfe
                    //0xff
                    default:
                        console.error("未知运算符：" + code.op);
                        break;

                }
                //console.log("code.op=" + code.op + ", stack=" + stack);
            }

            if (stack.length > 0) {
                console.error("stack 有残余：" + stack);
            }

        }
    }

    export function getCode(line: string): Code {
        let matchArr: Array<string> = line.match(/^(\w+)(?:\s+(.*))?$/);
        let args: Array<any> = matchArr[2] ? matchArr[2].split(",") : [];
        let i: number = args.length;
        while (i--) {
            let arg: string = args[i];

            let subMatchArr: Array<string> = arg.match(/^label\d+$/);
            if (subMatchArr) {
                continue;
            }

            subMatchArr = arg.match(/^registerid=(\d+)$/);
            if (subMatchArr) {
                args[i] = parseInt(subMatchArr[1]);
                continue;
            }

            subMatchArr = arg.match(/^r\:(\d+)$/);
            if (subMatchArr) {
                let r: Register = new Register();
                r.index = parseInt(subMatchArr[1]);
                args[i] = r;
                continue;
            }

            subMatchArr = arg.match("^\"(.+)\"$");
            if (subMatchArr) {
                args[i] = subMatchArr[1];
                continue;
            }

            switch (arg) {
                case "true":
                    args[i] = true;
                    break;
                case "false":
                    args[i] = false;
                    break;
                case "null":
                    args[i] = null;
                    break;
                case "undefined":
                    args[i] = undefined;
                    break;
                default:
                    args[i] = parseFloat(arg);
                    break;
            }

        }
        return {
            op: matchArr[1],
            args: args
        };
    }

}