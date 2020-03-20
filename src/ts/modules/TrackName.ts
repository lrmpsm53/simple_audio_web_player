import {Block, Addons, Handlers} from './abstract/Block';

class TrackName__Name extends Block<HTMLElement> implements Addons.WithClasses {
    classes = ['sc---track-name__name'];
    renders = [Handlers.Classes.render];
    constructor() {
        super('span');
    }
}

export class TrackName extends Block<HTMLElement> implements Addons.WithClasses, Addons.WithChildren {
    classes = ['sc---row', 'sc---row_middle-children', 'sc---track-name'];
    renders = [Handlers.Classes.render, Handlers.Children.render];
    children = {
        TrackName__Name: new TrackName__Name
    }
    constructor() {
        super('h3');
    }
    updateName(trackName: string) {
        this.children.TrackName__Name.container.textContent = trackName;
    }
}