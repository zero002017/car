const { ccclass, property } = cc._decorator;

@ccclass
export default class Prefabs extends cc.Component {
    @property([cc.Prefab])
    public prefabs: Array<cc.Prefab> = [];
}

export namespace prefabs {

    export const names: Array<string> = new Array();
    export const s: { [key: string]: cc.Prefab } = {};

    export function init(prefabs: Array<cc.Prefab>): void {
        for (const prefab of prefabs) {
            if (prefab) {
                if (s[prefab.data.name]) {
                    console.error("重复名字的 prefab：" + prefab.data.name);
                } else {
                    names.push(prefab.data.name);
                    s[prefab.data.name] = prefab;
                }
            }
        }
    }

    export function has(name: string): boolean {
        return s[name] ? true : false;
    }

    export function instantiate(name: string): cc.Node {
        const prefab = s[name];
        if (prefab) {
            return cc.instantiate(prefab);
        }
        console.error("木有Prefab：" + name);
        return null;
    }

}
