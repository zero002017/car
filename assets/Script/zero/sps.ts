export namespace sps {

    export const names: Array<string> = new Array();
    const jsons: { [key: string]: { skel: string, atlas: string, texName: string } } = {};
    const texs: { [key: string]: cc.Texture2D } = {};
    const skeletonDatas: { [key: string]: sp.SkeletonData } = {};

    let timeScale: number;

    export function init(linesStr: string, initComplete: () => void): void {
        setTimeScale(1);
        const lines = linesStr.replace(/^\s*|\s*$/g, "").split(/\s*\n\s*/);
        const _skels: { [key: string]: string } = {};
        const L = lines.length / 3;
        for (let i: number = 0; i < L; i++) {
            const name = lines[i * 3];
            names.push(name);
            jsons[name] = { skel: lines[i * 3 + 1], atlas: lines[i * 3 + 2].replace(/#/g, "\n"), texName: null };
            if (_skels[jsons[name].skel]) {
                jsons[name].skel = _skels[jsons[name].skel];
            } else {
                _skels[name] = jsons[name].skel;
            }
            jsons[name].texName = jsons[name].atlas.match(/(\w+)\.png/)[1];
        }
        cc.resources.loadDir("sps/", cc.SpriteFrame, (error, spriteFrames: Array<cc.SpriteFrame>) => {
            for (const spriteFrame of spriteFrames) {
                texs[spriteFrame.name] = spriteFrame.getTexture();
            }
            //console.log(texs);
            if (initComplete) {
                initComplete();
            }
        });
    }

    export function setTimeScale(_timeScale: number): void {
        timeScale = _timeScale;
    }

    export function getSkel(name: string): sp.Skeleton {
        let skeletonData: sp.SkeletonData = skeletonDatas[name];
        if (skeletonData) { } else {
            if (jsons[name]) {
                skeletonDatas[name] = skeletonData = new sp.SkeletonData();
                skeletonData["_uuid"] = name;
                skeletonData.skeletonJson = jsons[name].skel;
                skeletonData.atlasText = jsons[name].atlas;
                skeletonData.textures = [texs[jsons[name].texName]];
                skeletonData["textureNames"] = [jsons[name].texName + ".png"];
            } else {
                console.error("木有 " + name);
                return null;
            }
        }
        const node = new cc.Node();
        const skel = node.addComponent(sp.Skeleton);
        skel.skeletonData = skeletonData;
        skel.enableBatch = true;
        skel.timeScale = timeScale;
        return skel;
    }

}