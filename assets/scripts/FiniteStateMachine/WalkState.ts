import { AttackState } from "./AttackState";
import { IdleState } from "./IdleState";
import { IState } from "./IState";
import { JumpState } from "./JumpState";
import { Player } from "../Player";
import { DieState } from "./DieState";

export class WalkState implements IState {
    enter(player: Player): void {
        // console.log("進入 Walk 狀態");
        player.onWalk();
    }

    update(player: Player, deltaTime: number): void {
        // 若血量歸零則切換到 Die 狀態
        if (player.Health == 0) {
            player.stateMachine.changeState(new DieState());
            return;
        }

        let velocity = player.RigidBody.linearVelocity;
        if (player.MoveRight) {
            velocity.x = player.WalkSpeed;
        } else if (player.MoveLeft) {
            velocity.x = -player.WalkSpeed;
        } else {
            velocity.x = 0; // 停止移動時，不再給予水平方向速度
        }
        player.RigidBody.linearVelocity = velocity;

        // 若停止左右移動則返回 Idle 狀態
        if (!player.MoveLeft && !player.MoveRight) {
            player.stateMachine.changeState(new IdleState());
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
        // console.log("離開 Walk 狀態");
    }
}