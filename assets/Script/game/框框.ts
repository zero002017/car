export default class 框框 {

    public node: cc.Node;
    public stars: Array<cc.Node>;

    public init(node: cc.Node): void {
        this.node = node;
        this.stars = this.node.children.slice();
    }

    public set(stars: number): void {
        for (const star of this.stars) {
            star.active = false;
        }
        this.stars[stars - 1].active = true;
    }

}
