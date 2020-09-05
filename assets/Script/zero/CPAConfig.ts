//中文
interface CPAConfig {
    success: boolean;
    msg: string;
    version: string;
    data: {
        isopen: boolean;
        version: string;
        mainIcon: CPAAdSet;
        labIcon: CPAAdSet;
        gameIcon: CPAAdSet;
        mainIcons: CPAAdSet;
        mainBanner: CPAAdSet;
        gameBanner: CPAAdSet;
        gameoverBanner2: CPAAdSet;
        addturnlist: { [key: string]: CPAGameInfo };
    };
    苹果不显示: Array<string>;
    推荐2: Array<string>;
    CPA关: boolean;
    CPA黑名单: Array<number>;
    加载页显示CPA: boolean;
    qrs: Array<QR>;
}

interface CPAAdSet {
    itemlist: Array<string>;
    adtype: string;
}

interface CPAGameInfo {
    otherIconUrl: string;
    otherInsertUrl?: string;
    otherBannerUrl: string;
    otherBanner2Url: string;
    otherAppId: string;
    otherName: string;
    otherIndexPath: string;
    showTimes?: number;
}

interface QR {
    name: string;
    icon: string;
    b: string;
}
