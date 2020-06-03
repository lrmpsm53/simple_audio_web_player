import { Logic } from '../Abstract/Abstract';
import type { Player } from './Player';
import type { Time } from '../views/Time';
import type { Bar } from '../views/Bar';

export class ChangeProgress extends Logic<Player> {
    TimeCurrent = this.Main.View.ViewTree.get('TimeCurrent') as Time;
    TimeLeft = this.Main.View.ViewTree.get('TimeLeft') as Time;
    ProgressBar = this.Main.View.ViewTree.get('ProgressBar') as Bar;
    states = this.setStates({
        currentAudio: this.createState(0)
            .addCallbacks(() => {
                const current = this.Main.Audio.currentTime();
                const duration = this.Main.Audio.duration();
                this.updateTime(current, duration);
            })
            .setBind(this.Main.Audio.states.get('currentTime'))
            .setReverseBind(this.ProgressBar.states.get('currentValue'))
    });
    recipient = this.setRecipient({
        timeupdate: this.updateAll
    })
    .addSender(this.Main.Audio.sender)
    .addSender(this.Main.Switchtrack.sender)
    transformCurrent(current: number) {
        const Audio = this.Main.Audio;
        const duration = Audio.duration() ? Audio.duration() : 0;
        if (current > 1) current /= duration;
        return {
            current: current,
            duration: duration
        }
    }
    getValues() {
        const current = this.Main.Audio.currentTime();
        let duration = this.Main.Audio.duration();
        duration = duration ? duration : 0;
        let progress = current / duration;
        progress = progress ? progress : 0.0001;
        return {
            current: current,
            duration: duration,
            progress: progress
        }
    }
    updateAll() {
        const { current, duration, progress } = this.getValues();
        this.ProgressBar.states.get('currentValue').value(progress, 'nobind');
        this.updateTime(current, duration);
    }
    updateTime(current: number, duration: number) {
        if(typeof current == 'number' && typeof duration == 'number') {
            const updateValue = (Time:Time) => {
                const field = Time.DOMElement.container;
                switch(Time.referenceType) {
                    case 'left':
                    field.textContent = Time.createTimeString(duration - current)
                    break
                    case 'current': 
                    field.textContent = Time.createTimeString(current)
                    break
                }
            }
            updateValue(this.TimeLeft);
            updateValue(this.TimeCurrent);
        }
    }
}