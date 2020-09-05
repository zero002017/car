//中文
interface CPA12Config {
    code: number,
    data: Array<CPA12GameInfo>;
    msg: string,
    success: boolean
}

interface CPA12GameInfo {
    Position: number,
    GameName: string,
    GameAppId: string,
    Icon: string,
    PromoteLink: string,
    QRCode: string,
    JumpType: number,
    MutualType: string,
    Remark: string
}
