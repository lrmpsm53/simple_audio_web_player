import { Logic } from '../Abstract/Abstract';
import type { Player } from './Player';
import type { TrackName } from '../views/TrackName';
import type { SwitchBack, SwitchForward } from '../views/Controls';

export class SwitchTrack extends Logic<Player> {
    Songs = this.Main.states.get('Songs');
    TrackName = this.Main.View.ViewTree.get('TrackName') as TrackName;
    SwitchBack = this.Main.Controls.ViewTree.get('SwitchBack') as SwitchBack;
    SwitchForward = this.Main.Controls.ViewTree.get('SwitchForward') as SwitchForward;
    states = this.setStates({
        currentSong: this.createState(0)
            .addCallbacks(this.updateViews)
    });
    recipient = this.setRecipient({
        back: () => this.switchTrack(-1),
        forward: () => this.switchTrack(1),
        ended: () => {
            this.switchTrack(1);
            this.Main.Audio.states.get('isPlay').value(true);
        },
        addSongs: () => this.updateViews(0)
    })
    .addSender(this.SwitchBack.sender)
    .addSender(this.SwitchForward.sender)
    .addSender(this.Main.Audio.sender)
    .addSender(this.Main.sender)
    sender = this.setSender();
    updateViews(index: number) {
        const track = this.Songs.value()[index];
        this.TrackName.states.get('Name').value(track.name);
        this.Main.Audio.states.get('src').value(track.source);
    }
    private isPlaying() {
        return this.Main.Audio.states.get('isPlay').value();
    }
    updateParamms() {
        if (this.isPlaying())
        this.Main.Audio.states.get('isPlay').value(true, 'forcibly')
        else
        this.sender.sendMessage('timeupdate');
    }
    switchTrack(k: 1|-1) {
        const index = this.states.get('currentSong');
        let indexValue = index.value();
        const tracksSum = this.Songs.value().length - 1;
        indexValue += k;
        if (0 <= indexValue && indexValue <= tracksSum) {
            index.value(indexValue, 'forcibly');
        }
        else {
            if (k === 1 && indexValue > tracksSum) {
                index.value(0);
            }
            if (k === -1 && indexValue < 0) {
                index.value(tracksSum, 'forcibly');
            }
        }
        this.updateParamms();
    }
}