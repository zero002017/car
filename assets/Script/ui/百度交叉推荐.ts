import { guideAllComplete, platformType, getDeviceRect } from "../zero/global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class 百度交叉推荐 extends cc.Component {

    private recommendationButton: any;

    public show(): void {

        if (guideAllComplete()) { } else {
            return;
        }

        if (platformType == "百度小游戏") { } else {
            return;
        }

        const b = getDeviceRect(this.node);
        this.recommendationButton = wx["createRecommendationButton"]({
            type: 'list',
            style: {
                left: b[0],
                top: b[1],
            }
        });

        this.recommendationButton.onError((e) => {
            console.error(e);
        });

        this.recommendationButton.onLoad(() => {
            this.recommendationButton.show();
        });

        this.recommendationButton.load();

    }

    public hide(): void {
        if (this.recommendationButton) {
            this.recommendationButton.offError();
            this.recommendationButton.offLoad();
            this.recommendationButton.hide();
            this.recommendationButton.destroy();
            this.recommendationButton = null;
        }
    }

}
