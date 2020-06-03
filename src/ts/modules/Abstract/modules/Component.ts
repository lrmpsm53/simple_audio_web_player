import { StoreForObjects } from './Store';
import { State, TState } from './State';
import { Sender, Recipient, TRecipient, handlers } from './Message';

type StateUnits = {[index: string]: TState<any>};

export abstract class Component {
    states?: StoreForObjects;
    sender?: Sender;
    recipient?: TRecipient;
    setStates<T extends StateUnits>(states: T) {
        return new StoreForObjects(states);
    }
    setSender() {
        return new Sender;
    }
    setRecipient(handlers: handlers) {
        return new Recipient(this, handlers);
    }
    createState<T>(input: T) {
        return new State(this, input);
    }
}