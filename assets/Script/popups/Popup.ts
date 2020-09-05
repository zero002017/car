export abstract class Popup extends cc.Component {

	public showing: boolean;

	public init(): void {
	}

	public show(): void {
		this.showing = true;
	}

	public showComplete(): void {
	}

	public hide(): void {
		this.showing = false;
		//popups.hide(this);//报错：Uncaught TypeError: Object prototype may only be an Object or null: undefined
		window["popups"].hide(this);
	}

	public hideComplete(): void {
	}

}
