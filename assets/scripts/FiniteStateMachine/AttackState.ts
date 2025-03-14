import { Bullet } from "../Bullet";
import { IState } from "./IState";
import { NodePoolManager } from "../Singleton/NodePoolManager";
import { Player } from "../Player";
import { DieState } from "./DieState";

export class AttackState implements IState {
    enter(player: Player): void {
        // console.log("進入 Attack 狀態");
        player.onAttack();
    }

    update(player: Player, deltaTime: number): void {
        // console.log("上一個狀態:", player.stateMachine.lastState);
        // 若血量歸零則切換到 Die 狀態
        if (player.Health == 0) {
            player.stateMachine.changeState(new DieState());
            return;
        }

        // 若開始攻擊則切換到 Attack 狀態
        if (player.OnFight) {
            player.setFight = false;
            let nodePool = NodePoolManager.getNodePoolMgr();
            let bullet = nodePool.createNode("Bullet", player.node.parent, player.Bullet);
            let bulletInstance = bullet.getComponent(Bullet);
            let destroy = function () {
                if (bullet) nodePool.returnNode("Bullet", bullet);
            }
            bulletInstance.init(player.node.position, player.FaceToRight, player.PlayerID);
            bulletInstance.setDestroyEvent(destroy.bind(this));
            // 攻擊時血量歸零則切換到 Die 狀態
            if (player.Health == 0) {
                player.stateMachine.changeState(new DieState());
                return;
            }
            // 延遲返回上一個狀態，以便看得見攻擊的動畫效果
            setTimeout(() => {
                if (player.Health == 0) return;
                player.stateMachine.changeState(player.stateMachine.lastState);
            }, player.CoolDownTime * 1000);
        }
    }

    exit(player: Player): void {
        // console.log("離開 Attack 狀態");
    }
}