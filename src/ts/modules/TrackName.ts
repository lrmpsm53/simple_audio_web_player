import {Block} from './abstract/Block';

class TrackName__Name extends Block<HTMLElement> {
    classes = ['sc---track-name__name'];
    constructor() {
        super('span');
        this.fixData();
    }
}

export class TrackName extends Block<HTMLElement> {
    classes = ['sc---row', 'sc---row_middle-children', 'sc---track-name'];
    children = {
        TrackName__Name: new TrackName__Name
    }
    constructor() {
        super('h3');
        this.fixData();
    }
    updateName(trackName: string) {
        this.children.TrackName__Name.container.textContent = trackName;
    }
}