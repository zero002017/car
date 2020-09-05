import { prefabs } from "../ui/Prefabs";

export namespace Atlas {

    const sfs: Array<SF> = new Array();
    interface SF {
        atlasName: string;
        sfName: string;
        onComplete: (spriteFrame: cc.SpriteFrame) => void;
    }
    let loading: boolean;

    const atlass: { [key: string]: cc.SpriteAtlas } = {};

    export let spss: { [key: string]: { [key: string]: cc.SpriteFrame } };

    export function init(node: cc.Node, _spss: { [key: string]: { [key: string]: cc.SpriteFrame } }): void {
        spss = _spss;
        for (const child of node.children) {
            const sps: { [key: string]: cc.SpriteFrame } = spss[child.name] = {};
            for (const subChild of child.children) {
                const sp = subChild.getComponent(cc.Sprite);
                if (sp) {
                    sps[subChild.name] = sp.spriteFrame;
                } else {
                    console.error("木有 sprite：" + child.name + " " + subChild.name);
                }
            }
        }
    }

    export function load(atlasName: string, sfName: string, onComplete: (spriteFrame: cc.SpriteFrame) => void): void {
        sfs.push({
            atlasName: atlasName,
            sfName: sfName,
            onComplete: onComplete
        });
        if (loading) { } else {
            loading = true;
            loadNext();
        }
    }

    function loadNext(): void {
        const node = sfs[0];
        const atlas = atlass[node.atlasName];
        if (atlas) {
            getSF(node);
        } else {
            cc.resources.load(node.atlasName + "/_", (error, _atlas: cc.SpriteAtlas) => {
                console.log(_atlas);
                atlass[node.atlasName] = _atlas;
                getSF(node);
            });
        }
    }

    function getSF(node: SF): void {
        const atlas = atlass[node.atlasName];
        const sfName = node.sfName.match(/[^\/]+$/)[0];
        if (atlas["_spriteFrames"][sfName]) {
            getSFComplete(atlas.getSpriteFrame(sfName), node);
        } else {
            cc.resources.load(node.atlasName + "/" + node.sfName, (error, texture: cc.Texture2D) => {
                getSFComplete(new cc.SpriteFrame(texture), node);
            });
        }
    }

    function getSFComplete(spriteFrame: cc.SpriteFrame, node: SF): void {
        let i: number = sfs.length;
        while (i--) {
            const _node = sfs[i];
            if (
                _node.atlasName == node.atlasName &&
                _node.sfName == node.sfName
            ) {
                sfs.splice(i, 1);
                if (_node.onComplete) {
                    _node.onComplete(spriteFrame);
                }
            }
        }
        if (sfs.length) {
            loadNext();
        } else {
            loading = false;
        }
    }

}