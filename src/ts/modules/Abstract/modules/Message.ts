import { StoreForObjects, StoreForArrays } from "./Store";

export class Sender {
    recipients = new StoreForArrays<TRecipient>();
    sendMessage(message: string) {
        this.recipients.fields.forEach(recipient => {
            recipient.getMessage(message);
        });
    }
    addRecipient(recipient: TRecipient) {
        this.recipients.push(recipient);
        return this;
    }
}

export type handlers = {[index: string]: () => void};
export type TRecipient = Recipient<handlers>;

export class Recipient<T extends handlers> {
    handlers: StoreForObjects<T>;
    context: object;
    constructor(context: object, handlers: T) {
        this.context = context;
        this.handlers =  new StoreForObjects(handlers);
    }
    getMessage<K extends keyof T, M extends K>(message: M|string) {
        const handler = this.handlers.get(message);
        handler && handler.call(this.context);
    }
    addSender(sender: Sender) {
        sender.addRecipient(this);
        return this;
    }
}