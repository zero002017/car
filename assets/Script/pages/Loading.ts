import Page from "./Page";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends Page {

    private warning: cc.Node;
    private companyNames: cc.Node;
    private _bar: cc.Node;
    private bar: cc.Node;
    private barWid0: number;
    private go: cc.Node;

    private targetPercent: number;
    private currPercent: number;

    public onLoadComplete: () => void;

    public init(): void {
        super.init();

        this.warning = this.node.getChildByName("warning");
        this.companyNames = this.node.getChildByName("companyNames");
        if (window["showCompanyNames"]) { } else {
            this.companyNames.destroy();
        }
        this._bar = this.node.getChildByName("bar");
        this.bar = this._bar.getChildByName("bar");
        this.barWid0 = this.bar.width;
        this._bar.active = false;

        this.go = this.node.getChildByName("go");
        //####
        this.go.on(cc.Node.EventType.TOUCH_START, () => {
            Sounds.playFX("点击");
            this.warning.active = false;
            this.go.active = false;
            this._bar.active = true;
            main.enterFrames.add(this.updateProgress);
        });
        this.go.getChildByName("点击屏幕继续").runAction(cc.repeatForever(cc.sequence(
            cc.fadeTo(1, 100),
            cc.fadeTo(1, 255)
        )));

        this.targetPercent = 0;
        this.currPercent = 0;
    }

    public addProgress(d: number): void {
        this.targetPercent += d;
        //console.log("this.targetPercent=" + this.targetPercent);
    }

    private updateProgress = () => {
        const d: number = this.targetPercent - this.currPercent;
        if (d < 1) {
            this.currPercent = this.targetPercent;
        } else {
            this.currPercent += d * 0.4;
        }
        this.bar.width = this.barWid0 * this.currPercent / 100;
        if (this.currPercent >= 100) {
            main.enterFrames.clear(this.updateProgress);
            if (this.onLoadComplete) {
                this.onLoadComplete();
                this.onLoadComplete = null;
            }
        }
    }

    public show(): void {
        super.show();
    }

    public showComplete(): void {
        super.showComplete();
    }

    public hide(): void {
        super.hide();
    }

    public hideComplete(): void {
        super.hideComplete();

        main.startCPB.deactive();
    }

}
