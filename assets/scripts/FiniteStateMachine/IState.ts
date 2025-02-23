import { Player } from "../Player";

export interface IState {
    enter(player: Player): void;
    update(player: Player, deltaTime: number): void;
    exit(player: Player): void;
}