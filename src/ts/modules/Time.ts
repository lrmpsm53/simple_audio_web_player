import {Block} from './abstract/Block';

interface i_TimeContext {
    container: HTMLElement;
    referenceType: string;
    AudioBlock: HTMLAudioElement;
}

export default class Time extends Block<HTMLElement> {
    classes = ['sc---time'];
    constructor(referenceType: string, AudioBlock: HTMLAudioElement) {
        super('span');
        this.constructorData <string> ('referenceType', referenceType);
        this.constructorData <HTMLAudioElement> ('AudioBlock', AudioBlock);
        this.fixData();
        this.updatetime(new Event('timeupdate'), this.contextFields)
    }
    computedFields() {
        return {
            events: [
                {
                    name: 'timeupdate',
                    block: this.constructorData <HTMLAudioElement> ('AudioBlock'),
                    callback: this.updatetime
                }
            ]
        }
    }
    computedContextFields(): i_TimeContext {
        return {
            container: this.container,
            referenceType: this.constructorData ('referenceType'),
            AudioBlock: this.constructorData <HTMLAudioElement> ('AudioBlock')
        }
    }
    updatetime(event: Event,_this = this as unknown as i_TimeContext) {
        function create_time_string(seconds: number): string {
            let minutes = Math.floor(seconds/60);
            let only_seconds: number|string = Math.floor(seconds - minutes*60);
            if(only_seconds < 10) only_seconds = '0' + only_seconds.toString();
            return minutes + ':' + only_seconds;
        }
        const duration = _this.AudioBlock.duration ? _this.AudioBlock.duration : 0;
        const currrentTime = _this.AudioBlock.currentTime;
        if (_this.referenceType == 'current') 
            _this.container.textContent = create_time_string(currrentTime);
        if (_this.referenceType == 'left') 
            _this.container.textContent = create_time_string(duration - currrentTime);
    }
}