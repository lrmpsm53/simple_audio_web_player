import { View } from '../Abstract/Abstract';

export class Audio extends View<HTMLAudioElement> {
    DOMElement = this.createDOMElement('audio')
        .attributes.append(
            {
                name: 'preload',
                value: 'auto'
            },
            {
                name: 'type',
                value: 'audio/mp3'
            }
        );
    states = this.setStates({
        src: this.createState('')
            .addCallbacks(this.updateSRC),
        isPlay: this.createState(false)
            .addCallbacks(this.togglePlay),
        currentVolume: this.createState(0)
            .addCallbacks(this.changeVolume),
        currentTime: this.createState(0)
            .addCallbacks(this.changeCurrentTime)
    });
    events = this.bindEvents(
        {
            name: 'timeupdate',
            block: this.DOMElement.container,
            callback: () => this.sender.sendMessage('timeupdate')
        },
        {
            name: 'ended',
            block: this.DOMElement.container,
            callback: () => {
                this.states.get('isPlay').value(false);
                this.sender.sendMessage('ended');
            }
        }
    );
    sender = this.setSender();
    duration() {
        return this.DOMElement.container.duration;
    }
    currentTime() {
        return this.DOMElement.container.currentTime;
    }
    togglePlay(is: boolean) {
        setTimeout(() =>{
            if (is) this.DOMElement.container.play()
            else this.DOMElement.container.pause();
        }, 0);
    }
    changeCurrentTime(value: number) {
        value *= this.duration();
        this.DOMElement.container.currentTime = value;
        
    }
    updateSRC(src: string) {
        this.DOMElement.container.src = src;
    }
    changeVolume(volume: number) {
        this.DOMElement.container.volume = volume;
    }
}