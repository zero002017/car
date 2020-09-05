import { UserStorage } from "../zero/UserStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class 等待 extends cc.Component {

    private circle: cc.Sprite;
    private position: UserStorage.Position;
    private totalTime: number;
    public onUpdate: (restSec: number) => void;
    private onComplete: () => void;

    public init(position: UserStorage.Position, sec: number, onComplete: () => void) {
        this.circle = this.node.getChildByName("circle").getComponent(cc.Sprite);
        this.position = position;
        this.totalTime = sec * 1000;
        this.onComplete = onComplete;
    }

    protected update(dt: number): void {
        let k: number = 1 - (new Date().getTime() - this.position.startTime) / this.totalTime;
        if (k < 0) {
            k = 0;
            if (this.onUpdate) {
                this.onUpdate(0);
                this.onUpdate = null;
            }
            if (this.onComplete) {
                this.onComplete();
                this.onComplete = null;
            }
            return;
        }
        this.circle.fillRange = k;
        if (this.onUpdate) {
            this.onUpdate(Math.floor(k * this.totalTime / 1000));
        }
    }

}
