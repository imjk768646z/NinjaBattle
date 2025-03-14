import { Player } from "../Player";
import { IState } from "./IState";

export class DieState implements IState {
    enter(player: Player): void {
        // console.log("進入 Die 狀態");
        player.onDie();
    }

    update(player: Player, deltaTime: number): void {

    }

    exit(player: Player): void {
        // console.log("離開 Die 狀態");
    }
}


