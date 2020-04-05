import {Block, Streams} from './abstract/Abstract';

class TrackName__Name extends Block<HTMLElement> {
    classes = new Streams.Classes(this, 'sc---track-name__name');
    constructor() {
        super('span');
    }
}

export default class TrackName extends Block<HTMLElement> {
    classes = new Streams.Classes(this, 'sc---row', 'sc---row_middle-children', 'sc---track-name');
    children = new Streams.Children(this, {
            TrackName__Name: new TrackName__Name
    });
    constructor() {
        super('h3');
    }
    updateName(trackName: string) {
        this.children.get('TrackName__Name').container.textContent = trackName;
    }
}