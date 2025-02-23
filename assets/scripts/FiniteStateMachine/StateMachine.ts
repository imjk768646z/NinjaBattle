import { IState } from "./IState";
import { Player } from "../Player";

export class StateMachine {
    public currentState: IState;
    public lastState: IState;
    public player: Player;

    constructor(player: Player, initialState: IState) {
        this.player = player;
        this.currentState = initialState;
        this.lastState = initialState;
        this.currentState.enter(player);
    }

    changeState(newState: IState) {
        this.lastState = this.currentState;
        this.currentState.exit(this.player);
        this.currentState = newState;
        this.currentState.enter(this.player);
    }

    update(deltaTime: number) {
        this.currentState.update(this.player, deltaTime);
    }
}