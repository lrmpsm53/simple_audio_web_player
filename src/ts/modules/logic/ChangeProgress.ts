import { Logic } from '../Abstract/Abstract';
import type { Player } from './Player';
import type { Time } from '../views/Time';
import type { Bar } from '../views/Bar';

export class ChangeProgress extends Logic<Player> {
    readonly TimeCurrent = this.Main.View.getChild('TimeCurrent') as Time;
    readonly TimeLeft = this.Main.View.getChild('TimeLeft') as Time;
    readonly ProgressBar = this.Main.View.getChild('ProgressBar') as Bar;
    readonly states = this.setStates({
        currentAudio: {
            value: 0,
            callbacks: [() => {
                const current = this.Main.Audio.currentTime();
                const duration = this.Main.Audio.duration();
                this.updateTime(current, duration);
            }],
            binds: [ this.Main.Audio.states.get('currentTime') ],
            reverseBinds: [ this.ProgressBar.states.get('currentValue') ]
        }
    });
    readonly recipient = this.setRecipient(
        {
            timeupdate: this.updateAll,
            loaded: this.whenLoaded
        },
        [
            this.Main.Audio.sender,
            this.Main.Switchtrack.sender
        ]
    );
    getValues() {
        const current = this.Main.Audio.currentTime();
        let duration = this.Main.Audio.duration();
        duration = duration ? duration : 0;
        let progress = current / duration;
        progress = progress ? progress : 0.00001;
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
    whenLoaded() {
        const { current, duration } = this.getValues();
        this.updateTime(current, duration);
    }
    updateTime(current: number, duration: number) {
        const updateValue = (Time:Time) => {
            const field = Time.container;
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