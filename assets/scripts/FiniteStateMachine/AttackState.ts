import { Bullet } from "../Bullet";
import { IState } from "./IState";
import { NodePoolManager } from "../Singleton/NodePoolManager";
import { Player } from "../Player";

export class AttackState implements IState {
    enter(player: Player): void {
        console.log("進入 Attack 狀態");
        // 執行攻擊行為，例如產生子彈或播放攻擊動畫
        // 攻擊邏輯可以根據需求擴充
    }
    update(player: Player, deltaTime: number): void {
        // 攻擊結束後返回 Idle 狀態 (或根據情境返回其他狀態)
        // player.stateMachine.changeState(new IdleState());
        console.log("上一個狀態:", player.stateMachine.lastState);
        if (player.OnFight) {
            player.setFight = false;
            // todo: 產生與銷毀子彈應該另外開一個腳本來執行 可以是單例模式或是中介模式
            let nodePool = NodePoolManager.getNodePoolMgr();
            let bullet = nodePool.createNode("Bullet", player.node.parent, player.Bullet);
            let bulletScript = bullet.getComponent(Bullet);
            let destroy = function () {
                if (bullet) nodePool.returnNode("Bullet", bullet);
            }
            bulletScript.init(player.node.position, player.FaceToRight);
            bulletScript.setDestroyEvent(destroy.bind(this));
        }
        player.stateMachine.changeState(player.stateMachine.lastState);
    }
    exit(player: Player): void {
        console.log("離開 Attack 狀態");
    }
}