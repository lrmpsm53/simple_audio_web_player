export interface ITreeNode<T> {
    name?: string;
    element: T;
    children?: ITreeNode<T>[];
}

interface ITreeMap<T> {
    [index: string]: T;
}

export abstract class Tree<T> {
    readonly root: T;
    protected tree: ITreeNode<T>;
    protected treeMap: ITreeMap<T>;
    createMap(node:ITreeNode<T>, buffer: ITreeMap<T> = {}) {
		if (!!node.name) {
			buffer[node.name] = node.element;
		}
		if (!!node.children) {
			node.children.forEach(
				child => this.createMap(child, buffer)
			);
		}
		return buffer;
	}
	get<K extends keyof ITreeMap<T>, M extends K>(key: M) {
        return this.treeMap[key];
	}
	abstract buildTree(...args: any[]): any;
    constructor(tree: ITreeNode<T>) {
        this.tree = tree;
		this.root = this.tree.element;
		this.treeMap = this.createMap(tree);
	}
}