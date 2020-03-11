import {Block} from './Block';

export interface i_BarContext {
    container: HTMLElement;
    changeValue: (value1: number, value2: number) => void;
    calculateValue: (value: number) => i_returnedValues|void;
    children: {
        Roller: Bar__Roller;
        State: Bar__State;
    }
    isMoving: boolean;
    AudioBlock:HTMLAudioElement;
}

interface i_returnedValues {
    value: number;
    _this: i_BarContext;
}

class Bar__Roller extends Block<HTMLElement> {
    classes = ['sc---bar__roller'];
    constructor() {
        super('div');
        this.fixData();
    }
    computedContextFields() {
        return {
            container: this.container
        }
    }
    updatePosition(value: number, _this = this as unknown as {container: HTMLElement}) {
        _this.container.style.left = `${value*100}%`;
    }
}

class Bar__State extends Block<HTMLElement> {
    classes = ['sc---bar__state'];
    constructor() {
        super('div');
        this.fixData();
    }
    computedContextFields() {
        return {
            container: this.container
        }
    }
    updateState(value: number, _this = this as unknown as {container: HTMLElement}) {
        _this.container.style.width = `${value*100}%`;
    }
}

export abstract class Bar extends Block<HTMLElement> {
    classes = ['sc---bar'];
    constructor(AudioBlock: HTMLAudioElement) {
        super('div');
        this.constructorData <HTMLAudioElement> ('AudioBlock', AudioBlock);
    }
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
    protected anableMoving(event?: MouseEvent,_this = this as unknown as i_BarContext) {
        _this.isMoving = !_this.isMoving;
    }
    protected disableMoving(event?: MouseEvent,_this = this as unknown as i_BarContext) {
        _this.isMoving = false;
    }
    computedContextFields(): i_BarContext {
        return {
            container: this.container,
            changeValue: this.changeValue,
            calculateValue: this.calculateValue,
            children: this.children,
            isMoving: false,
            AudioBlock: this.constructorData('AudioBlock')
        }
    }
    protected changeValue (newValueState: number, newValueRoller: number, _this = this as unknown as i_BarContext) {
        _this.children.State.updateState(newValueState);
        _this.children.Roller.updatePosition(newValueRoller);
    }
    protected getNewMousemovePosition(event: MouseEvent) {
        const _this = this as unknown as i_BarContext;
        const positionOfContainer = Math.floor(_this.container.getBoundingClientRect().left);
        const newPosition = event.clientX - positionOfContainer;
        if (_this.isMoving && newPosition) return _this.calculateValue(newPosition);
    }
    protected calculateValue (relative: number, _this = this as unknown as i_BarContext) {
        const widthOfContainer = Math.floor(_this.container.clientWidth);
        let newValueState: number;
        if (relative < 1) {
            newValueState = relative;
            relative = relative * widthOfContainer;
        }
        else newValueState = relative / widthOfContainer;
        const rollerRadius = 10;
        if (0 <= newValueState && newValueState <= 1) {
            const newValueRoller = (relative - rollerRadius) / widthOfContainer;
            _this.changeValue(newValueState, newValueRoller);
            return {
                value: newValueState, 
                _this: _this
            }
        } 
    }
}