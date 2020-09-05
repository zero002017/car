export default class Storage_ {

    private target: any;
    private key: string;
    public jsonCode: string;

    public constructor(_target: any, _key: string) {
        this.target = _target;
        this.key = _key;
        this.jsonCode = localStorage.getItem(this.key);
        //console.log(_key + "\n" + this.jsonCode);
        if (this.jsonCode) {
            this.jsonCode = this.jsonCode.replace(/\s*|\s*$/g, "");
            if (this.jsonCode) {
                const json: any = JSON.parse(this.jsonCode);
                for (const key in json) {
                    this.target[key] = json[key];
                }
            }
        }
    }

    public clear(): void {
        this.target = null;
        this.key = null;
    }

    public flush(): void {
        this.jsonCode = JSON.stringify(this.target, null, "\t");
        //console.log(this.key + ", " + this.jsonCode.substr(0, 30));
        try {
            localStorage.setItem(this.key, this.jsonCode);
        } catch (e) {
            console.error("e=" + e);
        }
    }

}