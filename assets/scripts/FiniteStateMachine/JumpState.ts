import { AttackState } from "./AttackState";
import { IdleState } from "./IdleState";
import { IState } from "./IState";
import { Player } from "../Player";
import { DieState } from "./DieState";
import { FSMState } from "../Definition";

export class JumpState implements IState {
    constructor() {
        this.fsmEvent = FSMState.Jump;
    }

    fsmEvent: FSMState;

    enter(player: Player): void {
        // console.log("進入 Jump 狀態");
        player.onJump();
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

        // 當落地後返回 Idle 狀態
        if (player.OnGround) {
            player.stateMachine.changeState(new IdleState());
        }
        // 若開始攻擊則切換到 Attack 狀態
        if (player.OnFight) {
            player.stateMachine.changeState(new AttackState());
        }
    }

    exit(player: Player): void {
        // console.log("離開 Jump 狀態");
    }
}