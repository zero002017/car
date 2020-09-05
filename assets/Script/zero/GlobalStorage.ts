import Storage_ from "./Storage_";
import { gameName, storageTime } from "./global";

let $globalStorageStorage: Storage_;
export namespace GlobalStorage {

    export let openId: string = "";
    export let nickname: string = "";
    export let headImgURL: string = "";
    export let gender: 0 | 1 | 2 = 0;

    export let selectedLanguageKey: string;

    export let musicOn: boolean = true;
    export let soundOn: boolean = true;

    export let testEffectsIndex: number = 0;
    export let testSkinIndex: number = 0;

    export let showBox: boolean = false;
    export let gongshiDebug: boolean = false;

    export let showDebugPanel: boolean = false;

    export let ignores: Array<string> = new Array();

    export let 邀请次数们: { [key: string]: number } = {};

    export let 下次弹出每日钻石: boolean = true;

    export let fangchenmi_date: number;
    export let fangchenmi_startTime: number;

    export function init(): void {
        $globalStorageStorage = new Storage_(GlobalStorage, gameName + "_GlobalStorage" + storageTime);
    }

    export function toJSONCode(): string {
        return JSON.stringify(GlobalStorage);
    }

    export function flush(): void {
        $globalStorageStorage.flush();
    }

}