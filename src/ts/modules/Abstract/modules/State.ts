export type TState<T> = State<T, object>

export type Property<K extends object, T extends keyof K> = K[T];

export interface IStateParams<V> {
    value: V;
    callbacks?: Array<(arg: V) => void>;
    binds?: TState<V>[];
    reverseBinds?: TState<V>[];
}

type TValueParams = 'nobind' | 'forcibly';

export class State<V, C extends object> {
    protected context: C;
    readonly callbacks: Array<(arg: V) => void> = [];
    protected cache: V;
    readonly binds: TState<V>[] = [];
    constructor(context: C, params: IStateParams<V>) {
        this.context = context;
        const {value, callbacks, binds, reverseBinds} = params;
        this.cache = value;
        binds && this.setBinds(binds);
        reverseBinds && this.setReverseBinds(reverseBinds);
        callbacks && this.addCallbacks(...callbacks);
    }
    private setBinds(binds: TState<V>[]) {
        binds.forEach(bind => this.setBind(bind));
    }
    private setReverseBinds(binds: TState<V>[]) {
        binds.forEach(bind => this.setReverseBind(bind));
    }
    paramValidator(params: TValueParams[]) {
        return (someParam: TValueParams) => {
            for (let param of params) {
                if (param === someParam) return true;
            }
            return false;
        }
    }
    value(value?: V, ...params: TValueParams[]) {
        const hasParam = this.paramValidator(params);
        if (value !== undefined && (hasParam('forcibly') || value !== this.cache)) {
            this.cache = value;
            !hasParam('nobind') && this.updateBinds(value);
            this.callbacks.forEach(callback => {
                callback.call(this.context, this.cache);
            });
        }
        return this.cache;
    }
    protected updateBinds( value: V) {
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