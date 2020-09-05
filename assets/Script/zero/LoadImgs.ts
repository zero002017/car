import { GlobalStorage } from "./GlobalStorage";

export namespace LoadImgs {

    export const sps: { [key: string]: cc.SpriteFrame } = {};
    const urls: Array<string> = new Array();
    const nodess: { [key: string]: Array<Node> } = {};

    let loading: boolean = false;

    interface Node {
        onLoadComplete: (sp: cc.SpriteFrame) => void;
        ignoreIfError: boolean;
    }

    export function load(url: string, onLoadComplete: (sp: cc.SpriteFrame) => void, ignoreIfError: boolean): void {
        //console.log("加载 " + url);
        if (GlobalStorage.ignores.indexOf(url) > -1) {
            return;
        }
        if (sps[url]) {
            if (onLoadComplete) {
                onLoadComplete(sps[url]);
            }
        } else {
            if (urls.indexOf(url) == -1) {
                urls.push(url);
            }
            if (nodess[url]) { } else {
                nodess[url] = new Array();
            }
            nodess[url].push({
                onLoadComplete: onLoadComplete,
                ignoreIfError: ignoreIfError
            });
            if (loading) { } else {
                loadNext();
            }
        }
    }

    function loadNext(): void {
        if (urls.length) {
            loading = true;
            const url = urls[0];
            cc.assetManager.loadRemote(url, (error, texture: cc.Texture2D) => {
                const nodes = nodess[url];
                if (error) {
                    console.error("加载失败：" + url);
                    for (const node of nodes) {
                        if (node.ignoreIfError) {
                            GlobalStorage.ignores.push(url);
                            GlobalStorage.flush();
                            break;
                        }
                    }
                } else {
                    const sp = new cc.SpriteFrame(texture);
                    sps[url] = sp;
                    for (let node of nodes) {
                        if (node.onLoadComplete) {
                            node.onLoadComplete(sp);
                        }
                    }
                }

                nodes.length = 0;
                delete nodess[url];
                urls.shift();

                loadNext();

            });
        } else {
            loading = false;
        }
    }

}