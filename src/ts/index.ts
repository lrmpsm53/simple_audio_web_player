import './modules/styles';
import {PlayerContainer, ISong} from './modules/PlayerContainer';

console.info (
    `
    Thank you for using my product.
    if you find a mistake or have any 
    wishes - contact me
    orlov.dmitriy2303@outlook.com
    `
);

module.exports = function(containers: HTMLCollectionOf<HTMLElement>, playlist: ISong[]) {
    const containersArr = Array.from(containers);
    containersArr.map(container => new PlayerContainer(container, 'orange', playlist).children.runHooks());
}