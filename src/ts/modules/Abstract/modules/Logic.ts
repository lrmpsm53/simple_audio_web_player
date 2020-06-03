import { Component } from "./Component";
import type { Main } from './Main';
import type { TView } from './View';

export class Logic<T extends Main<TView>> extends Component {
    Main: T;
    constructor(Main: T) {
        super();
        this.Main = Main;
    }
}