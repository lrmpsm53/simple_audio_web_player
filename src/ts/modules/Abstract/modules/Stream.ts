abstract class Stream<T extends object> {
    protected abstract fields: T;
    forEach<K extends keyof T, M extends K>(callback: (arg: T[M], key: M) => void) {
        const cleanFields = { ...this.fields };
        Object.keys(cleanFields).forEach(key => callback(this.fields[key as M], key as M));
    }
    get<K extends keyof T, M extends K>(key: M) {
        return this.fields[key];
    }
    getAll() {
        return this.fields;
    }
    set<K extends keyof T, M extends K>(key: M, value: T[M]) {
        this.fields[key] = value;
        return this
    }
    abstract push(arg: any): void;
    abstract pop(): void;
}

export class StreamForArrays<T> extends Stream<Array<T>> {
    fields: T[];
    constructor(...fields: T[]) {
        super();
        this.fields = fields;
    }
    push(value: T) {
        this.fields.push(value);
    }
    pop() {
        this.fields.pop();
    }
}

export class StreamForObjects<T extends object = object> extends Stream<T> {
    fields: T;
    constructor(fields?: T) {
        super();
        this.fields = fields ? fields : {} as T;
    }
    push(value: object) {
        const keys = Object.keys(value);
        if (keys.length > 1) throw new Error;
    }
    pop() {
        const keys = Object.keys(this.fields);
        const lastKey = keys[keys.length - 1] as keyof T;
        delete this.fields[lastKey];
    }
}