import { Component } from "./Component";
import type { Main } from './Main';
import type { TRootView } from './View';

export class Logic<T extends Main<TRootView>> extends Component {
    Main: T;
    constructor(Main: T) {
        super();
        this.Main = Main;
    }
}