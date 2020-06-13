import { View } from '../Abstract/Abstract';

export class Bar extends View<HTMLElement> {
    readonly element = this.createDOMElement({
        tag: 'div',
        classes: [ 'sc---bar' ]
    });
    readonly children = [
        this.createSimpleView<HTMLElement>({
            name: 'Roller',
            tag: 'div',
            classes: [ 'sc---bar__roller' ]
        }),
        this.createSimpleView<HTMLElement>({
            name: 'Bar__State',
            tag: 'div',
            classes: [ 'sc---bar__state' ]
        })
    ];
    readonly states = this.setStates({
        currentValue: {
            value: 0,
            callbacks: [ this.changeValues ]
        }
    });
    readonly events = this.bindEvents(
        {
            name: 'resize',
            block: window,
            callback: () => this.updatePositionRoller()
        },
        {
            name: 'mousemove', 
            block: document, 
            callback: this.getNewMousemovePosition, 
            capture: false
        }, 
        {
            name: 'mousedown', 
            block: this.container,
            callback: () => this.swichMoving(true), capture: true
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
            callback: () => this.swichMoving(false), 
            capture: true
        }
    );
    private beforePositionRelative = 0;
    private isMoving = false;
    private get RollerRadius() {
        const Roller = this.getChild('Roller');
        return Roller ? Roller.containerProp('offsetWidth') / 2 : 0;
    }
    private get BarWidth() {
        return this.containerProp('clientWidth');
    }
    private get BarPosition() {
        return Math.floor(this.container.getBoundingClientRect().left);
    }
    protected updatePositionRoller(relative?: number) {
        if (relative) this.beforePositionRelative = relative / this.BarWidth;
        if (this.beforePositionRelative) {
            const absolutePosition = this.BarWidth * this.beforePositionRelative;
            const absolutePositionWithoutRollerRadius = absolutePosition - this.RollerRadius;
            const relativePositionWithoutRollerradius = absolutePositionWithoutRollerRadius / this.BarWidth * 100;
            const Roller = this.getChild('Roller');
            if(Roller) Roller.container.style.left = `${relativePositionWithoutRollerradius}%`;
        }
    }
    protected updateState(value: number) {
        const State = this.getChild('Bar__State');
        if(State) State.container.style.width = `${value*100}%`;
    }
    protected swichMoving(is: boolean) {
        this.isMoving = is;
    }
    protected getNewMousemovePosition(event: MouseEvent) {
        const newPosition = event.clientX - this.BarPosition;
        if (this.isMoving && newPosition) {
            this.changeValues(newPosition);
        }
    }
    protected changeValues (relative: number) {
        let newValueState: number;
        if (relative < 1) {
            newValueState = relative;
            relative = relative * this.BarWidth;
        } else newValueState = relative / this.BarWidth;
        if (0 < newValueState && newValueState < 1) {
            this.states.get('currentValue').value(newValueState);
            this.updateState(newValueState);
            this.updatePositionRoller(relative);
        } 
    }
}