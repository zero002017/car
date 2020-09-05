interface CPBConfig {
    开: boolean;
    加载页显示: boolean;
    黑名单: Array<number>;
    苹果不显示: Array<number>;
    推荐1: Array<number>;
    推荐2: Array<number>;
    atlas: string;
    文字底: Array<number>;
    cpbs: Array<CPBGameInfo>;
}

interface CPBGameInfo {
    appId: string;
    name: string;
    nameRect: Array<number>;
    path: string;
    icon: string;
    iconRect: Array<number>;
    insert: string;
}
