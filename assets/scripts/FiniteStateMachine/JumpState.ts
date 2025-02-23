import { AttackState } from "./AttackState";
import { IdleState } from "./IdleState";
import { IState } from "./IState";
import { Player } from "../Player";

export class JumpState implements IState {
    enter(player: Player): void {
        console.log("進入 Jump 狀態");
        // 這邊已在按鍵事件中觸發跳躍力，此處僅作狀態紀錄
    }
    update(player: Player, deltaTime: number): void {
        let velocity = player.RigidBody.linearVelocity;
        if (player.MoveRight) {
            velocity.x = player.WalkSpeed;
        } else if (player.MoveLeft) {
            velocity.x = -player.WalkSpeed;
        } else {
            velocity.x = 0; // 停止移動時，不再給予水平方向速度
        }
        player.RigidBody.linearVelocity = velocity;

        // 當落地後返回 Idle 狀態
        if (player.OnGround) {
            player.stateMachine.changeState(new IdleState());
        }

        if (player.OnFight) {
            player.stateMachine.changeState(new AttackState());
        }
    }
    exit(player: Player): void {
        console.log("離開 Jump 狀態");
    }
}