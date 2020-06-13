import { StoreForObjects } from './Store';
import { State, IStateParams, Property } from './State';
import { Sender, Recipient, TRecipient, handlers } from './Message';

type TStateUnits = { [index: string]: IStateParams<any> }

type TStateStore<T extends TStateUnits> = {
    [K in keyof T]: State<Property<T[K], 'value'>, T[K]>
}

export abstract class Component {
    readonly states?: StoreForObjects;
    readonly sender?: Sender;
    readonly recipient?: TRecipient;
    setStates<T extends TStateUnits>(states: T) {
        const storeStates = new StoreForObjects<TStateStore<T>>();
        for (let key in states) {
            storeStates.push({[key]: new State(this, states[key])});
        }
        return storeStates;
    }
    setSender() {
        return new Sender;
    }
    setRecipient(handlers: handlers, senders?: Sender[]) {
        return new Recipient(this, handlers, senders);
    }
}