export default class EnterFrames {

    private s: Array<() => void>;

    public constructor() {
        this.s = new Array();
    }

    public add(f: () => void): void {
        if (this.s.indexOf(f) == -1) {
            this.s.push(f);
        }
    }

    public clear(f: () => void): void {
        const index: number = this.s.indexOf(f);
        if (index > -1) {
            this.s[index] = null;
        }
    }

    public clearAll(): void {
        this.s.length = 0;
    }

    public step(): void {
        for (const f of this.s) {
            if (f) {
                f();
            }
        }
        let i: number = this.s.length;
        while (i--) {
            if (this.s[i]) { } else {
                this.s.splice(i, 1);
            }
        }
    }

}
