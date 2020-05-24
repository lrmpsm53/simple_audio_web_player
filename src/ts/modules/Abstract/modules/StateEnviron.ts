import { StreamForObjects } from './Stream';

export type TStateUnits = {[index: string]: State}
type TStateInput<T> = {
    value?: T;
    callback?: Function;
}
export abstract class StateEnviron {
    states?: StreamForObjects<TStateUnits>;
    setStates(states: TStateUnits) {
        return new StreamForObjects(states)
    }
    createState<T>(input: TStateInput<T>) {
        return new State(
            this,
            input.value,
            input.callback
        );
    }
}

export class State
    <
        E extends StateEnviron = StateEnviron, 
        V extends any = any,
        C extends Function = Function
    > {
    readonly context: E;
    private value?: V;
    readonly callback?: Function;
    readonly binds: State[] = [];
    get() {
        return this.value;
    }
    update(value?: V) {
        if(value !== undefined) {
            this.value = value;
        }
        this.callback && this.callback.call(this.context, value);
        this.binds.forEach(bind => {
            if (bind.callback) {
                bind.callback.call(bind.context, value);
            }
        });
    }
    setBind(bind: State) {
        this.binds.push(bind);
    }
    setDoubleBind(bind: State) {
        this.binds.push(bind);
        bind.binds.push(this);
    }
    constructor(context: E, value?: V, callback?: C) {
        this.context = context;
        if (!!value) this.value = value;
        if (!!callback) this.callback = callback;
    }
}