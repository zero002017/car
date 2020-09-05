import { getDDs, getSpNode } from "../zero/global";
import { Sounds } from "../zero/Sounds";
import { main } from "../Main";

export default abstract class BaseMoneys extends cc.Component {

    protected playEffects(
        itemName: string, d: number, fromX: number, fromY: number, toX: number, toY: number,
        onEffectStart: (dd: number) => void, onEffectEnd: (dd: number) => void, onComplete: () => void
    ): void {
        let dds: Array<number> = getDDs(d, 3);
        let i: number = -1;
        for (let dd of dds) {
            i++;
            this.playEffect(
                itemName, dd, i * 0.1, fromX, fromY, toX, toY,
                onEffectStart, onEffectEnd, i == dds.length - 1 ? onComplete : null
            );
        }
    }

    private playEffect(
        itemName: string, dd: number, delay: number, fromX: number, fromY: number, toX: number, toY: number,
        onEffectStart: (dd: number) => void, onEffectEnd: (dd: number) => void, onComplete: () => void
    ): void {
        main.delays.delay({
            time: delay,
            action: () => {
                if (onEffectStart) {
                    onEffectStart(dd);
                }
                let effect: cc.Node = getSpNode("ui", itemName);
                this.node.addChild(effect);
                effect.x = fromX;
                effect.y = fromY;
                effect.runAction(cc.sequence(
                    cc.moveTo(0.6, toX, toY).easing(cc.easeCircleActionInOut()),
                    cc.callFunc(() => {
                        //Sounds.playFX("钻石金币体力");
                        effect.destroy();
                        let ani: cc.Node = getSpNode("ui", itemName + "亮");
                        this.node.addChild(ani);
                        ani.x = toX;
                        ani.y = toY;
                        ani.runAction(cc.sequence(
                            cc.fadeOut(0.3),
                            cc.callFunc(() => {
                                ani.destroy();
                            }, this)
                        ));
                        if (onEffectEnd) {
                            onEffectEnd(dd);
                        }
                        main.delays.delay({
                            time: 0.5,
                            action: () => {
                                if (onComplete) {
                                    onComplete();
                                }
                            }
                        });
                    }, this)
                ));
            }
        });
    }

}