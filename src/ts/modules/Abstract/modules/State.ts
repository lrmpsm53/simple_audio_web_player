export type TState<T> = State<T, object>

export class State<V, C extends object> {
    protected context: C;
    readonly callbacks: Array<(arg: V) => void> = [];
    protected cache: V;
    readonly binds: TState<V>[] = [];
    constructor(context: C, value: V) {
        this.context = context;
        this.cache = value;
    }
    value(value?: V, param?: 'nobind'|'forcibly') {
        if (value !== undefined) {
            if (value !== this.cache || param === 'forcibly') {
                this.cache = value;
                if(!(param === 'nobind')) this.updateBinds(this.cache);
                this.callbacks.forEach(callback => {
                    callback.call(this.context, this.cache);
                });
            }
        }
        return this.cache;
    }
    protected updateBinds(value: V) {
        for (let bind of this.binds) {                        
            bind.value(value);
        }
    }
    addCallbacks(...callbacks: Array<(arg: V) => void>) {
        callbacks.forEach(callback => {
            this.callbacks.push(callback);
        });
        return this;
    }
    setBind(bind: TState<V>) {
        this.binds.push(bind);
        return this;
    }
    setReverseBind(bind: TState<V>) {
        bind.binds.push(this);
        return this;
    }
}