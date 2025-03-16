import { FSMState } from "../Definition";
import { Player } from "../Player";

export interface IState {
    fsmEvent: FSMState;
    enter(player: Player): void;
    update(player: Player, deltaTime: number): void;
    exit(player: Player): void;
}