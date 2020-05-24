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
    createMap(node:ITreeNode<T>) {
		const buffer: ITreeMap<T> = {};
		function handler(node: ITreeNode<T>) {
			if (!!node.name) buffer[node.name] = node.element;
		}
		this.treeTrevesal(handler, node);
		return buffer;
	}
	treeTrevesal(handler: (node: ITreeNode<T>,) => void, tree: ITreeNode<T>) {
		const callback = (node: ITreeNode<T>) => {
			handler(node);
			node.children?.forEach(child => callback(child));
		}
		callback(tree);
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