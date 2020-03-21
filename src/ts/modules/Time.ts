import {BlockWithComputingData, Block, Addons, Handlers} from './abstract/Block';

export default class Time 
extends BlockWithComputingData<HTMLElement, Addons.WithEvents> 
implements Addons.WithClasses, Addons.WithEvents {
    classes = ['sc---time'];
    referenceType: string;
    events = [];
    AudioBlock: HTMLAudioElement;
    renders = [Handlers.Classes.render, Handlers.Events.render]
    constructor(referenceType: string, AudioBlock: HTMLAudioElement) {
        super('span');
        this.referenceType = referenceType;
        this.AudioBlock = AudioBlock;
        this.constructorData('AudioBlock', AudioBlock);
        this.fixData(Handlers.Events.fix);
        this.updatetime();
    }
    computedFields() {
        return {
            events: [{
                name: 'timeupdate',
                block: this.constructorData<HTMLAudioElement>('AudioBlock'),
                callback: this.updatetime
            }]
        }
    }
    updatetime() {
        function create_time_string(seconds: number): string {
            let minutes = Math.floor(seconds/60);
            let only_seconds: number|string = Math.floor(seconds - minutes*60);
            if(only_seconds < 10) only_seconds = '0' + only_seconds.toString();
            return minutes + ':' + only_seconds;
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