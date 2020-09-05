let maxIndex: number = 0;

interface Args {
    time: number;
    action: () => void;
    group?: string;
    name?: string;
}

export default class Delays {

    private s: Array<Args>;

    public constructor() {
        this.s = new Array();
    }

    public delay(args: Args): void {
        if (args.group) { } else {
            args.group = "default";
        }
        if (args.name) { } else {
            args.name = "#" + (++maxIndex);
        }
        if (args.time > 0) { } else {
            args.time = 0;
        }
        this.clear(args.group, args.name);
        this.s.push(args);
    }

    public clear(group: string, name?: string): void {
        let i: number = this.s.length;
        if (name) {
            while (i--) {
                const args = this.s[i];
                if (args) {
                    if (args.group == group && args.name == name) {
                        args.action = null;
                        this.s[i] = null;
                    }
                }
            }
        } else {
            while (i--) {
                const args = this.s[i];
                if (args) {
                    if (args.group == group) {
                        args.action = null;
                        this.s[i] = null;
                    }
                }
            }
        }
    }

    public clearAll(): void {
        for (const args of this.s) {
            if (args) {
                args.action = null;
            }
        }
        this.s.length = 0;
    }

    public step(dt: number): void {
        let i: number = -1;
        for (const args of this.s) {
            i++;
            if (args) {
                if ((args.time -= dt) > 0) { } else {
                    args.action();
                    args.action = null;
                    this.s[i] = null;
                }
            }
        }
        i = this.s.length;
        while (i--) {
            const args = this.s[i];
            if (args) { } else {
                this.s.splice(i, 1);
            }
        }
    }

}
