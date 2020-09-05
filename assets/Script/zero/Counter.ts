import { main } from "../Main";

export default class Counter {

	public sec: number;
	private setSec: (sec: number) => void;
	private onComplete: () => void;

	private running: boolean;
	public counting: boolean;
	private lastTime: number;
	public restSec: number;

	public init(_sec: number, _setSec: (sec: number) => void): void {
		this.stop();
		this.sec = _sec;
		this.setSec = _setSec;
		if (this.setSec) this.setSec(this.sec);
	}

	public start(_onComplete: () => void): void {
		this.stop();
		this.running = true;
		this.onComplete = _onComplete;
		this.restSec = this.sec;
		this.resume();
		this.count();
	}
	public pause(): void {
		if (this.running) { } else { return; }
		this.counting = false;
		main.enterFrames.clear(this.count);
	}
	public resume(): void {
		if (this.running) { } else { return; }
		this.counting = true;
		this.lastTime = new Date().getTime();
		main.enterFrames.add(this.count);
	}
	public stop(): void {
		this.pause();
		this.onComplete = null;
		this.running = false;
	}
	private count = () => {
		const time = new Date().getTime();
		let ds: number = time - this.lastTime;
		if (ds > 0) {
			ds /= 1000;
		} else {
			ds = 0;
		}
		this.lastTime = time;
		this.restSec -= ds;
		if (this.restSec <= 0) {
			this.restSec = 0;
			let onComplete = this.onComplete;
			this.stop();
			if (onComplete) {
				onComplete();
			}
		}
		if (this.setSec) this.setSec(Math.ceil(this.restSec));
	}
	public clear(): void {
		this.stop();
		this.setSec = null;
	}

}
