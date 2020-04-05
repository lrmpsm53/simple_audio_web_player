import {Block, Streams, IBlock} from './Abstract';

class Bar__Roller extends Block<HTMLElement> implements IBlock {
    private rollerRadius = () => this.container.offsetWidth / 2;
    private parentWidth = () => this.parentContainer.offsetWidth;
    private parentContainer: HTMLElement;
    private beforePositionRelative?: number;
    events = new Streams.Events(this, {
        name: 'resize', block: window,
        callback: () => this.updatePosition()
    });
    classes = new Streams.Classes(this, 'sc---bar__roller');
    constructor(parentContainer: HTMLElement) {
        super('div');
        this.parentContainer = parentContainer;
    }
    updatePosition(_arguments?: { relative: number; widthOfContainer: number;}) {
        if (_arguments) this.beforePositionRelative = _arguments.relative / _arguments.widthOfContainer;
        if (this.beforePositionRelative) {
            const absolutePosition = this.parentWidth() * this.beforePositionRelative;
            const absolutePositionWithoutRollerRadius = absolutePosition - this.rollerRadius();
            const relativePositionWithoutRollerradius = absolutePositionWithoutRollerRadius / this.parentWidth() * 100;
            this.container.style.left = `${relativePositionWithoutRollerradius}%`;
        }
    }
}

class Bar__State extends Block<HTMLElement> {
    classes = new Streams.Classes(this, 'sc---bar__state');
    constructor() {
        super('div');
    }
    updateState(value: number) {
        this.container.style.width = `${value*100}%`;
    }
}

export default abstract class Bar extends Block<HTMLElement> {
    classes = new Streams.Classes(this, 'sc---bar');
    children = new Streams.Children(this, {
        Roller: new Bar__Roller(this.container),
        State: new  Bar__State
    })
    isMoving = false;
    events = new Streams.Events(this, 
        {
            name: 'mousemove', block: document, 
            callback: this.getNewMousemovePosition, capture: false
        }, 
        {
            name: 'mousedown', block: this.container,
            callback: () => this.swichMoving(true), capture: true
        }, 
        {
            name: 'mouseup', block: document,
            callback: this.getNewMousemovePosition, capture: true
        }, 
        {
            name: 'mouseup', block: document,
            callback: () => this.swichMoving(false), capture: true
        }
    );
    constructor() {super('div')}
    protected swichMoving(is: boolean) {
        this.isMoving = is;
    }
    protected getNewMousemovePosition(event: MouseEvent): number|void {
        const positionOfContainer = Math.floor(this.container.getBoundingClientRect().left);
        const newPosition = event.clientX - positionOfContainer;
        if (this.isMoving && newPosition) return this.changeValues(newPosition);
    }
    protected changeValues (relative: number): void|number {
        const widthOfContainer = Math.floor(this.container.clientWidth);
        let newValueState: number;
        if (relative < 1) {
            newValueState = relative;
            relative = relative * widthOfContainer;
        } else newValueState = relative / widthOfContainer;
        if (0 < newValueState && newValueState < 1) {
            this.children.get('State').updateState(newValueState);
            const newPositionArguments = {relative: relative, widthOfContainer: widthOfContainer};
            this.children.get('Roller').updatePosition(newPositionArguments);
            return newValueState;
        } 
    }
}