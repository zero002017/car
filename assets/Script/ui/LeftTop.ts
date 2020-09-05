const { ccclass, property } = cc._decorator;

@ccclass
export default class LeftTop extends cc.Component {

    public adjust(): void {
        let i: number = -1;
        for (const child of this.node.children) {
            if (child.active) {
                i++;
                child.x = 0;
                child.y = -i * 70;
            }
        }
    }

}
