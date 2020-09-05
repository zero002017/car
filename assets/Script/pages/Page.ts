import { swid } from "../Main";
import { hei0 } from "../zero/global";

export default abstract class Page extends cc.Component {
    public init(): void {
        this.node.setContentSize(swid, hei0);
    }

    public show(): void { }

    public showComplete(): void { }

    public hide(): void { }

    public hideComplete(): void { }

}
