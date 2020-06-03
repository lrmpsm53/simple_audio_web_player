export interface ITreeNode<T> {
    name?: string;
    element: T;
    children?: ITreeNode<T>[];
}

type TTreeMap<T> =  { [index: string]: T };

export abstract class Tree<T> {
    readonly root: T;
    protected tree: ITreeNode<T>;
    protected treeMap: TTreeMap<T>;
    createMap(node: ITreeNode<T>) {
		const buffer: TTreeMap<T> = {};
		function handler(node: ITreeNode<T>) {
			if (!!node.name) buffer[node.name] = node.element;
		}
		this.treeTrevesal(handler, node);
		return buffer;
	}
	treeTrevesal(handler: (node: ITreeNode<T>) => void, tree: ITreeNode<T>) {
		const callback = (node: ITreeNode<T>) => {
			handler(node);
			if (node.children) {
				node.children.forEach(child => callback(child));
			}
		}
		callback(tree);
	}
	get(key: string): T {
        return this.treeMap[key];
	}
	abstract buildTree(...args: any[]): any;
    constructor(tree: ITreeNode<T>) {
        this.tree = tree;
		this.root = this.tree.element;
		this.treeMap = this.createMap(tree);
	}
}