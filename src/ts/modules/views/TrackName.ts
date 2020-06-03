import { View } from '../Abstract/Abstract';

export class TrackName extends View<HTMLElement> {
    DOMElement = this.createDOMElement('div')
        .classes.append(
            'sc---row',
            'sc---row_middle-children',
            'sc---track-name'
        )
    ViewTree = this.createViewTree([
        {
            name: 'TrackName__Name',
            element: 
                this.createSimpleView<HTMLElement>('span')
                    .modify(_this =>
                        _this.classes.push('sc---track-name__name')
                    )
        }
    ]);
    states = this.setStates({
        'Name': this.createState('')
            .addCallbacks(this.updateName)
    });
    updateName(trackName: string) {
        const textField = this.ViewTree.get('TrackName__Name').DOMElement.container;
        textField.textContent = trackName;
        textField.classList.remove('sc---track-name__name_animated');
        textField.classList.add('sc---track-name__name_animated');

    }
}