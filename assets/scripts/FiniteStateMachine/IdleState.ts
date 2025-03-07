import { AttackState } from "./AttackState";
import { IState } from "./IState";
import { JumpState } from "./JumpState";
import { Player } from "../Player";
import { WalkState } from "./WalkState";
import { DieState } from "./DieState";

export class IdleState implements IState {
    enter(player: Player): void {
        console.log("進入 Idle 狀態");
        player.onIdle();
    }

    update(player: Player, deltaTime: number): void {
        // 若血量歸零則切換到 Die 狀態
        if (player.Health == 0) {
            player.stateMachine.changeState(new DieState());
            return;
        }
        // 若有左右移動則切換到 Walk 狀態
        if (player.MoveLeft || player.MoveRight) {
            player.stateMachine.changeState(new WalkState());
        }
        // 若離開地面則切換到 Jump 狀態
        if (!player.OnGround) {
            player.stateMachine.changeState(new JumpState());
        }
        // 若開始攻擊則切換到 Attack 狀態
        if (player.OnFight) {
            player.stateMachine.changeState(new AttackState());
        }
    }

    exit(player: Player): void {
        console.log("離開 Idle 狀態");
    }
}