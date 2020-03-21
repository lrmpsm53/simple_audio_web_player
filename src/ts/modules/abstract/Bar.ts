import {Block, Addons, BlockWithComputingData, Handlers} from './Block';

class Bar__Roller extends Block<HTMLElement> implements Addons.WithClasses {
    classes = ['sc---bar__roller'];
    renders = [Handlers.Classes.render];
    constructor() {
        super('div');
    }
    updatePosition(value: number) {
        this.container.style.left = `${value*100}%`;
    }
}

class Bar__State extends Block<HTMLElement> implements Addons.WithClasses {
    classes = ['sc---bar__state'];
    renders = [Handlers.Classes.render];
    constructor() {
        super('div');
    }
    updateState(value: number) {
        this.container.style.width = `${value*100}%`;
    }
}

type BarImplementation = Addons.WithClasses & Addons.WithEvents & Addons.WithChildren;

export default abstract class Bar<T extends object> 
    extends BlockWithComputingData<HTMLElement, T> 
    implements BarImplementation 
{
    classes = ['sc---bar'];
    AudioBlock: HTMLAudioElement;
    isMoving = false;
    renders = [Handlers.Classes.render, Handlers.Children.render, Handlers.Events.render];
    children = {
        Roller: new Bar__Roller,
        State: new  Bar__State
    }
    events = [
        {
            name: 'mousemove',
            block: document,
            callback: this.getNewMousemovePosition,
            capture: false
        },
        {
            name: 'mousedown',
            block: this.container,
            callback: this.anableMoving,
            capture: true
        },
        {
            name: 'mouseup',
            block: document,
            callback: this.getNewMousemovePosition,
            capture: true
        },
        {
            name: 'mouseup',
            block: document,
            callback: this.disableMoving,
            capture: true
        }
    ]
    constructor(AudioBlock: HTMLAudioElement) {
        super('div');
        this.AudioBlock = AudioBlock;
    }
    protected anableMoving() {
        this.isMoving = true;
    }
    protected disableMoving() {
        this.isMoving = false;
    }
    protected changeValue (newValueState: number, newValueRoller: number) {
        this.children.State.updateState(newValueState);
        this.children.Roller.updatePosition(newValueRoller);
    }
    protected getNewMousemovePosition(event: MouseEvent): {value: number; this: Bar<T>} | void {
        const positionOfContainer = Math.floor(this.container.getBoundingClientRect().left);
        const newPosition = event.clientX - positionOfContainer;
        if (this.isMoving && newPosition) return this.calculateValue(newPosition);
    }
    protected calculateValue (relative: number) {
        const widthOfContainer = Math.floor(this.container.clientWidth);
        let newValueState: number;
        if (relative < 1) {
            newValueState = relative;
            relative = relative * widthOfContainer;
        }
        else newValueState = relative / widthOfContainer;
        const rollerRadius = 10;
        if (0 <= newValueState && newValueState <= 1) {
            const newValueRoller = (relative - rollerRadius) / widthOfContainer;
            this.changeValue(newValueState, newValueRoller);
            return {
                value: newValueState, 
                this: this
            }
        } 
    }
}