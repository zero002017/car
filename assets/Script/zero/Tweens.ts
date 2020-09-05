export default class Tweens {

    private s: Array<Tween> = new Array();

    public from(target: any, props: any, duration: number, ease?: (x: number) => number, complete?: (target: any) => void, update?: (target: any) => void, delay?: number): void {
        this.add(target, props, null, props, duration, ease, complete, update, delay);
    }

    public to(target: any, props: any, duration: number, ease?: (x: number) => number, complete?: (target: any) => void, update?: (target: any) => void, delay?: number): void {
        this.add(target, null, props, null, duration, ease, complete, update, delay);
    }

    public fromTo(target: any, fromProps: any, toProps: any, duration: number, ease?: (x: number) => number, complete?: (target: any) => void, update?: (target: any) => void, delay?: number): void {
        this.add(target, fromProps, toProps, fromProps, duration, ease, complete, update, delay);
    }

    private add(target: any, fromProps: any, toProps: any, setProps: any, duration: number, ease: (x: number) => number, complete: (target: any) => void, update: (target: any) => void, delay: number): void {
        this.s.push(new Tween(target, fromProps, toProps, setProps, duration, ease, complete, update, delay));
    }

    public clear(target: any): void {
        let i: number = -1;
        for (const tween of this.s) {
            i++;
            if (tween) {
                if (tween.target == target) {
                    tween.clear();
                    this.s[i] = null;
                }
            }
        }
    }

    public clearAll(): void {
        for (const tween of this.s) {
            if (tween) {
                tween.clear();
            }
        }
        this.s.length = 0;
    }

    public step(dt: number): void {
        let i: number = -1;
        for (const tween of this.s) {
            i++;
            if (tween) {
                if (tween.step(dt)) {
                    tween.clear();
                    this.s[i] = null;
                }
            }
        }
        i = this.s.length;
        while (i--) {
            const tween = this.s[i];
            if (tween) { } else {
                this.s.splice(i, 1);
            }
        }
    }

}

class Tween {

    public target: any;
    private fromProps: any;
    private toProps: any;
    private duration: number;
    private ease: (x: number) => number;
    private complete: (target: any) => void;
    private update: (target: any) => void;
    private delay: number;

    private time: number;

    public constructor(target: any, fromProps: any, toProps: any, setProps: any, duration: number, ease: (x: number) => number, complete: (target: any) => void, update: (target: any) => void, delay: number) {

        if (target) { } else {
            console.error("Tween target 为空");
            return;
        }

        this.target = target;
        this.fromProps = fromProps;
        this.toProps = toProps;
        this.duration = duration;
        this.ease = ease;
        this.complete = complete;
        this.update = update;
        this.delay = delay;

        if (this.fromProps) { } else {
            this.fromProps = {};
            for (const key in this.toProps) {
                this.fromProps[key] = this.target[key];
            }
        }
        if (this.toProps) { } else {
            this.toProps = {};
            for (const key in this.fromProps) {
                this.toProps[key] = this.target[key];
            }
        }
        if (this.duration > 0) { } else {
            this.duration = 0;
        }
        if (this.ease) { } else {
            this.ease = eases.linear;//默认
        }
        if (this.delay > 0) { } else {
            this.delay = 0;
        }

        //console.log("fromProps=" + JSON.stringify(this.fromProps));
        //console.log("toProps=" + JSON.stringify(this.toProps));
        if (setProps) {
            this.setProps(setProps);
        }

        this.time = 0;

    }

    private setProps(props: any): void {
        for (const key in props) {
            this.target[key] = props[key];
        }
        if (this.update) this.update(this.target);
    }

    public clear(): void {
        this.target = null;
        this.fromProps = null;
        this.toProps = null;
        this.ease = null;
        this.complete = null;
        this.update = null;
    }

    public step(dt: number): boolean {

        if (this.target instanceof cc.Node) {
            if (this.target.isValid) { } else {
                return true;
            }
        }

        if (this.delay > 0) {
            if ((this.delay -= dt) > 0) {
                return false;
            }
        }

        if (this.duration > 0) {
            if ((this.time += dt) < this.duration) {
                const k = this.ease(this.time / this.duration);
                for (const key in this.fromProps) {
                    this.target[key] = this.fromProps[key] + (this.toProps[key] - this.fromProps[key]) * k;
                    //console.log(key, this.fromProps[key], this.toProps[key], this.target[key]);
                }
                if (this.update) this.update(this.target);
                return false;
            }
        }

        this.setProps(this.toProps);
        if (this.complete) this.complete(this.target);
        return true;

    }

}

export namespace eases {

    export function linear(x: number): number {
        return x;
    }

    export function quadIn(x: number): number {
        return x * x;
    }
    export function quadOut(x: number): number {
        x = 1 - x; return 1 - x * x;
    }
    export function quadInOut(x: number): number {
        if (x < 0.5) return x * x * 2;
        x = 1 - x; return 1 - x * x * 2;
    }

    export function cubicIn(x: number): number {
        return x * x * x;
    }
    export function cubicOut(x: number): number {
        x = 1 - x; return 1 - x * x * x;
    }
    export function cubicInOut(x: number): number {
        if (x < 0.5) return x * x * x * 4;
        x = 1 - x; return 1 - x * x * x * 4;
    }

    export function backIn(x: number): number {
        //let s: number = 1.70158;
        let s: number = 1.7;
        return x * x * ((s + 1) * x - s);
    }
    export function backOut(x: number): number {
        let s: number = 1.7;
        x = 1 - x; return 1 - x * x * ((s + 1) * x - s);
    }
    export function backInOut(x: number): number {
        let s: number = 0.5;
        if (x < 0.5) return x * x * ((s + 1) * x - s) * 8;
        x = 1 - x; return 1 - x * x * ((s + 1) * x - s) * 8;
    }

    export function bounceIn(x: number): number {
        return 1 - bounceOut(1 - x);
    }
    export function bounceOut(x: number): number {
        if (x < (1 / 2.75)) {
            return (7.5625 * x * x);
        }
        else if (x < (2 / 2.75)) {
            return (7.5625 * (x -= (1.5 / 2.75)) * x + .75);
        }
        else if (x < (2.5 / 2.75)) {
            return (7.5625 * (x -= (2.25 / 2.75)) * x + .9375);
        }
        else {
            return (7.5625 * (x -= (2.625 / 2.75)) * x + .984375);
        }
    }
    export function bounceInOut(x: number): number {
        if (x < 0.5) return bounceIn(x * 2) * 0.5;
        return bounceOut(x * 2 - 1) * 0.5 + 0.5;
    }

}
