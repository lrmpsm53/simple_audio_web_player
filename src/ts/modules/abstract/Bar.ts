import {Block, Addons, BlockWithComputingData, Handlers} from './Abstract';

class Bar__Roller extends Block<HTMLElement> implements Addons.WithClasses, Addons.WithEvents {
    private get rollerRadius() {
        return this.container.offsetWidth / 2
    };
    private get parentWidth() {
        return (this.parentContainer as HTMLElement).offsetWidth;
    };
    private parentContainer?: HTMLElement;
    private beforePositionRelative?: number;
    events = [
        {
            name: 'resize',
            block: window,
            callback: () => setTimeout(() => this.updatePosition(), 0)
        }
    ]
    classes = ['sc---bar__roller'];
    renders = [Handlers.Classes.render, Handlers.Events.render];
    constructor(parentContainer: HTMLElement) {
        super('div');
        this.parentContainer = parentContainer;
    }
    updatePosition(_arguments?: { relative: number; widthOfContainer: number;}) {
        if (_arguments) this.beforePositionRelative = _arguments.relative / _arguments.widthOfContainer;
        if (this.beforePositionRelative) {
            const absolutePosition = this.parentWidth * this.beforePositionRelative;
            const absolutePositionWithoutRollerRadius = absolutePosition - this.rollerRadius;
            const relativePositionWithoutRollerradius = absolutePositionWithoutRollerRadius / this.parentWidth * 100;
            this.container.style.left = `${relativePositionWithoutRollerradius}%`;
        }
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

interface BarChildren {
        Roller: Bar__Roller;
        State: Bar__State;
}

export default abstract class Bar<T extends object> 
    extends BlockWithComputingData<HTMLElement, T | {children: BarChildren}>
    implements BarImplementation
{
    classes = ['sc---bar'];
    children = {};
    AudioBlock: HTMLAudioElement;
    isMoving = false;
    renders = [Handlers.Classes.render, Handlers.Children.render, Handlers.Events.render];
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
    computedFields() {
        return {
            children: {
                Roller: new Bar__Roller(this.container),
                State: new  Bar__State
            }
        }
    }
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
        } else newValueState = relative / widthOfContainer;
        if (0 < newValueState && newValueState < 1) {
            const children = this.children as BarChildren;
            children.State.updateState(newValueState);
            children.Roller.updatePosition({relative: relative, widthOfContainer: widthOfContainer});
            return {
                value: newValueState, 
                this: this
            }
        } 
    }
}