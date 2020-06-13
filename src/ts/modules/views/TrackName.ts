import { View } from '../Abstract/Abstract';

export class TrackName extends View<HTMLElement> {
    readonly name = 'TrackName';
    readonly element = this.createDOMElement({
        tag: 'div',
        classes: [
            'sc---row',
            'sc---row_middle-children',
            'sc---track-name'
        ]
    });
    readonly children = [
        this.createSimpleView({
                name: 'TrackName__Name',
                tag: 'span',
                classes: [ 'sc---track-name__name' ]
        })
    ];
    readonly states = this.setStates({
        Name: {
            value: '',
            callbacks: [ this.updateName ]
        }
    });
    private updateName(trackName: string) {
        const textField = this.getChild('TrackName__Name');
        if (textField) textField.container.textContent = trackName;
    }
}