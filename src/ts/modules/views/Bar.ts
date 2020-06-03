import { View } from '../Abstract/Abstract';

export class Bar extends View<HTMLElement> {
    DOMElement = this.createDOMElement('div')
        .classes.push('sc---bar');
    ViewTree = this.createViewTree([
        {
            name: 'Roller',
            element: 
                this.createSimpleView<HTMLElement>('div')
                .modify(
                    _this =>_this.classes.push('sc---bar__roller')
                )
        },
        {
            name: 'Bar__State',
            element: 
                this.createSimpleView<HTMLElement>('div')
                .modify(
                    _this => _this.classes.push('sc---bar__state')
                )
        }
    ]);
    states = this.setStates({
        currentValue: this.createState(0)
            .addCallbacks(this.changeValues)
    });
    events = this.bindEvents(
        {
            name: 'resize', block: window,
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
            block: this.DOMElement.container,
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
    beforePositionRelative = 0;
    private isMoving = false;
    private RollerRadius() {
        const Roller = this.ViewTree.get('Roller');
        return Roller.DOMElement.container.offsetWidth / 2;
    }
    private BarWidth() {
        return this.DOMElement.container.clientWidth;
    }
    private BarPosition() {
        return Math.floor(this.DOMElement.container.getBoundingClientRect().left);
    }
    protected updatePositionRoller(relative?: number) {
        if (relative) this.beforePositionRelative = relative / this.BarWidth();
        if (this.beforePositionRelative) {
            const absolutePosition = this.BarWidth() * this.beforePositionRelative;
            const absolutePositionWithoutRollerRadius = absolutePosition - this.RollerRadius();
            const relativePositionWithoutRollerradius = absolutePositionWithoutRollerRadius / this.BarWidth() * 100;
            this.ViewTree.get('Roller').DOMElement.container.style.left = `${relativePositionWithoutRollerradius}%`;
        }
    }
    protected updateState(value: number) {
        const State = this.ViewTree.get('Bar__State');
        State.DOMElement.container.style.width = `${value*100}%`;
    }
    protected swichMoving(is: boolean) {
        this.isMoving = is;
    }
    protected getNewMousemovePosition(event: MouseEvent) {
        const newPosition = event.clientX - this.BarPosition();
        if (this.isMoving && newPosition) {
            this.changeValues(newPosition);
        }
    }
    protected changeValues (relative: number) {
        let newValueState: number;
        if (relative < 1) {
            newValueState = relative;
            relative = relative * this.BarWidth();
        } else newValueState = relative / this.BarWidth();
        if (0 < newValueState && newValueState < 1) {
            this.states.get('currentValue').value(newValueState);
            this.updateState(newValueState);
            this.updatePositionRoller(relative);
        } 
    }
}