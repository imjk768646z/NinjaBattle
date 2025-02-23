import { AttackState } from "./AttackState";
import { IState } from "./IState";
import { JumpState } from "./JumpState";
import { Player } from "../Player";
import { WalkState } from "./WalkState";

export class IdleState implements IState {
    enter(player: Player): void {
        console.log("進入 Idle 狀態");
        // 停止水平移動
        // player.rigidBody.linearVelocity = new Vec2(0, player.rigidBody.linearVelocity.y);
    }
    update(player: Player, deltaTime: number): void {
        // console.log("更新狀態");

        // 若有左右移動，切換到 Walk 狀態
        if (player.MoveLeft || player.MoveRight) {
            player.stateMachine.changeState(new WalkState());
        }
        // 若離開地面則切換到 Jump 狀態
        if (!player.OnGround) {
            player.stateMachine.changeState(new JumpState());
        }

        if (player.OnFight) {
            player.stateMachine.changeState(new AttackState());
        }
    }
    exit(player: Player): void {
        console.log("離開 Idle 狀態");
    }
}