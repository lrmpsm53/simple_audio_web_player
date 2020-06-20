import { View } from '../Abstract/Abstract';

export class Audio extends View<HTMLAudioElement> {
    readonly element = this.createDOMElement({
        tag: 'audio',
        attributes: [
            { name: 'preload', value: 'auto' },
            { name: 'type', value: 'audio/mp3' }
        ]
    });
    readonly states = this.setStates({
        src: {
            value: '',
            callbacks: [ this.updateSRC ]
        },
        isPlay: {
            value: false,
            callbacks: [ this.switchPlay ]
        },
        currentVolume: {
            value: 0,
            callbacks: [ this.changeVolume ]
        },
        currentTime: {
            value: 0,
            callbacks: [ this.changeCurrentTime ]
        }
    });
    readonly events = this.bindEvents(
        {
            name: 'timeupdate',
            block: this.container,
            callback: () => this.sender.sendMessage('timeupdate')
        },
        {
            name: 'ended',
            block: this.container,
            callback: () => {
                this.states.get('isPlay').value(false);
                this.sender.sendMessage('ended');
            }
        },
        {
            name: 'loadeddata',
            block: this.container,
            callback: () => this.sender.sendMessage('loaded')
        },
        {
            name: 'play',
            block: this.container,
            callback: () => this.sender.sendMessage('play')
        },
        {
            name: 'pause',
            block: this.container,
            callback: () => this.sender.sendMessage('pause')
        }
    );
    readonly sender = this.setSender();
    duration() {
        return this.containerProp('duration');
    }
    currentTime() {
        return this.containerProp('currentTime');
    }
    switchPlay(is: boolean) {
        setTimeout(() =>{
            if (is) this.container.play()
            else this.container.pause();
        }, 0);
    }
    changeCurrentTime(value: number) {
        value *= this.duration();
        this.containerProp('currentTime', value);
        
    }
    updateSRC(src: string) {
        this.containerProp('src', src);
    }
    changeVolume(volume: number) {
        this.container.volume = volume;
    }
}