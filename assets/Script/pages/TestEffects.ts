import Page from "./Page";
import { sps } from "../zero/sps";
import { Sounds } from "../zero/Sounds";
import { GlobalStorage } from "../zero/GlobalStorage";
import { playAnimation, getAniNames, getSkinNames } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestEffects extends Page {

    private container: cc.Node;
    private prev: cc.Node;
    private next: cc.Node;
    private txt: cc.Label;

    private currAniNames: Array<string>;
    private currSkinNames: Array<string>;

    public init(): void {
        super.init();

        this.container = this.node.getChildByName("container");

        this.prev = this.node.getChildByName("prev");
        this.prev.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            if (--GlobalStorage.testSkinIndex < 0) {
                if (--GlobalStorage.testEffectsIndex < 0) {
                    GlobalStorage.testEffectsIndex = sps.names.length - 1;
                }
                this.updateNames();
                GlobalStorage.testSkinIndex = this.currSkinNames.length - 1;
            }
            GlobalStorage.flush();
            this.showEffect();
        });
        this.next = this.node.getChildByName("next");
        this.next.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            if (++GlobalStorage.testSkinIndex >= this.currSkinNames.length) {
                if (++GlobalStorage.testEffectsIndex >= sps.names.length) {
                    GlobalStorage.testEffectsIndex = 0;
                }
                this.updateNames();
                GlobalStorage.testSkinIndex = 0;
            }
            GlobalStorage.flush();
            this.showEffect();
        });

        this.txt = this.node.getChildByName("txt").getComponent(cc.Label);
    }

    private updateNames(): void {
        const spName = sps.names[GlobalStorage.testEffectsIndex];
        const skel = sps.getSkel(spName);
        this.currAniNames = getAniNames(skel);
        this.currSkinNames = getSkinNames(skel);
        console.log("currAniNames=" + this.currAniNames);
        console.log("currSkinNames=" + this.currSkinNames);
        skel.node.destroy();
    }

    private showEffect(): void {
        this.container.destroyAllChildren();
        let x: number = -1;
        let y: number = 0;
        const spName = sps.names[GlobalStorage.testEffectsIndex];
        const skinName = this.currSkinNames[GlobalStorage.testSkinIndex];
        this.txt.string = spName + " " + GlobalStorage.testEffectsIndex + "/" + sps.names.length + " " + skinName + " " + GlobalStorage.testSkinIndex + "/" + this.currSkinNames.length;
        console.log(this.txt.string);
        if (skinName) {
            for (const aniName of this.currAniNames) {
                if (++x >= 7) {
                    x = 0;
                    y++;
                }
                const skel = sps.getSkel(spName);
                this.container.addChild(skel.node);
                skel.setSkin(skinName);
                playAnimation(skel, aniName, true);
                skel.node.x = x * 150;
                skel.node.y = -y * 180;
                const txt = new cc.Node().addComponent(cc.Label);
                this.container.addChild(txt.node);
                txt.fontSize = 16;
                txt.node.x = skel.node.x;
                txt.node.y = skel.node.y - 50;
                if (spName.indexOf("10600") == 0) {
                    skel.node.scaleX = skel.node.scaleY = 0.6;
                }
                txt.string = aniName;
            }
        }
    }

    public show(): void {
        super.show();

        if (GlobalStorage.testEffectsIndex >= sps.names.length) {
            GlobalStorage.testEffectsIndex = sps.names.length - 1;
        }
        this.updateNames();
        if (GlobalStorage.testSkinIndex >= this.currSkinNames.length) {
            GlobalStorage.testSkinIndex = 0;
        }
        this.showEffect();
    }

    public showComplete(): void {
        super.showComplete();
    }

    public hide(): void {
        super.hide();

        this.container.destroyAllChildren();
    }

    public hideComplete(): void {
        super.hideComplete();
    }

}
