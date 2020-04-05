import {Streams, Block} from './abstract/Abstract';
import type {PlayerContainer__AudioBlock as AudioBlock} from './PlayerContainer';

abstract class TimeData extends Block<HTMLElement> {
    referenceType: string;
    protected AudioBlock: AudioBlock;
    constructor(referenceType: string, AudioBlock: AudioBlock) {
        super('span');
        this.referenceType = referenceType;
        this.AudioBlock = AudioBlock;
    }
}

export default class Time extends TimeData {
    classes = new Streams.Classes(this, 'sc---time');
    events = new Streams.Events(this, {
        name: 'timeupdate', block: this.AudioBlock.container, 
        callback: this.updatetime
    })
    constructor(referenceType: string, AudioBlock: AudioBlock) {
        super(referenceType, AudioBlock);
        this.updatetime();
    }
    updatetime() {
        function create_time_string(seconds: number): string {
            let minutes = Math.floor(seconds/60);
            let only_seconds: number|string = Math.floor(seconds - minutes*60);
            if(only_seconds < 10) only_seconds = '0' + only_seconds.toString();
            return `${minutes}:${only_seconds}`;
        }
        const duration = this.AudioBlock.duration ? this.AudioBlock.duration : 0;
        const currrentTime = this.AudioBlock.currentTime;
        switch(this.referenceType) {
            case 'current': this.container.textContent = create_time_string(currrentTime)
            break;
            case 'left': this.container.textContent = create_time_string(duration - currrentTime)
            break;
        }
    }
}